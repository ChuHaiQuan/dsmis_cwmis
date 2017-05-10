package com.poweronce.util;

import java.util.List;

import com.poweronce.annotation.NoJSON;

import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;

public class ExtUtil {

    public static String genExtListString(@SuppressWarnings("rawtypes") List list, long total) {
	ExtListResponse object = new ExtListResponse(list, total);
	JsonConfig config = new JsonConfig();
	config.addIgnoreFieldAnnotation(NoJSON.class);
	JSONObject fromObject = JSONObject.fromObject(object, config);
	return fromObject.toString();
    }

    public static class ExtListResponse {
	private long total;
	@SuppressWarnings("rawtypes")
	private List listData;

	@SuppressWarnings("rawtypes")
	public ExtListResponse(List listData, long total) {
	    this.listData = listData;
	    this.total = total;
	}

	public long getTotal() {
	    return total;
	}

	public void setTotal(long total) {
	    this.total = total;
	}

	public List getListData() {
	    return listData;
	}

	public void setListData(List listData) {
	    this.listData = listData;
	}
    }

}
