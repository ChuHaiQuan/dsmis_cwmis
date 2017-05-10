package com.poweronce.model;

public class CompareUtil {

    // 0 大类小类的树型列表 1 大类小类的文本列表 2 只有大类文本
    public static String getHtmlFormatString(String curr, String para, String htmlFormat, String htmlFormat2) throws Exception {
        if (curr == null || para == null)
            return "";
        if (curr.equals(para)) {
            return htmlFormat;
        }
        return htmlFormat2;

    }
}
