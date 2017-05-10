package com.poweronce.entity;

import java.io.Serializable;

public class TStock implements Serializable {
    /**
     *
     */
    // private static final long serialVersionUID = 1L;
    private long id;
    private int oper_id;
    private String oper_name;
    private String oper_time;
    private float all_stock_price;
    private String stock_bill_code;
    private int provider_id;
    private String provider_name;

    public float getAll_stock_price() {
        return all_stock_price;
    }

    public void setAll_stock_price(float all_stock_price) {
        this.all_stock_price = all_stock_price;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public int getOper_id() {
        return oper_id;
    }

    public void setOper_id(int oper_id) {
        this.oper_id = oper_id;
    }

    public String getOper_name() {
        return oper_name;
    }

    public void setOper_name(String oper_name) {
        this.oper_name = oper_name;
    }

    public String getOper_time() {
        return oper_time;
    }

    public void setOper_time(String oper_time) {
        this.oper_time = oper_time;
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

    public String getStock_bill_code() {
        return stock_bill_code;
    }

    public void setStock_bill_code(String stock_bill_code) {
        this.stock_bill_code = stock_bill_code;
    }

}
