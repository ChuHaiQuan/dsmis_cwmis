/**
 *
 */
package com.poweronce.dao;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;

import org.apache.log4j.Logger;

import com.poweronce.entity.TInvoiceHistory;
import com.poweronce.entity.TProduct;
import com.poweronce.util.Constants;

/**
 * @author Administrator
 */
public final class TProductDAO extends BaseDAO<TProduct> {

    public TProductDAO() throws DAOException {
        super();
    }

    public TProductDAO(BaseDAO dao) throws DAOException {
        super(dao);
    }

    private static final Logger log = Logger.getLogger(TProductDAO.class);

    @Override
    protected TProduct convertObjectFromRecord(ResultSet rs) throws SQLException {
        if (rs == null)
            return null;
        TProduct obj = new TProduct();
        obj.setId(rs.getLong("id"));
        obj.setProduct_id(rs.getString("product_id"));
        obj.setCode(rs.getString("Code"));
        obj.setProduct_name("product_name");
        obj.setSpec(rs.getString("Spec"));
        obj.setUnit(rs.getString("Unit"));
        obj.setUpLimit(rs.getFloat("UpLimit"));
        obj.setDownLimit(rs.getFloat("DownLimit"));
        obj.setPrice_income(rs.getFloat("Price_income"));
        obj.setPrice_simgle(rs.getFloat("Price_simgle"));
        obj.setDrawing(rs.getString("Drawing"));
        obj.setHelpName(rs.getString("HelpName"));
        obj.setMyMemo(rs.getString("MyMemo"));
        obj.setDrawing2(rs.getString("Drawing2"));
        obj.setDrawing3(rs.getString("Drawing3"));
        obj.setDrawing4(rs.getString("Drawing4"));
        obj.setDrawing5(rs.getString("Drawing5"));
        obj.setDrawing6(rs.getString("Drawing6"));
        obj.setDrawing7(rs.getString("Drawing7"));
        obj.setDrawing8(rs.getString("Drawing8"));
        obj.setDrawing9(rs.getString("Drawing9"));
        obj.setSreserve1(rs.getString("Sreserve1"));
        obj.setSreserve2(rs.getString("Sreserve2"));
        obj.setSreserve3(rs.getString("Sreserve3"));
        obj.setFreserve1(rs.getInt("freserve1"));
        obj.setFreserve2(rs.getInt("freserve2"));
        obj.setFreserve3(rs.getInt("freserve3"));
        obj.setProduct_type(rs.getString("product_type"));
        obj.setNum(rs.getInt("num"));
        obj.setProduct_name_cn(rs.getString("product_name_cn"));
        obj.setSize(rs.getString("size"));
        obj.setWeight(rs.getString("weight"));
        return obj;
    }

    @Override
    protected Object[] convertObjectToRecord(TProduct obj) {
        return null;
    }

    /**
     * **
     * add self-define product
     *
     * @param obj
     * @return
     * @throws DAOException
     */
    public int insertSelfDefineProduct(TProduct obj) throws DAOException {
        if (obj == null) {
            return 1;
        }
        ResultSet rs = this.queryData("select min(id) from TProduct");
        int id = -1;
        try {
            if (rs.next()) {
                id = rs.getInt(1) - 1;
            }
        } catch (Exception ex) {
            log.error("Error when reading data from sql = 'select min(id) from TProduct'", ex);
            throw new DAOException("Error when reading data from sql = 'select min(id) from TProduct'", ex);

        }
        if (id >= 0) {
            id = -1;
        }
        int rows = this.update("insert into TProduct(id, product_name, price_simgle, price_income, product_type, num, Code) values(?,?,?,?,?,?,?)", new int[]{
                Types.INTEGER, Types.VARCHAR, Types.FLOAT, Types.FLOAT, Types.VARCHAR, Types.INTEGER, Types.VARCHAR}, new Object[]{id,
                obj.getProduct_name(), obj.getPrice_simgle(), obj.getPrice_income(), Constants.PRODUCT_TYPE_SELF_DEFINE, 1, obj.getCode()});
        if (rows > 0) {
            return id;
        }
        return 1;
    }

}
