package com.poweronce.model;

import java.lang.reflect.Method;

import com.poweronce.util.Invoke;

public class ShowEntityUtil {

    // 一行或一列显示
    public static String showEntity(String propertys, // 取表体数据的方法,展现形式如：<table><tr><td>##</td><td>##</td></tr></table>
                                    String propertys_para[], // 表体数据参数,如:new
                                    // String[]{"getId","getName"},上面的##将会用getId(),getName()代替。
                                    int para_len[], // 限制字数长度
                                    Object obj// 对象
    ) throws Exception {
        if (obj == null)
            return null;
        String str = "";
        Class clazz = obj.getClass();
        String proper = new String(propertys);
        int pos$$ = proper.indexOf("##");
        int k = 0;
        // 特殊表体，不仅仅只显示字段内容
        if (pos$$ > 0) {
            while (pos$$ > 0) {
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
        return str;
    }
}
