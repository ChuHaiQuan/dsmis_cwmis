package com.poweronce.form;

import java.io.Serializable;

import org.apache.struts.upload.FormFile;

public class TPurchaseForm extends BasePageForm {
    /**
	 * 
	 */
    // private static final long serialVersionUID = 1L;
    private long id;
    private int oper_id;
    private String oper_name;
    private String oper_time;
    private float all_purchase_price;
    private String purchase_bill_code;
    private int provider_id = -1;
    private String provider_name;
    private int if_stock = -1;
    private String invoice_pic;
    private String invoice_code;
    private String order_pic;
    private int paid = -1;// 0 not pay 1 payed
    private String remark;
    private String remark2;
    private int actual_received;
    private String receiver;

    private String oper_time_start;
    private String oper_time_end;
    private FormFile invoice_pic_file;
    private FormFile order_pic_file;

    private String purchaseProducts;

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

    public String getPurchase_bill_code() {
	return purchase_bill_code;
    }

    public void setPurchase_bill_code(String purchase_bill_code) {
	this.purchase_bill_code = purchase_bill_code;
    }

    public float getAll_purchase_price() {
	return all_purchase_price;
    }

    public void setAll_purchase_price(float all_purchase_price) {
	this.all_purchase_price = all_purchase_price;
    }

    public String getOper_time_end() {
	return oper_time_end;
    }

    public void setOper_time_end(String oper_time_end) {
	this.oper_time_end = oper_time_end;
    }

    public String getOper_time_start() {
	return oper_time_start;
    }

    public void setOper_time_start(String oper_time_start) {
	this.oper_time_start = oper_time_start;
    }

    public int getIf_stock() {
	return if_stock;
    }

    public void setIf_stock(int if_stock) {
	this.if_stock = if_stock;
    }

    public String getInvoice_pic() {
	return invoice_pic;
    }

    public void setInvoice_pic(String invoice_pic) {
	this.invoice_pic = invoice_pic;
    }

    public FormFile getInvoice_pic_file() {
	return invoice_pic_file;
    }

    public void setInvoice_pic_file(FormFile invoice_pic_file) {
	this.invoice_pic_file = invoice_pic_file;
    }

    public int getPaid() {
	return paid;
    }

    public void setPaid(int paid) {
	this.paid = paid;
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

    public String getRemark2() {
	return remark2;
    }

    public void setRemark2(String remark2) {
	this.remark2 = remark2;
    }

    public String getOrder_pic() {
	return order_pic;
    }

    public void setOrder_pic(String order_pic) {
	this.order_pic = order_pic;
    }

    public FormFile getOrder_pic_file() {
	return order_pic_file;
    }

    public void setOrder_pic_file(FormFile order_pic_file) {
	this.order_pic_file = order_pic_file;
    }

    public String getInvoice_code() {
	return invoice_code;
    }

    public void setInvoice_code(String invoice_code) {
	this.invoice_code = invoice_code;
    }

    public String getPurchaseProducts() {
	return purchaseProducts;
    }

    public void setPurchaseProducts(String purchaseProducts) {
	this.purchaseProducts = purchaseProducts;
    }

}
