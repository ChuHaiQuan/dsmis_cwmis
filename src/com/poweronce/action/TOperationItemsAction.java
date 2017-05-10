package com.poweronce.action;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;

import com.poweronce.form.TBuyerForm;

public class TOperationItemsAction extends BaseDispatchAction {
    public ActionForward list(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
        TBuyerForm tf = (TBuyerForm) form;
        String bc = tf.getShortName();
        String lm = tf.getLinkMan();
        String m = tf.getMobile();
        String condition = " where 1=1";
        if (!StringUtils.isEmpty(bc))
            condition += " and ShortName like '%" + bc + "%'";
        if (!StringUtils.isEmpty(lm))
            condition += " and LinkMan like '%" + lm + "%'";
        if (!StringUtils.isEmpty(m))
            condition += " and Mobile like '%" + m + "%'";
        return super.superListPage(mapping, form, request, response, condition, "");
    }

}
