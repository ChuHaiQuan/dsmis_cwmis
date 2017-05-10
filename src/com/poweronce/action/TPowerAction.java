package com.poweronce.action;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.beanutils.BeanUtils;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.json.simple.JSONObject;

import com.poweronce.entity.TEmployee;
import com.poweronce.entity.TPower;
import com.poweronce.entity.TPower.TPowerVo;
import com.poweronce.entity.TPowerOperation;
import com.poweronce.form.TPowerForm;
import com.poweronce.service.Webservice;
import com.poweronce.util.ExtUtil;
import com.poweronce.util.JsonUtil;

public class TPowerAction extends BaseDispatchAction {
    public ActionForward list(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        // TPowerForm tf = (TPowerForm)form;
        // tf.setPagesize(new Integer(1000));
        return super.superListPage(mapping, form, request, response, "", "");
    }

    @SuppressWarnings("unchecked")
    public ActionForward get(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        Object id = request.getParameter("id");
        Long lid = new Long(-1);
        if (id != null)
            lid = new Long(id.toString());
        List<TPowerOperation> list = Webservice.listAll(TPowerOperation.class, " where PopedomCode=" + lid, "");
        TPower tPower = Webservice.get(TPower.class, id);
        if (tPower != null) {
            List<TPowerVo> powers = new ArrayList<TPowerVo>();
            TPowerVo powerVo = new TPowerVo();
            BeanUtils.copyProperties(powerVo, tPower);
            powerVo.setOperations(list);
            powers.add(powerVo);
            response.getWriter().println(ExtUtil.genExtListString(powers, 1));
        } else {
            JSONObject jsonObject = null;
            jsonObject = JsonUtil.getFailJson("权限未找到");
            response.getWriter().println(jsonObject.toString());
        }

        return null;
    }

    public ActionForward del(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        Object id = request.getParameter("id");
        Long lid = new Long(-1);
        if (id != null)
            lid = new Long(id.toString());
        Webservice.execute(TPowerOperation.class, "delete from TPowerOperation where PopedomCode=" + lid);
        return super.superDelete(mapping, form, request, response);
    }

    public ActionForward save(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        try {
            // 保存权限名
            TPowerForm tf = (TPowerForm) form;
            TPower entity = new TPower();
            BeanUtils.copyProperties(entity, form);
            Long id = new Long(Webservice.insert(entity));
            // 删除本权限的所有选项
            Webservice.execute(TEmployee.class, "update TEmployee set Popedom=" + id + " where Popedom=" + tf.getId());
            Webservice.execute(TPower.class, "delete from TPower where id=" + entity.getId());
            Webservice.execute(TPowerOperation.class, "delete from TPowerOperation where PopedomCode=" + tf.getId());
            // 添加选择的所有权限
            String power_items[] = tf.getPower_items();
            if (power_items != null) {
                TPowerOperation fo = new TPowerOperation();
                fo.setPopedomCode(id.intValue());
                for (int i = 0; i < power_items.length; i++) {
                    fo.setOperationCode(Integer.parseInt(power_items[i]));
                    Webservice.insert(fo);
                }
            }
            JSONObject jsonObject = JsonUtil.getSuccessJson();
            response.getWriter().println(jsonObject.toString());
            return null;
        } catch (Exception e) {
            log.error("保存异常", e);
            JSONObject jsonObject = JsonUtil.getFailJson("保存失败");
            response.getWriter().println(jsonObject.toString());
            return null;
        }
    }

}
