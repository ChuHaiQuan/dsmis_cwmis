package com.poweronce.action;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.json.simple.JSONObject;
import org.krysalis.barcode4j.impl.code39.Code39Bean;
import org.krysalis.barcode4j.output.bitmap.BitmapCanvasProvider;
import org.krysalis.barcode4j.tools.UnitConv;

import com.poweronce.entity.TBuyer;
import com.poweronce.entity.TBuyer.TBuyerStatistics;
import com.poweronce.entity.TCreditWarning;
import com.poweronce.entity.TDamageReport;
import com.poweronce.entity.TEmployee;
import com.poweronce.entity.TProduct;
import com.poweronce.entity.TProduct.TProdouctVo2;
import com.poweronce.entity.TSale;
import com.poweronce.entity.TSaleHistory;
import com.poweronce.entity.TSaleProduct;
import com.poweronce.entity.TSaleTop;
import com.poweronce.form.TSaleForm;
import com.poweronce.form.TSaleProductForm;
import com.poweronce.model.CodeNumberGen;
import com.poweronce.service.Webservice;
import com.poweronce.util.CTime;
import com.poweronce.util.Constants;
import com.poweronce.util.ExtUtil;
import com.poweronce.util.JsonUtil;
import com.poweronce.util.ObjectFormat;
import com.poweronce.util.Tools;

public class TSaleAction extends BaseDispatchAction {
    private final static int PO_NUMBER_START = 101;

    public ActionForward list(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        String condition = " where 1=1 ";
        String paymentStatus = request.getParameter("payment_status");
        String rmaStatus = request.getParameter("rma_status");
        TSaleForm tf = (TSaleForm) form;
        if (tf.getOper_id() != 0)
            condition += " and oper_id=" + tf.getOper_id();
        if (StringUtils.isNotBlank(tf.getSale_bill_code()))
            condition += " and sale_bill_code='" + tf.getSale_bill_code() + "'";
        if (StringUtils.isNotBlank(tf.getOper_time_start()))
            condition += " and oper_time >= '" + tf.getOper_time_start() + "'";
        if (StringUtils.isNotBlank(tf.getOper_time_end())) {
            condition += " and oper_time <= '" + tf.getOper_time_end() + "'";
        }
        if (StringUtils.isNotBlank(tf.getInvoicecode())) {
            condition += " and invoice = '" + tf.getInvoicecode() + "'";
        }
        if (StringUtils.isNotBlank(tf.getBuyer_mobile())) {
            condition += " and buyer_mobile like '%" + tf.getBuyer_mobile() + "%'";
        }
        if (StringUtils.isNotBlank(tf.getBuyer_name())) {
            condition += " and buyer_name like '%" + tf.getBuyer_name() + "%'";
        }
        if (StringUtils.isNotBlank(tf.getBuyer_address())) {
            condition += " and buyer_address like '%" + tf.getBuyer_address() + "%'";
        }
        if (tf.getBuyer_id() != 0) {
            condition += " and buyer_id =" + tf.getBuyer_id();
        }
        if (tf.getIf_cashed() != -1) {
            condition += " and If_cashed = " + tf.getIf_cashed();
        }
        
        if(StringUtils.isNotEmpty(tf.getOper_name())){
        	condition += " and oper_name = '" + tf.getOper_name()+"'";
        }
        condition += " and type = " + tf.getType();
        
        if(StringUtils.isNotEmpty(tf.getProduct_name())){
        	condition+=" and id IN (SELECT sale_id FROM tsaleproduct WHERE product_name LIKE '%"+tf.getProduct_name()+"%')";
        }
        
        if(StringUtils.isNotEmpty(paymentStatus)){
        	
        	switch (paymentStatus) {
			case "0":
				condition += " and If_cashed = 1";
				break;
			case "1":
				condition += " and paid_price = 0";
			case "2":
				condition += " and paid_price>0 and paid_price<all_price" ;				
				break;
			default:
				break;
			}
        }
        
        if(StringUtils.isNotEmpty(rmaStatus)){
        	switch (rmaStatus) {
			case "0":
				condition += " and rma_status=1";
				break;
			case "1":
				condition += " and rma_status=2";
			default:
				break;
			}
        }
        condition += " order by id desc limit 5000";
       // request.setAttribute("maxCount", 5000);
        return super.superListPage(mapping, form, request, response, condition, "");
    }

