package com.poweronce.model;

public class OutlookBar {

    public static String addBar(String bar_background_image, String bar_onclick_fun, String bar_href, String bar_parentMenu, String bar_title) {
	return "<table width=\"134\" height=\"21\"  border=\"0\" cellpadding=\"0\" cellspacing=\"0\" background=\"" + bar_background_image + "\">" + "<tr>"
		+ "<td onclick=\"" + bar_onclick_fun + "\" align='center'><a href=\"" + bar_href + "\" parentMenu=\"" + bar_parentMenu + "\">" + bar_title
		+ "</a></td>" + "</tr>" + "</table>";
    }

    public static String addBarItem(String item_image, String item_link, String item_targer, String item_onclick_fun, String item_parentMenu, String item_title) {
	return "<table  border=\"0\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\">" + "<tr>" + "<td><div align=\"center\"><a href=\"" + item_link
		+ "\" target=\"" + item_targer + "\"><img src=\"" + item_image + "\" onclick=\"" + item_onclick_fun + ";\" parentMenu=\"" + item_parentMenu
		+ "\" border=\"0\"></a></div></td>" + "</tr>" + "<tr>" + "<td nowrap><div align=\"center\"><a href=\"" + item_link + "\" target=\""
		+ item_targer + "\" id=menu onclick=\"" + item_onclick_fun + ";\" parentMenu=\"" + item_parentMenu + "\">" + item_title + "</a></div></td>"
		+ "</tr>" + "</table>";
    }

    public static String addItem(String item_image, String item_link, String item_title, String id) {
	return "<table  border=\"0\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\">" + "<tr>" + "<td align=center><a href=\"" + item_link + "\" id="
		+ id + "><img src=\"" + item_image + "\" border=\"0\"><br/>" + item_title + "</a></td>" + "</tr>" + "</table>";
    }
}
