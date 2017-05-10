/**
 * @author 高颖祺
 */
package com.poweronce.util;

import org.json.simple.JSONObject;

/**
 * @author 高颖祺
 */
public class JsonUtil {

    @SuppressWarnings("unchecked")
    public static JSONObject getSuccessJson() {
        JSONObject json = new JSONObject();
        json.put("success", true);
        return json;
    }

    @SuppressWarnings("unchecked")
    public static JSONObject getFailJson(String message) {
        JSONObject json = new JSONObject();
        json.put("success", false);
        json.put("msg", message);
        return json;
    }

}
