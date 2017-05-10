package com.poweronce.model;

import java.util.HashMap;
import java.util.Iterator;

public class ComboList {

    public static ComboList instance = null;

    public static ComboList getInstance() {
        if (instance == null) {
            instance = new ComboList();
        }
        return instance;
    }

    // 获得下拉列表
    public static String getComboBox(String property, String other, String selectKey, HashMap hash) throws Exception {
        if (hash == null)
            return "";
        String privStr = "<select id='" + property + "' name='" + property + "' " + other + ">";

        Iterator iter = hash.keySet().iterator();
        while (iter.hasNext()) {
            Object obj = iter.next();
            String key = obj.toString();
            String value = hash.get(obj).toString();
            if (key.equalsIgnoreCase(selectKey))
                privStr += "<option value='" + key + "' selected>" + value + "</option>";
            else
                privStr += "<option value='" + key + "'>" + value + "</option>";
        }

        privStr += "</select>";
        return privStr;
    }

}
