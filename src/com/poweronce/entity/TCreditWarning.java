/**
 * 
 */
package com.poweronce.entity;

/**
 * @author chuhaiquan
 *
 */
public class TCreditWarning {

	private float amount;
	private String buyer_code;
	private String invoice;
	private String last_cash_time;
	private String oper_name;
	private Integer sale_id;
	
	
	public Integer getSale_id() {
		return sale_id;
	}
	public void setSale_id(Integer sale_id) {
		this.sale_id = sale_id;
	}
	public float getAmount() {
		return amount;
	}
	public void setAmount(float amount) {
		this.amount = amount;
	}
	public String getBuyer_code() {
		return buyer_code;
	}
	public void setBuyer_code(String buyer_code) {
		this.buyer_code = buyer_code;
	}
	public String getInvoice() {
		return invoice;
	}
	public void setInvoice(String invoice) {
		this.invoice = invoice;
	}
	public String getLast_cash_time() {
		return last_cash_time;
	}
	public void setLast_cash_time(String last_cash_time) {
		this.last_cash_time = last_cash_time;
	}
	public String getOper_name() {
		return oper_name;
	}
	public void setOper_name(String oper_name) {
		this.oper_name = oper_name;
	}
	
	
}
