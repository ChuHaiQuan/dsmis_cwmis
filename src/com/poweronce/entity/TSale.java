package com.poweronce.entity;

import java.io.Serializable;

public class TSale implements Serializable {
    /**
     *
     */
    // private static final long serialVersionUID = 1L;
    private long id;
    private int oper_id;
    private String sale_bill_code;
    private int if_cashed;// 0已出货 1交易完成 2大客户已付款
    private String oper_code;
    private String oper_name;
    private String oper_time;

    private int cash_oper_id;
    private String cash_oper_code;
    private String cash_oper_name;
    private String cash_time;
    private String cash_station;

    private int rma_id;
    private String rma_time;
    private String rma_code;
    private String rma_name;
    private int rma_status;
    private double tax;
    private String payment;
    private double all_price;
    private double sub_total;
    private double discount;

    private double discountpercent;
    
    private Integer buyer_type;
    private int buyer_id;
    private String buyer_code;
    private String buyer_name;
    private String buyer_address;
    private String buyer_state;
    private String buyer_city;
    private String buyer_mobile;
    private String buyer_postCode;

    private String confirm_code;
    private String invoice;
    private String remark;
    private double paid_price;

    private String send_type;
    private String send_time;
    private long send_operid;
    private String send_opername;
    
    private String company_name;
    private String company_address;
    private String company_fax;
    private String company_tel;
    private String company_name_pic_logo;
    private String company_logo_pic_logo;
    private float invoiceTax;

    private int type;
    private float delivery_fee;
    
    
    
    
    public float getDelivery_fee() {
		return delivery_fee;
	}

	public void setDelivery_fee(float delivery_fee) {
		this.delivery_fee = delivery_fee;
	}

	public int getRma_status() {
		return rma_status;
	}

	public void setRma_status(int rma_status) {
		this.rma_status = rma_status;
	}

	/**
     * 返还
     */
    private double refund;
    
    
    private int taxable;
    
    

	public int getTaxable() {
		return taxable;
	}

	public void setTaxable(int taxable) {
		this.taxable = taxable;
	}

	public Integer getBuyer_type() {
		return buyer_type;
	}

	public void setBuyer_type(Integer buyer_type) {
		this.buyer_type = buyer_type;
	}

	public double getDiscountpercent() {
		return discountpercent;
	}

