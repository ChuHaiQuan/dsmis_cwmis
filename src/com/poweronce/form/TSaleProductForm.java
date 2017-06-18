package com.poweronce.form;

public class TSaleProductForm extends BasePageForm {
    /**
	 * 
	 */
    // private static final long serialVersionUID = 1L;
    private long id;
    private int sale_id;
    private int product_id;
    private String product_code;
    private String product_code_id;
    private String product_name;
    private double product_price;
    private double agio_price;
    private double agio;
    private int product_num;
    private String sale_time;
    private int rma_id;
    private String rma_time;
    private int rma_num;
    private String rma_code;
    private String if_rma;
    private int if_back_order;
    private int credit_num;
    private int damage_num;
    private int return_credit_num;
    private int return_damage_num;
    private String refundMethod;
    
    public String getRefundMethod() {
		return refundMethod;
	}

	public void setRefundMethod(String refundMethod) {
		this.refundMethod = refundMethod;
	}

	public int getCredit_num() {
	return credit_num;
    }

    public void setCredit_num(int credit_num) {
	this.credit_num = credit_num;
    }

    public int getDamage_num() {
	return damage_num;
    }

    public void setDamage_num(int damage_num) {
	this.damage_num = damage_num;
    }

    public double getAgio() {
	return agio;
    }

    public void setAgio(double agio) {
	this.agio = agio;
    }

    public double getAgio_price() {
	return agio_price;
    }

    public void setAgio_price(double agio_price) {
	this.agio_price = agio_price;
    }

    public long getId() {
	return id;
    }

    public void setId(long id) {
	this.id = id;
    }

    public int getIf_back_order() {
	return if_back_order;
    }

    public void setIf_back_order(int if_back_order) {
	this.if_back_order = if_back_order;
    }

    public String getIf_rma() {
	return if_rma;
    }

    public void setIf_rma(String if_rma) {
	this.if_rma = if_rma;
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

    public double getProduct_price() {
	return product_price;
    }

    public void setProduct_price(double product_price) {
	this.product_price = product_price;
    }

    public String getRma_code() {
	return rma_code;
    }

    public void setRma_code(String rma_code) {
	this.rma_code = rma_code;
    }

    public int getRma_id() {
	return rma_id;
    }

    public void setRma_id(int rma_id) {
	this.rma_id = rma_id;
    }

    public String getRma_time() {
	return rma_time;
    }

    public void setRma_time(String rma_time) {
	this.rma_time = rma_time;
    }

    public int getSale_id() {
	return sale_id;
    }

    public void setSale_id(int sale_id) {
	this.sale_id = sale_id;
    }

    public String getSale_time() {
	return sale_time;
    }

    public void setSale_time(String sale_time) {
	this.sale_time = sale_time;
    }

    public String getProduct_code_id() {
	return product_code_id;
    }

    public void setProduct_code_id(String product_code_id) {
	this.product_code_id = product_code_id;
    }

    public int getRma_num() {
	return rma_num;
    }

    public void setRma_num(int rma_num) {
	this.rma_num = rma_num;
    }

    public int getReturn_credit_num() {
	return return_credit_num;
    }

    public void setReturn_credit_num(int return_credit_num) {
	this.return_credit_num = return_credit_num;
    }

    public int getReturn_damage_num() {
	return return_damage_num;
    }

    public void setReturn_damage_num(int return_damage_num) {
	this.return_damage_num = return_damage_num;
    }

}
