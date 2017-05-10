package com.poweronce.action;

import java.awt.image.BufferedImage;
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.imageio.ImageIO;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.jasperreports.engine.JRExporter;
import net.sf.jasperreports.engine.JRExporterParameter;
import net.sf.jasperreports.engine.JasperCompileManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.JasperRunManager;
import net.sf.jasperreports.engine.base.JRBaseReport;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import net.sf.jasperreports.engine.export.JRXlsExporter;
import net.sf.jasperreports.engine.export.JRXlsExporterParameter;

import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.struts.action.ActionErrors;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.apache.struts.actions.DispatchAction;
import org.apache.struts.upload.FormFile;

import com.poweronce.model.PaginationSupport;
import com.poweronce.service.Webservice;
import com.poweronce.util.CTime;
import com.poweronce.util.ExtUtil;
import com.poweronce.util.ExtUtil.ExtListResponse;
import com.poweronce.util.JsonUtil;
import com.poweronce.validator.Validation;

public class BaseDispatchAction extends DispatchAction {

    // 获得全部列表，主要用于统计报表
    public ActionForward superListBySql(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response,
                                        String entity, String sql) throws Exception {
        try {
            String form1 = form.getClass().getName();
            String formName = form1.substring(form1.lastIndexOf(".") + 1);
            String actionName = "com.poweronce.entity." + formName.substring(0, formName.length() - 4);

            long nCount = Webservice.getRowCountBySql(sql);
            List list = Webservice.listAllBySql(Class.forName(actionName), sql);
            request.setAttribute("list", list);
            request.setAttribute("count", nCount);
        } catch (Exception e) {
            ActionErrors errors = new ActionErrors();
            Validation.addUserErrorInfo(e.getMessage(), errors);
        }
        return mapping.findForward("list");
    }

    // 获得全部列表，主要用于统计报表
    public ActionForward superList(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response,
                                   String condition, String order) throws Exception {
        try {
            String form1 = form.getClass().getName();
            String formName = form1.substring(form1.lastIndexOf(".") + 1);
            String actionName = "com.poweronce.entity." + formName.substring(0, formName.length() - 4);

            long nCount = Webservice.getRowCount(Class.forName(actionName), condition);
            List list = Webservice.listAll(Class.forName(actionName), condition, order);
            request.setAttribute("list", list);
            request.setAttribute("count", nCount);
        } catch (Exception e) {
            ActionErrors errors = new ActionErrors();
            Validation.addUserErrorInfo(e.getMessage(), errors);
        }
        return mapping.findForward("list");
    }

    // 获得分页列表
    public ActionForward superListPage(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response,
                                       String condition, String order) throws Exception {
        try {
            String form1 = form.getClass().getName();
            String formName = form1.substring(form1.lastIndexOf(".") + 1);
            String actionName = "com.poweronce.entity." + formName.substring(0, formName.length() - 4);
            String currpageStr = request.getParameter("currpage");
            String pagesizeStr = request.getParameter("pagesize");
            int iCurrPage = 1;
            int iPageSize = PaginationSupport.PAGESIZE;

            if (!StringUtils.isEmpty(currpageStr) && StringUtils.isNumeric(currpageStr) && (new Long(currpageStr).longValue() > 0)) {
                iCurrPage = new Integer(currpageStr).intValue();
            }
            if (!StringUtils.isEmpty(pagesizeStr)) {
                iPageSize = new Integer(pagesizeStr).intValue();
            }

            long nCount = Webservice.getRowCount(Class.forName(actionName), condition);
            if(request.getAttribute("maxCount")!=null){
            	nCount = (Integer)request.getAttribute("maxCount");
            }
            List list = Webservice.listPage(Class.forName(actionName), condition, order, iCurrPage, iPageSize);
            
            response.getWriter().println(ExtUtil.genExtListString(list, nCount));
            // PaginationSupport ps = new PaginationSupport(list, nCount,
            // iPageSize, (iCurrPage - 1) * iPageSize);
        } catch (Exception e) {
            log.error("异常", e);
        }
        return null;
    }

    // 获得分页列表
    public ActionForward superListPageBySql(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                            HttpServletResponse response, String entity, String sql) throws Exception {
        try {
            String currpageStr = request.getParameter("currpage");
            String pagesizeStr = request.getParameter("pagesize");
            int iCurrPage = 1;
            int iPageSize = PaginationSupport.PAGESIZE;

            if (!StringUtils.isEmpty(currpageStr) && StringUtils.isNumeric(currpageStr) && (new Long(currpageStr).longValue() > 0)) {
                iCurrPage = new Integer(currpageStr).intValue();
            }
            if (!StringUtils.isEmpty(pagesizeStr)) {
                iPageSize = new Integer(pagesizeStr).intValue();
            }

            long nCount = Webservice.getRowCountBySql(sql);
            List list = Webservice.listPageBySql(Class.forName(entity), sql, iCurrPage, iPageSize);
            request.setAttribute("list", list);

            PaginationSupport ps = new PaginationSupport(list, nCount, iPageSize, (iCurrPage - 1) * iPageSize);
            request.setAttribute("page", ps);
        } catch (Exception e) {
            ActionErrors errors = new ActionErrors();
            Validation.addUserErrorInfo(e.getMessage(), errors);
        }
        return mapping.findForward("list");
    }

