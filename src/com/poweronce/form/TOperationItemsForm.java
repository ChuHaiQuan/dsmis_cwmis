package com.poweronce.form;

public class TOperationItemsForm extends BasePageForm {
    /**
	 * 
	 */
    // private static final long serialVersionUID = 1L;
    private long id;
    private String Type;
    private String Code;
    private String Content;
    private String Remark;

    public String getCode() {
	return Code;
    }

    public void setCode(String code) {
	Code = code;
    }

    public String getContent() {
	return Content;
    }

    public void setContent(String content) {
	Content = content;
    }

    public String getRemark() {
	return Remark;
    }

    public void setRemark(String remark) {
	Remark = remark;
    }

    public String getType() {
	return Type;
    }

    public void setType(String type) {
	Type = type;
    }

    public long getId() {
	return id;
    }

    public void setId(long id) {
	this.id = id;
    }

}
