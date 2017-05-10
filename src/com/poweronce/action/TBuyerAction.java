package com.poweronce.action;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;

import com.poweronce.entity.TBuyer;
import com.poweronce.entity.TProduct;
import com.poweronce.entity.TProduct.TProductVo;
import com.poweronce.form.TBuyerForm;
import com.poweronce.service.Webservice;
import com.poweronce.util.ExtUtil;

public class TBuyerAction extends BaseDispatchAction {
    public ActionForward list(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        TBuyerForm tf = (TBuyerForm) form;
        String bc = tf.getShortName();
        String lm = tf.getLinkMan();
        String m = tf.getMobile();
        String condition = " where 1=1";
        if (!StringUtils.isBlank(bc))
            condition += " and ShortName like '%" + bc + "%'";
        if (!StringUtils.isBlank(lm))
            condition += " and LinkMan like '%" + lm + "%'";
        if (!StringUtils.isBlank(m))
            condition += " and Mobile like '%" + m + "%'";
        return super.superListPage(mapping, form, request, response, condition, " order by shortName ");
    }

    public ActionForward quicklist(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        TBuyerForm tf = (TBuyerForm) form;
        String bc = tf.getShortName();
        String lm = tf.getLinkMan();
        String m = tf.getMobile();
        String condition = " where 1=1";
        if (!StringUtils.isBlank(bc))
            condition += " and ShortName like '" + bc + "%'";
        if (!StringUtils.isBlank(lm))
            condition += " and LinkMan like '" + lm + "%'";
        if (!StringUtils.isBlank(m))
            condition += " and Mobile like '" + m + "%'";
        List list = Webservice.listAll(TBuyer.class, condition, "");
        long nCount = Webservice.getRowCount(TBuyer.class, condition);
        response.getWriter().println(ExtUtil.genExtListString(list, nCount));
        return null;
    }

}
