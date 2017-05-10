/**
 * @author 高颖祺
 */
package com.poweronce.action;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;

import com.poweronce.form.TProduct_vendorForm;

/**
 * @author 高颖祺
 * 
 */
public class TProductVendorAction extends BaseDispatchAction {
    public ActionForward list(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
	TProduct_vendorForm typeForm = (TProduct_vendorForm) form;
	String pd = request.getParameter("product_id");
	String bc = request.getParameter("product_name");
	String lm = request.getParameter("vendor_id");
	String type = request.getParameter("vendor_name");
	String condition = " where 1=1";
	if (!StringUtils.isEmpty(pd))
	    condition += " and product_id = " + pd.trim() ;
	if (!StringUtils.isEmpty(bc))
	    condition += " and Product_name like '%" + bc.trim() + "%'";
	if (!StringUtils.isEmpty(lm))
	    condition += " and vendor_id = " + lm.trim();
	if (!StringUtils.isEmpty(type))
	    condition += " and vendor_name = '" + type.trim() + "'";
	condition += " order by vendor_id";
	return super.superListPage(mapping, form, request, response, condition, "");
    }
}
