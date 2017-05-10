package com.poweronce.action;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang.StringUtils;
import org.apache.struts.action.ActionErrors;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;

import com.poweronce.entity.TProduct;
import com.poweronce.entity.TProduct_vendor;
import com.poweronce.entity.TProvider;
import com.poweronce.entity.TStock;
import com.poweronce.entity.TStockProduct;
import com.poweronce.entity.TProduct.TProductVo;
import com.poweronce.form.TStockProductForm;
import com.poweronce.model.PaginationSupport;
import com.poweronce.service.Webservice;
import com.poweronce.util.ExtUtil;
import com.poweronce.validator.Validation;

public class TStockProductAction extends BaseDispatchAction {
    private String condition = "";

    public ActionForward list(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        String stock_id = request.getParameter("stock_id");
        String condition = " where 1=1";

        if (!StringUtils.isEmpty(stock_id))
            condition += " and stock_id = '" + stock_id.trim() + "'";
        long nCount = Webservice.getRowCount(TStockProduct.class, condition);
        List list = Webservice.listAll(TStockProduct.class, condition, "");
        response.getWriter().println(ExtUtil.genExtListString(list, nCount));
        return null;
    }

    public ActionForward add(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        ActionErrors errors = new ActionErrors();
        TStockProductForm tf = (TStockProductForm) form;
        List list = null;
        if (StringUtils.isNotEmpty(tf.getProduct_code()))
            list = Webservice.listAll(TProduct.class, " where code='" + tf.getProduct_code() + "'", "");
        if (tf.getProduct_id() > 0)
            list = Webservice.listAll(TProduct.class, " where id='" + tf.getProduct_id() + "'", "");
        List sale_product_list = null;
        HttpSession session = request.getSession(false);
        String user = session.getAttribute("user_code").toString();
        if (list == null || list.size() == 0) {
            Validation.addUserErrorInfo("product not exist!", errors, request);
        } else if (list.size() > 1) {
            Validation.addUserErrorInfo("product code has repeat,please modify product code!", errors, request);
        } else if (tf.getProduct_num() <= 0) {
            Validation.addUserErrorInfo("number must >0!", errors, request);
        } else if (tf.getProvider_id() <= 0) {
            Validation.addUserErrorInfo("please select vendor!", errors, request);
        } else if (tf.getProduct_price() <= 0) {
            Validation.addUserErrorInfo("price must >0!", errors, request);
        } else {
            TProduct p = (TProduct) list.get(0);

            Object obj = session.getAttribute("stock_product_list");
            if (obj == null) {
                sale_product_list = new ArrayList();
            } else {
                sale_product_list = (List) obj;
            }
            TStockProduct sp = new TStockProduct();
            sp.setProduct_code(p.getCode());
            sp.setProduct_id((int) p.getId());
            sp.setProduct_name(p.getProduct_name());
            sp.setProduct_num(tf.getProduct_num());
            sp.setProduct_price(tf.getProduct_price());
            sp.setProvider_id(tf.getProvider_id());
            TProvider pd = (TProvider) Webservice.get(TProvider.class, new Long(tf.getProvider_id()));
            sp.setProvider_name(pd.getShortName());
            sp.setId(sale_product_list.size());
            sale_product_list.add(sp);

            // 保存产品后插关系表
            list = Webservice
                    .listAll(TProduct_vendor.class, " where product_id=" + p.getId() + " and vendor_id=" + tf.getProvider_id(), "");
            if (list == null || list.size() == 0) {
                TProduct_vendor pv = new TProduct_vendor();
                pv.setProduct_id((int) p.getId());
                pv.setProduct_name(p.getProduct_name());
                pv.setVendor_id(tf.getProvider_id());
                pv.setVendor_name(pd.getShortName());
                Webservice.insert(pv);
            }

            TStock sale = (TStock) session.getAttribute("stock");
            sale.setAll_stock_price(sale.getAll_stock_price() + tf.getProduct_price() * tf.getProduct_num());
            session.setAttribute("stock", sale);
            session.setAttribute("stock_product_list", sale_product_list);
        }
        return mapping.findForward("add");
    }

    public ActionForward del(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        Object id = request.getParameter("id");
        Long lid = new Long(-1);
        if (id != null)
            lid = new Long(id.toString());
        HttpSession session = request.getSession(false);
        String user = session.getAttribute("user_code").toString();
        List list = (List) session.getAttribute("stock_product_list");
        for (int i = 0; i < list.size(); i++) {
            TStockProduct sp = (TStockProduct) list.get(i);
            if (sp.getId() == lid.longValue()) {
                TStock sale = (TStock) session.getAttribute("stock");
                sale.setAll_stock_price(sale.getAll_stock_price() - sp.getProduct_price() * sp.getProduct_num());
                session.setAttribute("stock", sale);
                list.remove(i);
            }
        }
        session.setAttribute("stock_product_list", list);
        return mapping.findForward("add");
    }

}
