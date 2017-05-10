package com.poweronce.action;

import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.apache.struts.actions.DispatchAction;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Node;
import org.dom4j.io.SAXReader;

import com.poweronce.entity.TBuyer;
import com.poweronce.entity.TProduct;
import com.poweronce.entity.TProduct_vendor;
import com.poweronce.entity.TProvider;
import com.poweronce.entity.TPurchase;
import com.poweronce.entity.TPurchaseProduct;
import com.poweronce.entity.TSale;
import com.poweronce.entity.TSaleProduct;
import com.poweronce.entity.TStockProduct;
import com.poweronce.service.Webservice;
import com.poweronce.util.ObjectFormat;

/**
 * @author shenbin
 *         <p/>
 *         更改所生成类型注释的模板为 窗口 > 首选项 > Java > 代码生成 > 代码和注释
 */
public class AjaxAction extends DispatchAction {

    // 获得一个产品的信息 sale
    public ActionForward getProduct(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
        try {
            response.setContentType("text/xml;charset=UTF-8");
            PrintWriter out = response.getWriter();
            // 按照产品条码查找
            String product_code = getRequestPara(request);
            // String condition = " where code='"+product_code+"'";
            // List list = Webservice.listAll(TProduct.class,condition,"");
            //
            String xml = "";
            // if(list==null || list.size()==0)//按照产品条码找不到
            // {
            // 按照产品助记符查找
            // list =
            // Webservice.getInstance().list("TProduct"," where product_id='"+product_code+"'",1,1,nCount);
            // if(list==null || list.size()==0)//按照产品条码，产品助记符都找不到
            // {

            // 按照输入的前几个字母查找
            List list = Webservice.listAll(TProduct.class, " where product_id like '" + product_code + "%'", "");
            if (list == null || list.size() == 0) {
                TProduct pro = new TProduct();
                pro.setCode(product_code);
                request.setAttribute("entity", pro);
                xml = "document.all.product_name_and_type.innerHTML='not find product,please check your product code!';menuControl(0,1);";
            } else if (list.size() == 1) {
                TProduct area = (TProduct) list.get(0);
                // 替换' "
                String code = area.getCode().replaceAll("'", "\\\\\'").replaceAll("\"", "\\\\\"");
                request.setAttribute("entity", area);
                xml = "document.all.product_name_and_type.innerHTML='Unit Price/单价:<input type=text value="
                        + ObjectFormat.formatNumber(area.getPrice_simgle(), "#,###.00") + " size=6 readonly>&nbsp;&nbsp;Storage/库存:<input type=text value="
                        + area.getNum() + " size=6 readonly>';document.all.product_code.value=\"" + code + "\";" + "document.all.product_num.focus();";

            } else// 下拉列表给用户
            {
                for (int i = 0; i < list.size(); i++) {
                    TProduct area = (TProduct) list.get(i);
                    // 替换' "
                    String code = area.getProduct_id().replaceAll("'", "\\\\\'").replaceAll("\"", "\\\\\"");
                    request.setAttribute("entity", area);
                    xml += "<span onclick=\"document.all.product_code.value=this.innerText;document.all.product_num.focus();\">" + code + "</span><br/>";
                }

                xml = "document.all.menu_1.innerHTML='" + xml + "';menuControl(1,1);";
            }
            // }
            // else//按照产品助记符找到了,有多个取最后一个
            // {
            // for(int i=0;i<list.size();i++)
            // {
            // TProduct area = (TProduct)list.get(i);
            // //替换' "
            // String code =
            // area.getCode().replaceAll("'","\\\\\'").replaceAll("\"","\\\\\"");
            // String prodcut_name =
            // area.getProduct_name().replaceAll("'","\\\\\'").replaceAll("\"","\\\\\"");
            // request.setAttribute("entity",area);
            // xml =
            // "document.all.product_name_and_type.innerHTML='Unit Price:<input type=text value="
            // +area.getPrice_simgle()+" size=6 readonly>&nbsp;&nbsp;Storage:<input type=text value="
            // +area.getNum()+" size=6 readonly>"+area.getProduct_id()+"&nbsp;&nbsp;&nbsp;&nbsp;"+prodcut_name+"';document.all.product_code.value=\""+code+"\";"
            // +
            // "document.all.product_num.focus();";
            // }
            // }
            // }
            // else if(list.size()==1)//按照产品条码找到了,有多个取最后一个
            // {
            // TProduct area = (TProduct)list.get(0);
            // //替换' "
            // String prodcut_name =
            // area.getProduct_name().replaceAll("'","\\\\\'").replaceAll("\"","\\\\\"");
            // request.setAttribute("entity",area);
            // xml =
            // "document.all.product_name_and_type.innerHTML='Unit Price/单价:<input type=text value="
            // +area.getPrice_simgle()+" size=6 readonly>&nbsp;&nbsp;Storage/库存:<input type=text value="
            // +area.getNum()+" size=6 readonly>"+area.getProduct_id()+"&nbsp;&nbsp;&nbsp;&nbsp;"+prodcut_name+"';"
            // +
            // "document.all.product_num.focus();";
            // }
            // else
            // {
            // for(int i=0;i<list.size();i++)
            // {
            // TProduct area = (TProduct)list.get(i);
            // //替换' "
            // String code =
            // area.getProduct_id().replaceAll("'","\\\\\'").replaceAll("\"","\\\\\"");
            // request.setAttribute("entity",area);
            // xml +=
            // "<span onclick=\"document.all.product_code.value=this.innerText;document.all.product_num.focus();\">"+code+"</span><br/>";
            // }
            //
            // xml =
            // "document.all.menu_1.innerHTML='"+xml+"';menuControl(1,1);";
            // }
            out.println(xml);
        } catch (Exception e) {
            e.getMessage();
        }
        return mapping.findForward("NULL");
    }

