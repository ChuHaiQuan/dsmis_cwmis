/**
 *
 */
package com.poweronce.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.LinkedList;
import java.util.List;

import org.apache.log4j.Logger;
import com.poweronce.dao.mysql.DBConnectionManager;
import com.poweronce.util.DAOUtil;

/**
 * @author Administrator
 */
public abstract class BaseDAO<T> {

    private static final Logger log = Logger.getLogger(BaseDAO.class);

    private Connection conn = null;

    /**
     * get the connection
     *
     * @throws DAOException
     */
    public BaseDAO() throws DAOException {
        try {
            conn = DBConnectionManager.getInstance().getOracleConnection();
            conn.setAutoCommit(true);
        } catch (Exception e) {
            log.fatal("fail to get the connection from datasource.", e);
            throw new DAOException("fail to get the connection from datasource.", e);
        }
    }

    public BaseDAO(BaseDAO dao) {
        this.conn = dao.getConnection();
    }

    protected Connection getConnection() {
        return this.conn;
    }

    public void close() throws DAOException {
        DBConnectionManager.getInstance().freeOracleConnection(conn);
    }

    /**
     * *
     * start the transaction
     *
     * @throws DAOException
     */
    public void startTransaction() throws DAOException {
        try {
            conn.setAutoCommit(false);
        } catch (SQLException e) {
            log.error("fail to start the transaction.", e);
            throw new DAOException("fail to start the transaction.", e);
        }
    }

    public void rollback() throws DAOException {
        try {
            conn.rollback();
            conn.setAutoCommit(true);
        } catch (SQLException e) {
            log.error("fail to rollbak the transaction.", e);
            throw new DAOException("fail to rollbak the transaction.", e);
        }
    }

    public void commit() throws DAOException {
        try {
            conn.commit();
            conn.setAutoCommit(true);
        } catch (SQLException e) {
            log.error("fail to commit the transaction.", e);
            throw new DAOException("fail to commit the transaction.", e);
        }
    }

    /**
     * <p>
     * To excute insert, update and delete SQL statements
     * </p>
     *
     * @param sql
     * @param inTypes
     * @param inParams
     * @return the number of the referenced Table items.
     * @throws DAOException if database error
     */
    protected int update(String sqlCmd, int[] inTypes, Object[] inParams) throws DAOException {
        PreparedStatement pstmt = null;
        try {
            pstmt = conn.prepareStatement(sqlCmd);
            int argCnt = inParams.length;
            for (int i = 0; i < argCnt; i++) {
                Object obj = inParams[i];
                if (obj != null) {
                    pstmt.setObject(i + 1, inParams[i]);
                } else {
                    pstmt.setNull(i + 1, inTypes[i]);
                }
            }
            int res = pstmt.executeUpdate();
            return res;
        } catch (SQLException e) {
            log.error("Error when updating database: sql = '" + sqlCmd + "'", e);
            throw new DAOException("Error when updating database: sql = '" + sqlCmd + "'", e);
        } finally {
            DAOUtil.releaseResource(null, pstmt, null);
        }
    }

    protected int update(String sql) throws DAOException {
        Statement stmt = null;
        try {
            stmt = conn.createStatement();
            int res = stmt.executeUpdate(sql);
            return res;
        } catch (SQLException e) {
            log.error("Error when updating database: sql = '" + sql + "'", e);
            throw new DAOException("Error when updating database: sql = '" + sql + "'", e);
        } finally {
            DAOUtil.releaseResource(null, stmt, null);
        }
    }

    /**
     * <p>
     * if the result set is small, then this query method will be more easy
     * query the database, and return the data as list, every element
     * corresponds to each row, and its type is object[]
     * </p>
     *
     * @param sql
     * @return List<Object[]>
     * @throws DAOException : if database error
     */
    protected List<T> query(String sql, Object[] inParams, int[] inTypes) throws DAOException {
        List<T> rsall = new LinkedList<T>();
        PreparedStatement stmt = null;
        ResultSet rs = null;
        try {
            stmt = conn.prepareStatement(sql);
            int argCnt = inParams.length;
            for (int i = 0; i < argCnt; i++) {
                Object obj = inParams[i];
                if (obj != null) {
                    stmt.setObject(i + 1, inParams[i], inTypes[i]);
                } else {
                    stmt.setNull(i + 1, inTypes[i]);
                }
            }
            rs = stmt.executeQuery();
            while (rs.next()) {
                T obj = this.convertObjectFromRecord(rs);
                if (obj != null) {
                    rsall.add(obj);
                }
            }
            return rsall;
        } catch (java.lang.Exception ex) {
            log.error("Error when querying database: sql = '" + sql + "'", ex);
            throw new DAOException("Error when querying database: sql = '" + sql + "'", ex);
        } finally {
            DAOUtil.releaseResource(rs, stmt, null);
        }
    }

    public ResultSet queryData(String sql) throws DAOException {
        Statement stmt = null;
        try {
            stmt = conn.createStatement();
            return stmt.executeQuery(sql);
        } catch (java.lang.Exception ex) {
            log.error("Error when querying database: sql = '" + sql + "'", ex);
            throw new DAOException("Error when querying database: sql = '" + sql + "'", ex);
        }
    }

    /**
     * used for select clause
     *
     * @param obj
     * @return
     */
    protected abstract T convertObjectFromRecord(ResultSet rs) throws SQLException;

    /**
     * used for insert clause
     *
     * @param obj
     * @return
     */
    protected abstract Object[] convertObjectToRecord(T obj);
}
