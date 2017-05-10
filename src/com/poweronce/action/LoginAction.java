package com.poweronce.action;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.apache.struts.actions.DispatchAction;
import org.json.simple.JSONObject;

import com.poweronce.entity.TEmployee;
import com.poweronce.entity.TPowerOperation;
import com.poweronce.form.TEmployeeForm;
import com.poweronce.service.Webservice;
import com.poweronce.util.Constants;
import com.poweronce.util.JsonUtil;

/**
 * @author shenbin
 *
 * 更改所生成类型注释的模板为
 * 窗口 > 首选项 > Java > 代码生成 > 代码和注释
 */

/**
 * @author shenbin
 *         <p/>
 *         更改所生成类型注释的模板为 窗口 > 首选项 > Java > 代码生成 > 代码和注释
 */
public class LoginAction extends DispatchAction {
    Logger log = Logger.getLogger(LoginAction.class);

    @SuppressWarnings("unchecked")
    public ActionForward login(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
//        List<TEmployee> all = Webservice.listAll(TEmployee.class, "", "");
//        if (all != null && all.size() > Constants.Employee_Count) {
//            response.getWriter().println(JsonUtil.getFailJson("保存失败，超出使用人数！"));
//            return null;
//        }
        try {
            TEmployeeForm adminform = (TEmployeeForm) form;
            String code = adminform.getCode();
            String password = adminform.getPassword1();
            String condition = " where code='" + code + "' and password1='" + password + "'";
            List<TEmployee> list = Webservice.listAll(TEmployee.class, condition, "");
            if (list == null || list.size() == 0) {
                JSONObject json = new JSONObject();
                JSONObject error = new JSONObject();
                error.put("code", "用户名或密码错误");
                json.put("success", false);
                json.put("errors", error);
                response.getWriter().println(json.toString());
                return null;
            } else {
                TEmployee login = list.get(0);
                HttpSession session = request.getSession(true);
                session.setAttribute("employee", login);
                session.setAttribute("user_id", new Long(login.getId()));
                session.setAttribute("user_code", login.getCode());
                session.setAttribute("user_name", login.getName());
                List<TPowerOperation> list2 = Webservice.listAll(TPowerOperation.class, " where PopedomCode=" + login.getPopedom(),
                        " order by OperationCode asc");
                session.setAttribute("power", list2);
                session.setMaxInactiveInterval(-1);
                response.getWriter().println(JsonUtil.getSuccessJson().toString());
                return null;
            }
        } catch (Exception e) {
            log.error("异常", e);
            JSONObject json = new JSONObject();
            JSONObject error = new JSONObject();
            error.put("code", "用户名或密码错误");
            json.put("success", false);
            json.put("errors", error);
            response.setCharacterEncoding("GBK");
            response.getWriter().println(json.toString());
            return null;
        }
    }

    public ActionForward logout(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) {
        HttpSession s = request.getSession(false);
        if (s != null) {
            s.removeAttribute("employee");
            s.removeAttribute("user_id");
            s.removeAttribute("user_code");
            s.removeAttribute("user_name");
            s.invalidate();
        }
        return mapping.findForward("logout");
    }

    public ActionForward main(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) {
        try {
            HttpSession session = request.getSession(false);
            if (session.getAttribute("employee") == null) {
                return mapping.findForward("false");
            }
        } catch (Exception e) {
            log.error("异常", e);
        }
        return mapping.findForward("main");
    }

}