    // 获得一个产品的信息,purchase order
    public ActionForward getProductName(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
        try {
            response.setContentType("text/xml;charset=UTF-8");
            PrintWriter out = response.getWriter();
            // 按照产品条码查找
            String product_code = getRequestPara(request);
            String condition = " where product_id like '" + product_code + "%'";
            List list = Webservice.listAll(TProduct.class, condition, "");

            String xml = "";
            if (list != null && list.size() > 1)// 按照产品名称找到
            {

                for (int i = 0; i < list.size(); i++) {
                    TProduct area = (TProduct) list.get(i);
                    // 替换' "
                    String code = area.getProduct_id().replaceAll("'", "\\\\\'").replaceAll("\"", "\\\\\"");
                    request.setAttribute("entity", area);
                    xml += "<span onclick=\"document.all.product_help.value=this.innerText;menuControl(0,1);document.all.product_num.focus();\">" + code
                            + "</span><br/>";
                }

                xml = "document.all.menu_1.innerHTML='" + xml + "';menuControl(1,1);";

            } else if (list != null && list.size() == 1) {
                TProduct area = (TProduct) list.iterator().next();
                String prodcut_name = area.getProduct_name().replaceAll("'", "\\\\\'").replaceAll("\"", "\\\\\"");
                String prodcut_id = area.getProduct_id().replaceAll("'", "\\\\\'").replaceAll("\"", "\\\\\"");

                // 用=,like都只有一个，是全称了
                condition = " where product_id='" + product_code + "'";
                list = Webservice.listAll(TProduct.class, condition, "");
                // 是全称跑出焦点，不要在设置文本框值了，否在又会进来一次
                if (list != null && list.size() == 1) {
                    xml = "document.all.product_name_and_type.innerHTML='Storage/库存:" + area.getNum() + "&nbsp;&nbsp;&nbsp;&nbsp;" + area.getProduct_id()
                            + "&nbsp;&nbsp;&nbsp;&nbsp;" + prodcut_name + "';" + "document.all.product_num.focus();";

                } else {
                    xml = "document.all.product_name_and_type.innerHTML='Storage/库存:" + area.getNum() + "&nbsp;&nbsp;&nbsp;&nbsp;" + area.getProduct_id()
                            + "&nbsp;&nbsp;&nbsp;&nbsp;" + prodcut_name + "';" + "document.all.product_help.value=\"" + prodcut_id + "\";";

                }

            }
            out.println(xml);
        } catch (Exception e) {
            e.getMessage();
        }
        return mapping.findForward("NULL");
    }

