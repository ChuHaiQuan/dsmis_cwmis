package com.poweronce.model;

import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;

import com.poweronce.entity.TBuyer;
import com.poweronce.entity.TPower;
import com.poweronce.entity.TProductType;
import com.poweronce.entity.TProvider;
import com.poweronce.service.Webservice;

//问题?修改后的数据如何在这里更新
public class UserHashMap {
    private HashMap companyType = null;
    private HashMap sex = null;
    private HashMap state = null;
    private HashMap city = null;
    private HashMap department = null;
    private HashMap headship = null;
    private HashMap unit = null;
    private HashMap provider = null;
    private HashMap customer = null;
    private HashMap payment = null;
    private HashMap buyer = null;
    private HashMap power_items = null;
    private HashMap power = null;
    private HashMap product_type = null;
    private HashMap sale_state = null;
    private HashMap stock_state = null;
    private static UserHashMap instance = null;

    public static UserHashMap getInstance() {
        if (instance == null)
            instance = new UserHashMap();
        return instance;
    }

    public String getValue(String obj, String key) throws Exception {
        String str1 = obj.substring(0, 1).toUpperCase() + obj.substring(1, obj.length());
        Class cl = this.getClass();
        Method m = cl.getMethod("get" + str1, new Class[]{});
        Object o = m.invoke(this, new Object[]{});
        Object ret = "";
        if (o != null) {
            ret = ((HashMap) o).get(key);
            if (ret != null)
                return ret.toString();
            else
                ret = "";
        }
        return ret.toString();

    }

    public void setStock_state() {
        stock_state = new LinkedHashMap();
        stock_state.put("0", "No");
        stock_state.put("1", "Yes");
    }

    public void setCompanyType() {
        companyType = new LinkedHashMap();
        companyType.put("provider", "provider");
        companyType.put("saler", "saler");
    }

    public void setPayment() {
        payment = new LinkedHashMap();
        payment.put("Cash", "Cash");
        payment.put("Credit Card", "Credit Card");
        payment.put("Credit Account", "Credit Account");
    }

    public void setSex() {
        sex = new LinkedHashMap();
        sex.put("male", "male");
        sex.put("female", "female");
    }

    public void setDepartment() {
        department = new LinkedHashMap();
        department.put("finance", "finance");
        department.put("develop", "develop");
        department.put("general manager", "general manager");
        department.put("layout", "layout");
        department.put("market", "market");
        department.put("other", "other");
    }

    public void setHeadship() {
        headship = new LinkedHashMap();
        headship.put("accountant", "accountant");
        headship.put("secretary", "secretary");
        headship.put("saler", "saler");
        headship.put("casher", "casher");
        headship.put("manager", "manager");
        headship.put("other", "other");
    }

    public void setUnit() {
        unit = new LinkedHashMap();
        unit.put("entries", "entries");
        unit.put("kg", "kg");
        unit.put("lbs", "lbs");
        unit.put("box", "box");
        unit.put("dozen", "dozen");
    }

    public void setSale_state() {
        sale_state = new LinkedHashMap();
        sale_state.put("0", "Processing(Non pay)");
        sale_state.put("1", "Paid");
        sale_state.put("2", "RMA");
    }

    public void setPower_items() {
        power_items = new LinkedHashMap();
        power_items.put("20", "stock");
        power_items.put("21", "sale");
        power_items.put("22", "cash");
        power_items.put("23", "RMA");
        power_items.put("24", "product search");
        power_items.put("25", "price search");
        power_items.put("26", "P.O.");

        power_items.put("40", "employee");
        power_items.put("41", "vendor");
        power_items.put("42", "customer");
        power_items.put("43", "product");
        power_items.put("45", "product category");
        power_items.put("44", "power");

        power_items.put("60", "stock detail");
        power_items.put("61", "sale detail");
        power_items.put("62", "purchase detail");
        power_items.put("63", "back order");

        power_items.put("80", "top sale");

        power_items.put("100", "daily report");
        power_items.put("101", "monthly report");
        power_items.put("102", "report between");

        power_items.put("120", "backup");
        power_items.put("121", "change password");

    }

