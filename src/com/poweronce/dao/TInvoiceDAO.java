/**
 *
 */
package com.poweronce.dao;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;

import com.poweronce.entity.TInvoice;
import com.poweronce.util.DAOUtil;

/**
 * @author Administrator
 */
public final class TInvoiceDAO extends BaseDAO<TInvoice> {

    private static final Logger log = Logger.getLogger(TInvoiceDAO.class);

    private static final String sqlQueryBase = "select * from TInvoice ";
    private static final String sqlDeleteBase = "delete from TInvoice ";
    private static final String sqlInsert = "insert into TInvoice(provider_id,purchase_bill_code,invoice_code,amout,paidAmount,description,invoiceDate,updDate,credit) values(?,?,?,?,?,?,?,?,?)";

    private static final int[] typeInsert = new int[]{Types.INTEGER, Types.VARCHAR, Types.VARCHAR, Types.FLOAT, Types.FLOAT,
            Types.VARCHAR, Types.INTEGER, Types.INTEGER, Types.FLOAT};

    public TInvoiceDAO() throws DAOException {
        super();
    }

    public TInvoiceDAO(BaseDAO dao) throws DAOException {
        super(dao);
    }

    protected TInvoice convertObjectFromRecord(ResultSet rs) throws SQLException {
        if (rs == null)
            return null;
        TInvoice obj = new TInvoice();
        obj.setId(rs.getLong("id"));
        obj.setProvider_id(rs.getLong("provider_id"));
        obj.setPurchase_bill_code(rs.getString("purchase_bill_code"));
        obj.setInvoice_code(rs.getString("invoice_code"));
        obj.setAmout(rs.getFloat("amout"));
        obj.setDescription(rs.getString("description"));
        obj.setInvoiceDate(rs.getLong("invoiceDate"));
        obj.setUpdDate(rs.getLong("updDate"));
        obj.setPaidAmount(rs.getFloat("paidAmount"));
        obj.setCredit(rs.getFloat("credit"));
        return obj;
    }

    protected Object[] convertObjectToRecord(TInvoice obj) {
        if (obj == null)
            return null;
        return new Object[]{obj.getProvider_id(), obj.getPurchase_bill_code().trim(), obj.getInvoice_code().trim(),
                (float) obj.getAmout(), obj.getPaidAmount(), obj.getDescription().trim(), obj.getInvoiceDateForDB(), obj.getUpdDateForDB(),
                obj.getCredit()};
    }

    public boolean insert(TInvoice obj) throws DAOException {
        if (obj == null) {
            return false;
        }
        boolean isSuc = this.update(sqlInsert, typeInsert, this.convertObjectToRecord(obj)) > 0;
        if (isSuc) {
            this.resetProviderInvoice(obj.getProvider_id());
            this.resetPurchaseInvoiceInfo(obj.getInvoice_code(), obj.getPurchase_bill_code(), obj.getAmout());
        }
        return isSuc;
    }

    public List<TInvoice> queryByProvider(long provider_id) throws DAOException {
        return this.query(sqlQueryBase + " where provider_id=" + provider_id + " order by invoiceDate desc", new Object[]{}, new int[]{});
    }

    public TInvoice getInvoice(long provider_id, String purchase_bill_code) throws DAOException {
        List<TInvoice> invoices = this.query(sqlQueryBase + " where provider_id=? and purchase_bill_code=?", new Object[]{provider_id,
                purchase_bill_code}, new int[]{Types.INTEGER, Types.VARCHAR});
        if (invoices == null || invoices.size() < 1) {
            return null;
        }
        return invoices.get(0);
    }

    public TInvoice getInvoice(String invoice_code) throws DAOException {
        List<TInvoice> invoices = this.query(sqlQueryBase + " where invoice_code=?", new Object[]{invoice_code},
                new int[]{Types.VARCHAR});
        if (invoices == null || invoices.size() < 1) {
            return null;
        }
        return invoices.get(0);
    }

    public TInvoice getInvoice(long id) throws DAOException {
        List<TInvoice> invoices = this.query(sqlQueryBase + " where id=?", new Object[]{id}, new int[]{Types.INTEGER});
        if (invoices == null || invoices.size() < 1) {
            return null;
        }
        return invoices.get(0);
    }

