package com.poweronce.struts.util;

import java.util.HashMap;

import org.apache.struts.action.RequestProcessor;

/**
 * ProcessorFactory 类用于实现 processors 对象状态的保存和 <br>
 * <p/>
 * 在所有 servlet 实例中保持一致
 */

public class ProcessorFactory {

    /*
     * 
     * 为了实现键 - 值对，使用 HashMap 对象保存信息 为了实现所有 servlet 实例中保持一致的要求，将 HashMap 对象定义为
     * static
     */

    public static HashMap processors = new HashMap();

    /**
     * addProcessor 方法提供访问 processors 对象的接口，用于实现 RequestProcessor 对象的加入
     *
     * @param key       RequestProcessor 对象的键
     * @param processor RequestProcessor 对象
     */

    public static void addProcessor(String key, RequestProcessor processor) {

        processors.put(key, processor);

    }

    /**
     * getProcessor 方法提供获取 RequestProcessor 对象的接口
     *
     * @param key RequestProcessor 对象的键
     * @return HashMap 中 key 对应的 RequestProcessor 对象
     */

    public static Object getProcessor(String key) {

        return processors.get(key);

    }

}
