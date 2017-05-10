package com.poweronce.form;

public class TPowerOperationForm extends BasePageForm {
    /**
	 * 
	 */
    // private static final long serialVersionUID = 1L;
    private long id;
    private int PopedomCode;
    private String OperationCode;

    public String getOperationCode() {
	return OperationCode;
    }

    public void setOperationCode(String operationCode) {
	OperationCode = operationCode;
    }

    public int getPopedomCode() {
	return PopedomCode;
    }

    public void setPopedomCode(int popedomCode) {
	PopedomCode = popedomCode;
    }

    public long getId() {
	return id;
    }

    public void setId(long id) {
	this.id = id;
    }

}
