Ext.require([ 'Ext.form.*', 'Ext.layout.container.Absolute', 'Ext.window.Window', 'WJM.employee.LoginWindow' ]);
Ext.onReady(function() {
	// 登录
	var win = Ext.create('WJM.employee.LoginWindow', {
		height : 350,
		submitConfig : {
			success : function(form, action) {
				location.href = location.context + "/login.do?action=main";
			},
			failure : function(form, action) {
				Ext.Msg.alert('错误', "登录失败，请重试");
			}
		}
	});
	win.show();
});