package com.poweronce.service;

import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.struts.action.ActionErrors;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.apache.struts.actions.DispatchAction;
import org.directwebremoting.ScriptBuffer;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Node;
import org.dom4j.io.SAXReader;

import com.poweronce.entity.TBuyer;
import com.poweronce.entity.TProduct;
import com.poweronce.entity.TProductType;
import com.poweronce.entity.TProduct_vendor;
import com.poweronce.entity.TProvider;
import com.poweronce.entity.TPurchase;
import com.poweronce.entity.TPurchaseProduct;
import com.poweronce.entity.TSale;
import com.poweronce.entity.TSaleProduct;
import com.poweronce.entity.TStock;
import com.poweronce.entity.TStockProduct;
import com.poweronce.form.TStockProductForm;
import com.poweronce.service.Webservice;
import com.poweronce.util.ObjectFormat;
import com.poweronce.validator.Validation;

/**
 * @author shenbin
 *         <p/>
 *         更改所生成类型注释的模板为 窗口 > 首选项 > Java > 代码生成 > 代码和注释
 */
public class AjaxService extends BaseDWR {

    public void purchasePayed(Long id) throws Exception {
        Webservice.execute(TPurchase.class, "update TPurchase set paid=1 where id=" + id);
        util.addScript(new ScriptBuffer("alert('purchase paid.');"));
    }

    public void checkPurchase(Long id) throws Exception {
        Webservice.execute(TPurchaseProduct.class, "update TPurchaseProduct set if_stock=1 where purchase_id=" + id);
        Webservice.execute(TPurchase.class, "update TPurchase set if_stock=1 where id=" + id);
        util.addScript(new ScriptBuffer("alert('Check purchase success!');"));
    }

    public void updateremark(Long id, String remark) throws Exception {
        Webservice.execute(TPurchase.class, "update TPurchase set remark='" + remark + "' where id=" + id);
        util.addScript(new ScriptBuffer("alert('update remark success!');"));
    }

    public void getProductTypeListButton(Long id, String area) throws Exception {
        TProductType type = (TProductType) Webservice.get(TProductType.class, id);
        List<TProductType> items = Webservice.listAll("TProductType", " where parent_id=" + id, " order by product_type_name");
        if (items == null || items.size() == 0) {
            util.setValue(area, "<input type='button' style='height:50px;font-weight:bold;' value='" + type.getProduct_type_name()
                    + "' onclick='change_button_bg(this);changeCategory(" + id + ")'/>");
            return;
        }
        String types = "";
        for (int i = 0; i < items.size(); i++) {
            types += "<input type='button' style='height:50px;font-weight:bold;' value='" + items.get(i).getProduct_type_name()
                    + "' onclick='change_button_bg(this);changeCategory(" + items.get(i).getId() + ")'/>";
        }
        util.setValue(area, types);
    }

    public void getProductTypeListButton2(Long id, String area) throws Exception {
        TProductType type = (TProductType) Webservice.get(TProductType.class, id);
        List<TProductType> items = Webservice.listAll("TProductType", " where parent_id=" + id, " order by product_type_name");
        StringBuffer sb = new StringBuffer();
        int level = type.getLevel() + 1;
        if (items == null || items.size() == 0) {
            sb.append("No Lower Level categories, Please Add Products/没有下一层类别,请添加产品.<BR/><input type='button' style='height:50px;font-weight:bold;' value='"
                    + type.getProduct_type_name() + "' onclick='change_button_bg(this);changeCategory(" + id + ")'/>");
        } else {
            sb.append("Sub categories/子类别[level=" + (type.getLevel() + 1) + "]:<BR/>");
            for (int i = 0; i < items.size(); i++) {
                TProductType tmpType = items.get(i);
                sb.append("<input type='button' name='btn_type_" + level + "' style='height:50px;font-weight:bold;' value='" + tmpType.getProduct_type_name()
                        + "' onclick=\"change_button_bg(this," + level + ");changeType(" + tmpType.getId() + ",'" + tmpType.getProduct_type_name() + "',"
                        + level + ");\"/>");
            }
        }
        sb.append("<input type='button' style='width:400px;height:50px;font-weight:bold;' value='new product category' onclick='addNewCategory(" + id + ");'/>");
        util.setValue(area, sb.toString());
    }

    /**
     * **
     * used to get all the child product types of the given parent type added by
     * liming
     *
     * @param product_id
     * @throws Exception
     */
    public List<TProductType> getChildProductTypes(Long parentID) throws Exception {
        if (parentID < 0) {// click main types
            return Webservice.listAll(TProductType.class, " where level=1", "");
        } else {
            return Webservice.listAll("TProductType", " where parent_id=" + parentID, " order by product_type_name");
        }
    }