    public void setState() {
        state = new LinkedHashMap();
        state.put("Alabamas", "Alabamas");
        state.put("Alaska", "Alaska");
        state.put("Arizona", "Arizona");
        state.put("Arkansas", "Arkansas");
        state.put("California", "California");
        state.put("Colorado", "Colorado");
        state.put("Connecticut", "Connecticut");
        state.put("Delaware", "Delaware");
        state.put("District of Columbia", "District of Columbia");
        state.put("Florida", "Florida");
        state.put("Georgia", "Georgia");
        state.put("Hawaii", "Hawaii");
        state.put("Idaho", "Idaho");
        state.put("Illinois", "Illinois");
        state.put("Indiana", "Indiana");
        state.put("Iowa", "Iowa");
        state.put("Kansas", "Kansas");
        state.put("Kentucky", "Kentucky");
        state.put("Louisiana", "Louisiana");
        state.put("Maine", "Maine");
        state.put("Maryland", "Maryland");
        state.put("Massachusetts", "Massachusetts");
        state.put("Michigan", "Michigan");
        state.put("Minnesota", "Minnesota");
        state.put("Mississippi", "Mississippi");
        state.put("Missouri", "Missouri");
        state.put("Montana", "Montana");
        state.put("Nebraska", "Nebraska");
        state.put("Nevada", "Nevada");
        state.put("New Hampshire", "New Hampshire");
        state.put("New Jersy", "New Jersy");
        state.put("New Mexico", "New Mexico");
        state.put("New York", "New York");
        state.put("North Carolina", "North Carolina");
        state.put("North Dakota", "North Dakota");
        state.put("Ohio", "Ohio");
        state.put("Oklahoma", "Oklahoma");
        state.put("Oregon", "Oregon");
        state.put("Pennsylvania", "Pennsylvania");
        state.put("Puerto Rico", "Puerto Rico");
        state.put("Rhode Island", "Rhode Island");
        state.put("South Carolina", "South Carolina");
        state.put("South Dakota", "South Dakota");
        state.put("Tennessee", "Tennessee");
        state.put("Texas", "Texas");
        state.put("Utah", "Utah");
        state.put("Vermont", "Vermont");
        state.put("Virginia", "Virginia");
        state.put("Virgin Islands", "Virgin Islands");
        state.put("Washington", "Washington");
        state.put("West Virginia", "West Virginia");
        state.put("Wisconsin", "Wisconsin");
        state.put("Wyoming", "Wyoming");
    }

    public void setCity() {
        city = new LinkedHashMap();
        city.put("Washington", "Washington");
        city.put("Washington", "Washington2");
    }

    public HashMap getPayment() {
        if (payment == null)
            setPayment();
        return payment;
    }

    public HashMap getStock_state() {
        if (stock_state == null)
            setStock_state();
        return stock_state;
    }

    public HashMap getCity() {
        if (city == null)
            setCity();
        return city;
    }

    public HashMap getState() {
        if (state == null)
            setState();
        return state;
    }

    public HashMap getHeadship() {
        if (headship == null)
            setHeadship();
        return headship;
    }

    public HashMap getPower_items() {
        if (power_items == null)
            setPower_items();
        return power_items;
    }

    public HashMap getUnit() {
        if (unit == null)
            setUnit();
        return unit;
    }

    public HashMap getDepartment() {
        if (department == null)
            setDepartment();
        return department;
    }

    public HashMap getCompanyType() {
        if (companyType == null)
            setCompanyType();
        return companyType;
    }

    public HashMap getSale_state() {
        if (sale_state == null)
            setSale_state();
        return sale_state;
    }

    public HashMap getSex() {
        if (sex == null)
            setSex();
        return sex;
    }

    public void setPower() throws Exception {
        List list = Webservice.listAll(TPower.class, "", "");
        Iterator iter = list.iterator();
        power = new LinkedHashMap();
        while (iter.hasNext()) {
            TPower obj2 = (TPower) iter.next();
            power.put(new Long(obj2.getId()).toString(), obj2.getPower_name());
        }

    }

    public void setProvider() throws Exception {
        List list = Webservice.listAll(TProvider.class, "", "");
        Iterator iter = list.iterator();
        provider = new LinkedHashMap();
        while (iter.hasNext()) {
            TProvider obj2 = (TProvider) iter.next();
            provider.put(new Long(obj2.getId()).toString(), obj2.getShortName());
        }

    }

    public void setBuyer() throws Exception {
        List list = Webservice.listAll(TBuyer.class, "", "");
        Iterator iter = list.iterator();
        buyer = new LinkedHashMap();
        while (iter.hasNext()) {
            TBuyer obj2 = (TBuyer) iter.next();
            buyer.put(new Long(obj2.getId()).toString(), obj2.getShortName());
        }

    }

    public void setProduct_type() throws Exception {
        List list = Webservice.listAll(TProductType.class, " where level=2", "");
        Iterator iter = list.iterator();
        product_type = new LinkedHashMap();
        while (iter.hasNext()) {
            TProductType obj2 = (TProductType) iter.next();
            product_type.put(obj2.getProduct_type_name(), obj2.getProduct_type_name());
        }

    }

    public void setCustomer() throws Exception {
        List list = Webservice.listAll(TBuyer.class, "", "");
        Iterator iter = list.iterator();
        customer = new LinkedHashMap();
        while (iter.hasNext()) {
            TBuyer obj2 = (TBuyer) iter.next();
            customer.put(obj2.getCode(), obj2.getShortName());
        }
    }

    public HashMap getCustomer() throws Exception {
        setCustomer();
        return customer;
    }

    public HashMap getProvider() throws Exception {
        setProvider();
        return provider;
    }

    public HashMap getBuyer() throws Exception {
        setBuyer();
        return buyer;
    }

    public HashMap getProduct_type() throws Exception {
        setProduct_type();
        return product_type;
    }

    public HashMap getPower() throws Exception {
        setPower();
        return power;
    }

}
