package com.poweronce.action;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.lang.reflect.InvocationTargetException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import net.sf.jasperreports.engine.JasperCompileManager;
import net.sf.jasperreports.engine.JasperRunManager;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import net.sf.json.JSONArray;

import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.struts.action.ActionErrors;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.apache.struts.upload.FormFile;
import org.json.simple.JSONObject;

import com.poweronce.entity.TProduct;
import com.poweronce.entity.TProduct.TProductVo;
import com.poweronce.entity.TPurchaseProduct.TPurchaseProductVo;
import com.poweronce.entity.TProductType;
import com.poweronce.entity.TProduct_vendor;
import com.poweronce.entity.TProvider;
import com.poweronce.entity.TPurchase;
import com.poweronce.entity.TPurchaseProduct;
import com.poweronce.entity.TStockProduct;
import com.poweronce.form.TPurchaseForm;
import com.poweronce.model.CodeNumberGen;
import com.poweronce.service.Webservice;
import com.poweronce.util.CTime;
import com.poweronce.util.Constants;
import com.poweronce.util.JsonUtil;
import com.poweronce.util.ObjectFormat;
import com.poweronce.util.ProductUtil;
import com.poweronce.util.Tools;
import com.poweronce.validator.Validation;

public class TPurchaseAction extends BaseDispatchAction {

