package com.poweronce.action;

import java.io.IOException;
import java.util.Enumeration;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.struts.action.ActionErrors;

import com.poweronce.entity.TEmployee;
import com.poweronce.validator.Validation;

public class SessionTimeOut implements Filter {

    /*
     * (non-Javadoc)
     * 
     * @see javax.servlet.Filter#init(javax.servlet.FilterConfig)
     */
    public void init(FilterConfig conf) throws ServletException {
        // TODO Auto-generated method stub

    }

    /*
     * (non-Javadoc)
     * 
     * @see javax.servlet.Filter#doFilter(javax.servlet.ServletRequest,
     * javax.servlet.ServletResponse, javax.servlet.FilterChain)
     */
    public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest hRequest = (HttpServletRequest) req;
        HttpServletResponse hResponse = (HttpServletResponse) resp;
        if (!(hRequest.getServletPath().indexOf(".do") > 0)) {
            chain.doFilter(hRequest, resp);
            return;
        }
        /****************************************************************************************************
         ************************************ 后台登录管理员session检测************************************
         * ×××××××××××××××××
         * ×××××××××××××××××××××××××××××××××××××××××××××××××××××
         * ××××××××××××××××××××××××
         */
        // String referer = hRequest.getHeader("Referer");
        // String host = hRequest.getHeader("Host");
        // if(referer==null || referer.indexOf(host)<=0)
        // {
        // ActionErrors errors = new ActionErrors();
        // Validation.addUserErrorInfo("Access Deney!", errors,
        // (HttpServletRequest)req);
        // String newPath = hRequest.getContextPath() + "/index.jsp";
        // hResponse.sendRedirect(newPath);
        // return;
        // }

        if (hRequest.getServletPath().indexOf("index.jsp") > 0 || hRequest.getServletPath().indexOf("login.do") > 0) {
            chain.doFilter(hRequest, resp);
            return;
        }
        TEmployee admin = getAdmin(hRequest);
        if (admin == null) {
            ActionErrors errors = new ActionErrors();
            Validation.addUserErrorInfo("Session is timeout!", errors, (HttpServletRequest) req);
            String newPath = hRequest.getContextPath() + "/session_timeout.jsp";
            hResponse.sendRedirect(newPath);
            return;
        }
        chain.doFilter(hRequest, resp);
    }

    private TEmployee getAdmin(HttpServletRequest request) {
        if (request.getSession(false) == null) {
            return null;
        }
        HttpSession session = request.getSession(false);
        TEmployee admin = null;
        admin = (TEmployee) session.getAttribute("employee");
        return admin;
    }

    /*
     * (non-Javadoc)
     * 
     * @see javax.servlet.Filter#destroy()
     */
    public void destroy() {
        // TODO Auto-generated method stub

    }

}