    // 获得一个产品的信息,search price
    public ActionForward getProductListByProductId(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        try {
            response.setContentType("text/xml;charset=UTF-8");
            PrintWriter out = response.getWriter();
            // 按照产品条码查找
            String product_code = getRequestPara(request);
            String condition = " where product_id like'" + product_code + "%'";
            List list = Webservice.listAll(TProduct.class, condition, "");

            String xml = "";
            if (list != null && list.size() > 1)// 按照产品名称找到
            {

                for (int i = 0; i < list.size(); i++) {
                    TProduct area = (TProduct) list.get(i);
                    // 替换' "
                    String code = area.getProduct_id().replaceAll("'", "\\\\\'").replaceAll("\"", "\\\\\"");
                    request.setAttribute("entity", area);
                    xml += "<span onclick=\"document.all.product_id.value=this.innerText;menuControl(0,1);\">" + code + "</span><br/>";
                }

                xml = "document.all.menu_1.innerHTML='" + xml + "';menuControl(1,1);";

            } else if (list != null && list.size() == 1) {
                TProduct area = (TProduct) list.iterator().next();
                String prodcut_id = area.getProduct_id().replaceAll("'", "\\\\\'").replaceAll("\"", "\\\\\"");

                // 用=,like都只有一个，是全称了
                condition = " where product_id='" + product_code + "'";
                list = Webservice.listAll(TProduct.class, condition, "");
                // 是全称跑出焦点，不要在设置文本框值了，否在又会进来一次
                if (list != null && list.size() == 1) {
                    xml = "";

                } else {
                    xml = "document.all.product_id.value=\"" + prodcut_id + "\";menuControl(0,1);";

                }

            }
            out.println(xml);
        } catch (Exception e) {
            e.getMessage();
        }
        return mapping.findForward("NULL");
    }

    // 获得客户的所有交易信息
    public ActionForward getSaleListByCustomerId(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        try {
            response.setContentType("text/xml;charset=UTF-8");
            PrintWriter out = response.getWriter();
            Long buyer_id = new Long(getRequestPara(request));
            String condition = " where buyer_id=" + buyer_id;
            List list = Webservice.listAll(TSale.class, condition, "");
            TBuyer buy = (TBuyer) Webservice.get(TBuyer.class, buyer_id);
            String xml = "";
            if (list != null) {
                String remark = buy.getMyMemo().replaceAll("'", "\\\\\'").replaceAll("\"", "\\\\\"").replaceAll("\r\n", "<br/>");
                xml += "document.all.sale_list.innerHTML=\"<table width=96% border=0 cellpadding=2 cellspacing=1 class='n_tabb2'>"
                        + "<tr class='tabbackblue' align='center'>" + "<td>receive #/销售单号</td>" + "<td>saleman/销售员</td>" + "<td>customer/客户</td>"
                        + "<td>payment/支付方式</td>" + "<td>sub total/小计</td>" + "<td>total/合计</td>" + "<td>balance/余额</td>" + "<td>date/时间</td>"
                        + "<td>pay/已付</td>" + "<td>print/打印</td>" + "</tr>";
                float amount = 0;
                for (int i = 0; i < list.size(); i++) {
                    TSale obj = (TSale) list.get(i);
                    xml += "<tr class='tdout' align='center' onmouseover=\\\"this.className='tdover'\\\" onmouseout=\\\"this.className='tdout'\\\">";
                    xml += "<td style='font-weight:bold;'><a href='#' onclick=\\\"request('" + request.getContextPath()
                            + "/ajax.do?action=getSaleProductList'," + obj.getId() + ")\\\">" + obj.getSale_bill_code() + "</a></td>";
                    xml += "<td>" + obj.getOper_code() + "</td>";
                    xml += "<td>" + obj.getBuyer_code() + "</td>";
                    xml += "<td>" + obj.getPayment() + "</td>";
                    xml += "<td>" + ObjectFormat.formatNumber(obj.getSub_total(), "#,##0.00") + "</td>";
                    xml += "<td>" + ObjectFormat.formatNumber(obj.getAll_price(), "#,##0.00") + "</td>";
                    xml += "<td>" + ObjectFormat.formatNumber(obj.getPaid_price() - obj.getAll_price(), "#,##0.00") + "</td>";
                    xml += "<td>" + obj.getCash_time() + "</td>";
                    xml += "<td>"
                            + ((obj.getIf_cashed() == 0) ? "<input type='button' value='cash' onclick=\\\"location.href='" + request.getContextPath()
                            + "/sale.do?action=cash&id=" + obj.getId() + "'; return true;\\\"/>" : obj.getIf_cashedStr()) + "</td>";
                    xml += "<td><a href='" + request.getContextPath() + "/sale.do?action=re_print&id=" + obj.getId() + "'><img border='0' src='"
                            + request.getContextPath() + "/images/02_biao_an16.gif'></a></td>";
                    xml += "</tr>";
                    amount += obj.getAll_price();
                }
                xml += "</table>\";";
                xml += "document.all.push_list.innerHTML=\"Remark/注释:<br>" + remark + "<br>Total sales Summary/次数:<font color='red'>" + list.size()
                        + "</font><br>Total sales Amount/总计:<font color='red'>" + ObjectFormat.formatNumber(amount, "#,###.00") + "</font><br>\";";
            }
            out.println(xml);
        } catch (Exception e) {
            e.getMessage();
        }
        return mapping.findForward("NULL");
    }

