package com.poweronce.model;

/**
 * <p>Title: </p>
 * <p>Description: </p>
 * <p>Copyright: Copyright (c) 2004</p>
 * <p>Company: </p>
 * @author not attributable
 * @version 1.0
 */

import javax.servlet.ServletRequest;

public class PageUtil {
    public static int TOP_BAR = 1; // 顶部分页导航条标志
    public static int BOTTOM_BAR = 2; // 底部分页导航条标志
    public static int STYLE_ONE = 1; // 打印形式1
    public static int STYLE_TWO = 2; // 打印形式2
    public static int STYLE_THREE = 3; // 打印形式3
    public static int STYLE_FOUR = 4; // 打印形式4
    public static int STYLE_FIVE = 5; // 打印形式5
    public static int STYLE_SIX = 6; // 打印形式6

    /**
     * @param url          String 转向地址
     * @param qryStr       String 附加参数
     * @param currpagePage int 当前请求页号
     * @param totalNum     int 总记录条数
     * @param pagesize     int 每页的记录条数
     * @param pos          int 分页导航条位置
     * @param style        int 分页导航条打印形式
     * @return String 返回分页导航条字符串
     */
    public static String printCurrPage(String url, String qryStr, int currpagePage, int totalNum, int pagesize, int pos, int style) {
        String tmpStr = "";
        String otherParam = (qryStr.length() > 0) ? ("&" + qryStr) : "";
        int currPage = (totalNum == 0) ? 1 : currpagePage; // 当前页号
        int totalPage = getPageCount(totalNum, pagesize); // 总页数

        if (style == STYLE_ONE) {
            String sJumpStr = "";
            String currpageName = "currpage_top";
            if (pos == BOTTOM_BAR)
                currpageName = "currpage_bottom";
            sJumpStr = "goto<input name=\"" + currpageName + "\" type=\"text\" size=4 value=\"" + currPage
                    + "\"><input type=image src=\"/pic/go_a.gif\" onclick=\"return checkPageNo(this.form," + pos + ",this.form." + currpageName + ")\" >";
            tmpStr = "pagesize:" + pagesize + "pages:" + totalPage + "" + " <font color='red'>" + currPage + "</font>/" + totalPage + "page "
                    + getUpDownString(url, otherParam, currPage, pagesize, totalPage) + sJumpStr;
        } else if (style == STYLE_TWO) {
            int width = 12;
            tmpStr += "pagesize:" + pagesize + "pages:" + totalPage + " ";
            if (currPage > 1) {
                tmpStr += "<a href='" + url + "?currpage=" + String.valueOf(currPage - 1) + otherParam + "'>[pre]</a>";
            }
            tmpStr += getNumNavigation(url, otherParam, totalPage, width, currPage);
            if (currPage < totalPage) {
                tmpStr += " <a href='" + url + "?currpage=" + String.valueOf(currPage + 1) + otherParam + "'>[next]</a>";
            }
        } else if (style == STYLE_THREE) {
            String sJumpStr = new String("");
            sJumpStr = "pagesize:<input name=\"pagesize\" type=\"text\" size=2 value=\""
                    + pagesize
                    + "\" onkeydown=\"javascript:if(event.keyCode==13){if(isNaN(this.value)){alert('not numberic！'); this.value='';}else document.location.href='"
                    + url + "?pagesize='+this.value+'" + otherParam + "'}\">  ";
            tmpStr += "<td align='left'>rows:" + totalNum + " " + sJumpStr + " <font color='red'>" + currPage + "</font>/" + totalPage + "page  </td>";
            tmpStr += "<td>";
            tmpStr += getUpDownString2(url, otherParam, currPage, pagesize, totalPage);
            tmpStr += getSelectString(url, otherParam, currPage, pagesize, totalPage);
            tmpStr += "</td>";
        } else if (style == STYLE_FOUR) {
            String sJumpStr = new String("");
            sJumpStr = "pagesize:<input name=\"pagesize\" type=\"text\" size=2 value=\""
                    + pagesize
                    + "\" onkeydown=\"javascript:if(event.keyCode==13){if(isNaN(this.value)){alert('not numberic！'); this.value='';}else document.location.href='"
                    + url + "?pagesize='+this.value+'" + otherParam + "'}\">  ";
            tmpStr += "<td align='left'>rows:" + totalNum + " " + sJumpStr + " <font color='red'>" + currPage + "</font>/" + totalPage + "page  </td>";
        } else if (style == STYLE_FIVE) {
            tmpStr += "<td>";
            tmpStr += getUpDownString2(url, otherParam, currPage, pagesize, totalPage);
            tmpStr += getSelectString(url, otherParam, currPage, pagesize, totalPage);
            tmpStr += "</td>";
        } else if (style == STYLE_SIX) {
            String sJumpStr = "goto<input name='currpage' id='top_input' "
                    + " type=\"text\" size=4 value=\""
                    + currPage
                    + "\"><input type=image src=\"/pic/go_a.gif\" onclick=\"javascript:if(isNaN(this.value)){alert('not numberic！'); this.value='';}else document.location.href='"
                    + url + "?pagesize=" + pagesize + "&currpage='+document.all['top_input'].value+'&" + otherParam + "'\">";
            tmpStr = getUpDownString2(url, otherParam, currPage, pagesize, totalPage) + sJumpStr;
        } else {
            tmpStr = "not support style value";
        }

        return tmpStr;
    }

