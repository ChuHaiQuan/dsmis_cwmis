package com.poweronce.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class CTime {
    /**
     * 模板定义如下： y 年号，如 1996 M 月份，如 July 或者 07 d 月中第几天，如 12 H 小时(24制)，如 0、17 m
     * 分钟,如 32 s 钞钟，如55 S 微钞，如978 E 星期几，如 Tuesday D 一年中的第几天，如 189 w week in year
     * (Number) 27 W week in month (Number) 2 a am/pm marker (Text) PM k hour in
     * day (1~24) (Number) 24 K hour in am/pm (0~11) (Number) 0 z time zone
     * (Text) Pacific Standard Time ' escape for text (Delimiter) '' single
     * quote (Literal) '
     */
    public synchronized static String getTime(String format) {
        Date time = new Date();
        SimpleDateFormat dateformatter = new SimpleDateFormat(format);
        String dateString = dateformatter.format(time);

        return dateString;
    }

    /*
     * field
     */
    public synchronized static String getTimeAdd(String format, int field, int add_days) {
        Calendar time = Calendar.getInstance();
        time.add(field, add_days);
        SimpleDateFormat dateformatter = new SimpleDateFormat(format);
        String dateString = dateformatter.format(time.getTime());
        return dateString;
    }

    public synchronized static String getTime(Date date, String format) {
        SimpleDateFormat dateformatter = new SimpleDateFormat(format);
        String dateString = dateformatter.format(date);
        return dateString;
    }

    public synchronized static Date getTime(String date, String format) throws ParseException {
        SimpleDateFormat dateformatter = new SimpleDateFormat(format);
        Date dateString = dateformatter.parse(date);
        return dateString;
    }
}
