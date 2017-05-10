/**
 * 
 */
package com.poweronce.form;

/**
 * @author Administrator
 * 
 */
public final class TInvoiceForm extends BasePageForm {
    private long[] ids;
    private long id;// bigint(20) NOT NULL auto_increment,
    private long provider_id;// int(20) NOT NULL default -1,
    private String purchase_bill_code;// varchar(50) NOT NULL,
    private String invoice_code;// varchar(50) NOT NULL,
    private double amout;// float(16,2) default 0.00,
    private String description;// varchar(200) default '',
    private String invoiceDate;// yyyy-mm-dd
    private double paidAmount = 0.0;
    private double credit = 0.0;
    private String remark;
    private String paymentMethod;

    public double getCredit() {
	return credit;
    }

    public void setCredit(double credit) {
	this.credit = credit;
    }

    public double getPaidAmount() {
	return paidAmount;
    }

    public void setPaidAmount(double paidAmount) {
	this.paidAmount = paidAmount;
    }

    public double getAmout() {
	return amout;
    }

    public void setAmout(double amout) {
	this.amout = amout;
    }

    public String getDescription() {
	if (description == null) {
	    description = "";
	}
	return description;
    }

    public void setDescription(String description) {
	this.description = description;
    }

    public long getId() {
	return id;
    }

    public void setId(long id) {
	this.id = id;
    }

    public String getInvoice_code() {
	return invoice_code;
    }

    public void setInvoice_code(String invoice_code) {
	this.invoice_code = invoice_code;
    }

    public String getInvoiceDate() {
	return invoiceDate;
    }

    public void setInvoiceDate(String invoiceDate) {
	this.invoiceDate = invoiceDate;
    }

    public long getProvider_id() {
	return provider_id;
    }

    public void setProvider_id(long provider_id) {
	this.provider_id = provider_id;
    }

    public String getPurchase_bill_code() {
	return purchase_bill_code;
    }

    public void setPurchase_bill_code(String purchase_bill_code) {
	this.purchase_bill_code = purchase_bill_code;
    }

    public long[] getIds() {
	return ids;
    }

    public void setIds(long[] ids) {
	this.ids = ids;
    }

    public String getRemark() {
	return remark;
    }

    public void setRemark(String remark) {
	this.remark = remark;
    }

    public String getPaymentMethod() {
	return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
	this.paymentMethod = paymentMethod;
    }
}
