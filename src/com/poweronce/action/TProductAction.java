package com.poweronce.action;

import java.io.File;
import java.util.Collection;
import java.util.Collections;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

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
import com.poweronce.entity.TProductType;
import com.poweronce.entity.TProduct_vendor;
import com.poweronce.form.TProductForm;
import com.poweronce.form.TProductTypeForm;
import com.poweronce.model.PaginationSupport;
import com.poweronce.service.Webservice;
import com.poweronce.util.ExtUtil;
import com.poweronce.util.JsonUtil;
import com.poweronce.util.POIUtil;
import com.poweronce.util.ProductUtil;
import com.poweronce.validator.Validation;

public class TProductAction extends BaseDispatchAction {
    public ActionForward list(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        String pd = request.getParameter("product_id");
        String id=request.getParameter("id");
        String bc = request.getParameter("product_name");
        String lm = request.getParameter("code");
        String type = request.getParameter("product_type");
        String bol=request.getParameter("product_id_all");
        String vendor = request.getParameter("vendor");
        String condition = " where 1=1";
        String orderBy="";
        
        if (!StringUtils.isEmpty(pd)){
        	if(StringUtils.isNotBlank(bol) && bol.toLowerCase().equals("true")){
            	condition += " and TProduct.product_id = '" + pd.trim() + "'";

        	}{
            	condition += " and TProduct.product_id like '%" + pd.trim() + "%'";

        	}
        	
        }
        if(!StringUtils.isEmpty(id)){
        	condition += " and TProduct.id = '" + id.trim() + "'";
        }
        if (!StringUtils.isEmpty(bc))
            condition += " and (TProduct.Product_name like '%" + bc.trim() + "%' or TProduct.product_name_cn like '%" + bc.trim() + "%')";
        if (!StringUtils.isEmpty(lm))
            condition += " and Code like '%" + lm.trim() + "%'";
        if (!StringUtils.isEmpty(type))
            condition += " and product_type = '" + type.trim() + "'";
        
       
        if (StringUtils.isNotEmpty(pd)) {
        	orderBy= " order by abs(length(TProduct.product_id)-length('" + pd.trim() + "')),product_id";
        } else {
        	orderBy= " order by product_id,size";
        }
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

        long nCount = Webservice.getRowCount(TProduct.class, condition+orderBy);
        long offset = iPageSize * (iCurrPage - 1);
        if(StringUtils.isNotEmpty(vendor)){
        	condition += " and TProduct_vendor.vendor_name like '%" + vendor.trim() + "%'";
        }
        String sql = "select TProduct.price_company,TProduct.price_wholesale,TProduct.id,TProduct.product_id,TProduct.`Code`,TProduct.product_name,TProduct.Spec,TProduct.Unit,TProduct.UpLimit,TProduct.DownLimit,TProduct.Price_simgle,TProduct.Drawing,TProduct.HelpName,TProduct.MyMemo,TProduct.Drawing2,TProduct.Drawing3,TProduct.Drawing4,TProduct.Drawing5,TProduct.Drawing6,TProduct.Drawing7,TProduct.Drawing8,TProduct.Drawing9,TProduct.Sreserve1,TProduct.Sreserve2,TProduct.Sreserve3,TProduct.freserve1,TProduct.freserve2,TProduct.freserve3,TProduct.product_type,TProduct.num,TProduct.product_name_cn,TProduct.size,TProduct.weight,TProduct_vendor.vendor_id provider_id,TProduct_vendor.price Price_income,TProduct_vendor.vendor_name vendortName from TProduct left join TProduct_vendor on TProduct.id=TProduct_vendor.product_id and TProduct_vendor.useDefault=1 "
                + condition +orderBy+ " limit " + iPageSize + " OFFSET " + offset;
        List list = Webservice.listAllBySql(TProductVo.class, sql);
        response.getWriter().println(ExtUtil.genExtListString(list, nCount));
        return null;
    }

