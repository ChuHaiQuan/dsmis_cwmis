package com.poweronce.form;

import org.apache.struts.action.ActionForm;

public class BasePageForm extends ActionForm {

    private Integer currpage;
    private Integer pagesize;
    private Integer totalcount;

    private String[] checkbox;
    private String[] groupid;

    public String[] getCheckbox() {
	return checkbox;
    }

    public void setCheckbox(String[] checkbox) {
	this.checkbox = checkbox;
    }

    public Integer getCurrpage() {
	return currpage;
    }

    public void setCurrpage(Integer currpage) {
	this.currpage = currpage;
    }

    public String[] getGroupid() {
	return groupid;
    }

    public void setGroupid(String[] groupid) {
	this.groupid = groupid;
    }

    public Integer getPagesize() {
	return pagesize;
    }

    public void setPagesize(Integer pagesize) {
	this.pagesize = pagesize;
    }

    public Integer getTotalcount() {
	return totalcount;
    }

    public void setTotalcount(Integer totalcount) {
	this.totalcount = totalcount;
    }

}
