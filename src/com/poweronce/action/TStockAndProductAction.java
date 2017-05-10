package com.poweronce.action;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;

import com.poweronce.entity.TStockAndProduct;
import com.poweronce.form.TStockAndProductForm;
import com.poweronce.service.Webservice;
import com.poweronce.util.ExtUtil;

public class TStockAndProductAction extends BaseDispatchAction {

    public ActionForward query(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        TStockAndProductForm f = (TStockAndProductForm) form;

        String condition = "select c.product_type,c.product_id,c.code,c.product_name,a.product_price,a.stock_time  "
                + "FROM TProduct c LEFT JOIN (select * from TStockProduct GROUP by product_price) a on a.product_id=c.id where 1=1 ";

        if (StringUtils.isNotBlank(f.getProduct_id()))
            condition += " and c.product_id='" + f.getProduct_id() + "'";
        if (StringUtils.isNotBlank(f.getProduct_name()))
            condition += " and (c.product_name like '%" + f.getProduct_name() + "%'  or c.product_name_cn like '%" + f.getProduct_name()
                    + "%')";
        List list = Webservice.listAllBySql(TStockAndProduct.class, condition);
        response.getWriter().println(ExtUtil.genExtListString(list, list != null ? list.size() : 0));
        return null;
    }
}
