package com.poweronce.action;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;

import com.poweronce.entity.TSaleProduct;
import com.poweronce.service.Webservice;
import com.poweronce.util.ExtUtil;

public class TSaleProductAction extends BaseDispatchAction {
    private String condition = "";

    public ActionForward list(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        String sale_id = request.getParameter("sale_id");
        String condition = " where 1=1";

        if (!StringUtils.isEmpty(sale_id))
            condition += " and sale_id = '" + sale_id.trim() + "'";
        long nCount = Webservice.getRowCount(TSaleProduct.class, condition);
        List list = Webservice.listAll(TSaleProduct.class, condition, "");
        response.getWriter().println(ExtUtil.genExtListString(list, nCount));
        return null;
    }

    public ActionForward del(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        return null;
    }

    public ActionForward update(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        return null;
    }

    protected String getCondition() {
        return condition;
    }

}
