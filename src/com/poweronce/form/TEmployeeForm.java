package com.poweronce.form;

public class TEmployeeForm extends BasePageForm {
    /**
	 * 
	 */
    // private static final long serialVersionUID = 1L;
    private long id;
    private String Name;
    private String Code;
    private String Sex;
    private String BirthDay;
    private String IDCard;
    private String Tel;
    private String Mobile;
    private String Address;
    private String Department;
    private String HeadShip;
    private String Popedom;
    private String Password1;
    private String newpassword1;
    private String newpassword2;
    private int is_manager;

    public String getAddress() {
	return Address;
    }

    public void setAddress(String address) {
	Address = address;
    }

    public String getBirthDay() {
	return BirthDay;
    }

    public void setBirthDay(String birthDay) {
	BirthDay = birthDay;
    }

    public String getCode() {
	return Code;
    }

    public void setCode(String code) {
	Code = code;
    }

    public String getDepartment() {
	return Department;
    }

    public void setDepartment(String department) {
	Department = department;
    }

    public String getHeadShip() {
	return HeadShip;
    }

    public void setHeadShip(String headShip) {
	HeadShip = headShip;
    }

    public String getIDCard() {
	return IDCard;
    }

    public void setIDCard(String card) {
	IDCard = card;
    }

    public String getMobile() {
	return Mobile;
    }

    public void setMobile(String mobile) {
	Mobile = mobile;
    }

    public String getName() {
	return Name;
    }

    public void setName(String name) {
	Name = name;
    }

    public String getPassword1() {
	return Password1;
    }

    public void setPassword1(String password1) {
	Password1 = password1;
    }

    public String getPopedom() {
	return Popedom;
    }

    public void setPopedom(String popedom) {
	Popedom = popedom;
    }

    public String getSex() {
	return Sex;
    }

    public void setSex(String sex) {
	Sex = sex;
    }

    public String getTel() {
	return Tel;
    }

    public void setTel(String tel) {
	Tel = tel;
    }

    public long getId() {
	return id;
    }

    public void setId(long id) {
	this.id = id;
    }

    public int getIs_manager() {
	return is_manager;
    }

    public void setIs_manager(int is_manager) {
	this.is_manager = is_manager;
    }

    public String getNewpassword1() {
	return newpassword1;
    }

    public void setNewpassword1(String newpassword1) {
	this.newpassword1 = newpassword1;
    }

    public String getNewpassword2() {
	return newpassword2;
    }

    public void setNewpassword2(String newpassword2) {
	this.newpassword2 = newpassword2;
    }

}
