package com.poweronce.form;

public class TBuyerForm extends BasePageForm {
    /**
	 * 
	 */
    // private static final long serialVersionUID = 1L;
    private long id;
    private String Type;
    private String Code;
    private String ShortName;
    private String AllName;
    private String Address;
    private String PostCode;
    private String Tel1;
    private String Tel2;
    private String Tel3;
    private String Mobile;
    private String FAX;
    private String EMail;
    private String Http;
    private String Accounts;
    private String TaxCode;
    private String LinkMan;
    private String CompanyType;
    private String HelpName;
    private String RecDate;
    private String MyMemo;
    private String city;
    private String state;
    private String passwd;
    private String bank_Name;
    private String bank_Acount;
    private String credit_Acount;
    private Float leav_money;
    private Float credit_Line;

    private int acc_type;
    

    public int getAcc_type() {
		return acc_type;
	}

	public void setAcc_type(int acc_type) {
		this.acc_type = acc_type;
	}
    public String getAccounts() {
	return Accounts;
    }

    public void setAccounts(String accounts) {
	Accounts = accounts;
    }

    public String getAddress() {
	return Address;
    }

    public void setAddress(String address) {
	Address = address;
    }

    public String getAllName() {
	return AllName;
    }

    public void setAllName(String allName) {
	AllName = allName;
    }

    public String getCode() {
	return Code;
    }

    public void setCode(String code) {
	Code = code;
    }

    public String getCompanyType() {
	return CompanyType;
    }

    public void setCompanyType(String companyType) {
	CompanyType = companyType;
    }

    public String getEMail() {
	return EMail;
    }

    public void setEMail(String mail) {
	EMail = mail;
    }

    public String getFAX() {
	return FAX;
    }

    public void setFAX(String fax) {
	FAX = fax;
    }

    public String getHelpName() {
	return HelpName;
    }

    public void setHelpName(String helpName) {
	HelpName = helpName;
    }

    public String getHttp() {
	return Http;
    }

    public void setHttp(String http) {
	Http = http;
    }

    public String getLinkMan() {
	return LinkMan;
    }

    public void setLinkMan(String linkMan) {
	LinkMan = linkMan;
    }

    public String getMobile() {
	return Mobile;
    }

    public void setMobile(String mobile) {
	Mobile = mobile;
    }

    public String getMyMemo() {
	return MyMemo;
    }

    public void setMyMemo(String myMemo) {
	MyMemo = myMemo;
    }

    public String getPostCode() {
	return PostCode;
    }

    public void setPostCode(String postCode) {
	PostCode = postCode;
    }

    public String getRecDate() {
	return RecDate;
    }

    public void setRecDate(String recDate) {
	RecDate = recDate;
    }

    public String getShortName() {
	return ShortName;
    }

    public void setShortName(String shortName) {
	ShortName = shortName;
    }

    public String getTaxCode() {
	return TaxCode;
    }

    public void setTaxCode(String taxCode) {
	TaxCode = taxCode;
    }

    public String getTel1() {
	return Tel1;
    }

    public void setTel1(String tel1) {
	Tel1 = tel1;
    }

    public String getTel2() {
	return Tel2;
    }

    public void setTel2(String tel2) {
	Tel2 = tel2;
    }

    public String getTel3() {
	return Tel3;
    }

    public void setTel3(String tel3) {
	Tel3 = tel3;
    }

    public String getType() {
	return Type;
    }

    public void setType(String type) {
	Type = type;
    }

    public long getId() {
	return id;
    }

    public void setId(long id) {
	this.id = id;
    }

    public String getCity() {
	return city;
    }

    public void setCity(String city) {
	this.city = city;
    }

    public String getState() {
	return state;
    }

    public void setState(String state) {
	this.state = state;
    }

    public String getPasswd() {
	return passwd;
    }

    public void setPasswd(String passwd) {
	this.passwd = passwd;
    }

    public String getBank_Acount() {
	return bank_Acount;
    }

    public void setBank_Acount(String bank_Acount) {
	this.bank_Acount = bank_Acount;
    }

    public String getBank_Name() {
	return bank_Name;
    }

    public void setBank_Name(String bank_Name) {
	this.bank_Name = bank_Name;
    }

    public String getCredit_Acount() {
	return credit_Acount;
    }

    public void setCredit_Acount(String credit_Acount) {
	this.credit_Acount = credit_Acount;
    }

    public Float getLeav_money() {
        return leav_money;
    }

    public void setLeav_money(Float leav_money) {
        this.leav_money = leav_money;
    }

    public Float getCredit_Line() {
        return credit_Line;
    }

    public void setCredit_Line(Float credit_Line) {
        this.credit_Line = credit_Line;
    }
}
