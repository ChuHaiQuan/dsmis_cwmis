package com.poweronce.action;

import java.util.Collections;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang.StringUtils;
import org.apache.struts.action.ActionErrors;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;

import com.poweronce.entity.TEmployee;
import com.poweronce.entity.TPower;
import com.poweronce.form.TEmployeeForm;
import com.poweronce.model.PaginationSupport;
import com.poweronce.service.Webservice;
import com.poweronce.util.Constants;
import com.poweronce.util.ExtUtil;
import com.poweronce.util.JsonUtil;
import com.poweronce.validator.Validation;

public class TEmployeeAction extends BaseDispatchAction {
    public ActionForward list(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        // TEmployeeForm tf = (TEmployeeForm)form;
        // tf.setPagesize(new Integer(500));

        String currpageStr = request.getParameter("currpage");
        String pagesizeStr = request.getParameter("pagesize");
        int iCurrPage = 1;
        int iPageSize = PaginationSupport.PAGESIZE;

        if (!StringUtils.isEmpty(currpageStr) && StringUtils.isNumeric(currpageStr) && (new Long(currpageStr).longValue() > 0)) {
            iCurrPage = new Integer(currpageStr).intValue();
        }
        if (!StringUtils.isEmpty(pagesizeStr)) {
            iPageSize = new Integer(pagesizeStr).intValue();
        }

        long nCount = Webservice.getRowCount(TEmployee.class, "");
        List<TEmployee> list = Webservice.listPage(TEmployee.class, "", " order by name ", iCurrPage, iPageSize);
        // for (TEmployee e : list) {
        // e.setPassword1("*********");
        // }
        TEmployee t=new TEmployee();
        t.setId(0);
        t.setName("---NONE---");
        list.add(0,t);
        response.getWriter().println(ExtUtil.genExtListString(list, nCount));

        return null;
    }

    public ActionForward change_password(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        String msg = "";
        try {
            TEmployeeForm adminform = (TEmployeeForm) form;
            String password = adminform.getPassword1();
            String password2 = adminform.getNewpassword1();
            String password3 = adminform.getNewpassword2();
            if (!password2.equals(password3)) {
                msg = "twice new password not same!";
                response.getWriter().println(JsonUtil.getFailJson(msg));
                return null;
            }
            HttpSession session = request.getSession(true);
            String id = session.getAttribute("user_id").toString();
            String condition = " where id=" + id + " and password1='" + password + "'";
            List list = Webservice.listAll(TEmployee.class, condition, "");
            if (list.size() == 0) {
                msg = "old password error!";
                response.getWriter().println(JsonUtil.getFailJson(msg));
                return null;
            } else {
                Webservice.execute(TEmployee.class, "update TEmployee set password1='" + password2 + "'");
            }
            response.getWriter().println(JsonUtil.getSuccessJson());
            return null;
        } catch (Exception e) {
            response.getWriter().println(JsonUtil.getFailJson("修改失败，请稍候重试。"));
            log.error("异常", e);
            return null;
        }
    }

    @Override
    public ActionForward save(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
    	
    	TEmployeeForm adminform = (TEmployeeForm) form;
        List<TEmployee> all = Webservice.listAll(TEmployee.class, " where id!="+adminform.getId()+" and Popedom="+adminform.getPopedom()+" and code!='admin' ", "");
      
//        List<TPower> allPower = Webservice.listAll(TPower.class, " where id="+adminform.getPopedom(), "");
            if (all != null && all.size() >= Constants.Employee_Count ) {
                response.getWriter().println(JsonUtil.getFailJson("保存失败，超出使用人数,请联系管理员获取更多的license！"));
                return null;
            }      	


        return super.save(mapping, form, request, response);
    }
}