    /**
     * @param url          String 转向地址
     * @param qryStr       String 附加参数
     * @param currpagePage int 当前请求页号
     * @param totalNum     int 总记录条数
     * @param pagesize     int 每页的记录条数
     * @param style        int 分页导航条打印形式
     * @return String 返回分页导航条字符串
     */
    public static String printCurrPage(String url, String qryStr, int currpagePage, int totalNum, int pagesize, int style) {
        String tmpStr = "";
        String otherParam = (qryStr.length() > 0) ? ("&" + qryStr) : "";
        int currPage = (totalNum == 0) ? 1 : currpagePage; // 当前页号
        int totalPage = getPageCount(totalNum, pagesize); // 总页数

        if (style == STYLE_ONE) {
            String sJumpStr = "goto<input name='currpage' id='top_input' "
                    + " type=\"text\" size=4 value=\""
                    + currPage
                    + "\"><input type=image src=\"/pic/go_a.gif\" onclick=\"javascript:if(isNaN(this.value)){alert('not numberic！'); this.value='';}else document.location.href='"
                    + url + "?pagesize=" + pagesize + "&currpage='+document.all['top_input'].value+'&" + otherParam + "'\">";

            tmpStr = "pagesize:" + pagesize + "pages:" + totalPage + "" + " <font color='red'>" + currPage + "</font>/" + totalPage + "page"
                    + getUpDownString2(url, otherParam, currPage, pagesize, totalPage) + sJumpStr;
        } else if (style == STYLE_TWO) {
            int width = 12;
            tmpStr += "pagesize:" + pagesize + "pages:" + totalPage + "";
            if (currPage > 1) {
                tmpStr += "<a href='" + url + "?currpage=" + String.valueOf(currPage - 1) + otherParam + "'>[pre]</a>";
            }
            tmpStr += getNumNavigation(url, otherParam, totalPage, width, currPage);
            if (currPage < totalPage) {
                tmpStr += " <a href='" + url + "?currpage=" + String.valueOf(currPage + 1) + otherParam + "'>[next]</a>";
            }
        } else if (style == STYLE_THREE) {
            String sJumpStr = new String("");
            sJumpStr = "pagesize:<input name=\"pagesize\" type=\"text\" size=2 value=\"" + pagesize
                    + "\" onkeydown=\"javascript:if(event.keyCode==13){if(isNaN(this.value)){alert('not numberic！'); this.value='';}else {"
                    + "document.forms('page_form').currpage.value='" + currPage + "';document.forms('page_form').action='" + url + "';submit();}}\">  ";
            tmpStr += "<form name='page_form' method='post'>";
            tmpStr += "<td align='left'>rows:" + totalNum + " " + sJumpStr + " <font color='red'>" + currPage + "</font>/" + totalPage + "page  </td>";
            tmpStr += "<td>";
            tmpStr += getUpDownString3(url, currPage, pagesize, totalPage);
            tmpStr += getSelectString2(url, otherParam, currPage, pagesize, totalPage);
            tmpStr += "</td>";
            tmpStr += "</form>";
        } else if (style == STYLE_FOUR) {
            String sJumpStr = new String("");
            sJumpStr = "pagesize:<input name=\"pagesize\" type=\"text\" size=2 value=\""
                    + pagesize
                    + "\" onkeydown=\"javascript:if(event.keyCode==13){if(isNaN(this.value)){alert('not numberic！'); this.value='';}else document.location.href='"
                    + url + "?pagesize='+this.value+'" + otherParam + "'}\">  ";
            tmpStr += "<td align='left'>rows:" + totalNum + " " + sJumpStr + " <font color='red'>" + currPage + "</font>/" + totalPage + "page  </td>";
        } else if (style == STYLE_FIVE) {
            tmpStr += "<td>";
            tmpStr += getUpDownString2(url, otherParam, currPage, pagesize, totalPage);
            tmpStr += getSelectString(url, otherParam, currPage, pagesize, totalPage);
            tmpStr += "</td>";
        } else if (style == STYLE_SIX) {
            String sJumpStr = "goto<input name='currpage' id='top_input' "
                    + " type=\"text\" size=4 value=\""
                    + currPage
                    + "\"><input type=image src=\"/pic/go_a.gif\" onclick=\"javascript:if(isNaN(this.value)){alert('not numberic！'); this.value='';}else document.location.href='"
                    + url + "?pagesize=" + pagesize + "&currpage='+document.all['top_input'].value+'&" + otherParam + "'\">";
            tmpStr = getUpDownString2(url, otherParam, currPage, pagesize, totalPage) + sJumpStr;
        } else {
            tmpStr = "not support style value";
        }

        return tmpStr;
    }

