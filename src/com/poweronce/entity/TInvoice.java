/**
 *
 */
package com.poweronce.entity;

import java.text.DecimalFormat;
import java.util.Date;

import com.poweronce.form.TInvoiceForm;
import com.poweronce.util.StrutsUtil;

/**
 * @author Administrator
 */
public final class TInvoice {

    private long id = 0;
    private long provider_id;
    private String purchase_bill_code;
    private String invoice_code;
    private double amout;
    private double paidAmount = 0.0;
    private String description;
    private Date invoiceDate;
    private Date updDate;
    private double credit = 0.0;

    public double getAmout() {
        return amout;
    }

    public String getDisplayAmout() {
        DecimalFormat df = new DecimalFormat("0.00");
        return df.format(this.amout);
    }

    public void setAmout(double amout) {
        this.amout = amout;
    }

    public double getCredit() {
        return credit;
    }

    public String getDisplayCredit() {
        DecimalFormat df = new DecimalFormat("0.00");
        return df.format(this.credit);
    }

    public void setCredit(double credit) {
        this.credit = credit;
    }

    public String getDescription() {
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
        if (invoice_code != null) {
            invoice_code = invoice_code.trim();
        }
        this.invoice_code = invoice_code;
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
        if (purchase_bill_code != null) {
            purchase_bill_code = purchase_bill_code.trim();
        }
        this.purchase_bill_code = purchase_bill_code;
    }

    /**
     * *
     * invoice date
     *
     * @return
     */
    public Date getInvoiceDate() {
        return invoiceDate;
    }

    public void setInvoiceDate(Date invoiceDate) {
        this.invoiceDate = invoiceDate;
    }

    public long getInvoiceDateForDB() {
        if (invoiceDate == null) {
            return -1;
        }
        return invoiceDate.getTime();
    }

    public void setInvoiceDate(long times) {
        if (times > 0) {
            this.invoiceDate = new Date();
            this.invoiceDate.setTime(times);
        }
    }

    /**
     * *
     * update date
     *
     * @return
     */
    public long getUpdDateForDB() {
        if (updDate == null) {
            return (new Date()).getTime();
        }
        return updDate.getTime();
    }

    public void setUpdDate(long times) {
        if (times > 0) {
            this.updDate = new Date();
            this.updDate.setTime(times);
        }
    }

    public Date getUpdDate() {
        return updDate;
    }

    public void setUpdDate(Date updDate) {
        this.updDate = updDate;
    }

    public static final TInvoice copyInvoiceValue(TInvoiceForm form) {
        if (form == null) {
            return null;
        }
        TInvoice invoice = new TInvoice();
        invoice.setId(form.getId());
        invoice.setProvider_id(form.getProvider_id());
        invoice.setPurchase_bill_code(form.getPurchase_bill_code());
        invoice.setInvoice_code(form.getInvoice_code());
        invoice.setAmout(form.getAmout());
        invoice.setDescription(form.getDescription());
        invoice.setInvoiceDate(StrutsUtil.parseDate(form.getInvoiceDate(), "yyyy-MM-dd"));
        invoice.setUpdDate(new Date());
        invoice.setCredit(form.getCredit());
        return invoice;
    }

    public String getDisplayBalance() {
        DecimalFormat df = new DecimalFormat("0.00");
        return df.format(this.amout - this.paidAmount - this.credit);
    }

    public double getPaidAmount() {
        return paidAmount;
    }

    public void setPaidAmount(double paidAmount) {
        this.paidAmount = paidAmount;
    }

    public String getDisplayPaidAmout() {
        DecimalFormat df = new DecimalFormat("0.00");
        return df.format(this.paidAmount);
    }

    public double getBalance() {
        return this.amout - this.paidAmount - this.credit;
    }
    // public String getDisplayBalanceAmout(){
    // DecimalFormat df =new DecimalFormat("0.00");
    // return df.format(this.amout - this.paidAmount - this.credit);
    // }
}
