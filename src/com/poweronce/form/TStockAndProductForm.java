package com.poweronce.form;

import java.io.Serializable;

public class TStockAndProductForm extends BasePageForm {
    /**
     * c.product_type,c.product_id,c.code,c.product_name,a.product_price,a.
     * stock_time
     */

    private String product_type;
    private String product_id;
    private float product_price;
    private String code;
    private String product_name;
    private String stock_time;

    public String getCode() {
	return code;
    }

    public void setCode(String code) {
	this.code = code;
    }

    public String getProduct_id() {
	return product_id;
    }

    public void setProduct_id(String product_id) {
	this.product_id = product_id;
    }

    public String getProduct_name() {
	return product_name;
    }

    public void setProduct_name(String product_name) {
	this.product_name = product_name;
    }

    public float getProduct_price() {
	return product_price;
    }

    public void setProduct_price(float product_price) {
	this.product_price = product_price;
    }

    public String getProduct_type() {
	return product_type;
    }

    public void setProduct_type(String product_type) {
	this.product_type = product_type;
    }

    public String getStock_time() {
	return stock_time;
    }

    public void setStock_time(String stock_time) {
	this.stock_time = stock_time;
    }

}
