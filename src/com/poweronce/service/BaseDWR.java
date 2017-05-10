package com.poweronce.service;

import javax.servlet.http.HttpSession;

import org.directwebremoting.ScriptSession;
import org.directwebremoting.WebContext;
import org.directwebremoting.WebContextFactory;
import org.directwebremoting.proxy.dwr.Util;

/**
 * 基本的web操作
 *
 * @author 叶少伟
 */
public class BaseDWR {
    protected WebContext context;
    protected HttpSession session;
    protected Util util;
    protected ScriptSession scriptSession;
    protected String path = "/WEB-INF/pages/";
    protected int size = 15;

    public BaseDWR() {
        try {
            context = WebContextFactory.get();
            session = context.getSession();
            util = new Util(context.getScriptSession());
            scriptSession = context.getScriptSession();
        } catch (Exception e) {

        }
    }
}
