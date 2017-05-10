/**
 *
 */
package com.poweronce.entity;

import java.text.DecimalFormat;
import java.util.Date;

/**
 * @author Administrator
 */
public final class TInvoiceHistory {

    private long id;
    private long invoice_id;
    private double amout;
    private Date payDate;
    private String remark;
    private String payment;

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

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getInvoice_id() {
        return invoice_id;
    }

    public void setInvoice_id(long invoice_id) {
        this.invoice_id = invoice_id;
    }

    public Date getPayDate() {
        return payDate;
    }

    public void setPayDate(Date payDate) {
        this.payDate = payDate;
    }

    public long getPayDateForDB() {
        if (payDate == null) {
            return (new Date()).getTime();
        }
        return payDate.getTime();
    }

    public void setpayDate(long times) {
        if (times > 0) {
            payDate = new Date();
            payDate.setTime(times);
        }
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public String getPayment() {
        return payment;
    }

    public void setPayment(String payment) {
        this.payment = payment;
    }

}
