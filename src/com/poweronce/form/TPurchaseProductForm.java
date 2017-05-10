package com.poweronce.form;

import java.io.Serializable;

public class TPurchaseProductForm extends BasePageForm {
    /**
	 * 
	 */
    // private static final long serialVersionUID = 1L;
    private long id;
    private int purchase_id;
    private int product_id;
    private String product_help;
    private String product_code;
    private String product_name;
    private float product_price;
    private int product_num;
    private String purchase_time;
    private int provider_id;
    private String provider_name;
    private String remark;
    private String[] ids;
    private String[] remarks;
    private int if_stock;
    private int[] actual_received;
    private String[] receiver;
    private float[] received_price;
    private Long products[];

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

    public int getPurchase_id() {
	return purchase_id;
    }

    public void setPurchase_id(int purchase_id) {
	this.purchase_id = purchase_id;
    }

    public String getPurchase_time() {
	return purchase_time;
    }

    public void setPurchase_time(String purchase_time) {
	this.purchase_time = purchase_time;
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

    public int getIf_stock() {
	return if_stock;
    }

    public void setIf_stock(int if_stock) {
	this.if_stock = if_stock;
    }

    public String getRemark() {
	return remark;
    }

    public void setRemark(String remark) {
	this.remark = remark;
    }

    public String[] getIds() {
	return ids;
    }

    public void setIds(String[] ids) {
	this.ids = ids;
    }

    public String[] getRemarks() {
	return remarks;
    }

    public void setRemarks(String[] remarks) {
	this.remarks = remarks;
    }

    public String getProduct_help() {
	return product_help;
    }

    public void setProduct_help(String product_help) {
	this.product_help = product_help;
    }

    public int[] getActual_received() {
	return actual_received;
    }

    public void setActual_received(int[] actual_received) {
	this.actual_received = actual_received;
    }

    public String[] getReceiver() {
	return receiver;
    }

    public void setReceiver(String[] receiver) {
	this.receiver = receiver;
    }

    public float[] getReceived_price() {
	return received_price;
    }

    public void setReceived_price(float[] received_price) {
	this.received_price = received_price;
    }

    public Long[] getProducts() {
	return products;
    }

    public void setProducts(Long[] products) {
	this.products = products;
    }

}