    // 下拉产品列表获得本类产品的列表
    public ActionForward getProductListByType(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        try {
            response.setContentType("text/xml;charset=UTF-8");
            PrintWriter out = response.getWriter();
            String condition = " where product_type='" + getRequestPara(request) + "'";
            List list = Webservice.listAll(TProduct.class, condition, "");

            String xml = "";
            xml += "document.all.product_by_type.innerHTML=\"<select name=product_type onchange='document.all.product_code.value=this.value'><option value='-1'>please select</option>";
            if (list != null && list.size() > 0) {
                for (int i = 0; i < list.size(); i++) {
                    TProduct area = (TProduct) list.get(i);
                    // 替换' "
                    String code = area.getCode().replaceAll("'", "\\\\\'").replaceAll("\"", "\\\\\"");
                    String product_name = area.getProduct_name().replaceAll("'", "\\\\\'").replaceAll("\"", "\\\\\"");
                    xml += "<option value='" + code + "'>" + product_name + "</option>";
                }
            }
            xml += "</select>\";";
            out.println(xml);
        } catch (Exception e) {
            e.getMessage();
        }
        return mapping.findForward("NULL");
    }

    // 下拉产品列表获得本类产品的列表
    public ActionForward getProductListByType2(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        try {
            response.setContentType("text/xml;charset=UTF-8");
            PrintWriter out = response.getWriter();
            String condition = " where product_type='" + getRequestPara(request) + "'";
            int nCount[] = new int[1];
            List list = Webservice.listAll(TProduct.class, condition, "");

            String xml = "";
            xml += "document.all.product_by_type.innerHTML=\"<select name=product_type onchange='document.all.product_name.value=this.value'><option value='-1'>please select</option>";
            if (list != null && list.size() > 0) {
                for (int i = 0; i < list.size(); i++) {
                    TProduct area = (TProduct) list.get(i);
                    // 替换' "
                    String code = area.getCode().replaceAll("'", "\\\\\'").replaceAll("\"", "\\\\\"");
                    String product_name = area.getProduct_name().replaceAll("'", "\\\\\'").replaceAll("\"", "\\\\\"");
                    xml += "<option value='" + product_name + "'>" + product_name + "</option>";
                }
            }
            xml += "</select>\";";
            out.println(xml);
        } catch (Exception e) {
            e.getMessage();
        }
        return mapping.findForward("NULL");
    }

    // stock中获得选择的产品的供应商
    public ActionForward getProductVendor(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
        try {
            response.setContentType("text/xml;charset=UTF-8");
            PrintWriter out = response.getWriter();

            String xml = "";
            xml += "document.all.div_vendor.innerHTML=\"<select name=provider_id>";

            int nCount[] = new int[1];
            List list = null;
            String v = getRequestPara(request);
            // 获得某个产品的供应商
            if (!v.equalsIgnoreCase("-1")) {
                list = Webservice.listAll(TProduct.class, " where code='" + v + "'", "");
                if (list != null && list.size() != 0) {
                    String condition = " where product_id=" + ((TProduct) list.iterator().next()).getId();
                    list = Webservice.listAll(TProduct_vendor.class, condition, "");

                    if (list != null && list.size() > 0) {
                        for (int i = 0; i < list.size(); i++) {
                            TProduct_vendor area = (TProduct_vendor) list.get(i);
                            // 替换' "
                            String vendor_name = area.getVendor_name().replaceAll("'", "\\\\\'").replaceAll("\"", "\\\\\"");
                            xml += "<option value='" + area.getVendor_id() + "'>" + vendor_name + "</option>";
                        }
                    }
                }
            }
            // 所有供应商
            else {
                list = Webservice.listAll(TProvider.class, "", "");

                if (list != null && list.size() > 0) {
                    for (int i = 0; i < list.size(); i++) {
                        TProvider area = (TProvider) list.get(i);
                        // 替换' "
                        String vendor_name = area.getShortName().replaceAll("'", "\\\\\'").replaceAll("\"", "\\\\\"");
                        xml += "<option value='" + area.getId() + "'>" + vendor_name + "</option>";
                    }
                }
            }
            xml += "</select>\";";
            out.println(xml);
        } catch (Exception e) {
            e.getMessage();
        }
        return mapping.findForward("NULL");
    }

