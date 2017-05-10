/**
 *
 */
package com.poweronce.util;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;

import org.apache.log4j.Logger;

/**
 * @author Administrator
 */
public final class DAOUtil {

    private static final Logger log = Logger.getLogger(DAOUtil.class);

    /**
     * Close the database connection, along with sql statement and result set.
     * When the connection cannot be closed, detailed info will be logged but
     * not prompt to user.
     *
     * @param rs   : the result set to be closed
     * @param stmt : the statement to be closed
     * @param conn : the connection to be closed
     */
    public static void releaseResource(ResultSet rs, Statement stmt, Connection conn) {
        if (rs != null) {
            try {
                rs.close();
                rs = null;
            } catch (Exception e) {
                log.error("DAOUtil.releaseResource: Error when close resultset", e);
            }
        }
        if (stmt != null) {
            try {
                stmt.close();
                stmt = null;
            } catch (Exception e) {
                log.error("DAOUtil.releaseResource: Error when close statement", e);
            }
        }
        if (conn != null) {
            try {
                conn.close();
                conn = null;
            } catch (Exception e) {
                log.error("DAOUtil.releaseResource: Error when close connection", e);
            }
        }
    }

    /**
     * *
     * 将一串id连接成(id1,id2......)的条件
     *
     * @param ids
     * @return
     */
    public static final String concateIDsToCondition(long... ids) {
        if (ids == null || ids.length < 1) {
            return "()";
        }
        StringBuilder sb = new StringBuilder("(");
        for (int i = 0; i < ids.length; i++) {
            sb.append(ids[i] + ",");
        }
        sb.replace(sb.length() - 1, sb.length(), ")");
        return sb.toString();
    }

}