    // 根据id 删除一条记录
    public ActionForward superDelete(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        try {
            String form1 = form.getClass().getName();
            String formName = form1.substring(form1.lastIndexOf(".") + 1);
            String actionName = "com.poweronce.entity." + formName.substring(0, formName.length() - 4);
            Object id = request.getParameter("id");
            Long lid = new Long(-1);
            if (id != null)
                lid = new Long(id.toString());
            Webservice.delete(Class.forName(actionName), lid);
            response.getWriter().println(JsonUtil.getSuccessJson());
        } catch (Exception e) {
            response.getWriter().println(JsonUtil.getFailJson("保存失败，请稍候重试"));
            log.error("异常", e);
        }
        return null;
    }

    // 保存数据
    public ActionForward update(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        try {
            String form1 = form.getClass().getName();
            String formName = form1.substring(form1.lastIndexOf(".") + 1);
            String actionName = formName.substring(0, formName.length() - 4);
            Object entity = null;
            if (request.getParameter("id") != null) {
                entity = Webservice.get(Class.forName("com.poweronce.entity." + actionName), request.getParameter("id"));
            }
            if (entity == null) {
                entity = Class.forName("com.poweronce.entity." + actionName).newInstance();
            }
            BeanUtils.copyProperties(entity, form);
            Object id = request.getParameter("id");
            Webservice.update(entity, id);
            response.getWriter().println(JsonUtil.getSuccessJson());
        } catch (Exception e) {
            response.getWriter().println(JsonUtil.getFailJson("保存失败，请稍候重试"));
            log.error("异常", e);
        }
        return null;
    }

    // 根据id 获得单条记录
    public ActionForward superGet(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response,
                                  Object id) throws Exception {
        try {
            String form1 = form.getClass().getName();
            String formName = form1.substring(form1.lastIndexOf(".") + 1);
            String actionName = "com.poweronce.entity." + formName.substring(0, formName.length() - 4);
            Object obj = Webservice.get(Class.forName(actionName), id);
            if (obj != null)
                BeanUtils.copyProperties(form, obj);
            request.setAttribute("entity", obj);
        } catch (Exception e) {
            ActionErrors errors = new ActionErrors();
            Validation.addUserErrorInfo(e.getMessage(), errors);
        }
        return mapping.findForward("get");
    }

    // 查看当前记录
    public ActionForward superShow(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        try {
            String form1 = form.getClass().getName();
            String formName = form1.substring(form1.lastIndexOf(".") + 1);
            String actionName = "com.poweronce.entity." + formName.substring(0, formName.length() - 4);
            Object id = request.getParameter("id");
            Long lid = new Long(-1);
            if (id != null)
                lid = new Long(id.toString());
            Object obj = Webservice.get(Class.forName(actionName), lid);
            if (obj != null)
                BeanUtils.copyProperties(form, obj);
            request.setAttribute("entity", obj);
        } catch (Exception e) {
            ActionErrors errors = new ActionErrors();
            Validation.addUserErrorInfo(e.getMessage(), errors);
        }
        return mapping.findForward("get");
    }

    // 保存数据
    public ActionForward save(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        try {
            String form1 = form.getClass().getName();
            String formName = form1.substring(form1.lastIndexOf(".") + 1);
            String actionName = formName.substring(0, formName.length() - 4);
            Object entity = null;
            if (request.getParameter("id") != null) {
                entity = Webservice.get(Class.forName("com.poweronce.entity." + actionName), request.getParameter("id"));
            }
            if (entity == null) {
                entity = Class.forName("com.poweronce.entity." + actionName).newInstance();
            }
            BeanUtils.copyProperties(entity, form);
            Webservice.save(entity);
            response.getWriter().println(JsonUtil.getSuccessJson());
        } catch (Exception e) {
            response.getWriter().println(JsonUtil.getFailJson("保存失败，请稍候重试"));
            log.error("异常", e);
        }
        return null;
    }

    // 根据id 删除一条记录
    public ActionForward del(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        try {
            String form1 = form.getClass().getName();
            String formName = form1.substring(form1.lastIndexOf(".") + 1);
            String actionName = "com.poweronce.entity." + formName.substring(0, formName.length() - 4);
            Object id = request.getParameter("id");
            Long lid = new Long(-1);
            if (id != null)
                lid = new Long(id.toString());
            Webservice.delete(Class.forName(actionName), lid);
            response.getWriter().println(JsonUtil.getSuccessJson());
        } catch (Exception e) {
            response.getWriter().println(JsonUtil.getFailJson("删除失败，请稍候重试"));
            log.error("异常", e);
        }
        return null;
    }