    public ActionForward listStoreAlert(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        String sql = "SELECT TProduct.price_company,TProduct.price_wholesale, TProduct.id, TProduct.product_id, TProduct.`Code`, TProduct.product_name, TProduct.Spec, TProduct.Unit, TProduct.UpLimit, TProduct.DownLimit, TProduct.Price_simgle, TProduct.Drawing, TProduct.HelpName, TProduct.MyMemo, TProduct.Drawing2, TProduct.Drawing3, TProduct.Drawing4, TProduct.Drawing5, TProduct.Drawing6, TProduct.Drawing7, TProduct.Drawing8, TProduct.Drawing9, TProduct.Sreserve1, TProduct.Sreserve2, TProduct.Sreserve3, TProduct.freserve1, TProduct.freserve2, TProduct.freserve3, TProduct.product_type, TProduct.num, TProduct.product_name_cn, TProduct.size, TProduct.weight, TProduct_vendor.vendor_id provider_id, TProduct_vendor.price Price_income, TProduct_vendor.vendor_name vendortName";
        sql += " FROM TProduct, ";
        sql += "(SELECT TSaleProduct.product_id, sum(TSaleProduct.product_num) nums FROM TSaleProduct WHERE sale_id IN(SELECT id FROM TSale WHERE if_cashed = 0) GROUP BY TSaleProduct.product_id) cachnum, TProduct_vendor ";
        sql += "WHERE cachnum.product_id = TProduct.id AND num-cachnum.nums < DownLimit AND TProduct.id = TProduct_vendor.product_id  and TProduct_vendor.useDefault=1 ";
        List list = Webservice.listAllBySql(TProductVo.class, sql);
        response.getWriter().println(ExtUtil.genExtListString(list, list != null ? list.size() : 0));
        return null;
    }

    public ActionForward quickSearch(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        String pq = request.getParameter("product_quick");
        if (StringUtils.isNotBlank(pq)) {
            String condition = " where 1=1";
            if (StringUtils.isNotBlank(pq))
                condition += " and TProduct.product_id  like '" + pq + "%' or TProduct.`Code` like '%" + pq
                        + "%' or TProduct.product_name like '" + pq + "%' or TProduct.product_name_cn like '%" + pq + "%'";
            condition += " order by abs(length(TProduct.product_id)-length('" + pq + "'))";

            long nCount = Webservice.getRowCount(TProduct.class, condition);
            String sql = "select TProduct.price_company,TProduct.price_wholesale,TProduct.id,TProduct.product_id,TProduct.`Code`,TProduct.product_name,TProduct.Spec,TProduct.Unit,TProduct.UpLimit,TProduct.DownLimit,TProduct.Price_simgle,TProduct.Drawing,TProduct.HelpName,TProduct.MyMemo,TProduct.Drawing2,TProduct.Drawing3,TProduct.Drawing4,TProduct.Drawing5,TProduct.Drawing6,TProduct.Drawing7,TProduct.Drawing8,TProduct.Drawing9,TProduct.Sreserve1,TProduct.Sreserve2,TProduct.Sreserve3,TProduct.freserve1,TProduct.freserve2,TProduct.freserve3,TProduct.product_type,TProduct.num,TProduct.product_name_cn,TProduct.size,TProduct.weight,TProduct_vendor.vendor_id provider_id,TProduct_vendor.price Price_income,TProduct_vendor.vendor_name vendortName from TProduct left join TProduct_vendor on  TProduct.id=TProduct_vendor.product_id  and TProduct_vendor.useDefault=1 "
                    + condition + " limit 0, 50";
            List list = Webservice.listAllBySql(TProductVo.class, sql);
            response.getWriter().println(ExtUtil.genExtListString(list, nCount));
        } else {
            response.getWriter().println(ExtUtil.genExtListString(Collections.emptyList(), 0));
        }
        return null;
    }

