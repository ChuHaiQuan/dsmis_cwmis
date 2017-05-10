package com.poweronce.dao.mysql;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Iterator;

import com.poweronce.util.Log;
import com.poweronce.util.Path;

public class DBConnection {

    // private PrintWriter logPrint;

    private String name = null;

    private String URL = null;

    private String user = null;

    private String password = null;

    private int checkedOut;

    private int maxConns = -1;

    private int initConns = 0;

    private int timeOut = -1;

    private static ArrayList freeConnections = new ArrayList();

    /**
     * 构造函数
     *
     * @throws Exception
     */
    public DBConnection(String name, String URL, String user, String password, int maxConn, int initConn, int timeOut) {
        this.name = name;
        this.URL = URL;
        this.user = user;
        this.password = password;

        if (initConn < 1) {
            this.initConns = 5;
        } else {
            this.initConns = initConn;
        }
        if (maxConn < 1) {
            this.maxConns = 50;
        } else {
            this.maxConns = maxConn;
        }
        if (timeOut < 1 || timeOut > 5) {
            this.timeOut = 30;
        } else {
            this.timeOut = timeOut;
        }
    }

    /**
     * 从连接池获得一个可用连接，如没有空闲的连接且当前连接数小于最大连接数，则创建新连接，
     * 如原来登记为可用的连接不再有效，则从向量删除之，然后递归调用自己以尝试新的可用连接
     */
    // public synchronized Connection getPoolConnection() {
    // Connection con = null;
    // if (freeConnections.size() > 0) {
    // //获取向量中第一个可用连接
    // con = (Connection) freeConnections.get(0);
    // //从队列中删除连接
    // freeConnections.remove(0);
    // try {
    // // 没有可用连接，或者连接已关闭
    // if (con == null || con.isClosed()) {
    // // LogWriter.write("从连接池" + name + "删除一个无效连接:", 104);
    // con = getConnection();
    // }
    // } catch (SQLException e) {
    // // LogWriter.write("从连接池" + name + "删除一个无效连接:", 105);
    // con = getConnection();
    // }
    //
    // } else if (maxConns == 0 || checkedOut < maxConns) {
    // con = newConnection();
    // }
    // if (con != null) {
    // checkedOut++;
    // }
    // try {
    // con.setAutoCommit(false);
    // } catch (SQLException e) {
    // // TODO Auto-generated catch block
    // e.printStackTrace();
    // }
    //
    // return con;
    // }
    // 数据库重新启动后可以重新获得连接，但是每次检测会损失少量时间
    public synchronized Connection getPoolConnection() {
        Connection con = null;
        if (freeConnections.size() > 0) {
            // 获取向量中第一个可用连接
            con = (Connection) freeConnections.get(0);
            // 从队列中删除连接
            freeConnections.remove(0);
            Statement stat = null;
            try {
                // 没有可用连接，或者连接已关闭
                if (con == null || con.isClosed()) {
                	System.err.println("没有可用连接，或者连接已关闭");
                     //LogWriter.write("从连接池" + name + "删除一个无效连接:", 104);
                    con = getConnection();
                } else {
                    // 测试连接是否可以用，抛跑出异常说明连接已不可用
                    stat = con.createStatement();
                    stat.close();
                }
            } catch (SQLException e) {
                // LogWriter.write("从连接池" + name + "删除一个无效连接:", 105);
                con = getConnection();
            } finally {
                try {
                    if (stat != null) {
                        stat.close();
                    }
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }

        } else if (maxConns == 0 || checkedOut < maxConns) {
            con = newConnection();
        }
        if (con != null) {
            checkedOut++;
        }
        try {
            con.setAutoCommit(false);
        } catch (SQLException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

        return con;
    }

    /**
     * 从连接池获取可用连接，可以指定客户程序能够等待的最长时间
     *
     * @param timeout 以毫秒计的等待时间限制
     * @throws SQLException
     */
    public synchronized Connection getConnection() {
        long startTime = System.currentTimeMillis();
        long remaining = timeOut;
        Connection con = null;
        while ((con = getPoolConnection()) == null) {
            try {
                wait(remaining);
                remaining = timeOut - (System.currentTimeMillis() - startTime);
                if (remaining <= 0) {
                    // LogWriter.write("连接超时:", 109);
                    break;
                }
            } catch (InterruptedException e) {
            }
        }
        return con;
    }

    /**
     * 创建新的连接
     */
    private Connection newConnection() {
        Connection con = null;
        try {
            if (user == null) {
                con = DriverManager.getConnection(URL);
            } else {
                con = DriverManager.getConnection(URL, user, password);
            }
            // LogWriter.write("连接池" + name + "创建一个新的连接", 100);
        } catch (SQLException e) {
            try {
                Log.printEvent("无法创建下列URL的连接" + e.getMessage(), Path.getPathFromClass(DBConnection.class));
            } catch (IOException e1) {
                // TODO Auto-generated catch block
                e1.printStackTrace();
            }
            return null;
        }
        return con;
    }

    public synchronized void freeConnection(Connection con) {
        System.out.println("freeConnections.size()==========================" + freeConnections.size());
        if (freeConnections.size() < initConns) {
            if (-1 == freeConnections.indexOf(con))
                freeConnections.add(con);
        } else {
            try {
                if (con != null)
                    con.close();
            } catch (SQLException e) {
                // LogWriter.write("无法关闭连接池" + name + "中的连接:", 111);
            }
        }
        checkedOut--;
        notifyAll();
    }

    /**
     * 关闭所有连接
     */
    public synchronized void release() {
        Iterator iter = freeConnections.iterator();
        while (iter.hasNext()) {
            Connection con = (Connection) iter.next();
            try {
                con.close();
                // LogWriter.write("关闭连接池" + name + "中的一个连接:", 110);
            } catch (SQLException e) {
                // LogWriter.write("无法关闭连接池" + name + "中的连接:", 111);
            }
        }
        freeConnections.clear();
        System.err.println("所有的数据库连接全部已经关闭!");
    }

}
