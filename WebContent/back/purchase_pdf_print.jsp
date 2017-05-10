<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib uri="/WEB-INF/struts-html.tld" prefix="html" %>
<%@ taglib uri="http://java.sun.com/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jstl/fmt" prefix="fmt" %>
<%@	page import="java.util.*" %>
<html>
<head>
<title>print</title>
</head>
<body style="background-color: #FFFFFF">
<table border="0" width="98%" height="98%" cellspacing="0" cellpadding="0">
<tr>
<td align="center" class="gr1">
<iframe width="98%" height="98%" src="<%=request.getContextPath()%>/purchase_order.do?action=show_pdf" />
</td>
</tr>
</table>
</body>
</html>