    // 根据id 修改数据
    public ActionForward toupdate(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        Object id = request.getParameter("id");
        Long lid = new Long(-1);
        if (id != null)
            lid = new Long(id.toString());
        return get(mapping, form, request, response, lid);
    }

    // 根据id 修改数据
    public ActionForward modi(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        Object id = request.getParameter("id");
        Long lid = new Long(-1);
        if (id != null)
            lid = new Long(id.toString());
        return get(mapping, form, request, response, lid);
    }

    // 根据id 获得单条记录
    public ActionForward get(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response, Long id)
            throws Exception {
        try {
            String form1 = form.getClass().getName();
            String formName = form1.substring(form1.lastIndexOf(".") + 1);
            String actionName = "com.poweronce.entity." + formName.substring(0, formName.length() - 4);
            Object obj = Webservice.get(Class.forName(actionName), id);
            if (obj != null)
                BeanUtils.copyProperties(form, obj);
            request.setAttribute("entity", obj);
        } catch (Exception e) {
            ActionErrors errors = new ActionErrors();
            Validation.addUserErrorInfo(e.getMessage(), errors, request);
        }
        return mapping.findForward("get");
    }

    // 查看当前记录
    public ActionForward show(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        try {
            String form1 = form.getClass().getName();
            String formName = form1.substring(form1.lastIndexOf(".") + 1);
            String actionName = "com.poweronce.entity." + formName.substring(0, formName.length() - 4);
            Object id = request.getParameter("id");
            Long lid = new Long(-1);
            if (id != null)
                lid = new Long(id.toString());
            Object obj = Webservice.get(Class.forName(actionName), lid);
            if (obj != null)
                BeanUtils.copyProperties(form, obj);
            request.setAttribute("entity", obj);
        } catch (Exception e) {
            ActionErrors errors = new ActionErrors();
            Validation.addUserErrorInfo(e.getMessage(), errors, request);
        }
        return mapping.findForward("get");
    }

    // 上传图片文件
    public String uploadPicture(FormFile file, String path, String orifile, HttpServletRequest request, ActionErrors errors) {
        String filename = "";
        try {
            if (file != null && file.getFileSize() != 0) {
                // 文件类型
                String filetype = file.getContentType();
                // 文件大小
                int filesize = file.getFileSize();
                // 文件扩展名
                String fileext = file.getFileName().substring(file.getFileName().lastIndexOf("."));

                String time = CTime.getTime(CTime.getTime("yyyyMMddHHmmssSSS"));
                filename = time + fileext;
                uploadFile(file, request.getRealPath("/") + path, filename);
                BufferedImage bi = ImageIO.read(new File(request.getRealPath("/") + path + filename));
                if (!StringUtils.isEmpty(orifile)) {
                    int n = orifile.indexOf("upfiles");
                    if (n >= 0) {
                        orifile = orifile.substring(n, orifile.length());
                    }
                    String path_ora = request.getRealPath("/") + "/" + orifile;
                    File file_ora = new File(path_ora);
                    file_ora.delete();
                }
            } else {
                return null;
            }
        } catch (Exception e) {
            return null;
        }
        return filename;
    }

    public void uploadFile(FormFile file, String path, String filename) throws FileNotFoundException, IOException {
        File dir = new File(path);
        if (!dir.exists())
            dir.mkdirs();
        InputStream stream = file.getInputStream();// 把文件读入
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        OutputStream bos = new FileOutputStream(path + filename);// 建立一个上传文件的输出流
        int bytesRead = 0;
        byte[] buffer = new byte[8192];
        while ((bytesRead = stream.read(buffer, 0, 8192)) != -1) {
            bos.write(buffer, 0, bytesRead);// 将文件写入服务器
        }
        bos.close();
        stream.close();
    }

    public void fileDelete(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response, String filename)
            throws IOException {
        if (!StringUtils.isEmpty(filename)) {
            int n = filename.indexOf("upfiles");
            if (n >= 0) {
                filename = filename.substring(n, filename.length());
            }
            String path_ora = request.getRealPath("/") + "/" + filename;
            File file_ora = new File(path_ora);
            file_ora.delete();
        }

    }

