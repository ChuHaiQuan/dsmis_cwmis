package com.poweronce.form;

public class TSaleTopForm {
    private String product_name;
    private float all_price;
    private int sale_times;

    public float getAll_price() {
	return all_price;
    }

    public void setAll_price(float all_price) {
	this.all_price = all_price;
    }

    public String getProduct_name() {
	return product_name;
    }

    public void setProduct_name(String product_name) {
	this.product_name = product_name;
    }

    public int getSale_times() {
	return sale_times;
    }

    public void setSale_times(int sale_times) {
	this.sale_times = sale_times;
    }
}
