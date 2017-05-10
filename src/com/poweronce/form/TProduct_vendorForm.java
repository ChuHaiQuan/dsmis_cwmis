package com.poweronce.form;

public class TProduct_vendorForm extends BasePageForm{
    private long id;
    private int product_id;
    private int vendor_id;
    private String product_name;
    private String vendor_name;
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
    public int getVendor_id() {
        return vendor_id;
    }
    public void setVendor_id(int vendor_id) {
        this.vendor_id = vendor_id;
    }
    public String getProduct_name() {
        return product_name;
    }
    public void setProduct_name(String product_name) {
        this.product_name = product_name;
    }
    public String getVendor_name() {
        return vendor_name;
    }
    public void setVendor_name(String vendor_name) {
        this.vendor_name = vendor_name;
    }
    
   
}
