/**
 *
 */
package com.poweronce.action;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;

import com.poweronce.dao.DAOException;
import com.poweronce.dao.TInvoiceDAO;
import com.poweronce.dao.TInvoiceHistoryDAO;
import com.poweronce.entity.TInvoice;
import com.poweronce.entity.TInvoiceHistory;
import com.poweronce.entity.TProvider;
import com.poweronce.form.TInvoiceForm;
import com.poweronce.service.Webservice;
import com.poweronce.util.ExtUtil;
import com.poweronce.util.JsonUtil;
import com.poweronce.util.StrutsUtil;

/**
 * @author Administrator
 */
public final class TInvoiceAction extends BaseDispatchAction {

    private Logger log = Logger.getLogger(TInvoiceAction.class);

    /**
     * *
     * 根据verdor id得到商家的账单列表
     */
    public ActionForward getProviderInvoice(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        TInvoiceForm invoiceForm = (TInvoiceForm) form;
        List<TInvoice> list = null;
        if (invoiceForm.getProvider_id() > 0) {
            TInvoiceDAO dao = new TInvoiceDAO();
            try {
                list = dao.queryByProvider(invoiceForm.getProvider_id());
            } finally {
                dao.close();
            }
        }
        if (list == null) {
            list = new ArrayList<TInvoice>(0);
        }
        request.setAttribute("list", list);
        return mapping.findForward("listByProvider");
    }

    /**
     * *
     * 根据verdor id得到商家的账单列表
     */
    public ActionForward addProviderInvoice(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        TInvoiceForm invoiceForm = (TInvoiceForm) form;
        if (isInvoiceInputValid(request, invoiceForm)) {
            TInvoiceDAO dao = new TInvoiceDAO();
            try {
                TInvoice invoice = dao.getInvoice(invoiceForm.getProvider_id(), invoiceForm.getPurchase_bill_code());
                if (invoice == null) {
                    invoice = dao.getInvoice(invoiceForm.getInvoice_code().trim());
                    if (invoice != null) {
                        StrutsUtil.setMessage(request, "No duplicate invoice #!");
                    }
                } else {
                    StrutsUtil.setMessage(request, "Such purchase order already has an invoice/该定单已经存在相应的账单!");
                }
                if (invoice == null) {
                    invoice = TInvoice.copyInvoiceValue(invoiceForm);
                    dao.insert(invoice);
                    StrutsUtil.setMessage(request, "Add invoice success/成功添加账单!");
                }
            } finally {
                dao.close();
            }
        }
        return this.getProviderInvoice(mapping, form, request, response);
    }

    private boolean isInvoiceInputValid(HttpServletRequest request, TInvoiceForm invoiceForm) {
        if (invoiceForm == null) {
            return false;
        }
        if (invoiceForm.getProvider_id() < 1) {
            StrutsUtil.setMessage(request, "No such Vendor/您指定的商家已被删除!");
        } else if (StringUtils.isEmpty(invoiceForm.getInvoice_code())) {
            StrutsUtil.setMessage(request, "Please add invoice number/请添加账单号!");
        } else if (StringUtils.isEmpty(invoiceForm.getPurchase_bill_code())) {
            StrutsUtil.setMessage(request, "Please add purchase bill code/请添加定单号!");
        } else if (StringUtils.isEmpty(invoiceForm.getInvoiceDate())) {
            StrutsUtil.setMessage(request, "Please add invoice date/请添加账单日期!");
        } else if (invoiceForm.getAmout() < 0.01) {
            StrutsUtil.setMessage(request, "Error invoice amount/请填写正确的账单金额!");
        } else if (invoiceForm.getCredit() < 0) {
            StrutsUtil.setMessage(request, "Error invoice credit/请填写正确的账单Credit(Credit>=0)!");
        } else {
            Date date = StrutsUtil.parseDate(invoiceForm.getInvoiceDate(), "yyyy-MM-dd");
            if (date == null) {
                StrutsUtil.setMessage(request, "Error invoice date/错误的账单日期!");
                return false;
            }
            return true;
        }
        return false;
    }

    /**
     * delete invoices
     */
    public ActionForward deleteInvoices(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        long[] ids = ((TInvoiceForm) form).getIds();
        if (ids == null || ids.length < 1) {
            StrutsUtil.setMessage(request, "Please invoices to delete/请选择您要删除的账单!");
        } else {
            TInvoiceDAO dao = new TInvoiceDAO();
            try {
                // also need change invoice total and invoice balance
                dao.deleteByIds(ids);
            } finally {
                dao.close();
            }
            StrutsUtil.setMessage(request, "Success to delete invoices/成功删除账单!");
        }
        return this.getProviderInvoice(mapping, form, request, response);
    }

    /**
     * *
     * 根据verdor id得到账单的详细信息
     */
    public ActionForward detail(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        TInvoiceForm invoiceForm = (TInvoiceForm) form;
        TInvoice invoice = null;
        if (invoiceForm.getProvider_id() > 0 && !StringUtils.isEmpty(invoiceForm.getPurchase_bill_code())) {
            TInvoiceDAO dao = new TInvoiceDAO();
            try {
                invoice = dao.getInvoice(invoiceForm.getProvider_id(), invoiceForm.getPurchase_bill_code());
                if (invoice != null) {
                    TInvoiceHistoryDAO histDao = new TInvoiceHistoryDAO(dao);
                    List<TInvoiceHistory> list = histDao.getByInvoiceId(invoice.getId());
                    response.getWriter().println(ExtUtil.genExtListString(list, list != null ? list.size() : 0));
                    return null;
                }
            } finally {
                dao.close();
            }
        }
        response.getWriter().println(JsonUtil.getSuccessJson());
        return null;
    }

