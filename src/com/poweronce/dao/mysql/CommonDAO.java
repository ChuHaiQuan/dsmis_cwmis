/*
 * Created on 2004-2-10
 *
 * To change the template for this generated file go to
 * Window - Preferences - Java - Code Generation - Code and Comments
 */
package com.poweronce.dao.mysql;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import com.poweronce.annotation.TableAnnotation;

public class CommonDAO {
    static final boolean sql_print = true;
    String class_name;
    String table_name;
    String identity_id;
    Boolean if_auto_increment = true;

    public CommonDAO(Class clazz) {
        if (clazz != null) {
            class_name = clazz.getName();
            table_name = class_name.substring((class_name.lastIndexOf('.') == -1 ? 0 : class_name.lastIndexOf('.') + 1), class_name.length());
            identity_id = "id";
            // 获得表的属性
            if (clazz.isAnnotationPresent(TableAnnotation.class)) {
                TableAnnotation formLabel = (TableAnnotation) clazz.getAnnotation(TableAnnotation.class);
                identity_id = formLabel.id();
                String auto_increment = formLabel.auto_increment();
                if ("no".equalsIgnoreCase(auto_increment))
                    if_auto_increment = false;
            }
        }
    }

    private List getCurrentCollection(String sql, Connection connect) throws Exception {
        List col = new ArrayList();
        PreparedStatement ps = null;
        ResultSet rs = null;
        if (sql_print)
            System.out.println(sql);
        try {
            ps = connect.prepareStatement(sql);
            rs = ps.executeQuery();
            col = resultSetToCollection(rs);
        } finally {
            try {
                if (rs != null)
                    rs.close();
                if (ps != null)
                    ps.close();
            } catch (SQLException e1) {
                e1.printStackTrace();
            }
        }
        return col;
    }

    private List getCurrentCollection(final int currpage, final int pagesize, String sql, Connection connect) throws Exception {
        List col = new ArrayList();
        PreparedStatement ps = null;
        ResultSet rs = null;
        String sqlStr = getOracleLimitString(sql, (currpage - 1) * pagesize, pagesize);
        if (sql_print)
            System.out.println(sqlStr);
        try {
            ps = connect.prepareStatement(sqlStr);
            rs = ps.executeQuery();
            col = resultSetToCollection(rs);
        } finally {
            try {
                if (rs != null)
                    rs.close();
                if (ps != null)
                    ps.close();
            } catch (SQLException e1) {
                e1.printStackTrace();
            }
        }
        return col;
    }

    private String getOracleLimitString(String sql, int row_min, int page_size) {
        StringBuffer pagingSelect = new StringBuffer(1000);
        int nOrder = sql.indexOf(" order by ");
        int nWhere = sql.indexOf(" where ");
        if (nOrder > 1) {
            pagingSelect.append("select * from (");
            pagingSelect.append(sql);
            pagingSelect.append(" ) A limit " + row_min + "," + page_size);
        } else {
            if (nWhere > 1) {
                pagingSelect.append(sql);
                pagingSelect.append(" limit " + row_min + "," + page_size);
            } else {
                pagingSelect.append(sql);
                pagingSelect.append(" limit " + row_min + "," + page_size);
            }
        }
        return pagingSelect.toString();
    }

