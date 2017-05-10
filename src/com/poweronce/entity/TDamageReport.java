/**
 * 
 */
package com.poweronce.entity;

/**
 * @author 高颖祺
 * 
 */
public class TDamageReport {
    private String product_name;
    private float all_price;
    private int rma_num;

    public String getProduct_name() {
	return product_name;
    }

    public void setProduct_name(String product_name) {
	this.product_name = product_name;
    }

    public float getAll_price() {
	return all_price;
    }

    public void setAll_price(float all_price) {
	this.all_price = all_price;
    }

    public int getRma_num() {
	return rma_num;
    }

    public void setRma_num(int rma_num) {
	this.rma_num = rma_num;
    }

}
