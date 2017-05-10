package com.poweronce.form;

public class TStockProductForm extends BasePageForm {
    /**
	 * 
	 */
    // private static final long serialVersionUID = 1L;
    private long id;
    private int stock_id;
    private int product_type;
    private int product_id;
    private String product_code;
    private String product_name;
    private float product_price;
    private int product_num;
    private String stock_time;
    private int provider_id;
    private String provider_name;

    public long getId() {
	return id;
    }

    public void setId(long id) {
	this.id = id;
    }

    public String getProduct_code() {
	return product_code;
    }

    public void setProduct_code(String product_code) {
	this.product_code = product_code;
    }

    public int getProduct_id() {
	return product_id;
    }

    public void setProduct_id(int product_id) {
	this.product_id = product_id;
    }

    public String getProduct_name() {
	return product_name;
    }

    public void setProduct_name(String product_name) {
	this.product_name = product_name;
    }

    public int getProduct_num() {
	return product_num;
    }

    public void setProduct_num(int product_num) {
	this.product_num = product_num;
    }

    public float getProduct_price() {
	return product_price;
    }

    public void setProduct_price(float product_price) {
	this.product_price = product_price;
    }

    public int getStock_id() {
	return stock_id;
    }

    public void setStock_id(int stock_id) {
	this.stock_id = stock_id;
    }

    public String getStock_time() {
	return stock_time;
    }

    public void setStock_time(String stock_time) {
	this.stock_time = stock_time;
    }

    public int getProvider_id() {
	return provider_id;
    }

    public void setProvider_id(int provider_id) {
	this.provider_id = provider_id;
    }

    public String getProvider_name() {
	return provider_name;
    }

    public void setProvider_name(String provider_name) {
	this.provider_name = provider_name;
    }

    public int getProduct_type() {
	return product_type;
    }

    public void setProduct_type(int product_type) {
	this.product_type = product_type;
    }

}
