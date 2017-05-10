<%@ page contentType="text/html; charset=UTF-8" %>
<script language='javascript'>
alert("session timeout ,please login again.");
parent.location = "<%=request.getContextPath()%>/index.jsp";
</script>

