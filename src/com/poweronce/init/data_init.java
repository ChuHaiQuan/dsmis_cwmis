package com.poweronce.init;

import java.sql.Connection;
import java.sql.PreparedStatement;

import com.poweronce.dao.mysql.DBConnectionManager;

public class data_init {

    public static void main(String[] args) throws Exception {
	Connection connect = null;
	connect = DBConnectionManager.getInstance().getOracleConnection();
	connect.setTransactionIsolation(Connection.TRANSACTION_SERIALIZABLE);
	PreparedStatement ps = (PreparedStatement) connect.createStatement();
	ps.execute("insert into tuser () values ()");
	connect.commit();
	DBConnectionManager.getInstance().freeOracleConnection(connect);

    }
}