    /**
     * @param url        String 转向地址
     * @param otherParam String 附加参数
     * @param currPage   int 当前请求页号
     * @param pagesize   int 每页的记录条数
     * @param totalPage  int 总分页数
     * @return String 打印出 ：[首页] [上页][下页] [尾页]
     */
    private static String getUpDownString(String url, String otherParam, int currPage, int pagesize, int totalPage) {
        String firstPage, lastPage, s;
        if (currPage == 1 || currPage == 0)
            firstPage = "[first] [pre]";
        else
            firstPage = "<a href='" + url + "?currpage=1" + otherParam + "'>[first]</a> " + "<a href='" + url + "?currpage=" + String.valueOf(currPage - 1)
                    + otherParam + "'>[pre]</a>";
        if (currPage == totalPage)
            lastPage = " [next] [last]";
        else
            lastPage = " <a href='" + url + "?currpage=" + String.valueOf(currPage + 1) + otherParam + "'>[next]</a> " + " <a href='" + url + "?currpage="
                    + String.valueOf(totalPage) + otherParam + "'>[last]</a>";
        s = "" + firstPage + lastPage;
        return s;

    }

    /**
     * @param url        String 转向地址
     * @param otherParam String 附加参数
     * @param currPage   int 当前请求页号
     * @param pagesize   int 每页的记录条数
     * @param totalPage  int 总分页数
     * @return String 打印出 ：[首页] [上页][下页]
     *         [尾页]（与getUpDownString（）不同的是它的连接地址有pagesize参数
     */
    private static String getUpDownString2(String url, String otherParam, int currPage, int pagesize, int totalPage) {
        String firstPage, lastPage, s;
        if (currPage == 1 || currPage == 0)
            firstPage = "[first] [pre]";
        else
            firstPage = "<a href='" + url + "?currpage=1" + otherParam + "&pagesize=" + pagesize + "'>[first]</a> " + "<a href='" + url + "?currpage="
                    + String.valueOf(currPage - 1) + otherParam + "&pagesize=" + pagesize + "'>[pre]</a>";
        if (currPage == totalPage)
            lastPage = " [next] [last]";
        else
            lastPage = " <a href='" + url + "?currpage=" + String.valueOf(currPage + 1) + otherParam + "&pagesize=" + pagesize + "'>[next]</a> " + " <a href='"
                    + url + "?currpage=" + String.valueOf(totalPage) + otherParam + "&pagesize=" + pagesize + "'>[last]</a>";
        s = "" + firstPage + lastPage;
        s += "<input type='hidden' name='currpage' value='" + currPage + "'>";
        return s;

    }

    /**
     * @param url        String 转向地址
     * @param otherParam String 附加参数
     * @param currPage   int 当前请求页号
     * @param pagesize   int 每页的记录条数
     * @param totalPage  int 总分页数
     * @return String 打印出 ：[首页] [上页][下页]
     *         [尾页]（与getUpDownString（）不同的是它的连接地址有pagesize参数
     */
    private static String getUpDownString3(String url, int currPage, int pagesize, int totalPage) {
        String firstPage, lastPage, s;
        if (currPage == 1 || currPage == 0)
            firstPage = "[first] [pre]";
        else
            firstPage = "<a href='#' onclick=\"document.forms('page_form').currpage.value=1;document.forms('page_form').action='" + url
                    + "';submit();\">[first]</a> " + "<a href='#' onclick=\"document.forms('page_form').currpage.value=" + String.valueOf(currPage - 1)
                    + ";document.forms('page_form').action='" + url + "';submit();\">[pre]</a>";
        if (currPage == totalPage)
            lastPage = " [next] [last]";
        else
            lastPage = " <a href='#' onclick=\"document.forms('page_form').currpage.value=" + String.valueOf(currPage + 1)
                    + ";document.forms('page_form').action='" + url + "';submit();\">[next]</a> "
                    + " <a href='#' onclick=\"document.forms('page_form').currpage.value=" + String.valueOf(totalPage)
                    + ";document.forms('page_form').action='" + url + "';submit();\">[last]</a>";
        s = "" + firstPage + lastPage;
        s += "<input type='hidden' name='currpage' value='" + currPage + "'>";
        return s;

    }

