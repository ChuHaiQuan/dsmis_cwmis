package com.poweronce.service;

import java.lang.reflect.Constructor;
import java.lang.reflect.Method;
import java.sql.Connection;
import java.util.List;

import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpSession;

import com.poweronce.dao.mysql.CommonDAO;
import com.poweronce.dao.mysql.DBConnectionManager;
import com.poweronce.entity.TEmployee;
import com.poweronce.util.CTime;
import uk.ltd.getahead.dwr.WebContext;
import uk.ltd.getahead.dwr.WebContextFactory;

public class DWRService {

    public static List listPage(String entity, String condition, String order, int iCurrPage, int iPageSize) throws Exception {
        Connection connect = null;
        List list = null;
        try {
            connect = DBConnectionManager.getInstance().getOracleConnection();
            connect.setTransactionIsolation(Connection.TRANSACTION_SERIALIZABLE);
            list = new CommonDAO(Class.forName("com.poweronce.entity." + entity)).listPage(iCurrPage, iPageSize, condition, order, connect);
            connect.commit();
        } finally {
            DBConnectionManager.getInstance().freeOracleConnection(connect);
        }
        return list;
    }

    public static List listAll(String entity, String condition, String order) throws Exception {
        Connection connect = null;
        List list = null;
        try {
            connect = DBConnectionManager.getInstance().getOracleConnection();
            connect.setTransactionIsolation(Connection.TRANSACTION_SERIALIZABLE);
            list = new CommonDAO(Class.forName("com.poweronce.entity." + entity)).listAllAll(condition, order, connect);
            connect.commit();
        } finally {
            DBConnectionManager.getInstance().freeOracleConnection(connect);
        }
        return list;
    }

    public static Object get(String entity, Object id) throws Exception {
        Object obj = null;
        Connection connect = null;
        try {
            connect = DBConnectionManager.getInstance().getOracleConnection();
            connect.setTransactionIsolation(Connection.TRANSACTION_SERIALIZABLE);
            obj = new CommonDAO(Class.forName("com.poweronce.entity." + entity)).get(id, connect);
            connect.commit();
        } finally {
            DBConnectionManager.getInstance().freeOracleConnection(connect);
        }
        return obj;
    }

    public static Object update(Object obj, Object id) throws Exception {
        String ret = null;
        Connection connect = null;
        try {
            connect = DBConnectionManager.getInstance().getOracleConnection();
            connect.setTransactionIsolation(Connection.TRANSACTION_SERIALIZABLE);
            ret = (String) new CommonDAO(obj.getClass()).update(obj, id, connect);
            connect.commit();
        } finally {
            DBConnectionManager.getInstance().freeOracleConnection(connect);
        }
        return ret;
    }

    public static String insert(Object obj) throws Exception {
        String ret = null;
        Connection connect = null;
        try {
            connect = DBConnectionManager.getInstance().getOracleConnection();
            connect.setTransactionIsolation(Connection.TRANSACTION_SERIALIZABLE);
            ret = (String) new CommonDAO(obj.getClass()).insert(obj, connect);
            connect.commit();
        } finally {
            DBConnectionManager.getInstance().freeOracleConnection(connect);
        }
        return ret;
    }

    public static String save(Object obj) throws Exception {
        String ret = null;
        Connection connect = null;
        try {
            connect = DBConnectionManager.getInstance().getOracleConnection();
            connect.setTransactionIsolation(Connection.TRANSACTION_SERIALIZABLE);
            ret = new CommonDAO(obj.getClass()).save(obj, connect);
            connect.commit();
        } finally {
            DBConnectionManager.getInstance().freeOracleConnection(connect);
        }
        return ret;
    }

    public static Object delete(Class entity, Object id) throws Exception {
        Object obj = null;
        Connection connect = null;
        try {
            connect = DBConnectionManager.getInstance().getOracleConnection();
            connect.setTransactionIsolation(Connection.TRANSACTION_SERIALIZABLE);
            obj = new CommonDAO(entity).delete(id, connect);
            connect.commit();
        } finally {
            DBConnectionManager.getInstance().freeOracleConnection(connect);
        }
        return obj;
    }

