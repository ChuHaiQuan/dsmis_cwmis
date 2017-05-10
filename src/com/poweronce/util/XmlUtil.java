/*
 * Created on 2005-6-28
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package com.poweronce.util;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Iterator;
import java.util.List;

/**
 * @author hz_poweronce
 *         <p/>
 *         TODO To change the template for this generated type comment go to
 *         Window - Preferences - Java - Code Style - Code Templates
 */
public class XmlUtil {

    public String Field_ListToXml(List list) {
        String xmlStr = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><rows>";
        if (list == null)
            return xmlStr + "</rows>";
        Iterator iter = list.iterator();
        int sn = 1;
        while (iter.hasNext()) {
            Object obj = iter.next();
            String classname = obj.getClass().getName();
            Class cls = null;
            try {
                cls = Class.forName(classname);
            } catch (ClassNotFoundException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
            String shortclass = classname.substring(classname.lastIndexOf(".") + 1);
            xmlStr += "<row><show_id>" + (sn++) + "</show_id><show_state>δ</show_state>";// "<"+shortclass
            // +">";
            Field fieldlist[] = cls.getDeclaredFields();
            for (int i = 0; i < fieldlist.length; i++) {
                Field fld = fieldlist[i];
                xmlStr += "<" + fld.getName() + ">";
                try {
                    xmlStr += fld.get(obj).toString();
                } catch (IllegalArgumentException e1) {
                    // TODO Auto-generated catch block
                    e1.printStackTrace();
                } catch (IllegalAccessException e1) {
                    // TODO Auto-generated catch block
                    e1.printStackTrace();
                }
                xmlStr += "</" + fld.getName() + ">";
            }
            xmlStr += "</row>";// "</"+shortclass +">";

        }
        return xmlStr + "</rows>";
    }

    public String GetMethod_ListToXml(List list) {
        String xmlStr = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><rows>";
        if (list == null)
            return xmlStr + "</rows>";
        Iterator iter = list.iterator();
        int sn = 1;
        while (iter.hasNext()) {
            Object obj = iter.next();
            String classname = obj.getClass().getName();
            Class cls = null;
            try {
                cls = Class.forName(classname);
            } catch (ClassNotFoundException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
            String shortclass = classname.substring(classname.lastIndexOf(".") + 1);
            xmlStr += "<row><show_id>" + (sn++) + "</show_id><show_state>δ</show_state>";// "<"+shortclass
            // +">";
            Method methodlist[] = cls.getDeclaredMethods();
            for (int i = 0; i < methodlist.length; i++) {
                Method meth = methodlist[i];
                String methodname = meth.getName();
                if (!"get".equals(methodname.substring(0, 3)))
                    continue;
                String firstChar = methodname.substring(3, 4);
                methodname = firstChar.toLowerCase() + methodname.substring(4, methodname.length());
                xmlStr += "<" + methodname + ">";
                try {
                    xmlStr += meth.invoke(obj, null);
                } catch (IllegalArgumentException e1) {
                    // TODO Auto-generated catch block
                    e1.printStackTrace();
                } catch (IllegalAccessException e1) {
                    // TODO Auto-generated catch block
                    e1.printStackTrace();
                } catch (InvocationTargetException e1) {
                    // TODO Auto-generated catch block
                    e1.printStackTrace();
                }
                xmlStr += "</" + methodname + ">";
            }
            xmlStr += "</row>";// "</"+shortclass +">";

        }
        return xmlStr + "</rows>";
    }
}
