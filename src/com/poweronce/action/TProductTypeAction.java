package com.poweronce.action;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;

import org.apache.commons.beanutils.BeanUtils;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;

import com.poweronce.entity.TProductType;
import com.poweronce.entity.TProductType.TProductTypeTreeNode;
import com.poweronce.form.TProductTypeForm;
import com.poweronce.service.Webservice;
import com.poweronce.util.ExtUtil;
import com.poweronce.util.JsonUtil;

public class TProductTypeAction extends BaseDispatchAction {
    public ActionForward list(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        TProductTypeForm typeForm = (TProductTypeForm) form;
        List<TProductTypeTreeNode> nodes = new ArrayList<TProductTypeTreeNode>();
        List<TProductType> list;
        if (typeForm == null || "0".equals(typeForm.getNode())) {
            list = Webservice.listAll(TProductType.class, " where  parent_id = 0 ", " order by product_type_name ");
        } else {
            list = Webservice.listAll(TProductType.class, " where parent_id = " + typeForm.getNode(), " order by product_type_name ");
        }
        if (list != null) {
            for (TProductType tProductType : list) {
                TProductTypeTreeNode node = new TProductTypeTreeNode();
                BeanUtils.copyProperties(node, tProductType);
                nodes.add(node);
            }
        }
        JSONArray fromObject = JSONArray.fromObject(nodes);
        response.getWriter().println(fromObject.toString());
        return null;
    }

    public ActionForward listall(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        long nCount = Webservice.getRowCount(TProductType.class, "");
        List list = Webservice.listAll(TProductType.class, "", " order by product_type_name ");
        response.getWriter().println(ExtUtil.genExtListString(list, nCount));
        return null;
    }

    // 保存数据
    public ActionForward update(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        try {
            TProductType productType = new TProductType();
            TProductTypeForm productTypeForm = (TProductTypeForm) form;
            BeanUtils.copyProperties(productType, form);
            if (productTypeForm.getParentId() != null) {
                TProductType parentProductType = Webservice.get(TProductType.class, productTypeForm.getParentId());
                if (parentProductType != null) {
                    productType.setParent_id(productTypeForm.getParentId());
                }
            }
            Object id = request.getParameter("id");
            Webservice.update(productType, id);
            response.getWriter().println(JsonUtil.getSuccessJson());
        } catch (Exception e) {
            response.getWriter().println(JsonUtil.getFailJson("保存失败，请稍候重试"));
            log.error("异常", e);
        }
        return null;
    }
}
