/**
 *
 */
package com.poweronce.util;

import java.text.NumberFormat;

/**
 * util类，主要用来为action，jsp提供支持
 *
 * @author liming
 */
public final class ProductUtil {

    /**
     * *
     * 把string数据解析成long类型，如果出错，返回defaultValue
     *
     * @param longStr
     * @param defaultValue
     * @return
     */
    public static final Long parseValue(Object longStr, long defaultValue) {
        if (longStr == null)
            return defaultValue;
        try {
            return Long.parseLong(String.valueOf(longStr));
        } catch (Exception ex) {
            return defaultValue;
        }
    }

    /**
     * *
     * format double data
     *
     * @param data
     * @param fractionCount
     * @return
     */
    public static final String formatNumber(double data, int fractionCount) {
        NumberFormat nf = NumberFormat.getInstance();
        nf.setMinimumFractionDigits(fractionCount);
        nf.setMaximumFractionDigits(fractionCount);
        return nf.format(data);
    }

    public static void main(String args[]) {
        System.out.println(formatNumber(2.33333, 2));
    }
}
