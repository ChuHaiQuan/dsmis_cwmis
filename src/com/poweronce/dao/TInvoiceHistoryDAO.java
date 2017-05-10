/**
 *
 */
package com.poweronce.dao;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.List;

import com.poweronce.entity.TInvoiceHistory;

/**
 * @author Administrator
 */
public final class TInvoiceHistoryDAO extends BaseDAO<TInvoiceHistory> {

    private static final String SQL_QUERY_BASE = "select * from TInvoiceHistory ";
    private static final String SQL_INSERT = "insert into TInvoiceHistory(invoice_id,amout,payDate,remark,payment) values(?,?,?,?,?)";
    private static final int[] TYPES_INSERT = new int[]{Types.INTEGER, Types.FLOAT, Types.INTEGER};

    public TInvoiceHistoryDAO() throws DAOException {
        super();
    }

    public TInvoiceHistoryDAO(BaseDAO dao) throws DAOException {
        super(dao);
    }

    protected TInvoiceHistory convertObjectFromRecord(ResultSet rs) throws SQLException {
        if (rs == null)
            return null;
        TInvoiceHistory obj = new TInvoiceHistory();
        obj.setId(rs.getLong("id"));
        obj.setInvoice_id(rs.getLong("invoice_id"));
        obj.setAmout(rs.getFloat("amout"));
        obj.setpayDate(rs.getLong("payDate"));
        obj.setRemark(rs.getString("remark"));
        obj.setPayment(rs.getString("payment"));
        return obj;
    }

    protected Object[] convertObjectToRecord(TInvoiceHistory obj) {
        if (obj == null)
            return null;
        return new Object[]{obj.getInvoice_id(), obj.getAmout(), obj.getPayDateForDB(), obj.getRemark(), obj.getPayment()};
    }

    /**
     * *
     * insert
     *
     * @throws DAOException
     */
    public boolean insert(TInvoiceHistory obj) throws DAOException {
        if (obj == null) {
            return false;
        }
        return this.update(SQL_INSERT, TYPES_INSERT, this.convertObjectToRecord(obj)) > 0;
    }

    /**
     * gets
     *
     * @throws DAOException
     */
    public List<TInvoiceHistory> getByInvoiceId(long invoiceId) throws DAOException {
        return this.query(SQL_QUERY_BASE + " where invoice_id=?", new Object[]{invoiceId}, new int[]{Types.INTEGER});
    }

}
