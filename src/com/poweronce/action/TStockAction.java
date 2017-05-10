package com.poweronce.action;

import java.util.Collection;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import net.sf.json.JSONArray;

import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.struts.action.ActionErrors;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;

import com.poweronce.entity.TProduct;
import com.poweronce.entity.TProduct.TProductVo;
import com.poweronce.entity.TProductType;
import com.poweronce.entity.TStock;
import com.poweronce.entity.TStockProduct;
import com.poweronce.form.TStockForm;
import com.poweronce.model.CodeNumberGen;
import com.poweronce.service.Webservice;
import com.poweronce.util.CTime;
import com.poweronce.util.JsonUtil;
import com.poweronce.util.ProductUtil;
import com.poweronce.validator.Validation;

public class TStockAction extends BaseDispatchAction {
    public ActionForward list(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        TStockForm tf = (TStockForm) form;
        String condition = " where 1=1 ";
        // if (tf.getProvider_id() != -1)
        // condition += " and provider_id=" + tf.getProvider_id();
        if (tf.getOper_id() != 0)
            condition += " and oper_id=" + tf.getOper_id();
        if (StringUtils.isNotEmpty(tf.getStock_bill_code()))
            condition += " and stock_bill_code='" + tf.getStock_bill_code() + "'";
        if (StringUtils.isNotEmpty(tf.getOper_time_start()))
            condition += " and oper_time >= '" + tf.getOper_time_start() + "'";
        if (StringUtils.isNotEmpty(tf.getOper_time_end())) {
            condition += " and oper_time <= '" + tf.getOper_time_end() + "'";
        }
        // if (StringUtils.isNotEmpty(tf.getProvider_name())) {
        // condition += " and provider_name like '%" + tf.getProvider_name() +
        // "%'";
        // }
        condition += " order by id desc ";
        return super.superListPage(mapping, form, request, response, condition, "");
    }

    public ActionForward stock(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        HttpSession session = request.getSession(false);
        String user = session.getAttribute("user_code").toString();
        session.setAttribute("stock", null);
        session.setAttribute("stock_product_list", null);

        Long user_id = (Long) session.getAttribute("user_id");
        TStock sale = new TStock();
        sale.setAll_stock_price(0);
        sale.setOper_id(user_id.intValue());
        sale.setOper_name(user);
        sale.setOper_time(CTime.getTime("yyyy-MM-dd HH:mm:ss"));

        // String path = request.getRealPath("")+"/ids/stock_id.gen";
        long max = Webservice.getSeqNextValue("seq_stock_id");// IdGen.getId(path);
        sale.setStock_bill_code(CodeNumberGen.gen(5, "0", max + 168));
        session.setAttribute("stock", sale);
        List product_type_list = Webservice.listAll(TProductType.class, " where level=1", "");
        request.setAttribute("product_type_list", product_type_list);
        return mapping.findForward("get");
    }

    public ActionForward getProductInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        Long productid = ProductUtil.parseValue(request.getParameter("id"), -1);
        TProduct product = (TProduct) Webservice.get(TProduct.class, productid);
        if (product == null) {
            ActionErrors errors = new ActionErrors();
            Validation.addUserErrorInfo("No such product.", errors, request);
            return mapping.findForward("info");
        }
        request.setAttribute("product", product);
        this.stock(mapping, form, request, response);
        return mapping.findForward("add_stock_product_2");
    }

    public ActionForward stock_print(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        HttpSession session = request.getSession(false);
        String user = session.getAttribute("user_code").toString();

        return mapping.findForward("stock_print");
    }

    @SuppressWarnings("unchecked")
    public ActionForward stock_submit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        try {
            TStockForm sf = (TStockForm) form;
            JSONArray fromObject = JSONArray.fromObject(sf.getProductJsonList());
            Collection<TProductVo> collection = JSONArray.toCollection(fromObject, TProductVo.class);
            HttpSession session = request.getSession(false);
            Long user_id = (Long) session.getAttribute("user_id");
            sf.setOper_id(user_id.intValue());
            long max = Webservice.getSeqNextValue("seq_stock_id");
            sf.setStock_bill_code(CodeNumberGen.gen(5, "0", max + 168));

            if (collection != null && collection.size() > 0) {
                TStock stock = new TStock();
                BeanUtils.copyProperties(stock, sf);
                Long id = new Long(Webservice.insert(stock));
                for (TProductVo tProductVo : collection) {
                    TStockProduct sp = new TStockProduct();
                    sp.setId(0);
                    sp.setProduct_code(tProductVo.getCode());
                    sp.setProduct_id(tProductVo.getId());
                    sp.setProduct_name(tProductVo.getProduct_name());
                    sp.setProduct_num(tProductVo.getNum());
                    sp.setProduct_price(tProductVo.getPrice_income());
                    sp.setProvider_id(Long.parseLong(tProductVo.getProvider_id()));
                    sp.setProvider_name(tProductVo.getVendortName());
                    sp.setStock_id(id);
                    sp.setStock_time(sf.getOper_time());
                    Webservice.insert(sp);
                    Webservice.execute(TProduct.class,
                            "update TProduct set num=num+" + sp.getProduct_num() + " where id=" + sp.getProduct_id());
                }
                response.getWriter().println(JsonUtil.getSuccessJson());
                return null;
            } else {
                response.getWriter().println(JsonUtil.getFailJson("请选择产品"));
                return null;
            }
        } catch (Exception e) {
            response.getWriter().println(JsonUtil.getFailJson("保存失败，请稍候重试"));
            log.error("保存失败", e);
            return null;
        }
    }
}