    /**
     * @param url       String 转向地址
     * @param currPage  int 前请求页号
     * @param pagesize  int 每页的记录条数
     * @param totalPage int 总分页数
     * @return String
     */
    private static String getSelectString(String url, String otherParam, int currPage, int pagesize, int totalPage) {
        String s = "";
        s += "   goto <select name=\"select\" class=\"button\" onchange=\"javascript:document.location.href='" + url + "?currpage='+ this.value +'&pagesize="
                + pagesize + "&" + otherParam + "'\" >";

        for (int i = 1; i <= totalPage; i++) {
            if (i == currPage) {
                s += "<option value='" + i + "' selected>" + i + "</option>";
            } else {
                s += "<option value='" + i + "'>" + i + "</option>";
            }
        }
        s += "</select>";
        return s;
    }

    /**
     * submit模式
     *
     * @param url       String 转向地址
     * @param currPage  int 前请求页号
     * @param pagesize  int 每页的记录条数
     * @param totalPage int 总分页数
     * @return String
     */
    private static String getSelectString2(String url, String otherParam, int currPage, int pagesize, int totalPage) {
        String s = "";
        s += "   goto <select name=\"select\" class=\"button\" "
                + "onchange=\"javascript:document.forms('page_form').currpage.value=this.value;document.forms('page_form').action='" + url + "';submit();\" >";

        for (int i = 1; i <= totalPage; i++) {
            if (i == currPage) {
                s += "<option value='" + i + "' selected>" + i + "</option>";
            } else {
                s += "<option value='" + i + "'>" + i + "</option>";
            }
        }
        s += "</select>";
        return s;
    }

    /**
     * @param countAll int 总记录条数
     * @param pagesize int 每页的记录条数
     * @return int 返回分页总数
     */
    public static int getPageCount(int countAll, int pagesize) {
        int iPageSize = pagesize;
        if (iPageSize < 1)
            iPageSize = 1;
        int totalPage = (countAll % iPageSize) > 0 ? 1 : 0;
        totalPage = totalPage + (countAll / iPageSize);
        if (totalPage == 0)
            totalPage = 1;
        return totalPage;
    }

    //

    /**
     * @param request      ServletRequest
     * @param default_size int 默认的每页的记录条数
     * @return int 返回每页的记录条数
     */
    public static int getPageSize(ServletRequest request, int default_size) {
        String sPageSize = request.getParameter("pagesize");
        int DEFAULT_PAGESIZE = default_size;
        int pagesize = DEFAULT_PAGESIZE;
        try {
            pagesize = (sPageSize == null) ? DEFAULT_PAGESIZE : Integer.parseInt(sPageSize);
        } catch (Exception e) {
            pagesize = DEFAULT_PAGESIZE;
        }
        if (pagesize < 1)
            pagesize = DEFAULT_PAGESIZE;
        return pagesize;
    }

    /**
     * @param url        String 转向地址
     * @param otherParam String 附加参数
     * @param totalPage  int 分页总数
     * @param width      int 分页导航条宽度，即一个分页导航条可以显示几个数字
     * @param currPage   int 当前请求页号
     * @return String 返回数字分页导航条
     */
    private static String getNumNavigation(String url, String otherParam, int totalPage, int width, int currPage) {
        int k = width / 2;
        int start = currPage - k;
        int end = currPage + k;
        String s = "";

        if (currPage <= k)
            start = 1;
        if (end > totalPage)
            end = totalPage;

        for (int i = start; i <= end; i++) {
            if (i == currPage)
                s += " <a href='" + url + "?currpage=" + String.valueOf(i) + otherParam + "'><font color='red'>" + i + "</font></a> ";
            else
                s += " <a href='" + url + "?currpage=" + String.valueOf(i) + otherParam + "'>" + i + "</a> ";
        }

        return s;
    }

    /**
     * @param request      ServletRequest
     * @param curParamName String 页号在请求参数中名称
     * @return int 返回当前页号
     */
    public static int getCurPage(ServletRequest request, String curParamName) {
        int curPage = 1;
        String curPageParaName = request.getParameter(curParamName);
        if (curPageParaName == null) {
            curPage = 1;
        } else {
            try {
                curPage = new Integer(curPageParaName).intValue();
                if (curPage < 1)
                    curPage = 1;
            } catch (Exception e) {
                curPage = 1;
            }
        }
        return curPage;
    }
}
