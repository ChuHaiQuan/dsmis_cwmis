package com.poweronce.servlet;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts.action.ActionServlet;

public class ActionServletGBKEncoding extends ActionServlet {
    protected void process(HttpServletRequest request, HttpServletResponse response) throws java.io.IOException, javax.servlet.ServletException {
        // 如果JSP用GBK，这里就用GBK吧！
        super.process(request, response);
    }
}
