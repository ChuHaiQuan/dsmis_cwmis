/**
 *
 */
package com.poweronce.util;

import java.text.SimpleDateFormat;
import java.util.Date;

import javax.servlet.http.HttpServletRequest;

/**
 * @author Administrator
 */
public final class StrutsUtil {

    /**
     * *
     * error message
     */
    public static final String getMessage(HttpServletRequest request) {
        if (request == null) {
            return "";
        }
        Object msg = request.getAttribute("_error");
        if (msg == null) {
            return "";
        }
        return String.valueOf(msg);
    }

    public static final void setMessage(HttpServletRequest request, String msg) {
        if (msg != null) {
            request.setAttribute("_error", msg);
        }
    }

    /**
     * *
     * format or parse the passed date
     */
    public static final String formatDate(Date date, String format) {
        if (date == null) {
            return "";
        }
        if (format == null || format.length() < 1) {
            format = "yyyy-MM-dd";
        }
        try {
            SimpleDateFormat dateformat = new SimpleDateFormat(format);
            return dateformat.format(date);
        } catch (Exception ex) {
            return "";
        }
    }

    public static final Date parseDate(String dateStr, String format) {
        if (dateStr == null) {
            return null;
        }
        if (format == null || format.length() < 1) {
            format = "yyyy-MM-dd";
        }
        try {
            SimpleDateFormat dateformat = new SimpleDateFormat(format);
            return dateformat.parse(dateStr);
        } catch (Exception ex) {
            return null;
        }
    }

    /**
     * get parameter
     */
    public static final String getParamValue(HttpServletRequest request, String param) {
        Object obj = request.getParameter(param);
        if (obj == null) {
            return "";
        }
        return String.valueOf(obj);
    }
}