    // 把数据库里的ResultSet转换为List对象
    private List resultSetToCollection(ResultSet rs) throws Exception {
        List col = new ArrayList();
        while (rs.next()) {
            Class clazz = Class.forName(getObjectName());
            Object obj = clazz.newInstance();
            Field[] fields = clazz.getDeclaredFields();
            for (int i = 0; i < fields.length; i++) {
                // 属性名
                String field = fields[i].getName();
                // 方法名
                String filedName = "set" + field.substring(0, 1).toUpperCase() + field.substring(1, field.length());
                // 属性类型
                Class fieldClazz = fields[i].getType();
                // 属性类型名称
                String fieldClass = fieldClazz.getName();
                // short类型
                if (fieldClass.equals("short")) {
                    Class[] paraClass = {short.class};
                    short rsValue = rs.getShort(field);
                    Object[] paraObj = {new Short(rsValue)};
                    Method method = clazz.getDeclaredMethod(filedName, paraClass);
                    method.invoke(obj, paraObj);
                }
                // short类型
                else if (fieldClass.equals("java.lang.Short")) {
                    Class[] paraClass = {Short.class};
                    Short rsValue = rs.getShort(field);
                    Object[] paraObj = {new Short(rsValue)};
                    Method method = clazz.getDeclaredMethod(filedName, paraClass);
                    method.invoke(obj, paraObj);
                }
                // int类型
                else if (fieldClass.equals("int")) {
                    Class[] paraClass = {int.class};
                    int rsValue = rs.getInt(field);
                    Object[] paraObj = {new Integer(rsValue)};
                    Method method = clazz.getDeclaredMethod(filedName, paraClass);
                    method.invoke(obj, paraObj);
                }
                // int类型
                else if (fieldClass.equals("java.lang.Integer")) {
                    Class[] paraClass = {Integer.class};
                    Integer rsValue = rs.getInt(field);
                    Object[] paraObj = {new Integer(rsValue)};
                    Method method = clazz.getDeclaredMethod(filedName, paraClass);
                    method.invoke(obj, paraObj);
                }
                // string类型
                else if (fieldClass.equals("java.lang.String")) {
                    Class[] paraClass = {String.class};
                    String rsValue = rs.getString(field);
                    Object[] paraObj = {rsValue};
                    Method method = clazz.getDeclaredMethod(filedName, paraClass);
                    method.invoke(obj, paraObj);
                }
                // long类型
                else if (fieldClass.equals("long")) {
                    Class[] paraClass = {long.class};
                    long rsValue = rs.getLong(field);
                    Object[] paraObj = {new Long(rsValue)};
                    Method method = clazz.getDeclaredMethod(filedName, paraClass);
                    method.invoke(obj, paraObj);
                }
                // long类型
                else if (fieldClass.equals("java.lang.Long")) {
                    Class[] paraClass = {Long.class};
                    Long rsValue = rs.getLong(field);
                    Object[] paraObj = {new Long(rsValue)};
                    Method method = clazz.getDeclaredMethod(filedName, paraClass);
                    method.invoke(obj, paraObj);
                }
                // float类型
                else if (fieldClass.equals("float")) {
                    Class[] paraClass = {float.class};
                    float rsValue = rs.getFloat(field);
                    Object[] paraObj = {new Float(rsValue)};
                    Method method = clazz.getDeclaredMethod(filedName, paraClass);
                    method.invoke(obj, paraObj);
                }
                // float类型
                else if (fieldClass.equals("java.lang.Float")) {
                    Class[] paraClass = {Float.class};
                    Float rsValue = rs.getFloat(field);
                    Object[] paraObj = {new Float(rsValue)};
                    Method method = clazz.getDeclaredMethod(filedName, paraClass);
                    method.invoke(obj, paraObj);
                }
                // double类型
                else if (fieldClass.equals("double")) {
                    Class[] paraClass = {double.class};
                    double rsValue = rs.getDouble(field);
                    Object[] paraObj = {new Double(rsValue)};
                    Method method = clazz.getDeclaredMethod(filedName, paraClass);
                    method.invoke(obj, paraObj);
                } else if (fieldClass.equals("java.lang.Double")) {
                    Class[] paraClass = {Double.class};
                    Double rsValue = rs.getDouble(field);
                    Object[] paraObj = {new Double(rsValue)};
                    Method method = clazz.getDeclaredMethod(filedName, paraClass);
                    method.invoke(obj, paraObj);
                }
                // Date类型
                else if (fieldClass.equals("java.util.Date")) {
                    Class[] paraClass = {Date.class};
                    Date rsValue = rs.getTimestamp(field);
                    Object[] paraObj = {rsValue};
                    Method method = clazz.getDeclaredMethod(filedName, paraClass);
                    method.invoke(obj, paraObj);
                }
            }
            col.add(obj);
        }
        return col;
    }