    // stock中获得选择的产品的供应商
    public ActionForward getProductVendorByProductName(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        try {
            response.setContentType("text/xml;charset=UTF-8");
            PrintWriter out = response.getWriter();

            String xml = "";
            xml += "document.all.div_vendor.innerHTML=\"<select name=provider_id>";

            int nCount[] = new int[1];
            List list = null;
            String v = getRequestPara(request);
            // 获得某个产品的供应商
            if (!v.equalsIgnoreCase("-1")) {
                v = v.replaceAll("'", "''");
                list = Webservice.listAll(TProduct.class, " where product_name='" + v + "'", "");
                if (list != null && list.size() != 0) {
                    String condition = " where product_id=" + ((TProduct) list.iterator().next()).getId();
                    list = Webservice.listAll(TProduct_vendor.class, condition, "");

                    if (list != null && list.size() > 0) {
                        for (int i = 0; i < list.size(); i++) {
                            TProduct_vendor area = (TProduct_vendor) list.get(i);
                            // 替换' "
                            String vendor_name = area.getVendor_name().replaceAll("'", "\\\\\'").replaceAll("\"", "\\\\\"");
                            xml += "<option value='" + area.getVendor_id() + "'>" + vendor_name + "</option>";
                        }
                    }
                }
            }
            // 所有供应商
            else {
                list = Webservice.listAll(TProvider.class, "", "");

                if (list != null && list.size() > 0) {
                    for (int i = 0; i < list.size(); i++) {
                        TProvider area = (TProvider) list.get(i);
                        // 替换' "
                        String vendor_name = area.getShortName().replaceAll("'", "\\\\\'").replaceAll("\"", "\\\\\"");
                        xml += "<option value='" + area.getId() + "'>" + vendor_name + "</option>";
                    }
                }
            }
            xml += "</select>\";";
            out.println(xml);
        } catch (Exception e) {
            e.getMessage();
        }
        return mapping.findForward("NULL");
    }

    // 获得用户的详细信息
    public ActionForward getCustomerDetail(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
        try {
            response.setContentType("text/xml;charset=UTF-8");
            PrintWriter out = response.getWriter();
            String condition = " where code='" + getRequestPara(request) + "'";
            int nCount[] = new int[1];
            List list = Webservice.listAll(TBuyer.class, condition, "");

            String xml = "";
            if (list == null || list.size() == 0)
                xml = "alert('customer is not exist!');";
            else {
                xml += "document.all.customer_detail.innerHTML=\"";
                for (int i = 0; i < list.size(); i++) {
                    TBuyer area = (TBuyer) list.get(i);
                    // 替换' "
                    String address = area.getAddress().replaceAll("'", "\\\\\'").replaceAll("\"", "\\\\\"");
                    xml += "Customer Address/地址:" + address + "<br>";
                    xml += "Credit Line/赊帐最高额:" + ObjectFormat.formatNumber(area.getCredit_Line(), "#,###.00") + "<br>";
                    xml += "Balance/余额:" + ObjectFormat.formatNumber(area.getBalance(), "#,###.00") + "<br>";
                    xml += "Mobile/手机:" + area.getMobile() + "<br>";
                }
                xml += "\";";
            }
            out.println(xml);
        } catch (Exception e) {
            e.getMessage();
        }
        return mapping.findForward("NULL");
    }