    public ActionForward listSaleCash(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {

        TSaleForm tf = (TSaleForm) form;
        if (tf.getId() > 0) {
            String condition = " where sale_id= " + tf.getId();
            List<TSaleHistory> list = Webservice.listAll(TSaleHistory.class, condition, " order by cash_time asc");
            response.getWriter().println(ExtUtil.genExtListString(list, list != null ? list.size() : 0));
            return null;
        }
        response.getWriter().println(JsonUtil.getSuccessJson());
        return null;
    }

    // 根据id 删除一条记录
    public ActionForward del(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        try {
            TSaleForm tf = (TSaleForm) form;
            TSale sale = (TSale) Webservice.get(TSale.class, tf.getId());
            deleteSale(sale);
            response.getWriter().println(JsonUtil.getSuccessJson());
        } catch (Exception e) {
            response.getWriter().println(JsonUtil.getFailJson("删除失败，请稍候重试"));
            log.error("异常", e);
        }
        return null;
    }
    
    
    /**
     * 报废
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward doReject(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        try {
            TSaleForm tf = (TSaleForm) form;
            TSale sale = (TSale) Webservice.get(TSale.class, tf.getId());
            sale.setIf_cashed(3);
            Webservice.update(sale, sale.getId());
            
            response.getWriter().println(JsonUtil.getSuccessJson());
        } catch (Exception e) {
            response.getWriter().println(JsonUtil.getFailJson("报废失败，请稍候重试"));
            log.error("异常", e);
        }
        return null;
    }

    private void deleteSale(TSale sale) throws Exception {
        String condition = " where 1=1";
        condition += " and sale_id = '" + sale.getId() + "'";
        if (sale.getIf_cashed() == 1) {
            List<TSaleProduct> list = Webservice.listAll(TSaleProduct.class, condition, "");
            if (list != null && list.size() > 0) {
                for (TSaleProduct saleProduct : list) {
                    Webservice.execute(TProduct.class, "update TProduct set num=num+" + saleProduct.getProduct_num() + " where id="
                            + saleProduct.getProduct_id());
                }
            }
        }
        // 订单有价格修改
        if (sale.getType() == 0) {
            // String sql = "update TBuyer set balance=balance+" + (sale.getAll_price() - sale.getPaid_price()) + " where id="
            // + sale.getBuyer_id();
            // Webservice.execute(TBuyer.class, sql);
            this.resetBuyerPrice(sale.getBuyer_id());
        }
        Webservice.execute(TProduct.class, "delete from TSaleProduct " + condition);
        Webservice.delete(TSale.class, sale.getId());
    }

    // 生成单据号
    private String getSale_bill_code(HttpServletRequest request) throws Exception {
        // String path = request.getRealPath("")+"/ids/sale_id.gen";
        long max = Webservice.getSeqNextValue("seq_sale_id");// IdGen.getId(path);
        return CodeNumberGen.gen(5, "0", max + 168);
    }

    public ActionForward sale_print(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        HttpSession session = request.getSession(false);
        String user = session.getAttribute("user_code").toString();

        return mapping.findForward("sale");
    }

    // 重新打印票据
    public ActionForward re_print(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        HttpSession session = request.getSession(false);
        String sale_id = request.getParameter("id");
        String per = request.getParameter("per");
        TSale sale = (TSale) Webservice.get(TSale.class, new Long(sale_id));
        List sale_product_list = Webservice.listAll(TSaleProduct.class, " where sale_id=" + sale_id, "");
        session.setAttribute("sale", sale);
        session.setAttribute("sale_product_list", sale_product_list);
        return mapping.findForward("print");
    }

    // 重新打印票据
    public ActionForward packing_print(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        HttpSession session = request.getSession(false);
        String sale_id = request.getParameter("id");
        String per = request.getParameter("per");
        String notNeedPaid = request.getParameter("notNeedPaid");
        TSale sale = (TSale) Webservice.get(TSale.class, new Long(sale_id));
        List sale_product_list = Webservice.listAll(TSaleProduct.class, " where sale_id=" + sale_id, "");
        session.setAttribute("sale", sale);
        session.setAttribute("sale_product_list", sale_product_list);
//        if (sale.getIf_cashed() == 0 && StringUtils.isEmpty(notNeedPaid)) {
//            response.sendRedirect("/");
//            return null;
//        }
        return mapping.findForward("packing_print");
    }

    // 重新打印票据
    public ActionForward rma_print(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        HttpSession session = request.getSession(false);
        String sale_id = request.getParameter("id");
        TSale sale = (TSale) Webservice.get(TSale.class, new Long(sale_id));
        List<TSaleProduct> sale_product_list = Webservice.listAll(TSaleProduct.class, " where sale_id=" + sale_id, "");
        session.setAttribute("sale", sale);
        session.setAttribute("sale_product_list", sale_product_list);
        return mapping.findForward("rma_print");
    }

    public ActionForward show_packing_pdf(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        try {
            HttpSession session = request.getSession(false);
            List<TSaleProduct> sale_product_list = (List<TSaleProduct>) session.getAttribute("sale_product_list");
            
            if(sale_product_list!=null && sale_product_list.size()>0){
            	for(TSaleProduct t : sale_product_list){
            		TProduct p = Webservice.get(TProduct.class, t.getProduct_id());
            		if(p!=null){
            			t.setUnit_qty(p.getProduct_name_cn());
            			t.setTracking_id(p.getTracking_id());
            		}else{
            			t.setUnit_qty("");
            			t.setTracking_id("");
            		}
            	}
            }
            TSale sale = (TSale) session.getAttribute("sale");
            DateFormat format = new SimpleDateFormat("yyyy-MM-dd");
            String path = request.getRealPath("");
            JasperCompileManager.compileReportToFile(path + "/report/packing.jrxml");

            InputStream reportFile = new FileInputStream(new File(path + "/report/packing.jasper"));

            Map<String, Object> parameters = new HashMap<String, Object>();
            
            parameters.put("company_name", sale.getCompany_name());
            parameters.put("send_type", sale.getSend_type());
            parameters.put("company_address", sale.getCompany_address());
            parameters.put("company_tel", sale.getCompany_tel());
            parameters.put("company_fax", sale.getCompany_fax());
            parameters.put("remark", sale.getRemark());
            parameters.put("buyer_address", sale.getBuyer_address());
            parameters.put("buyer_city", sale.getBuyer_city());
            parameters.put("buyer_mobile", sale.getBuyer_mobile());
            parameters.put("buyer_name", sale.getBuyer_name());
            parameters.put("oper_time", format.format(format.parse(sale.getOper_time())));
            parameters.put("oper_name", sale.getOper_name());
            parameters.put("buyer_postCode", sale.getBuyer_postCode());
            parameters.put("buyer_state", sale.getBuyer_state());
            String logo = "http://" + request.getLocalAddr() + ":" + request.getLocalPort() + request.getContextPath()
                    + sale.getCompany_logo_pic_logo();
            parameters.put("receive_barcode", sale.getInvoice());
            parameters.put("logo_url", logo);
            parameters.put("image_url", logo);
            String company_name_pic_logo = "http://" + request.getLocalAddr() + ":" + request.getLocalPort() + request.getContextPath()
                    + "/images/company_name.gif";
            parameters.put("company_name_pic_url", company_name_pic_logo);

            parameters.put("vendor", "DATE:" + sale.getOper_time() + "\r\n\r\n" + "SALE:" + sale.getOper_code() + "\r\n\r\n" + "INVOICE #:"
                    + sale.getSale_bill_code());
            parameters.put("invoice", sale.getInvoice());
            parameters.put("sale_number", sale.getSale_bill_code());

            parameters
                    .put("subtotal", String.valueOf(new Double(ObjectFormat.formatCurrency(sale.getSub_total(), "##0.00")).doubleValue()));
            parameters.put("tax", String.valueOf(new Double(ObjectFormat.formatCurrency(sale.getTax(), "##0.00")).doubleValue()));
            parameters.put("total",
                    String.valueOf(new Double(ObjectFormat.formatCurrency(sale.getSub_total() + sale.getTax(), "##0.00")).doubleValue()));
            parameters.put("deposite", String.valueOf(new Double(ObjectFormat.formatCurrency(sale.getDiscount(), "##0.00")).doubleValue()));
            parameters.put("balance", String.valueOf(new Double(ObjectFormat.formatCurrency(sale.getAll_price() - sale.getPaid_price(),
                    "##0.00")).doubleValue()));

            // pdf输出
            JRBeanCollectionDataSource ds = new JRBeanCollectionDataSource(sale_product_list);
            byte[] bytes = JasperRunManager.runReportToPdf(reportFile, parameters,ds);
            response.setContentType("application/pdf");
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
    
    /**
     * 报价单转换成销售
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws IOException 
     */
    @SuppressWarnings("unchecked")
	public ActionForward packeTransferToInvoiceOrder(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws IOException{
    	Integer id = Integer.parseInt(request.getParameter("id"));
    	try {
    		Date currentTime = new Date();
            String begin_time = new SimpleDateFormat("yyyy-MM-dd").format(currentTime);
            String end_time = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(currentTime);
			TSale tSale = Webservice.get(TSale.class, id);
			TSale sale = new TSale();
			BeanUtils.copyProperties(sale, tSale);
			sale.setType(0);
			sale.setOper_time(end_time);
			String today_count = " where type=0 and oper_time between '" + begin_time + "' and '" + end_time + "'";
            String po_number = new SimpleDateFormat("yyMMdd").format(currentTime)
                    + Tools.addZero(new Long(Webservice.getRowCount(TSale.class, today_count) + PO_NUMBER_START).toString(), 3,
                    Tools.ALIGN_RIGHT);
            String sale_bill_code = getSale_bill_code(request);
            sale.setInvoice(po_number);
            sale.setSale_bill_code(sale_bill_code);
			Long newId = new Long(Webservice.insert(sale));
			resetBuyerPrice(sale.getBuyer_id());
			List<TSaleProduct> list = Webservice.listAll(TSaleProduct.class, " where sale_id=" + tSale.getId(), "");
			
			for (TSaleProduct product:list) {
				TSaleProduct tSaleProduct = new TSaleProduct();
				BeanUtils.copyProperties(tSaleProduct, product);
				tSaleProduct.setSale_id((int)newId.longValue());
				Webservice.insert(tSaleProduct);
			}
				JSONObject successJson = JsonUtil.getSuccessJson();
	            successJson.put("invoice", sale.getInvoice());
	            response.getWriter().println(successJson.toJSONString());
	            return null;
	        } catch (Exception e) {
	            response.getWriter().println(JsonUtil.getFailJson("生成销售订单失败，请稍候重试"));
	            log.error("保存失败", e);
	            return null;
		}
    }

    // 普通用户购买
    @SuppressWarnings("unchecked")
    public ActionForward sale_submit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        try {
            // 用于打印的字符串
            TSaleForm sf = (TSaleForm) form;
            HttpSession session = request.getSession(false);
            Long user_id = (Long) session.getAttribute("user_id");
            String user_code = String.valueOf(session.getAttribute("user_code"));
            String user_name = String.valueOf(session.getAttribute("user_name"));
            sf.setOper_id(user_id.intValue());
            // 没有购买任何商品就提交
            JSONArray fromObject = JSONArray.fromObject(sf.getSaleProducts());
            Collection<TProdouctVo2> collection = JSONArray.toCollection(fromObject, TProdouctVo2.class);

            if (StringUtils.isBlank(sf.getSaleProducts()) || collection == null || collection.size() == 0) {
                response.getWriter().println(JsonUtil.getFailJson("请选择产品"));
                return null;
            }
            boolean hasDiscountProduct = false;
            for (TProdouctVo2 tProductVo : collection) {
                if (tProductVo.getAgio() > 0) {
                    hasDiscountProduct = true;
                    break;
                }
            }
            // 如果是订单优惠额是否正确
            if ((sf.getDiscount() > 0 || hasDiscountProduct) && sf.getType() == 0) {
                List<TEmployee> listAll = Webservice.listAll(TEmployee.class, " where mobile = '" + sf.getConfirm_code() + "'", "");
                if (listAll == null || listAll.size() <= 0) {
                    response.getWriter().println(JsonUtil.getFailJson("approver id/优惠确认人 填写不正确。"));
                    return null;
                }
            }
            TSale sale = new TSale();
            sf.setCash_time("1900-1-1");
            sf.setRma_time("1900-1-1");
            sf.setSend_time("1900-1-1");
            sf.setIf_cashed(0);
            BeanUtils.copyProperties(sale, sf);

            Date currentTime = new Date();
            SimpleDateFormat dateformatter = new SimpleDateFormat("yyMMdd");
            String dateString = dateformatter.format(currentTime);
            String begin_time = new SimpleDateFormat("yyyy-MM-dd").format(currentTime);
            String end_time = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(currentTime);

            String po_number = "";
            String sale_bill_code = "";

            if (sf.getId() > 0) {
                TSale tSale = Webservice.get(TSale.class, sf.getId());
                if (tSale != null) {
                    if (tSale.getType() == 0) {
                        po_number = tSale.getInvoice();
                        sale_bill_code = tSale.getSale_bill_code();
                        sale.setCash_oper_code(tSale.getCash_oper_code());
                        sale.setCash_oper_id(tSale.getCash_oper_id());
                        sale.setCash_oper_name(tSale.getCash_oper_name());
                        sale.setCash_time(tSale.getCash_time());
                        sale.setPaid_price(tSale.getPaid_price());
                        if (sale.getAll_price() - sale.getPaid_price() <= 0.001) {
                            sale.setPaid_price(sale.getAll_price());
                            sale.setIf_cashed(1);
                        }
                    } else {
                        if (sf.getType() == 0) {
                            // 报价单转成订单
                            String today_count = " where type=0 and oper_time between '" + begin_time + "' and '" + end_time + "'";
                            po_number = dateString
                                    + Tools.addZero(
                                    new Long(Webservice.getRowCount(TSale.class, today_count) + PO_NUMBER_START).toString(), 3,
                                    Tools.ALIGN_RIGHT);
                            sale_bill_code = getSale_bill_code(request);
                        } else {
                            // 报价单还是报价单
                            po_number = tSale.getInvoice();
                            sale_bill_code = tSale.getSale_bill_code();
                        }
                    }
                    sale.setCompany_address(tSale.getCompany_address());
                    sale.setCompany_fax(tSale.getCompany_fax());
                    sale.setCompany_logo_pic_logo(tSale.getCompany_logo_pic_logo());
                    sale.setCompany_name(tSale.getCompany_name());
                    sale.setCompany_tel(tSale.getCompany_tel());
                    sale.setCompany_name_pic_logo(tSale.getCompany_name_pic_logo());
                    sale.setInvoiceTax(tSale.getInvoiceTax());
                    deleteSale(tSale);
                }
            } else {
                if (sf.getType() == 0) {
                    // 新订单
                    String today_count = " where type=0 and oper_time between '" + begin_time + "' and '" + end_time + "'";
                    po_number = dateString
                            + Tools.addZero(new Long(Webservice.getRowCount(TSale.class, today_count) + PO_NUMBER_START).toString(), 3,
                            Tools.ALIGN_RIGHT);
                    sale_bill_code = getSale_bill_code(request);
                } else {
                    // 新报价单
                    String today_count = " where type=1 and oper_time between '" + begin_time + "' and '" + end_time + "'";
                    po_number = "E"
                            + dateString
                            + Tools.addZero(new Long(Webservice.getRowCount(TSale.class, today_count) + PO_NUMBER_START).toString(), 3,
                            Tools.ALIGN_RIGHT);
                    sale_bill_code = po_number;
                }
                sale.setCompany_address(Constants.company_address);
                sale.setCompany_fax(Constants.company_fax);
                sale.setCompany_logo_pic_logo(Constants.company_logo_pic_logo);
                sale.setCompany_name(Constants.company_name);
                sale.setCompany_tel(Constants.company_tel);
                sale.setCompany_name_pic_logo(Constants.company_name_pic_logo);
                sale.setInvoiceTax(Constants.invoiceTax);
            }
            sale.setInvoice(po_number);
            sale.setSale_bill_code(sale_bill_code);
            sale.setOper_id(user_id.intValue());
            sale.setOper_name(user_name);
            sale.setOper_code(user_code);
            sale.setOper_time(end_time);
            

            // 现金或信用卡支付,保存表单和购买产品的信息
            Long id = new Long(Webservice.insert(sale));
            List<JSONObject> list = new ArrayList<JSONObject>();
            for (TProdouctVo2 tProductVo : collection) {
                TSaleProduct sp = new TSaleProduct();
                TProduct tProduct = Webservice.get(TProduct.class, tProductVo.getId());
                if (tProduct != null) {
                    if (tProduct.getNum() - tProductVo.getNum() < tProduct.getDownLimit()) {
                        JSONObject jo = new JSONObject();
                        jo.put("product_name", tProduct.getProduct_name());
                        list.add(jo);
                    }
                }
                sp.setId(0);
                sp.setProduct_code(tProductVo.getCode());
                sp.setProduct_id(tProductVo.getId());
                sp.setProductid(tProductVo.getProduct_id());
                sp.setProduct_name(tProductVo.getProduct_name());
                sp.setProduct_num(tProductVo.getNum());
                sp.setRma_time("1900-1-1");
                sp.setProduct_price(tProductVo.getPrice_simgle());
                sp.setSale_id(id.intValue());
                sp.setBack_order_time("1900-1-1");
                sp.setAgio(tProductVo.getAgio());
                sp.setAgio_price(tProductVo.getAgio_price());
                sp.setSale_time(sale.getOper_time());
                Webservice.insert(sp);
                
                //如果小于零就是退货
                if(tProductVo.getNum()<0 && tProduct!=null && tProduct.getId()>0){
                    Webservice.execute(TProduct.class, "update TProduct set num=num+" + Math.abs(tProductVo.getNum()) + " where id="
                            + tProduct.getId());                	
                }
            }
            if (sf.getType() == 0 && sale.getBuyer_id() > 0) {
                // String sql = "update TBuyer set balance=balance-" + (sale.getAll_price() - sale.getPaid_price()) + " where id="
                // + sale.getBuyer_id();
                // Webservice.execute(TBuyer.class, sql);
            	
                this.resetBuyerPrice(sale.getBuyer_id());
            }
            JSONObject successJson = JsonUtil.getSuccessJson();
            successJson.put("saleId", id);
            org.json.simple.JSONArray array = new org.json.simple.JSONArray();
            array.addAll(list);
            successJson.put("listData", array);
            response.getWriter().println(successJson.toJSONString());
            return null;
        } catch (Exception e) {
            response.getWriter().println(JsonUtil.getFailJson("保存失败，请稍候重试"));
            log.error("保存失败", e);
            return null;
        }
    }

    public void get_barcode_img(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        String code = request.getParameter("code");
        try {
            Code39Bean bean = new Code39Bean();
            // final int dpi = 96;
            final int dpi = 60;
            bean.setModuleWidth(UnitConv.in2mm(1.0f / dpi));
            bean.setWideFactor(3);
            bean.doQuietZone(false);
            OutputStream out = response.getOutputStream();
            try {
                BitmapCanvasProvider canvas = new BitmapCanvasProvider(out, "image/x-png", dpi, BufferedImage.TYPE_BYTE_GRAY, false, 0);
                bean.generateBarcode(canvas, code);
                canvas.finish();
            } finally {
                out.close();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    public ActionForward show_pdf(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        try {
            HttpSession session = request.getSession(false);
            List sale_product_list = (List) session.getAttribute("sale_product_list");
            TSale sale = (TSale) session.getAttribute("sale");

            String path = request.getRealPath("");
            JasperCompileManager.compileReportToFile(path + "/report/sale.jrxml");
            InputStream reportFile = null;
            Map<String, Object> parameters = new HashMap<String, Object>();
            if (sale.getBuyer_id() > 0) {
                reportFile = new FileInputStream(new File(path + "/report/salecustomer.jasper"));
                TBuyer tBuyer = Webservice.get(TBuyer.class, sale.getBuyer_id());
                parameters.put("buyer_balance", String.valueOf(new Double(ObjectFormat.formatCurrency(
                        tBuyer.getBalance() - tBuyer.getLeav_money(), "##0.00")).doubleValue()));
            } else {
                reportFile = new FileInputStream(new File(path + "/report/sale.jasper"));
            }

            parameters.put("company_name", sale.getCompany_name());
            parameters.put("company_address", sale.getCompany_address());
            parameters.put("company_tel", sale.getCompany_tel());
            parameters.put("company_fax", sale.getCompany_fax());
            parameters.put("remark", sale.getRemark());
            String logo = "http://" + request.getLocalAddr() + ":" + request.getLocalPort() + request.getContextPath()
                    + sale.getCompany_logo_pic_logo();
            parameters.put("receive_barcode", sale.getInvoice());
            parameters.put("logo_url", logo);
            parameters.put("image_url", logo);
            String company_name_pic_logo = "http://" + request.getLocalAddr() + ":" + request.getLocalPort() + request.getContextPath()
                    + sale.getCompany_name_pic_logo();
            parameters.put("company_name_pic_url", company_name_pic_logo);

            parameters.put("vendor", "DATE:" + sale.getOper_time() + "\r\n\r\n"
                    // +"Post Code:"+provider.getPostCode()+"\r\n"
                    + "SALE:" + sale.getOper_code() + "\r\n\r\n" + "INVOICE #:" + sale.getSale_bill_code());
            // +"Vendor:"+provider.getLinkMan()+"\r\n"
            // +"Mobile:"+provider.getMobile()+"\r\n");
            
            DateFormat format=new SimpleDateFormat("yyyy-MM-dd");
            if(sale.getTax() == sale.getDiscount()){
            	sale.setSub_total(sale.getSub_total()+sale.getTax());
            	sale.setTax(0);
            	sale.setDiscount(0);
            }
            parameters.put("oper_time", format.format(format.parse(sale.getOper_time())));
            parameters.put("invoice", sale.getInvoice());
            parameters.put("sale_number", sale.getSale_bill_code());
            parameters.put("buyer_name", sale.getBuyer_name());
            parameters.put("buyer_postCode", sale.getBuyer_postCode());
            parameters.put("buyer_city", sale.getBuyer_city());
            parameters.put("buyer_state", sale.getBuyer_state());
            parameters.put("buyer_mobile", sale.getBuyer_mobile());
            parameters.put("buyer_address", sale.getBuyer_address());
            parameters.put("operator", sale.getOper_name());
            parameters.put("invoicename", sale.getType() == 0 ? "INVOICE" : "ESTIMATE");
            parameters
                    .put("subtotal", String.valueOf(new Double(ObjectFormat.formatCurrency(sale.getSub_total(), "##0.00")).doubleValue()));
            parameters.put("tax", String.valueOf(new Double(ObjectFormat.formatCurrency(sale.getTax(), "##0.00")).doubleValue()));
            parameters.put("total",
                    String.valueOf(new Double(ObjectFormat.formatCurrency(sale.getSub_total() + sale.getTax(), "##0.00")).doubleValue()));
            double deposit = new Double(ObjectFormat.formatCurrency(sale.getDiscount(), "##0.00")).doubleValue();
            parameters.put("deposite", String.valueOf(deposit==0?0:-deposit));
            parameters.put("balance", String.valueOf(new Double(ObjectFormat.formatCurrency(sale.getAll_price() - sale.getPaid_price(),
                    "##0.00")).doubleValue()));
            parameters.put("delivery_method", ("自取".equals(sale.getSend_type())?"pick up":"Delivery"));
            // pdf输出
            JRBeanCollectionDataSource ds = new JRBeanCollectionDataSource(sale_product_list);
            byte[] bytes = JasperRunManager.runReportToPdf(reportFile, parameters,ds);
            response.setContentType("application/pdf");
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

    public ActionForward show_pdf_rma(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        try {
            HttpSession session = request.getSession(false);
            String user = session.getAttribute("user_code").toString();
            List sale_product_list = (List) session.getAttribute("sale_product_list");
            TSale sale = (TSale) session.getAttribute("sale");

            String path = request.getRealPath("");
            JasperCompileManager.compileReportToFile(path + "/report/rma.jrxml");

            InputStream reportFile = new FileInputStream(new File(path + "/report/rma.jasper"));

            Map<String, Object> parameters = new HashMap<String, Object>();

            parameters.put("invoice", sale.getInvoice());
            parameters.put("sale_number", sale.getSale_bill_code());
            parameters.put("buyer_name", sale.getBuyer_name());
            parameters.put("buyer_postCode", sale.getBuyer_postCode());
            parameters.put("buyer_city", sale.getBuyer_city());
            parameters.put("buyer_mobile", sale.getBuyer_mobile());
            parameters.put("buyer_address", sale.getBuyer_address());
            parameters.put("buyer_state", sale.getBuyer_state());
            parameters.put("company_name", sale.getCompany_name());
            parameters.put("company_address", sale.getCompany_address());
            parameters.put("company_tel", sale.getCompany_tel());
            parameters.put("company_fax", sale.getCompany_fax());
            parameters.put("remark", sale.getRemark());
            String logo = "http://" + request.getLocalAddr() + ":" + request.getLocalPort() + request.getContextPath()
                    + sale.getCompany_logo_pic_logo();
            parameters.put("logo_url", logo);
            parameters.put("image_url", logo);
            String company_name_pic_logo = "http://" + request.getLocalAddr() + ":" + request.getLocalPort() + request.getContextPath()
                    + "/images/company_name.gif";
            parameters.put("company_name_pic_url", company_name_pic_logo);
            parameters.put("invoice", sale.getInvoice());
            parameters.put("sale_number", sale.getSale_bill_code());

            parameters.put("vendor", "DATE:" + sale.getOper_time() + "\r\n\r\n" + "SALE:" + sale.getOper_code() + "\r\n\r\n" + "INVOICE #:"
                    + sale.getSale_bill_code());
            parameters
                    .put("subtotal", String.valueOf(new Double(ObjectFormat.formatCurrency(sale.getSub_total(), "###.00")).doubleValue()));
            parameters.put("tax", String.valueOf(new Double(ObjectFormat.formatCurrency(sale.getTax(), "###.00")).doubleValue()));
            parameters.put("total",
                    String.valueOf(new Double(ObjectFormat.formatCurrency(sale.getSub_total() + sale.getTax(), "###.00")).doubleValue()));
            parameters.put("deposite", String.valueOf(new Double(ObjectFormat.formatCurrency(sale.getDiscount(), "###.00")).doubleValue()));
            parameters.put("balance", String.valueOf(new Double(ObjectFormat.formatCurrency(sale.getAll_price() - sale.getPaid_price(),
                    "###.00")).doubleValue()));
            parameters.put("refund", String.valueOf(new Double(ObjectFormat.formatCurrency(-sale.getRefund(), "###.00")).doubleValue()));
            // pdf输出
            JRBeanCollectionDataSource ds = new JRBeanCollectionDataSource(sale_product_list);
            byte[] bytes = JasperRunManager.runReportToPdf(reportFile, parameters,ds);
            response.setContentType("application/pdf");
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

    // 组装送到打印机的xml数据
    private String getPrintStr(String title, TSale sale, String productPrintStr, int product_num, String sale_num_total) {
        String t = "", printstr = "<xml>";
        t += "<title>" + title + "</title>";
        t += "<bill_code>" + sale.getSale_bill_code() + "</bill_code>";
        t += "<date>" + sale.getOper_time() + "</date>";
        t += "<sale>" + sale.getOper_code() + "</sale>";
        t += "<cashier>" + sale.getCash_oper_code() + "</cashier>";
        t += "<product_num>" + product_num + "</product_num>";

        printstr += t + productPrintStr;
        if ("RMA".equals(title)) {
            t = "<subtotal>$-" + sale.getSub_total() + "</subtotal>";
            t += "<tax>$-" + sale.getTax() + "</tax>";
            t += "<discount>" + sale.getDiscount() + "</discount>";
            t += "<total>$-" + sale.getAll_price() + "</total>";
            t += "<total_times>" + sale_num_total + "</total_times>";
        } else {
            t = "<subtotal>$" + sale.getSub_total() + "</subtotal>";
            t += "<tax>$" + sale.getTax() + "</tax>";
            t += "<discount>-" + sale.getDiscount() + "</discount>";
            t += "<total>$" + sale.getAll_price() + "</total>";
            t += "<total_times>" + sale_num_total + "</total_times>";
        }
        printstr += t;

        printstr += "</xml>";
        return printstr;
    }

    // 送到打印机打印的已购买的产品列表
    private String getProductPrintStr(Integer num, String product_name, String product_code, double price) {
        String ret = "<product>";
        // 数量
        ret += "<product_quntity>" + num + "</product_quntity>";

        // 产品名称
        ret += "<product_name>" + product_name + "</product_name>";
        ;

        // 产品代号
        ret += "<product_code>" + product_code + "</product_code>";

        // 产品单价
        ret += "<product_unit_price>$" + new Double(ObjectFormat.formatCurrency(price, "###.00")).doubleValue() + "</product_unit_price>";

        // 价格
        ret += "<product_price>$" + new Double(ObjectFormat.formatCurrency(price * num.longValue(), "###.00")).doubleValue()
                + "</product_price>";

        ret += "</product>";
        return ret;
    }

    // 确认退货
    @SuppressWarnings("unchecked")
    public ActionForward rma_submit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        try {
            TSaleForm sf = (TSaleForm) form;

            // List list = Webservice.listAll(TEmployee.class,
            // " where Code='" + f.getManager_name() + "' and Password1='" + f.getManager_password() + "' and HeadShip='manager'", "");
            // // 退货需要经理确认
            // if (list == null || list.size() == 0) {
            // Validation.addUserErrorInfo("manager id or manager password error!", errors, request);
            // return rma(mapping, form, request, response);
            // }

            HttpSession session = request.getSession(false);
            Long user_id = (Long) session.getAttribute("user_id");
            String user_code = String.valueOf(session.getAttribute("user_code"));
            String user_name = String.valueOf(session.getAttribute("user_name"));
            // 没有购买任何商品就提交
            JSONArray fromObject = JSONArray.fromObject(sf.getSaleProducts());
            Collection<TSaleProductForm> collection = JSONArray.toCollection(fromObject, TSaleProductForm.class);

            // 至少选择一项退货产品
            if (collection == null || collection.size() == 0) {
                response.getWriter().println(JsonUtil.getFailJson("no sale product！"));
                return null;
            }
            TSale s = (TSale) Webservice.get(TSale.class, new Long(sf.getId()));
            // 至少选择一项退货产品
            if (s.getIf_cashed() == 0) {
                response.getWriter().println(JsonUtil.getFailJson("已经付款的订单才能退货！"));
                return null;
            }
            for (TSaleProductForm saleProduct : collection) {
                if (saleProduct.getProduct_num() - saleProduct.getRma_num() - saleProduct.getReturn_damage_num()
                        - saleProduct.getReturn_credit_num() < 0) {
                    response.getWriter().println(JsonUtil.getFailJson("RMA number error!"));
                    return null;
                }
            }

            // 更新销售表
            String sql = "update TSale set if_cashed=2,rma_id=" + sf.getRma_id() + "" + ",rma_time='"
                    + CTime.getTime("yyyy-MM-dd HH:mm:ss") + "'" + ",rma_code='" + user_code + "'" + ",rma_name='" + user_name
                    + "' where id=" + sf.getId();
            Webservice.execute(TSale.class, sql);
            double subtotal_price = 0;
            double tax = 0;
            double discount = 0;
            
            for (TSaleProductForm saleProduct : collection) {
                // 更新rma产品
                int rma_num = saleProduct.getReturn_damage_num() + saleProduct.getReturn_credit_num();
                sql = "update TSaleProduct set if_rma='RMA',rma_id=" + sf.getRma_id() + "" + ",rma_time='"
                        + CTime.getTime("yyyy-MM-dd HH:mm:ss") + "'" + ",rma_code='" + user_code + "',rma_num=rma_num+" + rma_num
                        + ",credit_num=credit_num+" + saleProduct.getReturn_credit_num() + ",damage_num=damage_num+"
                        + saleProduct.getReturn_damage_num() + " where id=" + saleProduct.getId();
                Webservice.execute(TSaleProduct.class, sql);
                // 恢复库存
                sql = "update TProduct set num=num+" + saleProduct.getReturn_credit_num() + " where id=" + saleProduct.getProduct_id();
                //归还额度
                if("Deposit".equals(saleProduct.getRefundMethod())){
	                TBuyer tBuyer = Webservice.get(TBuyer.class, s.getBuyer_id());
	                tBuyer.setLeav_money(tBuyer.getLeav_money() + (float)(saleProduct.getAgio_price()*rma_num));
	                Webservice.update(tBuyer, tBuyer.getId());
                    
                }else if("Credit".equals(saleProduct.getRefundMethod())){
                	TBuyer tBuyer = Webservice.get(TBuyer.class, s.getBuyer_id());
                    tBuyer.setCredit_Line(tBuyer.getCredit_Line() + (float)(saleProduct.getAgio_price()*rma_num));
                    Webservice.update(tBuyer, tBuyer.getId());
                }
                Webservice.execute(TProduct.class, sql);
                subtotal_price += saleProduct.getAgio_price() * rma_num;
            }
            
            int rmaStatus = 1;
            //赋值是否完全退货字段
            if(sf.getId()>0){
            	List<TRmaNumStatics> list = Webservice.listAllBySql(TRmaNumStatics.class, 
            			"SELECT SUM(product_num-rma_num) AS product_num  FROM tsaleproduct where sale_id="+sf.getId());
            	if(list!=null && list.size()>0){
            		TRmaNumStatics t = list.get(0);
            		if(t.getProduct_num() == 0)
            			rmaStatus = 2;
            	}
            	
            }

            // 计算退货金额=货款总额+货款的税-优惠金额*退货所占整笔单子的百分比
            tax += subtotal_price * (s.getTax() / s.getSub_total());
            discount = subtotal_price / s.getSub_total() * s.getDiscount();
            s.setSub_total(new Double(ObjectFormat.formatCurrency(subtotal_price, "###.00")).doubleValue());
            s.setTax(new Double(ObjectFormat.formatCurrency(tax, "###.00")).doubleValue());
            s.setDiscount(new Double(ObjectFormat.formatCurrency(discount, "###.00")).doubleValue());
            double formerAllPrice = s.getAll_price();// the former total
            s.setAll_price(new Double(ObjectFormat.formatCurrency(subtotal_price + tax - discount, "###.00")).doubleValue());
            double diff = s.getAll_price();
            if (formerAllPrice - s.getAll_price() - s.getPaid_price() < 0.0) {
                diff = formerAllPrice - s.getPaid_price();
            }// the balance
            // s.setRemark(sf.getRemark());
            // update the balance and total price
            Webservice.execute(TSale.class,
                    "update TSale set all_price=all_price-" + s.getAll_price() + ", sub_total=sub_total-" + s.getSub_total()
                    		+ ", rma_status=" + rmaStatus
                            + ", paid_price=paid_price-" + s.getAll_price() + ",tax=tax-" + s.getTax() + ",discount=discount-" + discount
                            + ", refund=refund+" + s.getAll_price() + " where id=" + s.getId());
            if (s.getBuyer_id() > 0) {
                this.resetBuyerPrice(s.getBuyer_id());
            }
            JSONObject successJson = JsonUtil.getSuccessJson();
            successJson.put("saleId", new Long(sf.getId()));
            response.getWriter().println(successJson.toJSONString());
            return null;
        } catch (Exception e) {
            response.getWriter().println(JsonUtil.getFailJson("保存失败，请稍候重试"));
            log.error("保存失败", e);
            return null;
        }
    }

    // 确认付款
    public ActionForward cash_submit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        try {
            TSaleForm f = (TSaleForm) form;
            // -----------added by liming
            HttpSession session = request.getSession(false);
            Long user_id = (Long) session.getAttribute("user_id");
            String user_code = String.valueOf(session.getAttribute("user_code"));
            String user_name = String.valueOf(session.getAttribute("user_name"));
            String message = saleCashPay(f, user_id, user_code, user_name);
            if (message == null) {
                response.getWriter().println(JsonUtil.getSuccessJson().toJSONString());
            } else {
                response.getWriter().println(JsonUtil.getFailJson(message));
            }
            return null;
        } catch (Exception e) {
            response.getWriter().println(JsonUtil.getFailJson("保存失败，请稍候重试"));
            log.error("保存失败", e);
            return null;
        }
    }

    // 确认付款
    public ActionForward cashs_submit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        try {
            TSaleForm f = (TSaleForm) form;
            // -----------added by liming
            HttpSession session = request.getSession(false);
            Long user_id = (Long) session.getAttribute("user_id");
            String user_code = String.valueOf(session.getAttribute("user_code"));
            String user_name = String.valueOf(session.getAttribute("user_name"));
            // 没有购买任何商品就提交
            JSONArray fromObject = JSONArray.fromObject(f.getSaleCashs());
            Collection<TSaleForm> collection = JSONArray.toCollection(fromObject, TSaleForm.class);
            for (TSaleForm saleForm : collection) {
                saleForm.setPayment(f.getPayment());
                saleForm.setCash_station("");
                saleForm.setRemark(f.getRemark());
                String message = saleCashPay(saleForm, user_id, user_code, user_name);
                if (message != null) {
                    response.getWriter().println(JsonUtil.getFailJson(message));
                    return null;
                }
            }
            TSale tSale = Webservice.get(TSale.class, collection.iterator().next().getId());
            int customerId = tSale.getBuyer_id();
            if (!"Deposit".equals(f.getPayment()) && f.getAllbalance() > 0) {
                String sql = "Update TBuyer set leav_money=leav_money+" + f.getAllbalance() + " where id=" + customerId;
                Webservice.execute(TBuyer.class, sql);
            }
            response.getWriter().println(JsonUtil.getSuccessJson().toJSONString());
            return null;
        } catch (Exception e) {
            response.getWriter().println(JsonUtil.getFailJson("保存失败，请稍候重试"));
            log.error("保存失败", e);
            return null;
        }
    }

    private String saleCashPay(TSaleForm f, Long user_id, String user_code, String user_name) {
        try {
            TSale sale = (TSale) Webservice.get(TSale.class, f.getId());
            //小于零表示是销售退货
            if(sale.getAll_price()<0){
            	
            	return "这是退货订单,已经结算,无须重复结算!";
            }
            String if_cashed = "0";// cashed
            double paid_price = sale.getPaid_price() + f.getAccept();
            if ((sale.getAll_price() - paid_price) <= 0.00001) {
                if_cashed = "1";// have paid all
                paid_price = sale.getAll_price();
            }
            // 预付款支付
            if (sale.getBuyer_id() > 0 ) {
                TBuyer tBuyer = Webservice.get(TBuyer.class, sale.getBuyer_id());
                if("Deposit".equals(f.getPayment())){
                	if (tBuyer != null) {
                        if (tBuyer.getLeav_money() - f.getAccept() < 0) {
                            return "保存失败，预存金额不足！";
                        }
                    }
                }
                
                if("Credit".equals(f.getPayment())){
                	if (tBuyer != null) {
                        if (tBuyer.getCredit_Line() - f.getAccept() < 0) {
                            return "保存失败,信用额度不足！";
                        }
                    }
                }
                
            }
            String sql = "update TSale set if_cashed='" + if_cashed + "', cash_oper_id=" + user_id + ", paid_price=" + paid_price
                    + ",cash_oper_code='" + user_code + "'" + ",cash_oper_name='" + user_name + "'" + ",cash_time='"
                    + CTime.getTime("yyyy-MM-dd HH:mm:ss") + "'" + " where id=" + f.getId();
            Webservice.execute(TSale.class, sql);
            if (sale.getBuyer_id() > 0) {
                // 扣除预付款
                if ("Deposit".equals(f.getPayment())) {
                    TBuyer tBuyer = Webservice.get(TBuyer.class, sale.getBuyer_id());
                    tBuyer.setLeav_money(tBuyer.getLeav_money() - f.getAccept());
                    Webservice.update(tBuyer, tBuyer.getId());
                }
                if("Credit".equals(f.getPayment())){
                	TBuyer tBuyer = Webservice.get(TBuyer.class, sale.getBuyer_id());
                    tBuyer.setCredit_Line(tBuyer.getCredit_Line() - f.getAccept());
                    Webservice.update(tBuyer, tBuyer.getId());
                }
                this.resetBuyerPrice(sale.getBuyer_id());
                // sql = "update TBuyer set balance=balance+" + (paid_price - sale.getPaid_price()) + " where id=" + sale.getBuyer_id();
                // Webservice.execute(TBuyer.class, sql);
                TSaleHistory history = new TSaleHistory();
                history.setAmount(f.getAccept());
                history.setBuyer_id(sale.getBuyer_id());
                history.setPayment(f.getPayment());
                history.setBuyer_name(sale.getBuyer_name());
                history.setCash_time(CTime.getTime("yyyy-MM-dd HH:mm:ss"));
                history.setOper_id(user_id);
                history.setOper_name(user_name);
                history.setRemark(f.getRemark());
                history.setSale_bill_code(sale.getSale_bill_code());
                history.setSale_id(sale.getId());
                Webservice.insert(history);
            }
            if (if_cashed.equals("1")) {
                String condition = " where 1=1";
                condition += " and sale_id = '" + f.getId() + "'";
                List<TSaleProduct> list = Webservice.listAll(TSaleProduct.class, condition, "");
                if (list != null && list.size() > 0) {
                    for (TSaleProduct saleProduct : list) {
                        Webservice.execute(TProduct.class, "update TProduct set num=num-" + saleProduct.getProduct_num() + " where id="
                                + saleProduct.getProduct_id());
                    }
                }
            }
            return null;
        } catch (Exception e) {
            log.error("保存失败", e);
            return "保存失败，请稍候重试";
        }
    }

    // 当日统计
    public ActionForward day_stat(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        try {
        	
        	 String condition = " 1=1 ";
             TSaleForm tf = (TSaleForm) form;
             if (tf.getOper_id() != 0)
                 condition += " and a.oper_id=" + tf.getOper_id();
             if (StringUtils.isNotBlank(tf.getSale_bill_code()))
                 condition += " and a.sale_bill_code='" + tf.getSale_bill_code() + "'";
             if (StringUtils.isNotBlank(tf.getOper_time_start()))
                 condition += " and a.oper_time >= '" + tf.getOper_time_start() + "'";
             if (StringUtils.isNotBlank(tf.getOper_time_end())) {
                 condition += " and a.oper_time <= '" + tf.getOper_time_end() + "'";
             }
             if (StringUtils.isNotBlank(tf.getInvoicecode())) {
                 condition += " and a.invoice = '" + tf.getInvoicecode() + "'";
             }
             if (StringUtils.isNotBlank(tf.getBuyer_mobile())) {
                 condition += " and a.buyer_mobile like '%" + tf.getBuyer_mobile() + "%'";
             }
             if (StringUtils.isNotBlank(tf.getBuyer_name())) {
                 condition += " and a.buyer_name like '%" + tf.getBuyer_name() + "%'";
             }
             if (StringUtils.isNotBlank(tf.getBuyer_address())) {
                 condition += " and a.buyer_address like '%" + tf.getBuyer_address() + "%'";
             }
             if (tf.getBuyer_id() != 0) {
                 condition += " and a.buyer_id =" + tf.getBuyer_id();
             }
             if (tf.getIf_cashed() != -1) {
                 condition += " and a.If_cashed = " + tf.getIf_cashed();
             }
             
             
             
             
        	
            //String date = request.getParameter("date");
//            Date dayDate = new SimpleDateFormat("yyyy-MM-dd").parse(date);
//            Calendar calendar = Calendar.getInstance();
//            calendar.setTime(dayDate);
//            int year = calendar.get(Calendar.YEAR);
//            int month = calendar.get(Calendar.MONTH) + 1;
//            int day = calendar.get(Calendar.DAY_OF_MONTH);
            String sql = "select * from (SELECT b.product_name, sum(b.product_price*b.product_num) AS all_price, sum(b.product_num) AS sale_times"
                    + " FROM TSale AS a, TSaleProduct AS b"
                    + " WHERE a.id=b.sale_id and "
                    + condition
                    + " GROUP BY b.product_name) as t1 order by sale_times desc";
            List list = Webservice.listAllBySql(TSaleTop.class, sql);
            response.getWriter().println(ExtUtil.genExtListString(list, list != null ? list.size() : 0));
        } catch (Exception e) {
            log.error("查询失败", e);
            response.getWriter().println(JsonUtil.getFailJson("查询失败，请稍候重试"));
        }
        return null;
    }
    
    /**
     * 结清欠款
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward credit_warn_clear(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        try {
        	TSale sale = Webservice.get(TSale.class, request.getParameter("sale_id"));
        	
            List<TSaleHistory> list =  Webservice.listAll(TSaleHistory.class, " where sale_id="+request.getParameter("sale_id"), "");
            for (TSaleHistory sh:list) {
				sh.setPayment("Cash");
				Webservice.update(sh, sh.getId());
				if(sale.getBuyer_id()>0){
	            	TBuyer tBuyer = Webservice.get(TBuyer.class, sale.getBuyer_id());
	                tBuyer.setCredit_Line(tBuyer.getCredit_Line() + (float)sh.getAmount());
	                Webservice.update(tBuyer, tBuyer.getId());
	            }
			}
            response.getWriter().println(JsonUtil.getSuccessJson());
        } catch (Exception e) {
            response.getWriter().println(JsonUtil.getFailJson("操作，请稍候重试"));
            log.error("异常", e);
        }
    	return null;
    }
    /**
     * 超期未付款预警
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward credit_warn(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        try {
            String date = request.getParameter("date");
            DateFormat format = new SimpleDateFormat("yyyy-MM-dd");
            if(!StringUtils.isNotEmpty(date)){
            	date = format.format(new Date());
            }
            String sql = "SELECT -SUM(amount) AS amount,MAX(oper_name) AS oper_name,"
            		+ "sale_id,"
            		+ "(SELECT buyer_name FROM TSale WHERE id = t.sale_id) AS buyer_code,"
            		+ "(SELECT invoice FROM tsale WHERE id = t.sale_id) AS invoice,"
            		+ "MAX(cash_time) AS last_cash_time FROM TSaleHistory AS t "
            		+ "WHERE payment = 'Credit' GROUP BY sale_id "
            		+ "HAVING DATE_ADD(last_cash_time,INTERVAL 30 DAY)<='"+date.substring(0, 10)+"'";
            List list = Webservice.listAllBySql(TCreditWarning.class, sql);
            response.getWriter().println(ExtUtil.genExtListString(list, list != null ? list.size() : 0));
        } catch (Exception e) {
            log.error("查询失败", e);
            response.getWriter().println(JsonUtil.getFailJson("查询失败，请稍候重试"));
        }
        return null;
    }
    
    
    // 当月统计
    public ActionForward month_stat(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        try {
            String date = request.getParameter("date");
            Date dayDate = new SimpleDateFormat("yyyy-MM").parse(date);
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(dayDate);
            int year = calendar.get(Calendar.YEAR);
            int month = calendar.get(Calendar.MONTH) + 1;
            String sql = "select * from (SELECT b.product_name, sum(b.product_price*b.product_num) AS all_price, sum(b.product_num) AS sale_times"
                    + " FROM TSale AS a, TSaleProduct AS b"
                    + " WHERE a.id=b.sale_id and month(b.sale_time)="
                    + month
                    + " and year(b.sale_time)=" + year + " GROUP BY b.product_name) as t1 order by sale_times desc";
            List list = Webservice.listAllBySql(TSaleTop.class, sql);
            response.getWriter().println(ExtUtil.genExtListString(list, list != null ? list.size() : 0));
        } catch (Exception e) {
            log.error("查询失败", e);
            response.getWriter().println(JsonUtil.getFailJson("查询失败，请稍候重试"));
        }
        return null;
    }

    // 时间段统计
    public ActionForward between_stat(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        try {
            String begin = request.getParameter("begin");
            String end = request.getParameter("end");
            if (StringUtils.isEmpty(begin) || StringUtils.isEmpty(end)) {
                response.getWriter().println(JsonUtil.getFailJson("时间不能为空"));
                return null;
            }
            String sql = "select * from (SELECT b.product_name, sum(b.product_price*b.product_num) AS all_price, sum(b.product_num) AS sale_times"
                    + " FROM TSale AS a, TSaleProduct AS b"
                    + " WHERE a.id=b.sale_id and b.sale_time between '"
                    + begin
                    + "' and '"
                    + end
                    + "'" + " GROUP BY b.product_name) as t1 order by sale_times desc";
            List list = Webservice.listAllBySql(TSaleTop.class, sql);
            response.getWriter().println(ExtUtil.genExtListString(list, list != null ? list.size() : 0));
        } catch (Exception e) {
            log.error("查询失败", e);
            response.getWriter().println(JsonUtil.getFailJson("查询失败，请稍候重试"));
        }
        return null;
    }

    // 损坏统计
    public ActionForward damageRepor(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        try {
            String begin = request.getParameter("begin");
            String end = request.getParameter("end");
            if (StringUtils.isEmpty(begin) || StringUtils.isEmpty(end)) {
                response.getWriter().println(JsonUtil.getFailJson("时间不能为空"));
                return null;
            }
            String sql = "select product_id,product_name,SUM(rma_num) rma_num,SUM(rma_num*product_price) all_price from TSaleProduct where  "
                    + "rma_time between '"
                    + begin
                    + "' and '"
                    + end
                    + "'"
                    + " GROUP BY  product_id  HAVING rma_num>0  order by product_id desc";
            List list = Webservice.listAllBySql(TDamageReport.class, sql);
            response.getWriter().println(ExtUtil.genExtListString(list, list != null ? list.size() : 0));
        } catch (Exception e) {
            log.error("查询失败", e);
            response.getWriter().println(JsonUtil.getFailJson("查询失败，请稍候重试"));
        }
        return null;
    }

    /**
     * 重新计算客户的总金额和欠款
     *
     * @param buyerId
     * @throws Exception
     */
    public void resetBuyerPrice(long buyerId) throws Exception {
        List<TBuyerStatistics> list = Webservice.listAllBySql(TBuyerStatistics.class,
                "select sum(all_price) total,SUM(all_price- paid_price) balance from TSale where type=0 and buyer_id =" + buyerId);
        if (list == null || list.size() == 0) {
            return;
        }
        TBuyer tBuyer = Webservice.get(TBuyer.class, buyerId);
        if (tBuyer != null) {
            TBuyerStatistics tb = list.get(0);
            tBuyer.setBalance(tb.getBalance());
            tBuyer.setTotal(tb.getTotal());
            Webservice.update(tBuyer, buyerId);
        }
    }

    public ActionForward checkApprover(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        TSaleForm sf = (TSaleForm) form;
        
        String errorMsg = request.getParameter("errorMsg");
        String returnErrorMsg = "approver id/优惠确认人 填写不正确。";
        if(StringUtils.isEmpty(sf.getConfirm_code())){
        	if(StringUtils.isNotEmpty(errorMsg)){
        		returnErrorMsg = errorMsg;
        	}
            response.getWriter().println(JsonUtil.getFailJson(returnErrorMsg));
            return null;
        }
        List<TEmployee> listAll = Webservice.listAll(TEmployee.class, " where mobile = '" + sf.getConfirm_code() + "'", "");
        if (listAll == null || listAll.size() <= 0) {
        	if(StringUtils.isNotEmpty(errorMsg)){
        		returnErrorMsg = errorMsg;
        	}
            response.getWriter().println(JsonUtil.getFailJson(returnErrorMsg));
            return null;
        }
        response.getWriter().println(JsonUtil.getSuccessJson());
        return null;
    }
}