	public void setDiscountpercent(double discountpercent) {
		this.discountpercent = discountpercent;
	}

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
                return "saled";
            case 1:
                return "cashed";
            case 2:
                return "paid";
            default:
                return "unknown";
        }
    }

    public double getAll_price() {
        return all_price;
    }

    public void setAll_price(double all_price) {
        this.all_price = all_price;
    }

    public String getBuyer_address() {
        return buyer_address;
    }

    public void setBuyer_address(String buyer_address) {
        this.buyer_address = buyer_address;
    }

    public String getBuyer_code() {
        return buyer_code;
    }

    public void setBuyer_code(String buyer_code) {
        this.buyer_code = buyer_code;
    }

    public int getBuyer_id() {
        return buyer_id;
    }

    public void setBuyer_id(int buyer_id) {
        this.buyer_id = buyer_id;
    }

    public String getBuyer_name() {
        return buyer_name;
    }

    public void setBuyer_name(String buyer_name) {
        this.buyer_name = buyer_name;
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

    public String getConfirm_code() {
        return confirm_code;
    }

    public void setConfirm_code(String confirm_code) {
        this.confirm_code = confirm_code;
    }

    public double getDiscount() {
        return discount;
    }

    public void setDiscount(double discount) {
        this.discount = discount;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public int getIf_cashed() {
        return if_cashed;
    }

    public void setIf_cashed(int if_cashed) {
        this.if_cashed = if_cashed;
    }

    public String getInvoice() {
        return invoice;
    }

    public void setInvoice(String invoice) {
        this.invoice = invoice;
    }

    public String getOper_code() {
        return oper_code;
    }

    public void setOper_code(String oper_code) {
        this.oper_code = oper_code;
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

    public String getPayment() {
        return payment;
    }

    public void setPayment(String payment) {
        this.payment = payment;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public String getRma_code() {
        return rma_code;
    }

    public void setRma_code(String rma_code) {
        this.rma_code = rma_code;
    }

    public int getRma_id() {
        return rma_id;
    }

    public void setRma_id(int rma_id) {
        this.rma_id = rma_id;
    }

    public String getRma_name() {
        return rma_name;
    }

    public void setRma_name(String rma_name) {
        this.rma_name = rma_name;
    }

    public String getRma_time() {
        return rma_time;
    }

    public void setRma_time(String rma_time) {
        this.rma_time = rma_time;
    }

    public String getSale_bill_code() {
        return sale_bill_code;
    }

    public void setSale_bill_code(String sale_bill_code) {
        this.sale_bill_code = sale_bill_code;
    }

    public double getSub_total() {
        return sub_total;
    }

    public void setSub_total(double sub_total) {
        this.sub_total = sub_total;
    }

    public double getTax() {
        return tax;
    }

    public void setTax(double tax) {
        this.tax = tax;
    }

    public double getPaid_price() {
        return paid_price;
    }

    public void setPaid_price(double paid_price) {
        this.paid_price = paid_price;
    }

    public String getBuyer_state() {
        return buyer_state;
    }

    public void setBuyer_state(String buyer_state) {
        this.buyer_state = buyer_state;
    }

    public String getBuyer_city() {
        return buyer_city;
    }

    public void setBuyer_city(String buyer_city) {
        this.buyer_city = buyer_city;
    }

    public String getBuyer_postCode() {
        return buyer_postCode;
    }

    public void setBuyer_postCode(String buyer_postCode) {
        this.buyer_postCode = buyer_postCode;
    }

    public String getSend_time() {
        return send_time;
    }

    public void setSend_time(String send_time) {
        this.send_time = send_time;
    }

    public long getSend_operid() {
        return send_operid;
    }

    public void setSend_operid(long send_operid) {
        this.send_operid = send_operid;
    }

    public String getSend_opername() {
        return send_opername;
    }

    public void setSend_opername(String send_opername) {
        this.send_opername = send_opername;
    }

    public String getSend_type() {
        return send_type;
    }

    public void setSend_type(String send_type) {
        this.send_type = send_type;
    }

    public String getBuyer_mobile() {
        return buyer_mobile;
    }

    public void setBuyer_mobile(String buyer_mobile) {
        this.buyer_mobile = buyer_mobile;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    @Override
    public String toString() {
        return "TSale [id=" + id + ", oper_id=" + oper_id + ", sale_bill_code=" + sale_bill_code + ", if_cashed=" + if_cashed
                + ", oper_code=" + oper_code + ", oper_name=" + oper_name + ", oper_time=" + oper_time + ", cash_oper_id=" + cash_oper_id
                + ", cash_oper_code=" + cash_oper_code + ", cash_oper_name=" + cash_oper_name + ", cash_time=" + cash_time
                + ", cash_station=" + cash_station + ", rma_id=" + rma_id + ", rma_time=" + rma_time + ", rma_code=" + rma_code
                + ", rma_name=" + rma_name + ", tax=" + tax + ", payment=" + payment + ", all_price=" + all_price + ", sub_total="
                + sub_total + ", discount=" + discount + ", buyer_id=" + buyer_id + ", buyer_code=" + buyer_code + ", buyer_name="
                + buyer_name + ", buyer_address=" + buyer_address + ", buyer_state=" + buyer_state + ", buyer_city=" + buyer_city
                + ", buyer_mobile=" + buyer_mobile + ", buyer_postCode=" + buyer_postCode + ", confirm_code=" + confirm_code + ", invoice="
                + invoice + ", remark=" + remark + ", paid_price=" + paid_price + ", send_type=" + send_type + ", send_time=" + send_time
                + ", send_operid=" + send_operid + ", send_opername=" + send_opername + ", type=" + type + "]";
    }

    public double getRefund() {
        return refund;
    }

    public void setRefund(double refund) {
        this.refund = refund;
    }

}
