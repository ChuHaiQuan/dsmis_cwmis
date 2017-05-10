package com.poweronce.action;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import net.sf.json.JSONArray;

import org.apache.commons.lang.StringUtils;
import org.apache.struts.action.ActionErrors;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;

import com.poweronce.entity.TProduct;
import com.poweronce.entity.TProduct_vendor;
import com.poweronce.entity.TPurchase;
import com.poweronce.entity.TPurchaseProduct;
import com.poweronce.entity.TPurchaseProduct.TPurchaseProductVo;
import com.poweronce.entity.TStockProduct;
import com.poweronce.entity.TProduct.TProductVo;
import com.poweronce.form.TPurchaseForm;
import com.poweronce.form.TPurchaseProductForm;
import com.poweronce.service.Webservice;
import com.poweronce.util.CTime;
import com.poweronce.util.ExtUtil;
import com.poweronce.util.JsonUtil;
import com.poweronce.validator.Validation;

public class TPurchaseProductAction extends BaseDispatchAction {
    private String condition = "";

    public ActionForward list(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        String purchase_id = request.getParameter("purchase_id");
        String condition = " where 1=1";

        if (!StringUtils.isEmpty(purchase_id))
            condition += " and purchase_id = '" + purchase_id.trim() + "'";
        long nCount = Webservice.getRowCount(TPurchaseProduct.class, condition);
        List list = Webservice.listAll(TPurchaseProduct.class, condition, "");
        response.getWriter().println(ExtUtil.genExtListString(list, nCount));
        return null;
    }

    public ActionForward add(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        ActionErrors errors = new ActionErrors();
        TPurchaseProductForm tf = (TPurchaseProductForm) form;
        List list = Webservice.listAll(TProduct.class, " where product_id='" + tf.getProduct_help() + "'", "");
        List sale_product_list = null;
        HttpSession session = request.getSession(false);
        String user = session.getAttribute("user_code").toString();
        if (tf.getProduct_num() <= 0) {
            Validation.addUserErrorInfo("number must >0!", errors, request);
            return mapping.findForward("add");
        }
        if (tf.getProducts() == null || tf.getProducts().length == 0) {
            Validation.addUserErrorInfo("No product select!", errors, request);
            return mapping.findForward("add");
        }
        // else if(tf.getProvider_id()<=0)
        // {
        // Validation.addUserErrorInfo("please select vendor!", errors,
        // request);
        // return mapping.findForward("add");
        // }
        // else if(tf.getProduct_price()<=0)
        // {
        // Validation.addUserErrorInfo("price must >0!", errors, request);
        // return mapping.findForward("add");
        // }

        Object obj = session.getAttribute("purchase_product_list");
        if (obj == null) {
            sale_product_list = new ArrayList();
        } else {
            sale_product_list = (List) obj;
        }

        float all_price = 0;
        for (Long id : tf.getProducts()) {
            TProduct p = (TProduct) Webservice.get(TProduct.class, id);
            TPurchaseProduct sp = new TPurchaseProduct();
            sp.setProduct_code(p.getCode());
            sp.setProduct_id((int) p.getId());
            sp.setProduct_name(p.getProduct_name());
            sp.setProduct_num(tf.getProduct_num());
            sp.setProduct_price(p.getPrice_income());
            // 界面上显示尺寸
            sp.setRemark(p.getSize());
            // sp.setProvider_id(tf.getProvider_id());
            // TProvider pd = (TProvider)
            // Webservice.getInstance().get("TProvider",new
            // Long(tf.getProvider_id()));
            // sp.setProvider_name(pd.getAllName());
            sp.setId(sale_product_list.size());
            sale_product_list.add(sp);
            all_price += p.getPrice_income() * tf.getProduct_num();
            // 保存产品后插关系表
            list = Webservice
                    .listAll(TProduct_vendor.class, " where product_id=" + p.getId() + " and vendor_id=" + tf.getProvider_id(), "");
            if (list == null || list.size() == 0) {
                TProduct_vendor pv = new TProduct_vendor();
                pv.setProduct_id((int) p.getId());
                pv.setProduct_name(p.getProduct_name());
                // pv.setVendor_id(tf.getProvider_id());
                // pv.setVendor_name(pd.getAllName());
                Webservice.insert(pv);
            }
        }

        TPurchase sale = (TPurchase) session.getAttribute("purchase");
        sale.setAll_purchase_price(all_price + sale.getAll_purchase_price());
        session.setAttribute("purchase", sale);
        session.setAttribute("purchase_product_list", sale_product_list);
        return mapping.findForward("add");
    }

    public ActionForward del(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        Object id = request.getParameter("id");
        Long lid = new Long(-1);
        if (id != null)
            lid = new Long(id.toString());
        HttpSession session = request.getSession(false);
        int pos = new Integer(request.getParameter("pos").toString());
        List list = (List) session.getAttribute("purchase_product_list");
        TPurchaseProduct sp = (TPurchaseProduct) list.get(pos);
        if (sp.getId() == lid.longValue()) {
            TPurchase sale = (TPurchase) session.getAttribute("purchase");
            sale.setAll_purchase_price(sale.getAll_purchase_price() - sp.getProduct_price() * sp.getProduct_num());
            session.setAttribute("purchase", sale);
            list.remove(pos);
        }
        session.setAttribute("purchase_product_list", list);
        return mapping.findForward("add");
    }

    // 更新数量
    public ActionForward update(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        Object id = request.getParameter("id");
        Long lid = new Long(-1);
        if (id != null)
            lid = new Long(id.toString());
        int un = new Integer(request.getParameter("num").toString());
        int pos = new Integer(request.getParameter("pos").toString());
        HttpSession session = request.getSession(false);
        List list = (List) session.getAttribute("purchase_product_list");
        TPurchaseProduct sp = (TPurchaseProduct) list.get(pos);
        if (sp.getId() == lid.longValue()) {
            TPurchase sale = (TPurchase) session.getAttribute("purchase");
            sale.setAll_purchase_price(sale.getAll_purchase_price() + sp.getProduct_price() * (un - sp.getProduct_num()));
            session.setAttribute("purchase", sale);
            sp.setProduct_num(un);
        }
        return mapping.findForward("add");
    }

    protected String getCondition() {
        return condition;
    }

}