    /**
     * 订单搜索
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward list(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        TPurchaseForm tf = (TPurchaseForm) form;
        String condition = " where 1=1 ";
        if (tf.getProvider_id() != -1)
            condition += " and provider_id=" + tf.getProvider_id();
        if (tf.getIf_stock() != -1)
            condition += " and if_stock=" + tf.getIf_stock();
        if (StringUtils.isNotEmpty(tf.getPurchase_bill_code()))
            condition += " and purchase_bill_code='" + tf.getPurchase_bill_code() + "'";
        if (tf.getPaid() != -1)
            condition += " and paid=" + tf.getPaid();
        if (StringUtils.isNotEmpty(tf.getOper_time_start()))
            condition += " and oper_time >= '" + tf.getOper_time_start() + "'";
        if (StringUtils.isNotEmpty(tf.getOper_time_end()))
            condition += " and oper_time < '" + tf.getOper_time_end() + "'";
        if (tf.getOper_id() != 0)
            condition += " and oper_id=" + tf.getOper_id();
        condition += " order by id desc ";
        return super.superListPage(mapping, form, request, response, condition, "");
    }

    /**
     * 采购单收获
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward receivePurchase(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        try {
            Object id = request.getParameter("id");
            String time = CTime.getTime("yyyy-MM-dd HH:mm:ss");
            List<TPurchaseProduct> list = Webservice.listAll(TPurchaseProduct.class, " where purchase_id=" + id, "");
            float amount = 0;
            for (TPurchaseProduct tPurchaseProduct : list) {
                if (tPurchaseProduct.getActual_received() < tPurchaseProduct.getProduct_num()) {
                    Webservice.execute(TProduct.class,
                            "update TProduct set num=num+" + (tPurchaseProduct.getProduct_num() - tPurchaseProduct.getActual_received())
                                    + " where id=" + tPurchaseProduct.getProduct_id());
                    // 记录入库历史 以后考虑是一个仓库的库存
                    TStockProduct obj = new TStockProduct();
                    obj.setProduct_id(tPurchaseProduct.getProduct_id());
                    obj.setProduct_code(tPurchaseProduct.getProduct_code());
                    obj.setProduct_name(tPurchaseProduct.getProduct_name());
                    obj.setProduct_num(tPurchaseProduct.getProduct_num() - tPurchaseProduct.getActual_received());
                    obj.setProduct_price(tPurchaseProduct.getProduct_price());
                    obj.setProvider_id(tPurchaseProduct.getProvider_id());
                    obj.setProvider_name(tPurchaseProduct.getProvider_name());
                    obj.setStock_id(0);
                    obj.setStock_time(time);
                    Webservice.insert(obj);
                    amount += tPurchaseProduct.getProduct_price()
                            * (tPurchaseProduct.getProduct_num() - tPurchaseProduct.getActual_received());
                }
            }
            Webservice.execute(TPurchaseProduct.class,
                    "update TPurchaseProduct set if_stock=1,actual_received=product_num,actual_received_amount=actual_received_amount+"
                            + amount + " where purchase_id=" + id);
            Webservice.execute(TPurchase.class, "update TPurchase set if_stock=1 where id=" + id);
            response.getWriter().println(JsonUtil.getSuccessJson());
        } catch (Exception e) {
            response.getWriter().println(JsonUtil.getFailJson("收货失败，请稍候重试"));
            log.error("异常", e);
        }
        return null;
    }

    /**
     * 收获
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward checkPurchase(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        try {
            TPurchaseForm sf = (TPurchaseForm) form;
            HttpSession session = request.getSession(false);
            String user = session.getAttribute("user_name").toString();
            JSONArray jsonArray = JSONArray.fromObject(sf.getPurchaseProducts());
            Collection<TPurchaseProductVo> collection = JSONArray.toCollection(jsonArray, TPurchaseProductVo.class);
            if (collection == null || collection.size() <= 0) {
                response.getWriter().println(JsonUtil.getFailJson("请选择产品"));
                return null;
            }
            float amount = 0;
            // 循环产品列表，支持一个也支持多个
            for (TPurchaseProductVo tPurchaseProduct : collection) {
                if (tPurchaseProduct.getReceive_num() <= 0 || tPurchaseProduct.getIf_stock() == 1) {
                    continue;
                }
                // 个数对了，设置状态为已收获
                if (tPurchaseProduct.getActual_received() + tPurchaseProduct.getReceive_num() >= tPurchaseProduct.getProduct_num()) {
                    tPurchaseProduct.setReceive_num(tPurchaseProduct.getProduct_num() - tPurchaseProduct.getActual_received());
                    Webservice.execute(TPurchaseProduct.class,
                            "update TPurchaseProduct set if_stock=1 where id=" + tPurchaseProduct.getId());
                }
                Webservice.execute(TPurchaseProduct.class,
                        "update TPurchaseProduct set actual_received=actual_received+" + tPurchaseProduct.getReceive_num() + ",receiver='"
                                + user + "',remark='" + "" + "' where id=" + tPurchaseProduct.getId());
                Webservice.execute(TProduct.class, "update TProduct set num=num+" + tPurchaseProduct.getReceive_num() + " where id="
                        + tPurchaseProduct.getProduct_id());
                // 实际收到的货物大于0 ，放到进货明细中
                if (tPurchaseProduct.getReceive_num() > 0) {
                    TStockProduct obj = new TStockProduct();
                    obj.setProduct_id(tPurchaseProduct.getProduct_id());
                    obj.setProduct_code(tPurchaseProduct.getProduct_code());
                    obj.setProduct_name(tPurchaseProduct.getProduct_name());
                    obj.setProduct_num(tPurchaseProduct.getReceive_num());
                    obj.setProduct_price(tPurchaseProduct.getProduct_price());
                    obj.setProvider_id(tPurchaseProduct.getProvider_id());
                    obj.setProvider_name(tPurchaseProduct.getProvider_name());
                    obj.setStock_id(0);
                    obj.setStock_time(CTime.getTime("yyyy-MM-dd HH:mm:ss"));
                    Webservice.insert(obj);
                    amount += tPurchaseProduct.getProduct_price() * tPurchaseProduct.getReceive_num();
                }
            }
            // 判断是否全部收货了
            List<TPurchaseProduct> list = Webservice.listAll(TPurchaseProduct.class, " where if_stock=0 and purchase_id=" + sf.getId(), "");
            if (list == null || list.size() == 0) {
                Webservice.execute(TPurchase.class, "update TPurchase set if_stock=1 where id=" + sf.getId());
            }
            Webservice.execute(TPurchase.class, "update TPurchase set actual_received_amount=actual_received_amount+" + amount
                    + " where id=" + sf.getId());
            response.getWriter().println(JsonUtil.getSuccessJson());
        } catch (Exception e) {
            response.getWriter().println(JsonUtil.getFailJson("收货失败，请稍候重试"));
            log.error("异常", e);
        }
        return null;
    }

    public ActionForward provider_po_list(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        String provider_id = request.getParameter("provider_id");
        String condition = " where 1=1 ";
        condition += " and provider_id=" + provider_id;
        condition += " order by id desc ";
        // new Integer(1).intValue()
        super.superListPage(mapping, form, request, response, condition, "");
        return mapping.findForward("provider_po_list");
    }

    public ActionForward delete(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        try {
            TPurchaseForm tf = (TPurchaseForm) form;
            long id = tf.getId();
            deletePurchase(id);
            response.getWriter().println(JsonUtil.getSuccessJson());
        } catch (Exception e) {
            response.getWriter().println(JsonUtil.getFailJson("删除失败，请稍候重试"));
            log.error("异常", e);
        }
        return null;
    }

    private void deletePurchase(long id) throws Exception {
        Webservice.execute(TPurchaseProduct.class, "delete from TPurchaseProduct  where purchase_id = '" + id + "'");
        TPurchase sale = (TPurchase) Webservice.get(TPurchase.class, id);
        if (sale != null) {
            Webservice.execute(TProvider.class, "update TProvider set balance=balance-" + sale.getAll_purchase_price() + " where id="
                    + sale.getProvider_id());
        }
        Webservice.delete(TPurchase.class, id);
    }

    public ActionForward po(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        HttpSession session = request.getSession(false);
        String user = session.getAttribute("user_code").toString();
        session.setAttribute("purchase", null);
        session.setAttribute("purchase_product_list", null);

        Long user_id = (Long) session.getAttribute("user_id");
        TPurchase sale = new TPurchase();
        sale.setAll_purchase_price(0);
        sale.setOper_id(user_id.intValue());
        sale.setOper_name(user);
        sale.setOper_time(CTime.getTime("yyyy-MM-dd HH:mm:ss"));
        sale.setCash_time("1900-1-1");
        long max = Webservice.getSeqNextValue("seq_purchase_id");
        sale.setPurchase_bill_code(CodeNumberGen.gen(5, "0", max + 168));
        session.setAttribute("purchase", sale);
        List product_type_list = Webservice.listAll(TProductType.class, "", "");
        request.setAttribute("product_type_list", product_type_list);

        String id = request.getParameter("search_product_id");
        if (!StringUtils.isEmpty(id)) {
            TProduct tp = (TProduct) Webservice.get(TProduct.class, id);
            request.setAttribute("search_product_id", tp.getProduct_id());
            request.setAttribute("search_product_price", tp.getPrice_income());
        }
        return mapping.findForward("get");
    }

    public ActionForward po_canbinet(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        po(mapping, form, request, response);
        return mapping.findForward("po_canbinet");
    }

    public ActionForward stock_print(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        HttpSession session = request.getSession(false);
        String user = session.getAttribute("user_code").toString();

        return mapping.findForward("purchase_print");
    }

    public ActionForward print_bill(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        long id = ProductUtil.parseValue(request.getParameter("id"), -1);
        TPurchase purchase = null;
        if (id > -1) {
            purchase = (TPurchase) Webservice.get(TPurchase.class, id);
        }
        if (purchase == null) {
            ActionErrors errors = new ActionErrors();
            Validation.addUserErrorInfo("no such purchase bill!", errors, request);
            return mapping.findForward("info");
        } else {
            int total_items = 0;
            List list = Webservice.listAll(TPurchaseProduct.class, " where purchase_id=" + id, "");
            if (list != null && list.size() > 0) {
                for (int i = 0; i < list.size(); i++) {
                    TPurchaseProduct sp = (TPurchaseProduct) list.get(i);
                    total_items += sp.getProduct_num();
                }
            }
            HttpSession session = request.getSession(false);
            session.setAttribute("total_items", total_items);
            session.setAttribute("purchase", purchase);
            session.setAttribute("purchase_product_list", list);
            return mapping.findForward("purchase_pdf_print");
        }
    }

    public ActionForward show_pdf(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        try {
            HttpSession session = request.getSession(false);
            String user = session.getAttribute("user_code").toString();
            List sale_product_list = (List) session.getAttribute("purchase_product_list");
            TPurchase sale = (TPurchase) session.getAttribute("purchase");

            TProvider provider = (TProvider) Webservice.get(TProvider.class, new Long(sale.getProvider_id()));
            String path = request.getRealPath("");
            JasperCompileManager.compileReportToFile(path + "/report/article.jrxml");

            InputStream reportFile = new FileInputStream(new File(path + "/report/article.jasper"));

            Map<String, Object> parameters = new HashMap<String, Object>();
            parameters.put("company_name", sale.getCompany_name());
            parameters.put("company_address", sale.getCompany_address());
            parameters.put("company_tel", sale.getCompany_tel());
            parameters.put("company_fax", sale.getCompany_fax());
            String logo = "http://" + request.getLocalAddr() + ":" + request.getLocalPort() + request.getContextPath()
                  + sale.getCompany_logo_pic_logo();
            parameters.put("logo_url", logo);
            String company_name_pic_logo = "http://" + request.getLocalAddr() + ":" + request.getLocalPort() + request.getContextPath()
                    + sale.getCompany_name_pic_logo();
            parameters.put("company_name_pic_url", company_name_pic_logo);
            parameters.put("image_url", logo);
            if(provider!=null){
            	parameters.put("vendor",
            			provider.getShortName() + "\r\n" + provider.getAddress() + "\r\n" + provider.getCity() + "   " + provider.getState()
            			+ "   " + provider.getPostCode() + "\r\n" + "Tel:" + provider.getMobile() + "    Fax:" + provider.getFAX()
            			+ "\r\n");
            }
            // +"Vendor:"+provider.getLinkMan()+"\r\n"
            // +"Mobile:"+provider.getMobile()+"\r\n");
            parameters.put("subtotal",
                    String.valueOf(new Double(ObjectFormat.formatCurrency(sale.getAll_purchase_price(), "##0.00")).floatValue()));
            parameters.put("tax", "0");
            parameters.put("total",
                    String.valueOf(new Double(ObjectFormat.formatCurrency(sale.getAll_purchase_price(), "##0.00")).floatValue()));
            parameters.put("deposite", "0");
            parameters.put("balance", String.valueOf(new Double(ObjectFormat.formatCurrency(
                    sale.getAll_purchase_price() - sale.getAll_paid_price(), "##0.00")).floatValue()));
            parameters.put("total_items", session.getAttribute("total_items").toString());
            parameters.put("po_number", sale.getPo_number());
            parameters.put("date", "");
            parameters.put("proofread", "");

            // JRBeanCollectionDataSource ds = new
            // JRBeanCollectionDataSource(l);
            // JasperPrint jasperPrint =
            // JasperFillManager.fillReport(
            // reportFile,
            // parameters,
            // ds
            // );

            // pdf输出
            JRBeanCollectionDataSource ds = new JRBeanCollectionDataSource(sale_product_list);
            byte[] bytes = JasperRunManager.runReportToPdf(reportFile, parameters, ds);
            response.setContentType("application/pdf");
            response.setCharacterEncoding("UTF-8");
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

    @SuppressWarnings("unchecked")
    public ActionForward stock_submit_old(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        try {
            TPurchaseForm sf = (TPurchaseForm) form;
            HttpSession session = request.getSession(false);
            String user = session.getAttribute("user_name").toString();
            Long user_id = (Long) session.getAttribute("user_id");

            // 没有购买任何商品就提交
            JSONArray fromObject = JSONArray.fromObject(sf.getPurchaseProducts());
            Collection<TProductVo> collection = JSONArray.toCollection(fromObject, TProductVo.class);
            if (StringUtils.isBlank(sf.getPurchaseProducts()) || collection == null || collection.size() == 0) {
                response.getWriter().println(JsonUtil.getFailJson("请选择产品"));
                return null;
            }

            // 编辑订单
            long oldPrivadeId = 0;
            String oldPo_number = "";
            String oldPurchase_bill_code = "";

            if (sf.getId() > 0 && (TPurchase) Webservice.get(TPurchase.class, sf.getId()) != null) {
                TPurchase tPurchase = Webservice.get(TPurchase.class, sf.getId());
                oldPrivadeId = tPurchase.getProvider_id();
                oldPo_number = tPurchase.getPo_number();
                oldPurchase_bill_code = tPurchase.getPurchase_bill_code();
                deletePurchase(oldPrivadeId);
            }

            Map<Long, Collection<TProductVo>> map = new HashMap<Long, Collection<TProductVo>>();
            for (TProductVo tProductVo : collection) {
                Long key = Long.valueOf(tProductVo.getProvider_id());
                Collection<TProductVo> collection2 = map.get(key);
                if (collection2 == null) {
                    collection2 = new ArrayList<TProductVo>();
                    map.put(key, collection2);
                }
                collection2.add(tProductVo);
            }

            Set<Long> providerids = map.keySet();
            List<Long> ids = new ArrayList<Long>();
            for (Long provider_id : providerids) {
                TPurchase sale = new TPurchase();
                BeanUtils.copyProperties(sale, sf);
                sale.setProvider_id(provider_id.intValue());

                if (provider_id != oldPrivadeId) {
                    Date currentTime = new Date();
                    SimpleDateFormat dateformatter = new SimpleDateFormat("yyMMdd");
                    String dateString = dateformatter.format(currentTime);
                    String begin_time = new SimpleDateFormat("yyyy-MM-dd").format(currentTime);
                    String end_time = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(currentTime);
                    String today_count = " where oper_time between '" + begin_time + "' and '" + end_time + "'";
                    String po_number = dateString
                            + Tools.addZero(new Long(Webservice.getRowCount(TPurchase.class, today_count)).toString(), 3, Tools.ALIGN_RIGHT);
                    sale.setPo_number(po_number);

                    long max = Webservice.getSeqNextValue("seq_purchase_id");
                    sale.setPurchase_bill_code(CodeNumberGen.gen(5, "0", max + 168));
                } else {
                    sale.setPo_number(oldPo_number);
                    sale.setPurchase_bill_code(oldPurchase_bill_code);
                }
                Long id = saveTPurchase(sale, user, user_id, map.get(provider_id));
                if (id != null) {
                    ids.add(id);
                }
            }
            JSONObject successJson = JsonUtil.getSuccessJson();
            successJson.put("purchase_id", ids);
            response.getWriter().println(successJson.toJSONString());
            return null;
        } catch (Exception e) {
            response.getWriter().println(JsonUtil.getFailJson("保存失败，请稍候重试"));
            log.error("保存失败", e);
            return null;
        }
    }

    /**
     * 为一个供应商添加订单
     *
     * @param sale
     * @param user
     * @param user_id
     * @param collection
     * @return
     * @throws Exception
     * @throws IOException
     * @throws IllegalAccessException
     * @throws InvocationTargetException
     */
    private Long saveTPurchase(TPurchase sale, String user, Long user_id, Collection<TProductVo> collection) throws Exception, IOException,
            IllegalAccessException, InvocationTargetException {
        List list = Webservice.listAll(TProvider.class, " where id=" + sale.getProvider_id(), "");
        if (list == null || list.size() <= 0) {
            return null;
        }
        long total = 0;
        for (TProductVo tProductVo : collection) {
            total += tProductVo.getNum() * tProductVo.getPrice_income();
        }
        TProvider provider = (TProvider) list.get(0);
        sale.setAll_purchase_price(total);
        sale.setProvider_name(provider.getShortName());
        sale.setOper_id(user_id.intValue());
        sale.setOper_name(user);
        sale.setOper_time(CTime.getTime("yyyy-MM-dd HH:mm:ss"));
        sale.setCash_time("1900-1-1");

        sale.setProvider_id((int) provider.getId());
        sale.setProvider_name(provider.getShortName());
        if(sale.getId() == 0){
        	sale.setCompany_address(Constants.company_address);
            sale.setCompany_fax(Constants.company_fax);
            sale.setCompany_logo_pic_logo(Constants.company_logo_pic_logo);
            sale.setCompany_name(Constants.company_name);
            sale.setCompany_tel(Constants.company_tel);
            sale.setCompany_name_pic_logo(Constants.company_name_pic_logo);
            sale.setInvoiceTax(Constants.invoiceTax);
        }
        
        
        sale.setIf_cashed(0);
        sale.setPaid(0);
        sale.setIf_stock(0);
        sale.setAll_paid_price(0.0f);

        Long id = new Long(Webservice.insert(sale));

        for (TProductVo tProductVo : collection) {
            TPurchaseProduct sp = new TPurchaseProduct();
            sp.setId(0);
            sp.setProduct_code(tProductVo.getCode());
            sp.setProduct_id(tProductVo.getId());
            sp.setProduct_name(tProductVo.getProduct_name());
            sp.setProduct_num(tProductVo.getNum());
            sp.setProduct_price(tProductVo.getPrice_income());
            sp.setPurchase_id(id.intValue());
            sp.setPurchase_time(sale.getOper_time());
            sp.setRemark("");
            Webservice.insert(sp);
            if (sp.getProduct_price() != 0) {
                Webservice.execute(TProduct_vendor.class, "update TProduct_vendor set price=" + sp.getProduct_price()
                        + " where product_id=" + sp.getProduct_id() + " and vendor_id=" + sale.getProvider_id());
            }
        }
        Webservice.execute(TProvider.class, "update TProvider set balance=balance+" + sale.getAll_purchase_price() + " where id="
                + provider.getId());
        return id;
    }