    public Object get(Object id, Connection connect) throws Exception {
        List col = new ArrayList();
        PreparedStatement ps = null;
        ResultSet rs = null;
        String idtemp = id.toString();
        if (id instanceof String) {
            idtemp = "'" + idtemp + "'";
        }
        String sqlStr = "select * from " + getTableName() + " where " + getIdentity() + "=" + idtemp;
        if (sql_print)
            System.out.println(sqlStr);
        try {
            ps = connect.prepareStatement(sqlStr);
            rs = ps.executeQuery();
            col = resultSetToCollection(rs);
        } finally {
            try {
                if (rs != null)
                    rs.close();
                if (ps != null)
                    ps.close();
            } catch (SQLException e1) {
                e1.printStackTrace();
            }
        }
        if (col == null || col.size() == 0)
            return null;
        return col.get(0);
    }

    public int delete(Object id, Connection connect) throws Exception {
        int ret = -1;
        String idtemp = id.toString();
        if (id instanceof String) {
            idtemp = "'" + idtemp + "'";
        }
        PreparedStatement ps = null;
        String testLock = "select * from " + getTableName() + " where " + getIdentity() + "=" + idtemp + " for update";
        ps = connect.prepareStatement(testLock);
        ps.execute();
        ps.close();
        String sqlStr = "delete from " + getTableName() + " where " + getIdentity() + "=" + idtemp;
        if (sql_print)
            System.out.println(sqlStr);
        try {
            ps = connect.prepareStatement(sqlStr);
            int n = ps.executeUpdate();
            ret = n;
        } finally {
            try {
                if (ps != null)
                    ps.close();
            } catch (SQLException e1) {
                e1.printStackTrace();
            }
        }
        return ret;
    }

    // 修改表中的数据
    public String update(Object object, Object indentityObj, Connection connect) throws Exception {
        String sql = "";
        boolean havLob = false;
        String idtemp = indentityObj.toString();
        if (indentityObj instanceof String) {
            idtemp = "'" + idtemp + "'";
        }
        Class clazz = object.getClass();
        PreparedStatement ps = null;
        try {
            ps = connect.prepareStatement("select * from " + getTableName() + " where " + getIdentity() + "=" + idtemp + " for update");
            ps.execute();
            ps.close();
            // 用于存放CLOB,BLOB的字段名和值
            HashMap lobMap = new HashMap();
            // 组装sql语句
            sql = "update " + getTableName() + " set ";
            Field[] fields = clazz.getDeclaredFields();
            // 字段
            for (int i = 0; i < fields.length; i++) {
                String field = fields[i].getName();
                String filedName = "get" + field.substring(0, 1).toUpperCase() + field.substring(1, field.length());
                Method method = clazz.getDeclaredMethod(filedName, null);
                Object retObj = method.invoke(object, null);
                // 不更新未更改字段
                if (retObj == null)
                    continue;
                // 不更新主键
                if (getIdentity().equals(field))
                    continue;
                int len = field.length();
                if (len > 4 && field.substring(len - 4).equals("Clob")) {
                    lobMap.put(field, retObj);
                    havLob = true;
                    continue;
                } else if (len > 4 && field.substring(len - 4).equals("Blob")) {
                    lobMap.put(field, retObj);
                    havLob = true;
                    continue;
                }
                sql += field + "=?,";
            }
            sql = sql.substring(0, sql.length() - 1);
            sql += " where " + getIdentity() + "=" + idtemp;

            ps = connect.prepareStatement(sql);

            // 赋值
            int pos = 1;
            for (int i = 0; i < fields.length; i++) {
                // 属性名
                String field = fields[i].getName();
                int len = field.length();
                // 方法名
                String filedName = "get" + field.substring(0, 1).toUpperCase() + field.substring(1, field.length());
                Method method = clazz.getDeclaredMethod(filedName, null);
                Object retObj = method.invoke(object, null);
                // 不更新未更改字段及主键
                if (retObj == null || getIdentity().equals(field) || (len > 4 && field.substring(len - 4).equals("Clob"))
                        || (len > 4 && field.substring(len - 4).equals("Blob")))
                    continue;

                // 属性类型
                Class fieldClazz = fields[i].getType();
                // 属性类型名称
                String fieldClass = fieldClazz.getName();

                // 生成值串
                // int类型 long类型
                if (fieldClass.equals("int") || fieldClass.equals("java.lang.Integer") || fieldClass.equals("long") || fieldClass.equals("java.lang.Long")
                        || fieldClass.equals("short") || fieldClass.equals("java.lang.Short")) {
                    ps.setLong(pos++, Long.parseLong((retObj == null) ? "0" : retObj.toString()));
                }
                // 浮点型
                else if (fieldClass.equals("float") || fieldClass.equals("java.lang.Float") || fieldClass.equals("double")
                        || fieldClass.equals("java.lang.Double")) {
                    ps.setFloat(pos++, Float.parseFloat((retObj == null) ? "0" : retObj.toString()));
                }
                // string类型
                else if (fieldClass.equals("java.lang.String")) {
                    ps.setString(pos++, retObj == null ? "" : retObj.toString());
                } else if (fieldClass.equals("java.util.Date")) {
                    ps.setTimestamp(pos++, retObj == null ? new java.sql.Timestamp(new Date().getTime()) : new java.sql.Timestamp(((Date) retObj).getTime()));
                } else {
                    ps.setString(pos++, retObj.toString());
                }

            }
            if (sql_print)
                System.out.println(sql);
            ps.executeUpdate();
        } finally {
            try {
                if (ps != null)
                    ps.close();
            } catch (SQLException e1) {
                e1.printStackTrace();
            }
        }
        return idtemp;
    }