    /**
     * **
     * get all the products by the given product type added by liming
     *
     * @param productType
     * @return
     * @throws Exception
     */
    public Map<String, Object> getProductsByType(Long productType) throws Exception {
        Map<String, Object> returnMap = new HashMap<String, Object>();
        List<TProduct> products = Webservice.listAll("TProduct", " where product_type=" + productType, " order by product_id");
        List<TProvider> providerList = Webservice.listAll(TProvider.class, "", "");    /*
     * if(products != null && products.size() > 0){ List<TProduct_vendor>
	 * list = Webservice.listAll(TProduct_vendor.class,
	 * " where product_id in (select id from TProduct where product_type="
	 * +productType + ")",""); if(list != null && list.size()>0){
	 * Iterator<TProduct_vendor> iterator = list.iterator();
	 * while(iterator.hasNext()){ TProduct_vendor vendor = iterator.next();
	 * returnMap.put(String.valueOf(vendor.getProduct_id()), vendor); } } }
	 */
        if (products == null) {
            products = new ArrayList<TProduct>(0);
        }
        if (providerList == null) {
            providerList = new ArrayList<TProvider>(0);
        }
        returnMap.put("products", products);
        returnMap.put("providers", providerList);
        return returnMap;
    }

    /**
     * *
     * get the provider information, added by liming
     *
     * @param id
     * @return
     * @throws Exception
     */
    public List<TProvider> getProviders(long id) throws Exception {
        List<TProvider> providerList = null;
        if (id < 0) { // get all provider when id < 0
            providerList = Webservice.listAll(TProvider.class, "", "");
        } else {
            providerList = Webservice.listAll(TProvider.class, " where id=" + id, "");
        }
        if (providerList == null)
            providerList = new ArrayList<TProvider>(0);
        return providerList;

    }

    /**
     * *
     * save the product vendor: insert or modify
     *
     * @param provider
     * @return
     * @throws Exception
     */
    public long saveProductVendor(TProvider provider) throws Exception {
        if (provider == null)
            return -1;
        try {
            Object obj = Webservice.save(provider);
            if (obj == null) {
                return -1;
            }
            if (provider.getId() <= 0) {
                provider.setId(Long.parseLong(String.valueOf(obj)));
            }
            return provider.getId();
        } catch (Exception ex) {
            return -1;
        }
    }

    /**
     * *
     * add the stock products into session
     *
     * @param products
     * @return
     * @throws Exception
     */
    public boolean addStockProducts(List<TStockProductForm> stockProducts) {
        if (stockProducts == null || stockProducts.size() < 1) {
            return true;
        }
        List sale_product_list = (List) session.getAttribute("stock_product_list");
        if (sale_product_list == null) {
            sale_product_list = new ArrayList();
        }
        TStock sale = (TStock) session.getAttribute("stock");
        if (sale == null) {
            return false;
        }
        // add products
        try {
            Iterator<TStockProductForm> stockProductsIterator = stockProducts.iterator();
            while (stockProductsIterator.hasNext()) {
                TStockProductForm stockProduct = stockProductsIterator.next();
                if (stockProduct.getProduct_num() < 1 || stockProduct.getProduct_price() < 1) {
                    continue;
                }
                // get product
                List products = null;
                if (stockProduct.getProduct_id() > 0)
                    products = Webservice.listAll(TProduct.class, " where id='" + stockProduct.getProduct_id() + "'", "");
                if (products == null || products.size() < 1) {
                    continue;
                }
                TProduct product = (TProduct) products.get(0);
                // get provider
                TProvider pd = (TProvider) Webservice.get(TProvider.class, new Long(stockProduct.getProvider_id()));
                if (pd == null) {
                    pd = new TProvider();
                    pd.setId(stockProduct.getProvider_id());
                    pd.setShortName(stockProduct.getProvider_name());
                }
                // set attributes
                TStockProduct sp = new TStockProduct();
                sp.setProduct_code(product.getCode());
                sp.setProduct_id((int) product.getId());
                sp.setProduct_name(product.getProduct_name());
                sp.setProduct_num(stockProduct.getProduct_num());
                sp.setProduct_price(stockProduct.getProduct_price());
                sp.setProvider_id(stockProduct.getProvider_id());
                sp.setProvider_name(pd.getShortName());
                sp.setId(sale_product_list.size());
                sale_product_list.add(sp);
                // 保存产品后插关系表
                List list = Webservice.listAll(TProduct_vendor.class,
                        " where product_id=" + product.getId() + " and vendor_id=" + stockProduct.getProvider_id(), "");
                if (list == null || list.size() == 0) {
                    TProduct_vendor pv = new TProduct_vendor();
                    pv.setProduct_id((int) product.getId());
                    pv.setProduct_name(product.getProduct_name());
                    pv.setVendor_id(stockProduct.getProvider_id());
                    pv.setVendor_name(pd.getShortName());
                    Webservice.insert(pv);
                }
                sale.setAll_stock_price(sale.getAll_stock_price() + stockProduct.getProduct_price() * stockProduct.getProduct_num());
            }
        } catch (Exception ex) {
            return false;
        }
        session.setAttribute("stock", sale);
        session.setAttribute("stock_product_list", sale_product_list);
        return true;
    }

    public void product_list_by_po(String product_id) throws Exception {
        List<TProduct> list = Webservice.listAll("TProduct", " where product_id like'" + product_id + "%'", " order by product_id");
        if (list == null || list.size() == 0)
            return;
        StringBuffer b = new StringBuffer();
        b.append("<select multiple='true' name='products' size='10'>");
        for (TProduct p : list) {
            b.append("<option value=" + p.getId() + ">" + p.getCode() + " / " + p.getProduct_id() + " / Stock Price:$" + p.getPrice_income() + " / Inventory:"
                    + p.getNum() + "</option>");
        }
        b.append("</select>");
        util.setValue("product_list", b.toString());
    }
}