    public ActionForward stock_submit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        ActionErrors errors = new ActionErrors();
        TPurchaseForm sf = (TPurchaseForm) form;
        HttpSession session = request.getSession(false);
        List list = Webservice.listAll(TProvider.class, " where id=" + sf.getProvider_id(), "");
        if (list == null || list.size() < 0) {
            Validation.addUserErrorInfo("no such provider!", errors, request);
            return mapping.findForward("info");
        }
        TProvider provider = (TProvider) list.get(0);
        FormFile file = sf.getOrder_pic_file();// 取得上传的文件
        String path = "/upfiles/";
        String filename = uploadPicture(file, path, sf.getOrder_pic(), request, errors);
        if (filename == null) {
            return mapping.findForward("save");
        }
        if (filename.length() > 0)
            sf.setOrder_pic(path + filename);

        FormFile file2 = sf.getInvoice_pic_file();// 取得上传的文件
        String filename2 = uploadPicture(file2, path, sf.getInvoice_pic(), request, errors);
        if (filename2 == null) {
            return mapping.findForward("save");
        }
        if (filename2.length() > 0)
            sf.setInvoice_pic(path + filename2);

        TPurchase sale = (TPurchase) session.getAttribute("purchase");
        sale.setOrder_pic(sf.getOrder_pic());
        sale.setInvoice_pic(sf.getInvoice_pic());
        sale.setInvoice_code(sf.getInvoice_code());
        sale.setProvider_id((int) provider.getId());
        sale.setProvider_name(provider.getShortName());
        sale.setAll_purchase_price(sf.getAll_purchase_price());
        sale.setAll_paid_price(0.0f);
        sale.setIf_cashed(0);
        if (sale.getAll_purchase_price() < 0.00001)
            sale.setIf_cashed(1);
        sale.setPurchase_bill_code(sf.getPurchase_bill_code());
        sale.setRemark(sf.getRemark());
        Date currentTime = new Date();
        SimpleDateFormat dateformatter = new SimpleDateFormat("yyMMdd");
        String dateString = dateformatter.format(currentTime);
        String begin_time = new SimpleDateFormat("yyyy-MM-dd").format(currentTime);
        String end_time = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(currentTime);
        String today_count = " where oper_time between '" + begin_time + "' and '" + end_time + "'";
        String po_number = dateString
                + Tools.addZero(new Long(Webservice.getRowCount(TPurchase.class, today_count)).toString(), 3, Tools.ALIGN_RIGHT);
        sale.setPo_number(po_number);
        Long id = new Long(Webservice.insert(sale));
        if (sale.getIf_cashed() != 1)
            Webservice.execute(TProvider.class, "update TProvider set balance=balance+" + sale.getAll_purchase_price() + " where id="
                    + provider.getId());
        Validation.addUserErrorInfo("purchase success!", errors, request);

        return mapping.findForward("info");
    }

    public ActionForward invoice(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        ActionErrors errors = new ActionErrors();
        TPurchaseForm sf = (TPurchaseForm) form;
        FormFile file = sf.getInvoice_pic_file();// 取得上传的文件
        String path = "/upfiles/";
        String filename = uploadPicture(file, path, sf.getInvoice_pic(), request, errors);
        PrintWriter out = response.getWriter();
        if (filename == null) {
            String scrp = "<script language='javascript'>";
            scrp += "alert('upload file error');";
            scrp += "</script>";
            out.println(scrp);
        }
        if (filename.length() > 0)
            sf.setInvoice_pic(path + filename);

        Webservice.execute(
                TPurchase.class,
                "update TPurchase set invoice_code='" + sf.getInvoice_code() + "',invoice_pic='" + sf.getInvoice_pic() + "' where id="
                        + sf.getId());
        String scrp = "<script language='javascript'>";
        scrp += "alert('invoice upload success!');window.close();";
        scrp += "</script>";
        out.println(scrp);
        return null;
    }
}