    // 新增数据
    public String insert(Object object, Connection connect) throws Exception {
        int n = 0;
        String sql = "";
        boolean havLob = false;
        Class clazz = object.getClass();
        PreparedStatement ps = null;
        PreparedStatement ps2 = null;
        ResultSet rs = null;
        // 获得主键的序列自增值
        Object identity = null;
        try {
            // 用于存放CLOB,BLOB的字段名和值
            HashMap lobMap = new HashMap();
            // 组装sql语句
            sql = "insert into " + getTableName() + " (";
            Field[] fields = clazz.getDeclaredFields();

            // 插入所有的字段
            for (int i = 0; i < fields.length; i++) {
                if (fields[i].getName().equalsIgnoreCase(identity_id) && if_auto_increment)
                    continue;
                sql += fields[i].getName() + ",";
            }
            sql = sql.substring(0, sql.length() - 1);
            sql += ") values (";

            // ?,主键，BLOB,CLOB字段特殊
            for (int i = 0; i < fields.length; i++) {
                String field = fields[i].getName();
                if (field.equalsIgnoreCase(identity_id) && if_auto_increment)
                    continue;
                int len = field.length();
                if (len > 4 && field.substring(len - 4).equals("Clob")) {
                    sql += "EMPTY_CLOB(),";
                    String filedName = "get" + field.substring(0, 1).toUpperCase() + field.substring(1, field.length());
                    Method method = clazz.getDeclaredMethod(filedName, null);
                    Object retObj = method.invoke(object, null);
                    lobMap.put(field, retObj);
                    havLob = true;
                } else if (len > 4 && field.substring(len - 4).equals("Blob")) {
                    sql += "EMPTY_BLOB(),";
                    String filedName = "get" + field.substring(0, 1).toUpperCase() + field.substring(1, field.length());
                    Method method = clazz.getDeclaredMethod(filedName, null);
                    Object retObj = method.invoke(object, null);
                    lobMap.put(field, retObj);
                    havLob = true;
                } else
                    sql += "?,";
            }
            sql = sql.substring(0, sql.length() - 1);
            sql += ")";

            ps = connect.prepareStatement(sql);

            // 字段赋值
            int pos = 1;
            for (int i = 0; i < fields.length; i++) {
                // 属性名
                String field = fields[i].getName();
                if (getIdentity().equals(field) && if_auto_increment)
                    continue;
                // 属性类型
                Class fieldClazz = fields[i].getType();
                // 属性类型名称
                String fieldClass = fieldClazz.getName();
                // CLOB,BLOB类型
                int len = field.length();
                if (len > 4 && (field.substring(len - 4).equals("Clob") || field.substring(len - 4).equals("Blob")))
                    continue;
                // 其它字段赋值
                String filedName = "get" + field.substring(0, 1).toUpperCase() + field.substring(1, field.length());
                // int类型 long类型
                if (fieldClass.equals("int") || fieldClass.equals("java.lang.Integer") || fieldClass.equals("long") || fieldClass.equals("java.lang.Long")
                        || fieldClass.equals("short") || fieldClass.equals("java.lang.Short")) {
                    Method method = clazz.getDeclaredMethod(filedName, null);
                    Object retObj = method.invoke(object, null);
                    ps.setLong(pos++, Long.parseLong(retObj == null ? "0" : retObj.toString()));
                }
                // 浮点类型
                else if (fieldClass.equals("float") || fieldClass.equals("java.lang.Float") || fieldClass.equals("double")
                        || fieldClass.equals("java.lang.Double")) {
                    Method method = clazz.getDeclaredMethod(filedName, null);
                    Object retObj = method.invoke(object, null);
                    ps.setFloat(pos++, retObj == null ? 0 : new Float(retObj.toString()));
                }
                // string类型
                else if (fieldClass.equals("java.lang.String")) {
                    Method method = clazz.getDeclaredMethod(filedName, null);
                    Object retObj = method.invoke(object, null);
                    ps.setString(pos++, retObj == null ? "" : retObj.toString());
                } else if (fieldClass.equals("java.util.Date")) {
                    Method method = clazz.getDeclaredMethod(filedName, null);
                    Date retObj = (Date) method.invoke(object, null);
                    ps.setTimestamp(pos++, retObj == null ? new java.sql.Timestamp(new Date().getTime()) : new java.sql.Timestamp(retObj.getTime()));
                } else {
                    Method method = clazz.getDeclaredMethod(filedName, null);
                    Object retObj = method.invoke(object, null);
                    ps.setString(pos++, retObj.toString());
                }
            }
            if (sql_print)
                System.out.println(sql);
            ps.executeUpdate();

            sql = "SELECT LAST_INSERT_ID()";
            ps2 = connect.prepareStatement(sql);
            rs = ps2.executeQuery();
            if (rs.next()) {
                identity = rs.getString(1);
            }
        } finally {
            try {
                if (rs != null)
                    rs.close();
                if (ps != null)
                    ps.close();
                if (ps2 != null)
                    ps2.close();
            } catch (SQLException e1) {
                e1.printStackTrace();
            }
        }
        String ret = (identity == null) ? null : (String.valueOf(identity));
        return ret;
    }

