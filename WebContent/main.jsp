<%@page import="com.poweronce.util.Constants"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jstl/core" prefix="c"%>
<!DOCTYPE HTML>
<html>
<head>
<meta charset="UTF-8" />
<title>ERP AND POS SYSTEM</title>
<%@ include file="/css/morn98.jsp"%>
<script type="text/javascript">location.context='<%=request.getContextPath()%>';</script>
<%-- 正式发布配置  
<script type="text/javascript" src="<%=request.getContextPath()%>/js/core/ext-all.js?v=20150109" charset="UTF-8"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/allclass.js?v=20150109" charset="UTF-8"></script>
<%-- /正式发布配置   --%>
<%-- 开发配置模式   --%>

<script type="text/javascript"	src="<%=request.getContextPath()%>/js/core/bootstrap.js" charset="UTF-8"></script>
<script type="text/javascript">Ext.Loader.setConfig({enabled:true});</script>
<%-- /开发配置模式  --%>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/core/ext-lang-zh_CN.js?v=20121212" charset="UTF-8"></script>
<script type="text/javascript">
	window.user={};
	window.user.userPowers=[
			<c:forEach items="${sessionScope.power}" var="row" varStatus="status">
				<c:if test="${status.last}">
					<c:out value="${row.operationCode}"/>
				</c:if>
				<c:if test="${!status.last}">
					<c:out value="${row.operationCode}"/>,
				</c:if>
			</c:forEach>
	    ];
	window.user.userName='<c:out value="${sessionScope.user_name}"/>';
	window.user.userId=<c:out value="${sessionScope.user_id}"/>;
	window.user.userCode='<c:out value="${sessionScope.user_code}"/>';
	window.invoiceTax=<%=Constants.invoiceTax%>;
	Ext.Loader.setConfig({enabled:true});
  Ext.Loader.setPath({
      'Ext.ux.desktop': 'js/core/destop/core',
      'WJM': 'js/core/destop',
      'WJM.employee': 'js/employee',
      'WJM.model': 'js/model',
      'WJM.power': 'js/power',
      'WJM.vendor': 'js/vendor',
      'WJM.customer': 'js/customer',
      'WJM.product': 'js/product',
      'WJM.stock': 'js/stock',
      'WJM.sale': 'js/sale',
      'WJM.cash': 'js/cash',
      'Ext.ux.grid':'js/core',
      'Ext.ux.form.field':'js/core',
      'Ext.ux':'js/core',
      'WJM.purchase':'js/purchase',
      'WJM.admin':'js/admin',
      'WJM.rma':'js/rma'
  });
</script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/core/config.js" charset="UTF-8"></script>
<script type="text/javascript">
        
          Ext.require('WJM.App');
          Ext.require('Ext.ux.grid.Printer');
          Ext.require('Ext.ux.form.field.AdNumberField');
        var myDesktopApp;
        Ext.onReady(function () {
        	
          Ext.ux.grid.Printer.stylesheetPath = location.context + '/css/print.css';
          myDesktopApp = new WJM.App();
          
          Ext.require('WJM.model.TEmployee');
          Ext.require('WJM.model.TProductCategory');
          Ext.require('WJM.purchase.PurchaseGrid');
          Ext.require('WJM.model.TPurchase');
          Ext.require('WJM.model.TPurchaseProduct');
        });
</script>
</head>
<body id="bodycss">

</body>
</html>