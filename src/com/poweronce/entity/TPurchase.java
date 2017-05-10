package com.poweronce.entity;

import java.io.Serializable;

public class TPurchase implements Serializable {
    /**
     *
     */
    // private static final long serialVersionUID = 1L;
    private long id;
    private int oper_id;
    private String oper_name;
    private String oper_time;
    private int cash_oper_id;
    private String cash_oper_code;
    private String cash_oper_name;
    private String cash_time = "1900-1-1";
    private String cash_station;
    private float all_purchase_price;
    private float all_paid_price;
    private String purchase_bill_code;
    private int provider_id;
    private String provider_name;
    private int if_stock;
    private String po_number;
    private String order_pic;
    private String invoice_code;
    private String invoice_pic;
    private int paid;// 0 not pay 1 payed
    private String remark;
    private String remark2;
    private int actual_received;
    private String receiver;
    private int if_cashed = 0;// 0已出货 1交易完成 2大客户已付款
    private float actual_received_amount;
    
    private String company_name;
    private String company_address;
    private String company_fax;
    private String company_tel;
    private String company_name_pic_logo;
    private String company_logo_pic_logo;
    private float invoiceTax;
    
    
    

    public String getCompany_name() {
		return company_name;
	}

	public void setCompany_name(String company_name) {
		this.company_name = company_name;
	}

	public String getCompany_address() {
		return company_address;
	}

	public void setCompany_address(String company_address) {
		this.company_address = company_address;
	}

	public String getCompany_fax() {
		return company_fax;
	}

	public void setCompany_fax(String company_fax) {
		this.company_fax = company_fax;
	}

	public String getCompany_tel() {
		return company_tel;
	}

	public void setCompany_tel(String company_tel) {
		this.company_tel = company_tel;
	}

	public String getCompany_name_pic_logo() {
		return company_name_pic_logo;
	}

	public void setCompany_name_pic_logo(String company_name_pic_logo) {
		this.company_name_pic_logo = company_name_pic_logo;
	}

	public String getCompany_logo_pic_logo() {
		return company_logo_pic_logo;
	}

	public void setCompany_logo_pic_logo(String company_logo_pic_logo) {
		this.company_logo_pic_logo = company_logo_pic_logo;
	}

	public float getInvoiceTax() {
		return invoiceTax;
	}

	public void setInvoiceTax(float invoiceTax) {
		this.invoiceTax = invoiceTax;
	}

	public String getIf_cashedStr() {
        switch (if_cashed) {
            case 0:
                return "purchased";
            case 1:
                return "cashed";
            case 2:
                return "paid";
            default:
                return "unknown";
        }
    }

    public float getAll_purchase_price() {
        return all_purchase_price;
    }

    public void setAll_purchase_price(float all_purchase_price) {
        this.all_purchase_price = all_purchase_price;
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

    public String getPurchase_bill_code() {
        return purchase_bill_code;
    }

    public void setPurchase_bill_code(String purchase_bill_code) {
        this.purchase_bill_code = purchase_bill_code;
    }

    public int getIf_stock() {
        return if_stock;
    }

    public void setIf_stock(int if_stock) {
        this.if_stock = if_stock;
    }

    public String getPo_number() {
        return po_number;
    }

    public void setPo_number(String po_number) {
        this.po_number = po_number;
    }

    public String getInvoice_pic() {
        return invoice_pic;
    }

    public void setInvoice_pic(String invoice_pic) {
        this.invoice_pic = invoice_pic;
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

    public String getInvoice_code() {
        return invoice_code;
    }

    public void setInvoice_code(String invoice_code) {
        if (invoice_code != null) {
            invoice_code = invoice_code.trim();
        }
        this.invoice_code = invoice_code;
    }

    public float getAll_paid_price() {
        return all_paid_price;
    }

    public void setAll_paid_price(float all_paid_price) {
        this.all_paid_price = all_paid_price;
    }

    public int getIf_cashed() {
        return if_cashed;
    }

    public void setIf_cashed(int if_cashed) {
        this.if_cashed = if_cashed;
    }

    public String getCash_oper_code() {
        return cash_oper_code;
    }

    public void setCash_oper_code(String cash_oper_code) {
        this.cash_oper_code = cash_oper_code;
    }

    public int getCash_oper_id() {
        return cash_oper_id;
    }

    public void setCash_oper_id(int cash_oper_id) {
        this.cash_oper_id = cash_oper_id;
    }

    public String getCash_oper_name() {
        return cash_oper_name;
    }

    public void setCash_oper_name(String cash_oper_name) {
        this.cash_oper_name = cash_oper_name;
    }

    public String getCash_station() {
        return cash_station;
    }

    public void setCash_station(String cash_station) {
        this.cash_station = cash_station;
    }

    public String getCash_time() {
        return cash_time;
    }

    public void setCash_time(String cash_time) {
        this.cash_time = cash_time;
    }

    public float getActual_received_amount() {
        return actual_received_amount;
    }

    public void setActual_received_amount(float actual_received_amount) {
        this.actual_received_amount = actual_received_amount;
    }

}
