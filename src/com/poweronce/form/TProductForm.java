package com.poweronce.form;

import org.apache.struts.upload.FormFile;

public class TProductForm extends BasePageForm {

    /**
	 * 
	 */
    // private static final long serialVersionUID = 1L;
    private long[] ids;
    private long id;
    private long provider_id;
    private String product_type;
    private String parent_id;
    private String Code;
    private String product_id;
    private String product_name;
    private String product_name_cn;
    private String picture;
    private String Spec;
    private String Unit;
    private String size;
    private String weight;
    private float UpLimit;
    private float DownLimit;
    private String Drawing;
    private String HelpName;
    private String MyMemo;
    private String Drawing2;
    private String Drawing3;
    private String Drawing4;
    private String Drawing5;
    private String Drawing6;
    private String Drawing7;
    private String Drawing8;
    private String Drawing9;
    private float price_income;
    private float price_simgle;
    private String Sreserve1;
    private String Sreserve2;
    private String Sreserve3;
    private int freserve1;
    private int freserve2;
    private int freserve3;
    private int num;
    private FormFile theFile;

    private String productProviderJson;

    private float price_wholesale;

    private float price_company;
    
    
    public float getPrice_company() {
		return price_company;
	}

	public void setPrice_company(float price_company) {
		this.price_company = price_company;
	}
    public String getCode() {
	return Code;
    }

    public void setCode(String code) {
	Code = code;
    }

    public float getDownLimit() {
	return DownLimit;
    }

    public void setDownLimit(float downLimit) {
	DownLimit = downLimit;
    }

    public String getDrawing() {
	return Drawing;
    }

    public void setDrawing(String drawing) {
	Drawing = drawing;
    }

    public String getDrawing2() {
	return Drawing2;
    }

    public void setDrawing2(String drawing2) {
	Drawing2 = drawing2;
    }

    public String getDrawing3() {
	return Drawing3;
    }

    public void setDrawing3(String drawing3) {
	Drawing3 = drawing3;
    }

    public String getDrawing4() {
	return Drawing4;
    }

    public void setDrawing4(String drawing4) {
	Drawing4 = drawing4;
    }

    public String getDrawing5() {
	return Drawing5;
    }

    public void setDrawing5(String drawing5) {
	Drawing5 = drawing5;
    }

    public String getDrawing6() {
	return Drawing6;
    }

    public void setDrawing6(String drawing6) {
	Drawing6 = drawing6;
    }

    public String getDrawing7() {
	return Drawing7;
    }

    public void setDrawing7(String drawing7) {
	Drawing7 = drawing7;
    }

    public String getDrawing8() {
	return Drawing8;
    }

    public void setDrawing8(String drawing8) {
	Drawing8 = drawing8;
    }

    public String getDrawing9() {
	return Drawing9;
    }

    public void setDrawing9(String drawing9) {
	Drawing9 = drawing9;
    }

    public int getFreserve1() {
	return freserve1;
    }

    public void setFreserve1(int freserve1) {
	this.freserve1 = freserve1;
    }

    public int getFreserve2() {
	return freserve2;
    }

    public void setFreserve2(int freserve2) {
	this.freserve2 = freserve2;
    }

    public int getFreserve3() {
	return freserve3;
    }

    public void setFreserve3(int freserve3) {
	this.freserve3 = freserve3;
    }

    public String getHelpName() {
	return HelpName;
    }

    public void setHelpName(String helpName) {
	HelpName = helpName;
    }

    public long getId() {
	return id;
    }

    public void setId(long id) {
	this.id = id;
    }

    public String getMyMemo() {
	return MyMemo;
    }

    public void setMyMemo(String myMemo) {
	MyMemo = myMemo;
    }

    public String getPicture() {
	return picture;
    }

    public void setPicture(String picture) {
	this.picture = picture;
    }

    public String getProduct_name() {
	return product_name;
    }

    public void setProduct_name(String product_name) {
	this.product_name = product_name;
    }

    public String getProduct_type() {
	return product_type;
    }

    public void setProduct_type(String product_type) {
	this.product_type = product_type;
    }

    public String getSpec() {
	return Spec;
    }

    public void setSpec(String spec) {
	Spec = spec;
    }

    public String getSreserve1() {
	return Sreserve1;
    }

    public void setSreserve1(String sreserve1) {
	Sreserve1 = sreserve1;
    }

    public String getSreserve2() {
	return Sreserve2;
    }

    public void setSreserve2(String sreserve2) {
	Sreserve2 = sreserve2;
    }

    public String getSreserve3() {
	return Sreserve3;
    }

    public void setSreserve3(String sreserve3) {
	Sreserve3 = sreserve3;
    }

    public String getUnit() {
	return Unit;
    }

    public void setUnit(String unit) {
	Unit = unit;
    }

    public float getUpLimit() {
	return UpLimit;
    }

    public void setUpLimit(float upLimit) {
	UpLimit = upLimit;
    }

    public FormFile getTheFile() {
	return theFile;
    }

    public void setTheFile(FormFile theFile) {
	this.theFile = theFile;
    }

    public int getNum() {
	return num;
    }

    public void setNum(int num) {
	this.num = num;
    }

    public float getPrice_income() {
	return price_income;
    }

    public void setPrice_income(float price_income) {
	this.price_income = price_income;
    }

    public float getPrice_simgle() {
	return price_simgle;
    }

    public void setPrice_simgle(float price_simgle) {
	this.price_simgle = price_simgle;
    }

    public String getProduct_id() {
	return product_id;
    }

    public void setProduct_id(String product_id) {
	this.product_id = product_id;
    }

    public long getProvider_id() {
	return provider_id;
    }

    public void setProvider_id(long provider_id) {
	this.provider_id = provider_id;
    }

    public String getParent_id() {
	return parent_id;
    }

    public void setParent_id(String parent_id) {
	this.parent_id = parent_id;
    }

    public String getProduct_name_cn() {
	return product_name_cn;
    }

    public void setProduct_name_cn(String product_name_cn) {
	this.product_name_cn = product_name_cn;
    }

    public String getSize() {
	return size;
    }

    public void setSize(String size) {
	this.size = size;
    }

    public String getWeight() {
	return weight;
    }

    public void setWeight(String weight) {
	this.weight = weight;
    }

    public long[] getIds() {
	return ids;
    }

    public void setIds(long[] ids) {
	this.ids = ids;
    }

    public String getProductProviderJson() {
	return productProviderJson;
    }

    public void setProductProviderJson(String productProviderJson) {
	this.productProviderJson = productProviderJson;
    }

    public float getPrice_wholesale() {
	return price_wholesale;
    }

    public void setPrice_wholesale(float price_wholesale) {
	this.price_wholesale = price_wholesale;
    }

}
