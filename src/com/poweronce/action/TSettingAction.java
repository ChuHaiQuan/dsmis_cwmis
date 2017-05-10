package com.poweronce.action;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.InputStreamReader;
import java.io.LineNumberReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.struts.action.ActionErrors;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.apache.struts.upload.FormFile;
import org.apache.tools.ant.taskdefs.Zip;
import org.json.simple.JSONObject;

import com.poweronce.entity.TKeyValue;
import com.poweronce.form.TSettingForm;
import com.poweronce.service.Webservice;
import com.poweronce.util.CTime;
import com.poweronce.util.Constants;
import com.poweronce.util.ExtUtil;
import com.poweronce.util.JsonUtil;
import com.poweronce.util.ZipUtil;
import com.poweronce.validator.Validation;

public class TSettingAction extends BaseDispatchAction {
    private String condition = "";

    private String uploadpath = "c:\\upload\\";

    

    private String cmd_path = "mysqldump -uroot -p123456  cwmis > c:\backup-file.sql";

    public ActionForward backupdatabase(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
    	String backup_path = this.getServlet().getServletContext().getRealPath("/");
    	String filePath = "Backup\\";String sqlFileName =  CTime.getTime("yyyyMMddHHmmss");
    	File file = new File(backup_path+filePath);
    	if(!file.isDirectory()){
    		file.mkdirs();
    	}
        ClassLoader loader = getClass().getClassLoader();
        Properties props = new Properties();
        props.load(loader.getResourceAsStream("connection.properties"));
        String user = props.getProperty("oraclePoolName.userName");
        String psw = props.getProperty("oraclePoolName.password");
        String bkf = backup_path +filePath+sqlFileName+".sql";
        String cmd = "mysqldump.exe -u " + user + " -p" + psw + " --opt cwmis > " + bkf;
        Process process = Runtime.getRuntime().exec("cmd /c " + cmd);
        log.error("cmd /c " + cmd);
        try {
        	BufferedOutputStream bos = new BufferedOutputStream(response.getOutputStream());
            InputStreamReader ir = new InputStreamReader(process.getInputStream());
            LineNumberReader input = new LineNumberReader(ir);
            String line;
            while ((line = input.readLine()) != null)
                System.out.println(line);
            
            ZipUtil.zip(backup_path+filePath+sqlFileName+".zip", null, bkf);
            
            super.download(mapping, form, request, response, filePath+sqlFileName+".zip");
        } catch (java.io.IOException e) {
            log.error(e.getMessage(), e);
        }
//        JSONObject successJson = JsonUtil.getSuccessJson();
//        successJson.put("msg", bkf);
//        response.getWriter().println(successJson.toJSONString());
        return null;
    }

    public ActionForward restoredatabase(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        ActionErrors errors = new ActionErrors();
        TSettingForm f = (TSettingForm) form;
        FormFile file = f.getTheFile();
        String filename = file.getFileName();

        if (StringUtils.isEmpty(filename)) {
            Validation.addUserErrorInfo("Please select restore file!", errors, request);
        } else {
            super.uploadFile(file, uploadpath, filename);
            ClassLoader loader = getClass().getClassLoader();
            Properties props = new Properties();
            props.load(loader.getResourceAsStream("connection.properties"));
            String user = props.getProperty("oraclePoolName.userName");
            String psw = props.getProperty("oraclePoolName.password");
            // 数据库导入
            String path = "mysqladmin.exe -u" + user + " -p" + psw + " create cwmis";
            java.lang.Runtime.getRuntime().exec("cmd /c " + path);
            path = "mysql.exe -u" + user + " -p" + psw + " cwmis < " + uploadpath + filename;
            java.lang.Runtime.getRuntime().exec("cmd /c " + path);

            Validation.addUserErrorInfo("restore success!", errors, request);
        }
        return mapping.findForward("info");
    }

    protected String getCondition() {
        return condition;
    }

    public ActionForward getCompany(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        Map<String, String> company = new HashMap<String, String>();
        company.put("company_name", Constants.company_name);
        company.put("company_address", Constants.company_address);
        company.put("company_tel", Constants.company_tel);
        company.put("company_fax", Constants.company_fax);
        company.put("company_name_pic_logo", Constants.company_name_pic_logo);
        company.put("company_logo_pic_logo", Constants.company_logo_pic_logo);
        company.put("invoiceTax", String.valueOf(Constants.invoiceTax));
        List<Map<String, String>> array = new ArrayList<Map<String, String>>();
        array.add(company);
        response.getWriter().println(ExtUtil.genExtListString(array, 1));
        return null;
    }

    public ActionForward saveCompany(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        TSettingForm settingForm = (TSettingForm) form;
        String companylog = uploadPicture(settingForm.getTheFile(), "/images/company/", Constants.company_name_pic_logo, request,
                new ActionErrors());
        String logo = uploadPicture(settingForm.getTheFile2(), "/images/company/", Constants.company_logo_pic_logo, request,
                new ActionErrors());
        Map<String, String> company = new HashMap<String, String>();
        company.put("company_name", settingForm.getCompany_name());
        company.put("company_address", settingForm.getCompany_address());
        company.put("company_tel", settingForm.getCompany_tel());
        company.put("company_fax", settingForm.getCompany_fax());
        company.put("invoiceTax", String.valueOf(settingForm.getInvoiceTax()));
        company.put("company_name_pic_logo", companylog != null ? "/images/company/" + companylog : Constants.company_name_pic_logo);
        company.put("company_logo_pic_logo", companylog != null ? "/images/company/" + logo : Constants.company_logo_pic_logo);

        String jsonString = JSONObject.toJSONString(company);
        StringBuffer sql = new StringBuffer("delete from TKeyValue where mapkey = '" + Constants.company_key + "'");
        Webservice.execute(TKeyValue.class, sql.toString());
        TKeyValue data = new TKeyValue();
        data.setMapkey(Constants.company_key);
        data.setValue(jsonString);
        Webservice.insert(data);
        Constants.loadCompany();
        response.getWriter().println(JsonUtil.getSuccessJson());
        return null;
    }
}
