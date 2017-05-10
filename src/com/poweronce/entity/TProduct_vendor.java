package com.poweronce.entity;

import java.io.Serializable;

public class TProduct_vendor implements Serializable {
    /**
     *
     */
    // private static final long serialVersionUID = 1L;
    private long id;
    private int product_id;
    private int vendor_id;
    private String product_name;
    private String vendor_name;
    private float price;
    private int useDefault;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
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

    public int getVendor_id() {
        return vendor_id;
    }

    public void setVendor_id(int vendor_id) {
        this.vendor_id = vendor_id;
    }

    public String getVendor_name() {
        return vendor_name;
    }

    public void setVendor_name(String vendor_name) {
        this.vendor_name = vendor_name;
    }

    public float getPrice() {
        return price;
    }

    public void setPrice(float price) {
        this.price = price;
    }

    public int getUseDefault() {
        return useDefault;
    }

    public void setUseDefault(int useDefault) {
        this.useDefault = useDefault;
    }

    public boolean getUseDefaultBoolean() {
        return this.useDefault == 1;
    }
}