    // 销售明细单点击销售单时获得所购产品列表
    public ActionForward getSaleProductList(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
        try {
            response.setContentType("text/xml;charset=UTF-8");
            PrintWriter out = response.getWriter();
            String condition = " where sale_id=" + getRequestPara(request);
            List list = Webservice.listAll(TSaleProduct.class, condition, "");

            String xml = "";
            if (list != null) {
                xml += "document.all.product_list.innerHTML=\"<table width=96% border=0 cellpadding=2 cellspacing=1 class='n_tabb2'>"
                        + "<tr class='tabbackblue' align='center'>" + "<td>barcode #/条码</td>" + "<td>product name/名称</td>" + "<td>unit price/单价</td>"
                        + "<td>discount/打折</td>" + "<td>discount price/打折价</td>" + "<td>quantity/数量</td>" + "<td>RMA quantity/已退货数量</td>"
                        + "<td>sub total/小计</td>" + "<td>if RMA/是否已退货</td></tr>";
                for (int i = 0; i < list.size(); i++) {
                    TSaleProduct obj = (TSaleProduct) list.get(i);
                    // 替换' "
                    String product_code = obj.getProduct_code().replaceAll("'", "\\\\\'").replaceAll("\"", "\\\\\"");
                    String product_name = obj.getProduct_name().replaceAll("'", "\\\\\'").replaceAll("\"", "\\\\\"");
                    xml += "<tr class='tdout' align='center' onmouseover=\\\"this.className='tdover'\\\" onmouseout=\\\"this.className='tdout'\\\">";
                    xml += "<td>" + product_code + "</td>";
                    xml += "<td>" + product_name + "</td>";
                    xml += "<td>" + ObjectFormat.formatNumber(obj.getProduct_price(), "#,###.00") + "</td>";
                    xml += "<td>" + obj.getAgio() + "</td>";
                    xml += "<td>" + ObjectFormat.formatNumber(obj.getAgio_price(), "#,###.00") + "</td>";
                    xml += "<td>" + obj.getProduct_num() + "</td>";
                    xml += "<td>" + obj.getRma_num() + "</td>";
                    xml += "<td>" + ObjectFormat.formatNumber(obj.getAgio_price() * obj.getProduct_num(), "#,###.00") + "</td>";
                    xml += "<td>" + obj.getIf_rma() + "</td>";
                    xml += "</tr>";
                }
                xml += "</table>\";";
            }
            out.println(xml);
        } catch (Exception e) {
            e.getMessage();
        }
        return mapping.findForward("NULL");
    }

    // 进货明细单点击进货单时获得所进产品列表
    public ActionForward getStockProductList(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
        try {
            response.setContentType("text/xml;charset=UTF-8");
            PrintWriter out = response.getWriter();
            String condition = " where stock_id=" + getRequestPara(request);
            List list = Webservice.listAll(TStockProduct.class, condition, "");

            String xml = "";
            if (list != null) {
                xml += "document.all.product_list.innerHTML=\"<table width=96% border=0 cellpadding=2 cellspacing=1 class='n_tabb2'>"
                        + "<tr class='tabbackblue' align='center'>" + "<td>barcode #/条码</td>" + "<td>product name/名称</td>" + "<td>vendor/供应商</td>"
                        + "<td>quantity/数量</td>" + "<td>price/价格</td>" + "<td>sub total/小计</td></tr>";
                for (int i = 0; i < list.size(); i++) {
                    TStockProduct obj = (TStockProduct) list.get(i);
                    // 替换' "
                    String product_code = obj.getProduct_code().replaceAll("'", "\\\\\'").replaceAll("\"", "\\\\\"");
                    String product_name = obj.getProduct_name().replaceAll("'", "\\\\\'").replaceAll("\"", "\\\\\"");
                    String provider_name = obj.getProvider_name().replaceAll("'", "\\\\\'").replaceAll("\"", "\\\\\"");
                    xml += "<tr class='tdout' align='center' onmouseover=\\\"this.className='tdover'\\\" onmouseout=\\\"this.className='tdout'\\\">";
                    xml += "<td>" + product_code + "</td>";
                    xml += "<td>" + product_name + "</td>";
                    xml += "<td>" + provider_name + "</td>";
                    xml += "<td>" + obj.getProduct_num() + "</td>";
                    xml += "<td>" + ObjectFormat.formatNumber(obj.getProduct_price(), "#,###.00") + "</td>";
                    xml += "<td>" + ObjectFormat.formatNumber(obj.getProduct_price() * obj.getProduct_num(), "#,###.00") + "</td>";
                    xml += "</tr>";
                }
                xml += "</table>\";";
            }
            out.println(xml);
        } catch (Exception e) {
            e.getMessage();
        }
        return mapping.findForward("NULL");
    }

