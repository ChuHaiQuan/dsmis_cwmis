package com.poweronce.dao.mysql;

import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.Driver;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.StringTokenizer;

import com.poweronce.util.CTime;

public class DBConnectionManager {

    static private int clients;

    static private String ORACLEPOOLNAME = "oraclePoolName";

    private PrintWriter logPrint;

    private Map pools = new HashMap();

    /**
     * 静态工厂方法
     *
     * @return
     */
    public static DBConnectionManager getInstance() {
        return instance;
    }

    /**
     * 饿汉式单例类
     */
    private static final DBConnectionManager instance = new DBConnectionManager();

    /**
     * 建构函数私有以防止其它对象创建本类实例
     */
    private DBConnectionManager() {
        init();
    }

    /**
     * 使用默认的连接池名,创建并返回新连接
     *
     * @return Connection 可用连接或null
     */
    public Connection getOracleConnection() {
        return getConnection(ORACLEPOOLNAME);
    }

    /**
     * 获得一个可用的(空闲的)连接.如果没有可用连接,且已有连接数小于最大连接数 限制,则创建并返回新连接
     *
     * @param name在属性文件中定义的连接池名字
     * @return Connection 可用连接或null
     */
    public Connection getConnection(String name) {
        DBConnection pool = (DBConnection) pools.get(name);
        if (pool != null) {
            return pool.getConnection();
        }
        return null;
    }

    /**
     * 将连接对象返回给默认的连接池
     *
     * @param con 连接对象
     */
    public void freeOracleConnection(Connection con) {
        String name = ORACLEPOOLNAME;
        freeConnection(name, con);
    }

    /**
     * 将连接对象返回给由名字指定的连接池
     *
     * @param name 在属性文件中定义的连接池名字
     * @param con  连接对象
     */
    public void freeConnection(String name, Connection con) {
        DBConnection pool = (DBConnection) pools.get(name);
        if (pool != null) {
            pool.freeConnection(con);
        }
    }

    /**
     * 读取属性完成初始化
     */
    private void init() {
        Properties property = null;
        try {
            ClassLoader loader = getClass().getClassLoader();
            property = new Properties();
            property.load(loader.getResourceAsStream("connection.properties"));
            String logFile = property.getProperty("Managerlogfile", "DBConnectionManager.log");

            logPrint = new PrintWriter(new FileWriter(logFile, true), true);
        } catch (IOException e) {
            // System.err.println("无法打开日志文件：" + logFile);
            logPrint = new PrintWriter(System.err);
        }
        loadDrivers(property);
        createPools(property);
    }

    /**
     * 根据指定属性创建连接池实例.
     *
     * @param props 连接池属性
     */
    private void createPools(Properties props) {
        Enumeration propNames = props.propertyNames();
        while (propNames.hasMoreElements()) {
            String name = (String) propNames.nextElement();
            if (name.endsWith(".url")) {
                String poolName = name.substring(0, name.lastIndexOf("."));
                String url = props.getProperty(poolName + ".url");
                if (url == null) {
                    // LogWriter.write("没有为连接池" + poolName + "指定URL", 103);
                    continue;
                }
                String user = props.getProperty(poolName + ".userName");
                String password = props.getProperty(poolName + ".password");
                String maxConn = props.getProperty(poolName + ".maxConns", "0");
                String initConn = props.getProperty(poolName + ".initConn", "0");
                String timeOut = props.getProperty(poolName + ".timeOut", "0");
                int init = 0, max = 0, time = 0;
                try {
                    init = Integer.valueOf(initConn).intValue();
                    max = Integer.valueOf(maxConn).intValue();
                    time = Integer.valueOf(timeOut).intValue();
                } catch (NumberFormatException e) {
                    // LogWriter.write("错误的最大连接数限制：" + maxConn + ".连接池："
                    // + poolName, 101);
                }
                // System.out.println("max===="+max);
                DBConnection pool = new DBConnection(poolName, url, user, password, max, init, time);
                pools.put(poolName, pool);
                // LogWriter.write("成功创建连接池" + poolName, 100);
            }
        }
    }

    /**
     * 装载和注册所有JDBC驱动程序
     *
     * @param props 属性
     */
    private void loadDrivers(Properties props) {
        String driverClasses = props.getProperty("dbDrivers");
        StringTokenizer st = new StringTokenizer(driverClasses);
        while (st.hasMoreElements()) {
            String driverClassName = st.nextToken().trim();
            try {
                Driver driver = (Driver) Class.forName(driverClassName).newInstance();
                DriverManager.registerDriver(driver);
                // LogWriter.write("成功JDBC注册驱动程序" + driverClassName, 100);
            } catch (Exception e) {
                // LogWriter.write("无法注册JDBC驱动程序；" + driverClassName + "，错误：" +
                // e,102);
            }
        }
    }

    /**
     * 测试main（）
     *
     * @param args
     */
    public static void main(String[] args) {

        System.out.println(CTime.getTime("yyyy-MM-dd HH:mm:ss:SSS"));
        for (int i = 0; i < 100; i++) {
            Connection conn = DBConnectionManager.getInstance().getOracleConnection();
            Connection conn1 = DBConnectionManager.getInstance().getOracleConnection();

            Connection conn2 = DBConnectionManager.getInstance().getOracleConnection();
            Connection conn3 = DBConnectionManager.getInstance().getOracleConnection();
            Connection conn4 = DBConnectionManager.getInstance().getOracleConnection();
            if (conn == null)
                System.out.println("连接数据库出现错误");
            else
                System.out.println("连接数据库正常");

            try {
                DBConnectionManager.getInstance().freeOracleConnection(conn);
                DBConnectionManager.getInstance().freeOracleConnection(conn1);
                DBConnectionManager.getInstance().freeOracleConnection(conn1);
                DBConnectionManager.getInstance().freeOracleConnection(conn2);
                DBConnectionManager.getInstance().freeOracleConnection(conn3);
                DBConnectionManager.getInstance().freeOracleConnection(conn4);
            } catch (Exception ex1) {
                System.out.println("释放数据库连接出现错误");
            }

        }

        // System.out.println(CTime.getTime("yyyy-MM-dd HH:mm:ss:SSS"));
        // for (int i = 0; i < 400; i++) {
        // try {
        // Connection connect = DBConnectFactory.getInstance().getConnection();
        // System.out.println("连接数据库正常");
        // connect.close();
        // } catch (SQLException e) {
        // System.out.println("连接数据库出现错误");
        // e.printStackTrace();
        // }
        // }
        // System.out.println(CTime.getTime("yyyy-MM-dd HH:mm:ss:SSS"));
    }
}
