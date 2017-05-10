<%@ page contentType="text/html; charset=UTF-8" %>
<html>
<head>
<body onload="window.print();">
<img src="<%=request.getContextPath()%>/barcode?msg=<%=request.getParameter("code")%>&type=code128&fmt=png&res=200"/>
</body>
</html>