    public static Object execute(String entity, String sql) throws Exception {
        Object obj = null;
        Connection connect = null;
        try {
            connect = DBConnectionManager.getInstance().getOracleConnection();
            connect.setTransactionIsolation(Connection.TRANSACTION_SERIALIZABLE);
            obj = new CommonDAO(Class.forName("com.poweronce.entity." + entity)).execute(sql, connect);
            connect.commit();
        } finally {
            DBConnectionManager.getInstance().freeOracleConnection(connect);
        }
        return obj;
    }

    public static List listAllBySql(Class entity, String sql) throws Exception {
        List obj = null;
        Connection connect = null;
        try {
            connect = DBConnectionManager.getInstance().getOracleConnection();
            connect.setTransactionIsolation(Connection.TRANSACTION_SERIALIZABLE);
            obj = new CommonDAO(Class.forName("com.poweronce.entity." + entity)).listAllBySql(sql, connect);
            connect.commit();
        } finally {
            DBConnectionManager.getInstance().freeOracleConnection(connect);
        }
        return obj;
    }

    public static List listPageBySql(String entity, String sql, int iCurrPage, int iPageSize) throws Exception {
        List list = null;
        Connection connect = null;
        try {
            connect = DBConnectionManager.getInstance().getOracleConnection();
            connect.setTransactionIsolation(Connection.TRANSACTION_SERIALIZABLE);
            list = new CommonDAO(Class.forName("com.poweronce.entity." + entity)).listPageBySql(iCurrPage, iPageSize, sql, connect);
            connect.commit();
        } finally {
            DBConnectionManager.getInstance().freeOracleConnection(connect);
        }
        return list;
    }

    public static long getRowCountBySql(String sql) throws Exception {
        long obj = 0;
        Connection connect = null;
        try {
            connect = DBConnectionManager.getInstance().getOracleConnection();
            connect.setTransactionIsolation(Connection.TRANSACTION_SERIALIZABLE);
            obj = (Long) new CommonDAO(null).getRowCountBySql(sql, connect);
            connect.commit();
        } finally {
            DBConnectionManager.getInstance().freeOracleConnection(connect);
        }
        return obj;
    }

    public static long getOneRowColBySql(String sql) throws Exception {
        long obj = 0;
        Connection connect = null;
        try {
            connect = DBConnectionManager.getInstance().getOracleConnection();
            connect.setTransactionIsolation(Connection.TRANSACTION_SERIALIZABLE);
            obj = (Long) new CommonDAO(null).getOneRowColBySql(sql, connect);
            connect.commit();
        } finally {
            DBConnectionManager.getInstance().freeOracleConnection(connect);
        }
        return obj;
    }

    public static long getRowCount(String entity, String condition) throws Exception {
        long obj = 0;
        Connection connect = null;
        try {
            connect = DBConnectionManager.getInstance().getOracleConnection();
            connect.setTransactionIsolation(Connection.TRANSACTION_SERIALIZABLE);
            obj = (Long) new CommonDAO(Class.forName("com.poweronce.entity." + entity)).getRowCount(condition, connect);
            connect.commit();
        } finally {
            DBConnectionManager.getInstance().freeOracleConnection(connect);
        }
        return obj;
    }

    public static long getSeqCurValue(String seq) throws Exception {
        return new CommonDAO(null).getSeqCurValue(seq);
    }

    public static long getSeqNextValue(String seq) throws Exception {
        return new CommonDAO(null).getSeqNextValue(seq);
    }

    public static String back_order(String id) throws Exception {
        WebContext ctx = WebContextFactory.get();
        HttpSession session = ctx.getSession(false);
        String e = (String) session.getAttribute("user_code");
        execute("TSaleProduct", "update TSaleProduct set if_back_order=0,back_order_time='" + CTime.getTime("yyyy-MM-dd HH:mm:ss") + "',back_order_code='" + e
                + "' " + " where id=" + id);
        return "This product has check order success!";
    }

}
