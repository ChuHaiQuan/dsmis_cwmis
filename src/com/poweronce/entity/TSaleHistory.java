/**
 * 
 */
package com.poweronce.entity;

import java.util.Date;

/**
 * @author 高颖祺
 * 
 */
public class TSaleHistory {
    private long id;
    private long oper_id;
    private long buyer_id;
    private String cash_time;
    private double amount;
    private long sale_id;
    private String sale_bill_code;
    private String oper_name;
    private String buyer_name;
    private String remark;
    private String payment;

    public long getId() {
	return id;
    }

    public void setId(long id) {
	this.id = id;
    }

    public long getOper_id() {
	return oper_id;
    }

    public void setOper_id(long oper_id) {
	this.oper_id = oper_id;
    }

    public long getBuyer_id() {
	return buyer_id;
    }

    public void setBuyer_id(long buyer_id) {
	this.buyer_id = buyer_id;
    }

    public String getCash_time() {
	return cash_time;
    }

    public void setCash_time(String cash_time) {
	this.cash_time = cash_time;
    }

    public long getSale_id() {
	return sale_id;
    }

    public void setSale_id(long sale_id) {
	this.sale_id = sale_id;
    }

    public String getSale_bill_code() {
	return sale_bill_code;
    }

    public void setSale_bill_code(String sale_bill_code) {
	this.sale_bill_code = sale_bill_code;
    }

    public String getOper_name() {
	return oper_name;
    }

    public void setOper_name(String oper_name) {
	this.oper_name = oper_name;
    }

    public String getBuyer_name() {
	return buyer_name;
    }

    public void setBuyer_name(String buyer_name) {
	this.buyer_name = buyer_name;
    }

    public String getRemark() {
	return remark;
    }

    public void setRemark(String remark) {
	this.remark = remark;
    }

    public double getAmount() {
	return amount;
    }

    public void setAmount(double amount) {
	this.amount = amount;
    }

    public String getPayment() {
        return payment;
    }

    public void setPayment(String payment) {
        this.payment = payment;
    }
}