    // 把对象保存到数据库 根据对象的主键是否有值来insert或者update
    public String save(Object object, Connection connect) throws Exception {
        if (object == null)
            return null;
        Class clazz = object.getClass();
        String identity = getIdentity();
        String indentityFiledName = "get" + identity.substring(0, 1).toUpperCase() + identity.substring(1, identity.length());
        Method indentityMethod = clazz.getDeclaredMethod(indentityFiledName, null);
        Object indentityObj = indentityMethod.invoke(object, null);
        if (indentityObj == null || indentityObj.toString().length() == 0 || new Long(indentityObj.toString()).longValue() == 0)// 新增
        {
            return insert(object, connect);
        } else// 修改
        {
            return update(object, indentityObj, connect);
        }
    }

    public int execute(String sqlStr, Connection connect) throws Exception {
        PreparedStatement ps = null;
        int n = 0;
        try {
            if (sql_print)
                System.out.println(sqlStr);
            ps = connect.prepareStatement(sqlStr);
            n = ps.executeUpdate();
        } finally {
            try {
                if (ps != null)
                    ps.close();
            } catch (SQLException e1) {
                e1.printStackTrace();
            }
        }
        return n;
    }

    public long getRowCountBySql(String sql, Connection connect) throws Exception {
        Statement ps = null;
        ResultSet rs = null;
        long rows = 0;
        try {
            ps = connect.createStatement();
            String sqlStr = "select count(*) ncount from (" + sql + ") b";
            if (sql_print)
                System.out.println(sqlStr);
            rs = ps.executeQuery(sqlStr);
            while (rs.next()) {
                rows = (rs.getLong(1));
            }
        } finally {
            try {
                if (rs != null)
                    rs.close();
                if (ps != null)
                    ps.close();
            } catch (SQLException e1) {
                e1.printStackTrace();
            }
        }
        return rows;
    }

