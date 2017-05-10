package com.poweronce.util;

import java.io.UnsupportedEncodingException;

import org.apache.commons.lang.StringUtils;

public class ChineseUrl {

    public static String encode(String s, String characterEncoding) throws UnsupportedEncodingException {
        if (StringUtils.isEmpty(s))
            return "";
        // 先转成相应编码后再进行URL编码
        s = new String(s.getBytes("iso8859-1"), characterEncoding);
        return java.net.URLEncoder.encode(s, characterEncoding);
    }

    public static String decode(String s, String characterEncoding) throws UnsupportedEncodingException {
        if (StringUtils.isEmpty(s))
            return "";
        return new String(s.getBytes("iso8859-1"), characterEncoding);
    }

}
