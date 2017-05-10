package com.poweronce.form;

public class TPowerForm extends BasePageForm {
    /**
	 * 
	 */
    // private static final long serialVersionUID = 1L;
    private int id;
    private String power_name;
    private String[] power_items;

    public int getId() {
	return id;
    }

    public void setId(int id) {
	this.id = id;
    }

    public String getPower_name() {
	return power_name;
    }

    public void setPower_name(String power_name) {
	this.power_name = power_name;
    }

    public String[] getPower_items() {
	return power_items;
    }

    public void setPower_items(String[] power_items) {
	this.power_items = power_items;
    }

}
