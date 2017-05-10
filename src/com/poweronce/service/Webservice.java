package com.poweronce.service;

import java.sql.Connection;
import java.util.List;

import com.poweronce.dao.mysql.CommonDAO;
import com.poweronce.dao.mysql.DBConnectionManager;

public class Webservice {

    @SuppressWarnings("unchecked")
    public static <T> List<T> listPage(Class<T> entity, String condition, String order, int iCurrPage, int iPageSize) throws Exception {
        Connection connect = null;
        List<T> list = null;
        try {
            connect = DBConnectionManager.getInstance().getOracleConnection();
            connect.setTransactionIsolation(Connection.TRANSACTION_SERIALIZABLE);
            list = new CommonDAO(entity).listPage(iCurrPage, iPageSize, condition, order, connect);
            connect.commit();
        } finally {
            DBConnectionManager.getInstance().freeOracleConnection(connect);
        }
        return list;
    }

    public static <T> List<T> listAll(Class<T> entity, String condition, String order) throws Exception {
        Connection connect = null;
        List list = null;
        try {
            connect = DBConnectionManager.getInstance().getOracleConnection();
            connect.setTransactionIsolation(Connection.TRANSACTION_SERIALIZABLE);
            list = new CommonDAO(entity).listAllAll(condition, order, connect);
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

    @SuppressWarnings("unchecked")
    public static <T> T get(Class<T> entity, Object id) throws Exception {
        T obj = null;
        Connection connect = null;
        try {
            connect = DBConnectionManager.getInstance().getOracleConnection();
            connect.setTransactionIsolation(Connection.TRANSACTION_SERIALIZABLE);
            obj = (T) new CommonDAO(entity).get(id, connect);
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

    public static Object execute(Class entity, String sql) throws Exception {
        Object obj = null;
        Connection connect = null;
        try {
            connect = DBConnectionManager.getInstance().getOracleConnection();
            connect.setTransactionIsolation(Connection.TRANSACTION_SERIALIZABLE);
            obj = new CommonDAO(entity).execute(sql, connect);
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
            obj = new CommonDAO(entity).listAllBySql(sql, connect);
            connect.commit();
        } finally {
            DBConnectionManager.getInstance().freeOracleConnection(connect);
        }
        return obj;
    }

    public static List listPageBySql(Class entity, String sql, int iCurrPage, int iPageSize) throws Exception {
        List list = null;
        Connection connect = null;
        try {
            connect = DBConnectionManager.getInstance().getOracleConnection();
            connect.setTransactionIsolation(Connection.TRANSACTION_SERIALIZABLE);
            list = new CommonDAO(entity).listPageBySql(iCurrPage, iPageSize, sql, connect);
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

    public static long getRowCount(Class entity, String condition) throws Exception {
        long obj = 0;
        Connection connect = null;
        try {
            connect = DBConnectionManager.getInstance().getOracleConnection();
            connect.setTransactionIsolation(Connection.TRANSACTION_SERIALIZABLE);
            obj = (Long) new CommonDAO(entity).getRowCount(condition, connect);
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

}