    // 采购明细单点击采购单时获得所进产品列表
    public ActionForward getPurchaseProductList(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        try {
            response.setContentType("text/xml;charset=UTF-8");
            PrintWriter out = response.getWriter();
            String condition = " where purchase_id=" + getRequestPara(request) + " order by provider_id";
            List list = Webservice.listAll(TPurchaseProduct.class, condition, "");

            String xml = "";
            if (list != null) {
                xml += "document.all.product_list.innerHTML=\"<table width=96% border=0 cellpadding=2 cellspacing=1 class='n_tabb2'>"
                        + "<tr class='tabbackblue' align='center'>" + "<td>barcode #/条码</td>" + "<td>product name/名称</td>"
                        +
                        // "<td>vendor</td>" +
                        "<td>quantity/数量</td>" + "<td>price/价格</td>" + "<td>sub total/小计</td>" + "<td>Actual received/实际收到</td>"
                        + "<td>received price/收到价格</td>" + "<td>Receiver/接收人</td>" + "<td>checked/是否全部到货</td>" + "<td>remark/注释</td>" + "</tr>";
                for (int i = 0; i < list.size(); i++) {
                    TPurchaseProduct obj = (TPurchaseProduct) list.get(i);
                    // 替换' "
                    String product_code = obj.getProduct_code().replaceAll("'", "\\\\\'").replaceAll("\"", "\\\\\"");
                    String product_name = obj.getProduct_name().replaceAll("'", "\\\\\'").replaceAll("\"", "\\\\\"");
                    String provider_name = obj.getProvider_name().replaceAll("'", "\\\\\'").replaceAll("\"", "\\\\\"");
                    xml += "<tr class='tdout' align='center' onmouseover=\\\"this.className='tdover'\\\" onmouseout=\\\"this.className='tdout'\\\">";
                    xml += "<td>" + product_code + "</td>";
                    xml += "<td>" + product_name + "</td>";
                    // xml +=
                    // "<td><a href='#' onclick=\\\"win = window.open('"+request.getContextPath()+"/provider.do?action=view&id="+obj.getProvider_id()+"','vendor','height=400, width=800, top=0, left=0, toolbar=no, menubar=no, scrollbars=no,resizable=no,location=no, status=no');"
                    // +
                    // "win.moveTo((screen.width-800)/2,(screen.height-400)/2);\\\">"+provider_name+"</a></td>";
                    xml += "<td>" + obj.getProduct_num() + "</td>";
                    xml += "<td>" + ObjectFormat.formatNumber(obj.getProduct_price(), "#,###.00") + "</td>";
                    xml += "<td>" + ObjectFormat.formatNumber(obj.getProduct_price() * obj.getProduct_num(), "#,###.00") + "</td>";
                    xml += "<td><input type='text' size='2' name='actual_received' value='0'/></td>";
                    xml += "<td><input type='text' size='2' name='received_price' value='0'/></td>";
                    xml += "<td><input type='text' size='10' name='receiver' value='" + obj.getReceiver() + "'/></td>";
                    if (obj.getIf_stock() == 1)
                        xml += "<td><input type='checkbox'size=10 name='checkbox' value='" + obj.getId() + "' checked></td>";
                    else
                        xml += "<td><input type='checkbox' value='" + obj.getId() + "' name='checkbox'></td>";
                    xml += "<td><input type='hidden' name='ids' value='" + obj.getId() + "'><textarea name='remarks' cols='30' rows='2'>"
                            + (obj.getRemark() == null ? "" : obj.getRemark()) + "</textarea></td>";
                    xml += "</tr>";
                }
                xml += "</table>\";f_iframeResize();";
            }
            out.println(xml);
        } catch (Exception e) {
            e.getMessage();
        }
        return mapping.findForward("NULL");
    }


    private String getRequestPara(HttpServletRequest request) throws IOException, DocumentException {
        SAXReader xmlReader = new SAXReader();
        InputStream in = request.getInputStream();
        Document doc = xmlReader.read(in);
        Node node = doc.selectSingleNode("para");
        String text = node.getText();
        return text;
    }

    public ActionForward getXml(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) {
        try {
            PrintWriter out = response.getWriter();
            String xml = "<xml></xml>";
            out.println(xml);
        } catch (Exception e) {
            e.getMessage();
        }
        return mapping.findForward("NULL");
    }
}
