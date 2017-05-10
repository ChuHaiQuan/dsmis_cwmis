package com.poweronce.entity;

import java.io.Serializable;

public class TPurchaseProduct implements Serializable {
    /**
     *
     */
    // private static final long serialVersionUID = 1L;
    private long id;
    private int purchase_id;
    private long product_id;
    private String product_code;
    private String product_name;
    private float product_price;
    private int product_num;
    private String purchase_time;
    private int provider_id;
    private String provider_name;
    private String remark;
    private int if_stock;
    private int actual_received;
    private String receiver;

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

    public int getActual_received() {
        return actual_received;
    }

    public void setActual_received(int actual_received) {
        this.actual_received = actual_received;
    }

    public String getReceiver() {
        return receiver;
    }

    public void setReceiver(String receiver) {
        this.receiver = receiver;
    }

    public long getProduct_id() {
        return product_id;
    }

    public void setProduct_id(long product_id) {
        this.product_id = product_id;
    }

    public static class TPurchaseProductVo extends TPurchaseProduct {
        private int receive_num;

        public int getReceive_num() {
            return receive_num;
        }

        public void setReceive_num(int receive_num) {
            this.receive_num = receive_num;
        }
    }

}
