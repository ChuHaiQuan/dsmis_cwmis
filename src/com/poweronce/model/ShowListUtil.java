package com.poweronce.model;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;

import com.poweronce.util.Constants;
import com.poweronce.util.Invoke;

public class ShowListUtil {
    public static int SHOW_PAGE_NONE = 1; // 不显示分页
    public static int SHOW_PAGE_DOWN = 2; // 在底下显示分页
    public static int SHOW_PAGE_UP = 3; // 在头部显示分页
    public static int SHOW_PAGE_UPDOWN = 4; // 在底下和头部都显示分页

    // 橱窗展示方式显示
    public static String getShowWindowList(HttpServletRequest request, String propertys, // 取表体数据的方法,展现形式如：<table><tr><td>##</td><td>##</td></tr></table>
                                           String propertys_para[], // 表体数据参数,如:new
                                           // String[]{"getId","getName"},上面的##将会用getId(),getName()代替。
                                           String current,// request取的当前页的属性
                                           String pagesize, // request取的页大小的属性
                                           String totalcount, // request取的总数的属性
                                           String list,// request取的记录集的属性
                                           String qryStr,// 上一页，下一页链接地址
                                           String page_util_opara,// 分页链接的其它参数
                                           int cols_per_row, // 每行显示多少列
                                           int page_mode,// 显示分页模式
                                           boolean if_use_cell_line// 是否表格线分隔行列
    ) throws Exception {
        String str = "";
        String currPage = (String) request.getAttribute(current);
        int iCurrPage = 1;
        if (currPage != null)
            iCurrPage = Integer.parseInt(currPage);
        int iTotalSize = 0;
        String totalCount = (String) request.getAttribute(totalcount);
        if (totalCount != null)
            iTotalSize = Integer.parseInt(totalCount);
        int iPageSize = Constants.PAGE_SIZE_DEFALUT;
        String pageSize = (String) request.getAttribute(pagesize);
        if (pageSize != null)
            iPageSize = Integer.parseInt(pageSize);
        else {
            if (!StringUtils.isEmpty(pagesize) && StringUtils.isNumeric(pagesize))
                iPageSize = Integer.parseInt(pagesize);
        }

        List objlist = null;
        if (list.length() > 7 && list.substring(0, 7).equals("session"))
            objlist = (List) request.getSession(false).getAttribute(list);
        else
            objlist = (List) request.getAttribute(list);
        if (objlist == null)
            objlist = new ArrayList();
        if (objlist == null || objlist.size() == 0)
            return "";

        str += "<table width=100% border=0 cellpadding=0 cellspacing=0" + (if_use_cell_line ? " bgcolor=00678A" : "") + ">";
        // 上分页
        if (page_mode == SHOW_PAGE_UP || page_mode == SHOW_PAGE_UPDOWN) {
            str += "<tr " + (if_use_cell_line ? " bgcolor=C0CEE9" : "") + ">";
            str += "<td colspan=10>";
            str += "<table width=100% border=0 cellspacing=0 cellpadding=5>";
            str += "<tr>";
            str += "<td>";
            str += "<span>" + PageUtil.printCurrPage(qryStr, page_util_opara, iCurrPage, iTotalSize, iPageSize, PageUtil.STYLE_THREE);
            str += "</span>";
            str += "</td>";
            str += "</tr>";
            str += "</table>";
            str += "</td>";
            str += "</tr>";
        }
        // 表体
        Iterator itr = objlist.iterator();
        int cols = 0, // 第几条记录
                col_the_row = 0, // 当前行第几列
                rows = 0;// 已有多少行
        while (itr.hasNext()) {
            // 满要求的每行显示的列数开始换行显示
            if ((col_the_row) % cols_per_row == 0) {
                rows++;
                col_the_row = 0;
                str += "<tr>";
            }
            // 取当前的数据
            Object obj = itr.next();
            Class clazz = obj.getClass();
            str += "<TD>";
            String proper = new String(propertys);
            int pos$$ = proper.indexOf("##");
            int k = 0;
            // 特殊表体，不仅仅只显示字段内容
            if (pos$$ >= 0) {
                while (pos$$ >= 0) {
                    Method method = clazz.getDeclaredMethod(propertys_para[k], null);
                    Object retObj = method.invoke(obj, null);
                    proper = proper.replaceFirst("##", (retObj == null ? "" : retObj.toString()));
                    pos$$ = proper.indexOf("##");
                    k++;
                }
            }
            int pos2 = proper.indexOf("{{");
            if (pos2 > 0) {
                while (pos2 > 0) {
                    int pos3 = proper.indexOf("}}");
                    String inFunRet = proper.substring(pos2 + 2, pos3);
                    String reFun = Invoke.InvokeString(inFunRet).toString();
                    proper = proper.substring(0, pos2) + reFun + proper.substring(pos3 + 2, proper.length());
                    pos2 = proper.indexOf("{{");
                }
            }
            str += proper;
            str += "</TD>";

            if ((col_the_row + 1) % cols_per_row == 0) {
                str += "</tr>";
            }
            cols++;
            col_the_row++;
        }
        // 补剩余的<td></td> </tr>
        int lea_col = cols_per_row - col_the_row;
        if (lea_col > 0) {
            for (int lea = 0; lea < lea_col; lea++) {
                str += "<TD></TD>";
            }
            str += "</TR>";
        }

        // 下分页
        if (page_mode == SHOW_PAGE_DOWN || page_mode == SHOW_PAGE_UPDOWN) {
            str += "<tr " + (if_use_cell_line ? " bgcolor=C0CEE9" : "") + ">";
            str += "<td colspan=10>";
            str += "<table width=100% border=0 cellspacing=0 cellpadding=5>";
            str += "<tr>";
            str += "<td>";
            str += "<span>" + PageUtil.printCurrPage(qryStr, page_util_opara, iCurrPage, iTotalSize, iPageSize, PageUtil.STYLE_THREE);
            str += "</span>";
            str += "</td>";
            str += "</tr>";
            str += "</table>";
            str += "</td>";
            str += "</tr>";
        }
        str += "</table>";
        return str;
    }

