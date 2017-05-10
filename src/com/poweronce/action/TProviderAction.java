package com.poweronce.action;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;

import com.poweronce.form.TProviderForm;

public class TProviderAction extends BaseDispatchAction {
    public ActionForward list(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        TProviderForm tf = (TProviderForm) form;
        String bc = tf.getShortName();
        String lm = tf.getLinkMan();
        String m = tf.getMobile();
        String code = tf.getCode();
        String condition = " where 1=1";
        if (StringUtils.isNotBlank(bc))
            condition += " and ShortName like '%" + bc + "%'";
        if (StringUtils.isNotBlank(lm))
            condition += " and LinkMan like '%" + lm + "%'";
        if (StringUtils.isNotBlank(m))
            condition += " and Mobile like '%" + m + "%'";
        if (StringUtils.isNotBlank(code))
            condition += " and code like '%" + code + "%'";
        condition += " order by ShortName";
        return super.superListPage(mapping, form, request, response, condition, "");
    }

    public ActionForward view(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        super.superShow(mapping, form, request, response);
        return mapping.findForward("view");
    }
}