    public boolean saveInvoice(TInvoice invoice, double oldAmount) throws DAOException {
        if (invoice == null) {
            return false;
        }
        boolean isSuc = this.update(
                "update TInvoice set invoice_code=?,amout=?,description=?,invoiceDate=?,updDate=?,credit=? where id=?",
                new int[]{Types.VARCHAR, Types.FLOAT, Types.VARCHAR, Types.INTEGER, Types.INTEGER, Types.FLOAT, Types.INTEGER},
                new Object[]{invoice.getInvoice_code().trim(), (float) invoice.getAmout(), invoice.getDescription().trim(),
                        invoice.getInvoiceDateForDB(), (new Date()).getTime(), invoice.getCredit(), invoice.getId()}) > 0;
        if (isSuc) {
            this.resetProviderInvoice(invoice.getProvider_id());
            this.resetPurchaseInvoiceInfo(invoice.getInvoice_code(), invoice.getPurchase_bill_code(), invoice.getAmout());
        }
        return isSuc;
    }

    private void resetProviderInvoice(long provider_id) throws DAOException {
        if (provider_id < 0) {
            return;
        }
        ResultSet rs = null;
        try {
            rs = this.queryData("select sum(amout-paidAmount-credit), sum(amout) from TInvoice where provider_id=" + provider_id);
            double invoice_balance = 0, invoice_total = 0;
            if (rs != null && rs.next()) {
                invoice_balance = rs.getFloat(1);
                invoice_total = rs.getFloat(2);
            }
            DAOUtil.releaseResource(rs, null, null);
            this.update("update TProvider set invoice_balance=?,invoice_total=? where id=?", new int[]{Types.FLOAT, Types.FLOAT,
                    Types.INTEGER}, new Object[]{invoice_balance, invoice_total, provider_id});
        } catch (SQLException ex) {
            DAOUtil.releaseResource(rs, null, null);
            log.error("Error when querying invoice info when resetProviderInvoice:" + ex.getMessage(), ex);
            throw new DAOException("Error when querying invoice info when resetProviderInvoice:" + ex.getMessage(), ex);
        }
    }

    private void resetPurchaseInvoiceInfo(String invoice_code, String purchase_bill_code, double amount) throws DAOException {
        if (!StringUtils.isBlank(invoice_code) && !StringUtils.isBlank(purchase_bill_code)) {
            this.update("update TPurchase set invoice_code=? , all_purchase_price=? where purchase_bill_code=?", new int[]{Types.VARCHAR,
                    Types.DOUBLE, Types.VARCHAR}, new Object[]{invoice_code.trim(), amount, purchase_bill_code.trim()});
        }
    }

    /**
     * *
     * 支付账单
     */
    public boolean payInvoice(TInvoice oldInvoice, double paidAmount) throws DAOException {
        boolean isSuc = update("update TInvoice set paidAmount=paidAmount+? where id=?", new int[]{Types.FLOAT, Types.INTEGER},
                new Object[]{paidAmount, oldInvoice.getId()}) > 0;
        if (isSuc) {
            this.resetProviderInvoice(oldInvoice.getProvider_id());
            TInvoice invoice = this.getInvoice(oldInvoice.getId());
            if (invoice.getAmout() - invoice.getPaidAmount() - invoice.getCredit() <= 0.001) {
                this.update("update TPurchase set paid=1,all_paid_price=? where purchase_bill_code=?", new int[]{Types.FLOAT,
                        Types.VARCHAR}, new Object[]{invoice.getPaidAmount() + invoice.getCredit(),
                        invoice.getPurchase_bill_code().trim()});
            } else {
                this.update("update TPurchase set all_paid_price=? where purchase_bill_code=?", new int[]{Types.FLOAT, Types.VARCHAR},
                        new Object[]{invoice.getPaidAmount() + invoice.getCredit(), invoice.getPurchase_bill_code().trim()});
            }
        }
        return isSuc;
    }

    public int deleteByIds(long... ids) throws DAOException {
        if (ids == null || ids.length < 1) {
            return 0;
        }
        // also need change invoice total and invoice balance
        int rows = this.update(sqlDeleteBase + " where id in" + DAOUtil.concateIDsToCondition(ids));
        if (rows > 0) {
            // reset TProvider invoice info
            // reset TPurchase info
        }
        return rows;
    }
}
