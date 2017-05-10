package com.poweronce.util;

import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

public class Invoke {
    // com.poweronce.model.UserHashMap.getInstance().getValue("tbusi",123)
    // com.poweronce.model.UserHashMap.getValue("tbusi",123)
    // (new com.poweronce.model.UserHashMap()).getValue("tbusi",123)暂不支持
    // 最多支持两级函数调用
    static public Object InvokeString(String fun) throws ClassNotFoundException, SecurityException, NoSuchMethodException, InstantiationException,
            IllegalAccessException, IllegalArgumentException, InvocationTargetException {
        int pos = fun.lastIndexOf("(");
        int pos2 = fun.lastIndexOf(")");

        // 获得所有参数 "tbusi",123,注意小数
        String para = fun.substring(pos + 1, pos2);
        String[] paras = para.split(",");
        int pos3 = fun.substring(0, pos).lastIndexOf(".");
        // 获得方法 getValue
        String method = fun.substring(pos3 + 1, pos);
        // 解析com.poweronce.model.UserHashMap.getInstance()
        String pre = fun.substring(0, pos3);
        int pos4 = pre.lastIndexOf("(");
        String entity = null;
        Class clazz = null;
        Object obj = null;
        Object instan = null;
        // 获得方法getInstance()
        if (pos4 > 0) {
            int pos5 = pre.lastIndexOf(".");
            String instance = pre.substring(pos5 + 1, pre.length() - 2);
            entity = pre.substring(0, pos5);
            clazz = Class.forName(entity);
            instan = clazz.getMethod(instance, null).invoke(null, null);
        }
        // 直接调用static方法
        else {
            entity = fun.substring(0, pos3);
            clazz = Class.forName(entity);
        }
        // 找到和传入方法名和参数个数相同的方法
        Method me[] = clazz.getDeclaredMethods();
        Object obj1[] = new Object[paras.length];
        for (int i = 0; i < me.length; i++) {
            Method iMe = me[i];
            // 匹配方法名
            if (iMe.getName().equals(method)) {
                Class[] meTypes = iMe.getParameterTypes();
                // 匹配参数个数
                if (meTypes.length == paras.length) {
                    // 传入的String参数转化为相应类型
                    for (int j = 0; j < meTypes.length; j++) {
                        // Object参数
                        if (meTypes[j].getName().equalsIgnoreCase("java.lang.Object")) {
                            obj1[j] = paras[j];
                        }
                        // boolean参数
                        else if (meTypes[j].getName().equalsIgnoreCase("boolean") || meTypes[j].getName().equalsIgnoreCase("java.lang.Boolean")) {
                            obj1[j] = new Boolean(paras[j]);
                        }
                        // int参数
                        else if (meTypes[j].getName().equalsIgnoreCase("int") || meTypes[j].getName().equalsIgnoreCase("java.lang.Integer")) {
                            obj1[j] = new Integer(paras[j]);
                        }
                        // long参数
                        else if (meTypes[j].getName().equalsIgnoreCase("long") || meTypes[j].getName().equalsIgnoreCase("java.lang.Long")) {
                            obj1[j] = new Long(paras[j]);
                        }
                        // float参数
                        else if (meTypes[j].getName().equalsIgnoreCase("float") || meTypes[j].getName().equalsIgnoreCase("java.lang.Float")) {
                            obj1[j] = new Float(paras[j]);
                        }
                        // String参数
                        else {
                            Constructor tpCz = meTypes[j].getDeclaredConstructor(new Class[]{String.class});
                            String paran = paras[j].replaceAll("\"", "");
                            obj1[j] = tpCz.newInstance(new Object[]{paran});
                        }
                    }
                    if (pos4 > 0) {
                        Object obj2 = clazz.getMethod(method, meTypes).invoke(instan, obj1);
                        return obj2;
                    } else {
                        Object obj2 = clazz.getMethod(method, meTypes).invoke(null, obj1);
                        return obj2;
                    }
                }
            }
        }
        return "";
    }

    public static void main(String args[]) throws SecurityException, IllegalArgumentException, ClassNotFoundException, NoSuchMethodException,
            InstantiationException, IllegalAccessException, InvocationTargetException {
        // InvokeString("com.poweronce.model.UserHashMap.getInstance().getValue(\"svrCard\",61)");
        System.out.println(InvokeString("com.poweronce.util.Math.multi(1,5)"));
        return;
    }
}