    // 一行或一列显示
    public static String getShowListNoPage(HttpServletRequest request, String propertys, // 取表体数据的方法,展现形式如：<table><tr><td>##</td><td>##</td></tr></table>
                                           String propertys_para[], // 表体数据参数,如:new
                                           // String[]{"getId","getName"},上面的##将会用getId(),getName()代替。
                                           int para_len[], // 限制字数长度
                                           String list// request取的记录集的属性
    ) throws Exception {
        String str = "";

        List objlist = null;
        if (list.length() > 7 && list.substring(0, 7).equals("session"))
            objlist = (List) request.getSession(false).getAttribute(list);
        else
            objlist = (List) request.getAttribute(list);
        if (objlist == null)
            objlist = new ArrayList();
        if (objlist == null || objlist.size() == 0)
            return "";
        // 表体
        Iterator itr = objlist.iterator();
        while (itr.hasNext()) {
            // 取当前的数据
            Object obj = itr.next();
            Class clazz = obj.getClass();
            String proper = new String(propertys);
            int pos$$ = proper.indexOf("##");
            int k = 0;
            // 特殊表体，不仅仅只显示字段内容
            if (pos$$ >= 0) {
                while (pos$$ >= 0) {
                    Method method = clazz.getDeclaredMethod(propertys_para[k], null);
                    Object retObj = method.invoke(obj, null);
                    String retStr = (retObj == null ? "" : retObj.toString());
                    if ((para_len[k] != -1) && (retStr.length() > para_len[k])) {
                        retObj = retStr.substring(0, para_len[k]);
                    }
                    proper = proper.replaceFirst("##", retStr);
                    pos$$ = proper.indexOf("##");
                    k++;
                }
            }
            int pos2 = proper.indexOf("{{");
            if (pos2 > 0) {
                while (pos2 > 0) {
                    int pos3 = proper.indexOf("}}");
                    String inFunRet = proper.substring(pos2 + 2, pos3);
                    String reFun = Invoke.InvokeString(inFunRet).toString();
                    proper = proper.substring(0, pos2) + reFun + proper.substring(pos3 + 2, proper.length());
                    pos2 = proper.indexOf("{{");
                }
            }
            str += proper;
        }
        return str;
    }

