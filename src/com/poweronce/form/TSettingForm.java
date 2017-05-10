package com.poweronce.form;

import org.apache.struts.upload.FormFile;

import com.poweronce.util.Constants;

public class TSettingForm extends BasePageForm {
    /**
	 * 
	 */
    // private static final long serialVersionUID = 1L;
    private FormFile theFile;
    private FormFile theFile2;

    private String company_name;
    private String company_address;
    private String company_tel;
    private String company_fax;
    private float invoiceTax;

    public FormFile getTheFile() {
	return theFile;
    }

    public void setTheFile(FormFile theFile) {
	this.theFile = theFile;
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

    public String getCompany_tel() {
	return company_tel;
    }

    public void setCompany_tel(String company_tel) {
	this.company_tel = company_tel;
    }

    public String getCompany_fax() {
	return company_fax;
    }

    public void setCompany_fax(String company_fax) {
	this.company_fax = company_fax;
    }

    public FormFile getTheFile2() {
	return theFile2;
    }

    public void setTheFile2(FormFile theFile2) {
	this.theFile2 = theFile2;
    }

    public float getInvoiceTax() {
        return invoiceTax;
    }

    public void setInvoiceTax(float invoiceTax) {
        this.invoiceTax = invoiceTax;
    }

}