    public void download(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response, String filename)
            throws IOException {
        String shortname = filename.substring(filename.lastIndexOf("/") + 1, filename.length());
        // response.setContentType("application/msword");
        response.setHeader("Content-disposition", "attachment; filename=" + shortname);
        BufferedInputStream bis = null;
        BufferedOutputStream bos = null;
        try {
            bis = new BufferedInputStream(new FileInputStream(request.getRealPath("" + filename)));
            bos = new BufferedOutputStream(response.getOutputStream());

            byte[] buff = new byte[bis.available()];
            int bytesRead;

            while (-1 != (bytesRead = bis.read(buff, 0, buff.length))) {
                bos.write(buff, 0, bytesRead);
            }

        } catch (final IOException e) {
            System.out.println("IOException." + e);
        } finally {
            if (bis != null)
                bis.close();
            if (bos != null)
                bos.close();
        }
        return;

    }

    public ActionForward show_pdf(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response,
                                  String jrxml, String jasper, List list, String title) throws Exception {
        try {
            String path = request.getRealPath("");
            JasperCompileManager.compileReportToFile(path + jrxml);

            InputStream reportFile = new FileInputStream(new File(path + jasper));

            Map<String, Object> parameters = new HashMap<String, Object>();
            parameters.put("company_name", title);
            parameters.put("total", String.valueOf(list.size()));
            String logo = "http://" + request.getLocalAddr() + ":" + request.getLocalPort() + request.getContextPath()
                    + "/images/cnclogo.gif";

            // pdf输出
            JRBeanCollectionDataSource ds = new JRBeanCollectionDataSource(list);
            byte[] bytes = JasperRunManager.runReportToPdf(reportFile, parameters, ds);
            response.setContentType("application/pdf");
            response.setContentType("text/html;charset=GB2312");
            // response.setHeader("Content-disposition","inline;
            response.setContentLength(bytes.length);
            ServletOutputStream ouputStream = response.getOutputStream();
            ouputStream.write(bytes, 0, bytes.length);
            ouputStream.flush();
            ouputStream.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return mapping.findForward("");
    }

    public ActionForward show_excel(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response,
                                    String jrxml, String jasper, List list, String title) throws Exception {
        try {
            String path = request.getRealPath("");
            JasperReport jasperReport = JasperCompileManager.compileReport(path + jrxml);

            InputStream reportFile = new FileInputStream(new File(path + jasper));

            Map<String, Object> parameters = new HashMap<String, Object>();
            parameters.put("company_name", title);
            parameters.put("total", String.valueOf(list.size()));
            String logo = "http://" + request.getLocalAddr() + ":" + request.getLocalPort() + request.getContextPath()
                    + "/images/cnclogo.gif";

            JRBeanCollectionDataSource ds = new JRBeanCollectionDataSource(list);
            JasperPrint jasperPrint = JasperFillManager.fillReport(reportFile, parameters, ds);

            // excel
            response.setContentType("application/vnd.ms-excel");
            byte[] bytes;
            ByteArrayOutputStream baos = new ByteArrayOutputStream();

            JRExporter exporter = new JRXlsExporter();

            // 为什么Excel里面的数据是从第二行,第B列开始显示的
            java.lang.reflect.Field margin = JRBaseReport.class.getDeclaredField("leftMargin");
            margin.setAccessible(true);
            margin.setInt(jasperReport, 0);
            margin = JRBaseReport.class.getDeclaredField("topMargin");
            margin.setAccessible(true);
            margin.setInt(jasperReport, 0);
            margin = JRBaseReport.class.getDeclaredField("bottomMargin");
            margin.setAccessible(true);
            margin.setInt(jasperReport, 0);
            // 如何去掉Excel中隐藏的行
            java.lang.reflect.Field pageHeight = JRBaseReport.class.getDeclaredField("pageHeight");
            pageHeight.setAccessible(true);
            pageHeight.setInt(jasperReport, Integer.MAX_VALUE);

            exporter.setParameter(JRExporterParameter.JASPER_PRINT, jasperPrint);
            exporter.setParameter(JRExporterParameter.OUTPUT_STREAM, baos);
            // 不要有空白地方
            exporter.setParameter(JRXlsExporterParameter.IS_REMOVE_EMPTY_SPACE_BETWEEN_ROWS, Boolean.TRUE);
            exporter.setParameter(JRXlsExporterParameter.IS_DETECT_CELL_TYPE, Boolean.TRUE);
            // 不保留GridLine
            exporter.setParameter(JRXlsExporterParameter.IS_WHITE_PAGE_BACKGROUND, Boolean.TRUE);

            exporter.exportReport();
            bytes = baos.toByteArray();
            if (bytes != null && bytes.length > 0) {
                response.reset();
                response.setContentType("application/vnd.ms-excel");
                response.setHeader("Content-disposition", "attachment; filename=yourReport.xls");

                response.setContentLength(bytes.length);
                ServletOutputStream ouputStream = response.getOutputStream();
                ouputStream.write(bytes, 0, bytes.length);
                ouputStream.flush();
                ouputStream.close();

            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return mapping.findForward("");
    }

}
