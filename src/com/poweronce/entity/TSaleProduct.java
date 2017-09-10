package com.poweronce.entity;

import java.io.Serializable;

public class TSaleProduct implements Serializable {
    /**
     *
     */
    // private static final long serialVersionUID = 1L;
    private long id;
    private int sale_id;
    // 对应TProduct.id
    private long product_id;
    // 对应TProduct.product_id
    private String productid;
    private String product_code;
    private String product_name;
    private double product_price;
    private double agio;
    private double agio_price;
    private float product_num;
    private String sale_time;
    private int rma_id;
    private String rma_time;
    private String rma_code;
    private int rma_num;
    private int credit_num;
    private int damage_num;
    private String if_rma;
    private int if_back_order;
    private int back_order_id;
    private String back_order_time;
    private String back_order_code;
    private String unit_qty;
    private String tracking_id;
    

	public String getTracking_id() {
		return tracking_id;
	}

	public void setTracking_id(String tracking_id) {
		this.tracking_id = tracking_id;
	}

	public String getUnit_qty() {
		return unit_qty;
	}

	public void setUnit_qty(String unit_qty) {
		this.unit_qty = unit_qty;
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

    public String getProduct_name() {
        return product_name;
    }

    public void setProduct_name(String product_name) {
        this.product_name = product_name;
    }

    public float getProduct_num() {
        return product_num;
    }

    public void setProduct_num(float product_num) {
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

    public String getBack_order_code() {
        return back_order_code;
    }

    public void setBack_order_code(String back_order_code) {
        this.back_order_code = back_order_code;
    }

    public int getBack_order_id() {
        return back_order_id;
    }

    public void setBack_order_id(int back_order_id) {
        this.back_order_id = back_order_id;
    }

    public String getBack_order_time() {
        return back_order_time;
    }

    public void setBack_order_time(String back_order_time) {
        this.back_order_time = back_order_time;
    }

    public int getRma_num() {
        return rma_num;
    }

    public void setRma_num(int rma_num) {
        this.rma_num = rma_num;
    }

    public long getProduct_id() {
        return product_id;
    }

    public void setProduct_id(long product_id) {
        this.product_id = product_id;
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

    public String getProductid() {
        return productid;
    }

    public void setProductid(String productid) {
        this.productid = productid;
    }

}