    public ActionForward deleteProducts(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {

        try {
            TProductForm pform = (TProductForm) form;
            long ids = pform.getId();
            Webservice.delete(TProduct.class, ids);
            StringBuffer sql = new StringBuffer("delete from TProduct_vendor where product_id = " + ids);
            Webservice.execute(TProduct_vendor.class, sql.toString());
            response.getWriter().println(JsonUtil.getSuccessJson());
        } catch (Exception e) {
            response.getWriter().println(JsonUtil.getFailJson("失败，请稍候重试"));
            log.error("异常", e);
        }
        return null;
    }

    /**
     * **
     * 根据类别显示产品
     */
    public ActionForward listByType(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        long typeID = ProductUtil.parseValue(request.getParameter("product_type"), -1);
        StringBuffer condition = new StringBuffer(" where 1=1");
        if (typeID >= 0) {
            List<Long> allChildTypeIDs = new LinkedList<Long>();
            allChildTypeIDs.add(typeID);
            StringBuffer parentIdStr = new StringBuffer("(" + typeID + ")");
            while (parentIdStr != null) {
                List list = Webservice.listAll("TProductType", " where parent_id in " + parentIdStr.toString(), "");
                if (list == null || list.size() < 1) {
                    break;
                }
                parentIdStr = new StringBuffer("(");
                Iterator iterator = list.iterator();
                while (iterator.hasNext()) {
                    long id = ((TProductType) iterator.next()).getId();
                    parentIdStr.append(id + ",");
                    allChildTypeIDs.add(id);
                }
                parentIdStr.append("-1)");
            }
            Iterator<Long> iterator = allChildTypeIDs.iterator();
            condition.append(" and product_type in(");
            while (iterator.hasNext()) {
                condition.append("'" + iterator.next() + "',");
            }
            condition.append("'-1')");
        }
        return super.superListPage(mapping, form, request, response, condition.toString(), "order by product_id,size");
    }

    /**
     * 根据类别进行搜索：该类别可能是父类别， 所以要进行递归搜索
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward queryByType(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        long typeID = ProductUtil.parseValue(request.getParameter("product_type"), -1);
        StringBuffer condition = new StringBuffer(" where 1=1");
        if (typeID >= 0) {
            // List<Long> parentTypeIDList = new LinkedList<Long>();
            // parentTypeIDList.add(typeID);
            List<Long> allChildTypeIDs = new LinkedList<Long>();
            allChildTypeIDs.add(typeID);
            StringBuffer parentIdStr = new StringBuffer("(" + typeID + ")");
            while (parentIdStr != null) {
                List list = Webservice.listAll("TProductType", " where parent_id in " + parentIdStr.toString(), "");
                if (list == null || list.size() < 1) {
                    break;
                }
                parentIdStr = new StringBuffer("(");
                Iterator iterator = list.iterator();
                while (iterator.hasNext()) {
                    long id = ((TProductType) iterator.next()).getId();
                    parentIdStr.append(id + ",");
                    allChildTypeIDs.add(id);
                }
                parentIdStr.append("-1)");
            }
            Iterator<Long> iterator = allChildTypeIDs.iterator();
            condition.append(" and product_type in(");
            while (iterator.hasNext()) {
                condition.append("'" + iterator.next() + "',");
            }
            condition.append("'-1')");
        }
        super.superList(mapping, form, request, response, condition.toString(), "order by product_id,size");
        return mapping.findForward("query");
    }

    public ActionForward toadd(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        super.superList(mapping, new TProductTypeForm(), request, response, " where level=1", " order by product_type_name");
        request.setAttribute("product_type_list", request.getAttribute("list"));
        return mapping.findForward("select_product_type");
    }

    public ActionForward addinfo(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        return mapping.findForward("save");
    }

    public ActionForward query(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        TProductForm tf = (TProductForm) form;
        tf.setPagesize(new Integer(1000));
        String pt = tf.getProduct_type();
        String bc = tf.getProduct_name();
        String pd = tf.getProduct_id();
        String lm = tf.getCode();
        String parent_id = tf.getParent_id();
        String condition = " where 1=1";
        if (!StringUtils.isEmpty(pd))
            condition += " and product_id like '%" + pd.trim() + "%'";// like
        // 'pd'
        if (!StringUtils.isEmpty(pt))
            condition += " and Product_type='" + pt.trim() + "'";
        if (!StringUtils.isEmpty(bc))
            condition += " and Product_name like '%" + bc.trim() + "%'";
        if (!StringUtils.isEmpty(lm))
            condition += " and Code like '%" + lm.trim() + "%'";
        condition += " order by product_id,size";
        super.superList(mapping, form, request, response, condition, "");
        condition = "";
        if (!StringUtils.isEmpty(parent_id))
            condition = " where parent_id=" + parent_id;
        request.setAttribute("product_category_list", Webservice.listAll(TProductType.class, condition, " order by product_type_name"));
        if (request.getAttribute("list") == null || ((List) request.getAttribute("list")).size() == 0) {
            ActionErrors errors = new ActionErrors();
            Validation.addUserErrorInfo("No product fit for yor search, please enter you search condition again.", errors, request);
        }
        return mapping.findForward("query");
    }

    public ActionForward modi(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        super.toupdate(mapping, form, request, response);

        TProduct p = (TProduct) request.getAttribute("entity");
        request.setAttribute("list", Webservice.listAll(TProduct_vendor.class, " where product_id=" + p.getId(), ""));
        return mapping.findForward("get");
    }

    /**
     * 导入产品解析
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward importProduct(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
    	
    	String path = request.getParameter("path");
    	List<String[]> productList = POIUtil.readExcel(new File(path));
    	if(productList!=null && productList.size()>0){
    		for(String[] s : productList){
    			TProduct tProduct = new TProduct(s[0],
    					s[1],s[2],s[3],Float.parseFloat(s[4]),
    					Float.parseFloat(s[5]),Float.parseFloat(s[6]),Integer.parseInt(s[7]),Float.parseFloat(s[8]),s[9]);
    			Webservice.insert(tProduct);
    			//遍历数据,保存
    		}
    	}
    	JSONObject successJson = JsonUtil.getSuccessJson();
    	successJson.put("msg", "成功导入产品数据【"+productList.size()+"】条!");
    	response.getWriter().println(successJson.toJSONString());
        return null;
    }    
    
    public ActionForward save(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        ActionErrors errors = new ActionErrors();
        TProductForm theForm = (TProductForm) form;
        String pd = theForm.getProduct_id();
        String c = theForm.getCode();
        // 修改的时候不能和别人的一样
        String update = (theForm.getId() > 0) ? (" and id not in (" + theForm.getId() + ")") : "";
        List list = Webservice.listAll(TProduct.class, " where product_id='" + pd + "'" + update, "");
        if (list != null && list.size() > 0) {
            Validation.addUserErrorInfo("Your product id has used.Please use other name.", errors, request);
            return mapping.findForward("save");
        }
        list = Webservice.listAll(TProduct.class, " where code='" + c + "'" + update, "");
        if (list != null && list.size() > 0) {
            Validation.addUserErrorInfo("This barcode # has used.Please change the barcode.", errors, request);
            return mapping.findForward("save");
        }
        FormFile file = theForm.getTheFile();// 取得上传的文件
        String path = "/upfiles/product/";
        String filename = uploadPicture(file, path, theForm.getDrawing(), request, errors);
        if (filename == null) {
            return mapping.findForward("info");
        }
        if (filename.length() > 0)
            theForm.setDrawing(request.getContextPath() + path + filename);
        super.save(mapping, form, request, response);
        clearCondition(theForm);
        return super.superListPage(mapping, form, request, response, " order by id desc", "");
    }

    public void clearCondition(TProductForm form) throws Exception {
        form.setProduct_id("");
        form.setProduct_name("");
        form.setCode("");
    }

    public ActionForward save2(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        try {
            TProductForm theForm = (TProductForm) form;
            String pd = theForm.getProduct_id();
            String c = theForm.getCode();
            JSONArray fromObject = JSONArray.fromObject(theForm.getProductProviderJson());
            Collection<TProduct_vendor> collection = JSONArray.toCollection(fromObject, TProduct_vendor.class);
            if (collection == null || collection.size() <= 0) {
                response.getWriter().println(JsonUtil.getFailJson("请选择供货商"));
                return null;
            }
            List list;
            if (theForm.getId() <= 0) {
                // if (StringUtils.isNotBlank(pd)) {
                // list = Webservice.listAll(TProduct.class, " where product_id='" + pd + "'", "");
                // if (list != null && list.size() > 0) {
                // response.getWriter().println(JsonUtil.getFailJson("items id/助记符 已经被使用。请换一个"));
                // return null;
                // }
                // }
                if (StringUtils.isNotBlank(c)) {
                    list = Webservice.listAll(TProduct.class, " where code='" + c + "'", "");
                    if (list != null && list.size() > 0) {
                        response.getWriter().println(JsonUtil.getFailJson("产品barcode已经被使用。请换一个"));
                        return null;
                    }
                }
            } else {
                // if (StringUtils.isNotBlank(pd)) {
                // list = Webservice.listAll(TProduct.class, " where product_id='" + pd + "'", "");
                // if (list != null && list.size() > 1) {
                // response.getWriter().println(JsonUtil.getFailJson("items id/助记符 已经被使用。请换一个"));
                // return null;
                // }
                // }
                if (StringUtils.isNotBlank(c)) {
                    list = Webservice.listAll(TProduct.class, " where code='" + c + "'", "");
                    if (list != null && list.size() > 1) {
                        response.getWriter().println(JsonUtil.getFailJson("产品barcode已经被使用。请换一个"));
                        return null;
                    }
                }
            }
            FormFile file = theForm.getTheFile();// 取得上传的文件
            String path = "/upfiles/product/";
            String filename = uploadPicture(file, path, theForm.getDrawing(), request, new ActionErrors());
            if (filename != null && filename.length() > 0) {
                theForm.setDrawing(request.getContextPath() + path + filename);
            }
            TProduct pp = new TProduct();
            BeanUtils.copyProperties(pp, theForm);
            if (theForm.getId() > 0) {
                Webservice.update(pp, pp.getId());
            } else {
                String insert = Webservice.insert(pp);
                theForm.setId(Long.parseLong(insert));
            }
            TProduct pc = Webservice.get(TProduct.class, theForm.getId());
            if (pc == null) {
                response.getWriter().println(JsonUtil.getFailJson("失败，请稍候重试"));
                return null;
            }
            // 删除以前数据
            StringBuffer sql = new StringBuffer("delete from TProduct_vendor where product_id = " + pc.getId());
            Webservice.execute(TProduct_vendor.class, sql.toString());
            if (collection != null) {
                for (TProduct_vendor tProduct_vendor : collection) {
                    tProduct_vendor.setProduct_id((int) pc.getId());
                    tProduct_vendor.setProduct_name(pc.getProduct_name());
                    Webservice.insert(tProduct_vendor);
                }
            }
            response.getWriter().println(JsonUtil.getSuccessJson());
            return null;
        } catch (Exception e) {
            response.getWriter().println(JsonUtil.getFailJson("失败，请稍候重试"));
            log.error("保存产品失败", e);
            return null;
        }
    }
}