    public long getOneRowColBySql(String sql, Connection connect) throws Exception {
        Statement ps = null;
        ResultSet rs = null;
        long rows = 0;
        try {
            ps = connect.createStatement();
            if (sql_print)
                System.out.println(sql);
            rs = ps.executeQuery(sql);
            while (rs.next()) {
                rows = (rs.getLong(1));
            }
        } finally {
            try {
                if (rs != null)
                    rs.close();
                if (ps != null)
                    ps.close();
            } catch (SQLException e1) {
                e1.printStackTrace();
            }
        }
        return rows;
    }

    public long getRowCount(String condition, Connection connect) throws Exception {
        Statement ps = null;
        ResultSet rs = null;
        long rows = 0;
        try {
            ps = connect.createStatement();
            String sqlStr = "select count(*) ncount from " + getTableName() + condition;
            if (sql_print)
                System.out.println(sqlStr);
            rs = ps.executeQuery(sqlStr);
            while (rs.next()) {
                rows = (rs.getLong(1));
            }
        } finally {
            try {
                if (rs != null)
                    rs.close();
                if (ps != null)
                    ps.close();
            } catch (SQLException e1) {
                e1.printStackTrace();
            }
        }
        return rows;
    }

    public List listAllBySql(String sql, Connection connect) throws Exception {
        List list = new ArrayList();
        list = getCurrentCollection(sql, connect);
        return list;
    }

    public List listPage(final int currpage, final int pagesize, String condition, String order, Connection connect) throws Exception {
        List list = new ArrayList();
        String sql = "select * from " + getTableName() + condition + order;
        list = getCurrentCollection(currpage, pagesize, sql, connect);
        return list;
    }

    public List listPageBySql(final int currpage, final int pagesize, String sql, Connection connect) throws Exception {
        List list = new ArrayList();
        list = getCurrentCollection(currpage, pagesize, sql, connect);
        return list;
    }

    // 因为数据传输的原因，只取前1000条，多余1000条的记录请带条件查询
    public List listTopN(String condition, String order, int top, Connection connect) throws Exception {
        List list = new ArrayList();
        String sql = "select * from " + getTableName() + condition + order;
        list = getCurrentCollection(1, top, sql, connect);
        return list;
    }

    public List listAllAll(String condition, String order, Connection connect) throws Exception {
        List list = new ArrayList();
        String sql = "select * from " + getTableName() + condition + order;
        list = getCurrentCollection(sql, connect);
        return list;
    }

    public Long getSeqCurValue(String seq) throws Exception {
        Connection connect = null;
        Long id = null;
        try {
            connect = DBConnectionManager.getInstance().getOracleConnection();
            String sql = "select id from " + seq + " limit 0,1 for UPDATE ";
            id = this.getOneRowColBySql(sql, connect);
            connect.commit();
        } finally {
            DBConnectionManager.getInstance().freeOracleConnection(connect);
        }
        return id;
    }

    public Long getSeqNextValue(String seq) throws Exception {
        Connection connect = null;
        Long id = null;
        Statement ps = null;
        Statement ps2 = null;

        try {
            connect = DBConnectionManager.getInstance().getOracleConnection();
            String sql = "select id from " + seq + " limit 0,1 for UPDATE ";
            ps = connect.createStatement();
            ps.execute(sql);
            String sql2 = "update " + seq + " set id=id+1";
            ps2 = connect.createStatement();
            ps2.execute(sql2);

            id = this.getOneRowColBySql(sql, connect);
            connect.commit();
            id = this.getOneRowColBySql(sql, connect);
        } finally {
            try {
                if (ps != null)
                    ps.close();
                if (ps2 != null)
                    ps2.close();
            } catch (SQLException e1) {
                e1.printStackTrace();
            }
            DBConnectionManager.getInstance().freeOracleConnection(connect);
        }
        return id;
    }

    protected String getTableName() {
        return table_name;
    }

    protected String getIdentity() {
        return identity_id;
    }

    protected String getObjectName() {
        return class_name;
    }
}