    /**
     * add/save invoice
     */
    public ActionForward save(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        try {
            TInvoiceForm invoiceForm = (TInvoiceForm) form;
            String meseeage = "";
            if (isInvoiceInputValid(request, invoiceForm)) {
                TInvoice invoice = TInvoice.copyInvoiceValue(invoiceForm);
                TInvoiceDAO dao = new TInvoiceDAO();
                try {
                    if (invoiceForm.getId() > 0) {
                        TInvoice tmpInvoice = dao.getInvoice(invoiceForm.getId());
                        double oldAmount = (tmpInvoice == null) ? 0.0 : tmpInvoice.getAmout();
                        if (tmpInvoice == null) {
                            meseeage = "No such invoice/该账单已被删除!";
                        } else {
                            TInvoice tmp = null;
                            if (!tmpInvoice.getInvoice_code().equals(invoiceForm.getInvoice_code().trim())) {
                                tmp = dao.getInvoice(invoiceForm.getInvoice_code().trim());
                                if (tmp != null) {
                                    meseeage = "No duplicate invoice #!";
                                }
                            }
                            if (tmp == null) {
                                dao.saveInvoice(invoice, oldAmount);
                                meseeage = "Update invoice success/成功更新账单!";
                            }
                        }
                    } else {
                        TInvoice tmp = dao.getInvoice(invoiceForm.getProvider_id(), invoiceForm.getPurchase_bill_code());
                        if (tmp == null) {
                            tmp = dao.getInvoice(invoiceForm.getInvoice_code().trim());
                            if (tmp != null) {
                                meseeage = "No duplicate invoice #!";
                            } else {
                                dao.insert(invoice);
                            }
                        } else {
                            meseeage = "Such purchase order already has an invoice/该定单已经存在相应的账单!";
                        }
                    }
                } finally {
                    dao.close();
                }
            }
            if (meseeage.equals("")) {
                response.getWriter().println(JsonUtil.getSuccessJson());
            } else {
                response.getWriter().println(JsonUtil.getFailJson(meseeage));
            }
        } catch (Exception e) {
            response.getWriter().println(JsonUtil.getFailJson("付款失败，请稍候重试"));
            log.error("异常", e);
        }
        return null;
    }

    /**
     * *
     * 支付账单
     */
    public ActionForward payInvoice(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        TInvoiceForm invoiceForm = (TInvoiceForm) form;
        if (invoiceForm.getPaidAmount() < 0.00001) {
            response.getWriter().println(JsonUtil.getFailJson("Error invoice pay amount/错误的账单支付金额!"));
            return null;
        }
        String meg = "";
        // update database
        TInvoiceDAO dao = new TInvoiceDAO();
        try {
            TInvoice invoice = dao.getInvoice(invoiceForm.getInvoice_code());
            // new TInvoiceHistory obj
            TInvoiceHistory history = new TInvoiceHistory();
            if (invoice == null) {
                meg = "No such invoice/该账单不存在!";
                response.getWriter().println(JsonUtil.getFailJson(meg));
                return null;
            } else if (invoiceForm.getPaidAmount() < 0.01) {
                meg = "Error Pay amout/错误的支付金额:账单支付金额太小!";
                meg = "No such invoice/该账单不存在!";
                response.getWriter().println(JsonUtil.getFailJson(meg));
                return null;
            }
            TProvider tProvider = Webservice.get(TProvider.class, invoice.getProvider_id());
            // 使用账户余额付款，判断余额大小限制
            if ("Account Balance".equals(invoiceForm.getPaymentMethod())) {
                if (tProvider.getAcc_balance() - invoice.getPaidAmount() < 0) {
                    meg = "账户余额不足！";
                    response.getWriter().println(JsonUtil.getFailJson(meg));
                    return null;
                }
            }
            double balance = 0;
            if (invoice.getPaidAmount() + invoice.getCredit() + invoiceForm.getPaidAmount() - invoice.getAmout() > 0.001) {
                balance = invoice.getPaidAmount() + invoice.getCredit() + invoiceForm.getPaidAmount() - invoice.getAmout();
                invoiceForm.setPaidAmount(invoice.getAmout() - invoice.getCredit() - invoice.getPaidAmount());
            }
            dao.startTransaction();
            history.setAmout(invoiceForm.getPaidAmount());
            history.setInvoice_id(invoice.getId());
            history.setPayment(invoiceForm.getPaymentMethod());
            history.setPayDate(new Date());
            history.setRemark(invoiceForm.getRemark());
            TInvoiceHistoryDAO histDao = new TInvoiceHistoryDAO(dao);
            histDao.insert(history);
            dao.payInvoice(invoice, invoiceForm.getPaidAmount());
            dao.commit();
            // 使用账户余额付款
            if ("Account Balance".equals(invoiceForm.getPaymentMethod())) {
                String sql = "update TProvider set acc_balance=acc_balance-" + invoiceForm.getPaidAmount() + " where id="
                        + tProvider.getId();
                Webservice.execute(TProvider.class, sql);
            } else {
                // 多余的钱，放账户余额
                String sql = "update TProvider set acc_balance=acc_balance+" + balance + " where id=" + tProvider.getId();
                Webservice.execute(TProvider.class, sql);
            }
        } catch (DAOException ex) {
            log.error("Fail to pay invoice: system error/账单支付失败:系统出错!", ex);
            dao.rollback();
            meg = "Fail to pay invoice: system error/账单支付失败:系统出错!";
        } finally {
            dao.close();
        }
        if (meg.equals("")) {
            response.getWriter().println(JsonUtil.getSuccessJson());
        } else {
            response.getWriter().println(JsonUtil.getFailJson(meg));
        }
        return null;
    }
}
