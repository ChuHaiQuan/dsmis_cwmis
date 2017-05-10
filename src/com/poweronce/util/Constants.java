package com.poweronce.util;

import java.io.IOException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Properties;

import net.sf.json.JSONObject;

import com.poweronce.entity.TKeyValue;
import com.poweronce.entity.TPurchase;
import com.poweronce.entity.TSale;
import com.poweronce.service.Webservice;

public class Constants {
	
	private static final Constants instance= new Constants();
    public static int PAGE_SIZE_DEFALUT = 12;
    public static int Employee_Count;
    

    public static String APP_TITLE = "";

    static public String company_key = "company";
    static public String company_name = "AJ PLUMBING SUPPLIES ,INC.";
    static public String company_address = "86 Forsyth Street ,New York,N.Y 10002";
    static public String company_tel = "(212)219-3826";
    static public String company_fax = "(212)966-3983";
    static public String company_name_pic_logo = "/images/company_name.gif";
    static public String company_logo_pic_logo = "/images/lucky8_logo.gif";
    static public float invoiceTax = 0.08375F;

    static {
        try {
            loadCompany();
            initEmployeeCount();
        } catch (Exception e) {
        }
    }
    
    
    
    public Constants() {
    	ClassLoader loader = getClass().getClassLoader();
    	Properties property=new Properties();
        try {
			property.load(loader.getResourceAsStream("company.properties"));
	        String count = property.getProperty("employee_count", "2");
	        Constants.Employee_Count=Integer.parseInt(count);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

    }
    /***
     * 初始化用户数量
     */
    public static  void initEmployeeCount(){
        //更新TPurchase表company_name为空的数据
       try {
		Webservice.execute(TPurchase.class, 
				   "update TPurchase set company_name='"+company_name+"',company_address='"+company_address+"',"
				   		+ "company_tel='"+company_tel+"',company_fax='"+company_fax+"',"
				   				+ "company_name_pic_logo='"+company_name_pic_logo+"',company_logo_pic_logo='"+company_logo_pic_logo+"',"
				   						+ "invoiceTax="+invoiceTax+" where company_name is null or company_name='' ");
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	       try {
	   		Webservice.execute(TSale.class, 
					   "update TSale set company_name='"+company_name+"',company_address='"+company_address+"',"
					   		+ "company_tel='"+company_tel+"',company_fax='"+company_fax+"',"
					   				+ "company_name_pic_logo='"+company_name_pic_logo+"',company_logo_pic_logo='"+company_logo_pic_logo+"',"
					   						+ "invoiceTax="+invoiceTax+" where company_name is null or company_name='' ");
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    }
    
    public static void loadCompany() throws Exception {
        try {
            List<TKeyValue> all = Webservice.listAll(TKeyValue.class, " where mapkey = '" + company_key + "'", "");
            if (all != null && all.size() > 0) {
                JSONObject fromObject = JSONObject.fromObject(all.get(0).getValue());
                company_name = fromObject.getString("company_name");
                company_address = fromObject.getString("company_address");
                company_tel = fromObject.getString("company_tel");
                company_fax = fromObject.getString("company_fax");
                company_name_pic_logo = fromObject.getString("company_name_pic_logo");
                company_logo_pic_logo = fromObject.getString("company_logo_pic_logo");
                invoiceTax = Float.valueOf(fromObject.getString("invoiceTax"));
            } else {
                ClassLoader loader = Constants.class.getClassLoader();
                Properties props = new Properties();
                props.load(loader.getResourceAsStream("company.properties"));
                company_name = props.getProperty("company_name", "AJ PLUMBING SUPPLIES ,INC.");
                company_address = props.getProperty("company_address", "86 Forsyth Street ,New York,N.Y 10002");
                company_tel = props.getProperty("company_tel", "(212)219-3826");
                company_fax = props.getProperty("company_fax", "(212)966-3983");
                company_name_pic_logo = props.getProperty("company_name_pic_logo", "/images/company_name.gif");
                company_logo_pic_logo = props.getProperty("company_logo_pic_logo", "/images/lucky8_logo.gif");
                invoiceTax = Float.valueOf(props.getProperty("invoiceTax", "0.08375"));
            }
            

            
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // added by lm
    public static final long PRODUCT_TYPE_SELF_DEFINE = -1;
}