    // 平板展示方式显示
    public static String getShowList(HttpServletRequest request, String tablehead, // 表头字段
                                     String propertys, // 取表体数据的方法
                                     String propertys_para[], // 表体数据参数
                                     String current,// request取的当前页的属性
                                     String pagesize, // request取的页大小的属性
                                     String totalcount, // request取的总数的属性
                                     String list,// request取的记录集的属性
                                     String qryStr,// 上一页，下一页链接地址
                                     String page_util_opara,// 分页链接的其它参数
                                     int page_mode,// 显示分页模式
                                     boolean if_use_cell_line// 是否表格线分隔行列
    ) throws Exception {
        String str = "";
        String currPage = (String) request.getAttribute(current);
        int iCurrPage = 1;
        if (currPage != null)
            iCurrPage = Integer.parseInt(currPage);
        int iTotalSize = 0;
        String totalCount = (String) request.getAttribute(totalcount);
        if (totalCount != null)
            iTotalSize = Integer.parseInt(totalCount);
        int iPageSize = Constants.PAGE_SIZE_DEFALUT;
        String pageSize = (String) request.getAttribute(pagesize);
        if (pageSize != null)
            iPageSize = Integer.parseInt(pageSize);
        else {
            if (!StringUtils.isEmpty(pagesize) && StringUtils.isNumeric(pagesize))
                iPageSize = Integer.parseInt(pagesize);
        }
        List objlist = null;
        if (list.length() > 7 && list.substring(0, 7).equals("session"))
            objlist = (List) request.getSession(false).getAttribute(list);
        else
            objlist = (List) request.getAttribute(list);
        if (objlist == null)
            objlist = new ArrayList();
        if (objlist == null || objlist.size() == 0)
            return "";
        // 表头
        // str +=
        // "<table width=\"100%\" border=\"0\" cellpadding=\"2\" cellspacing=\"1\""+(if_use_cell_line?" bgcolor=\"00678A\"":"")+">";
        // 上分页
        if (page_mode == SHOW_PAGE_UP || page_mode == SHOW_PAGE_UPDOWN) {
            str += "<tr " + (if_use_cell_line ? " bgcolor=C0CEE9" : "") + ">";
            str += "<td colspan=10>";
            str += "<table width=100% border=0 cellspacing=0 cellpadding=5>";
            str += "<tr>";
            str += "<td>";
            str += "<span>" + PageUtil.printCurrPage(qryStr, page_util_opara, iCurrPage, iTotalSize, iPageSize, PageUtil.STYLE_THREE);
            str += "</span>";
            str += "</td>";
            str += "</tr>";
            str += "</table>";
            str += "</td>";
            str += "</tr>";
        }
        if (tablehead.length() > 0) {
            str += tablehead;
        }
        // 表体
        Iterator itr = objlist.iterator();
        while (itr.hasNext()) {
            Object obj = itr.next();
            Class clazz = obj.getClass();
            String proper = new String(propertys);
            int pos$$ = proper.indexOf("##");
            int k = 0;
            // 特殊表体，不仅仅只显示字段内容
            if (pos$$ >= 0) {
                while (pos$$ >= 0) {
                    Method method = clazz.getDeclaredMethod(propertys_para[k], null);
                    Object retObj = method.invoke(obj, null);
                    proper = proper.replaceFirst("##", (retObj == null ? "" : retObj.toString()));
                    pos$$ = proper.indexOf("##");
                    k++;
                }
            }

            int pos2 = proper.indexOf("{{");
            if (pos2 > 0) {
                while (pos2 > 0) {
                    int pos3 = proper.indexOf("}}");
                    String inFunRet = proper.substring(pos2 + 2, pos3);
                    String reFun = Invoke.InvokeString(inFunRet).toString();
                    proper = proper.substring(0, pos2) + reFun + proper.substring(pos3 + 2, proper.length());
                    pos2 = proper.indexOf("{{");
                }
            }
            str += proper;
        }

        // 下分页
        if (page_mode == SHOW_PAGE_DOWN || page_mode == SHOW_PAGE_UPDOWN) {
            str += "<tr " + (if_use_cell_line ? " bgcolor=C0CEE9" : "") + ">";
            str += "<td colspan=100>";
            str += "<table border=0 cellspacing=0 cellpadding=5>";
            str += "<tr>";
            str += "<td>";
            str += "<span>" + PageUtil.printCurrPage(qryStr, page_util_opara, iCurrPage, iTotalSize, iPageSize, PageUtil.STYLE_THREE);
            str += "</span>";
            str += "</td>";
            str += "</tr>";
            str += "</table>";
            str += "</td>";
            str += "</tr>";
        }
        // str += "</table>";
        return str;
    }

}
