Ext.define('WJM.employee.ChangePasswordModel', {
	extend : 'Ext.ux.desktop.Module',

	id : 'changepassword',

	init : function() {
		this.id = this.config.moduleId || 'changepassword';
		this.title = this.config.menuText || 'change password/修改密码';
	},

	createWindow : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow(this.id);
		if (!win) {
			var grid = Ext.create('WJM.employee.ChangePasswordForm', {
				listeners : {
					saveSuccess : function() {
						win.destroy();
						location.href = location.context + "/login.do?action=logout";
					}
				}
			});
			win = desktop.createWindow({
				id : this.id, title : this.title, width : 500, height : 200, iconCls : 'icon-grid', animCollapse : false, constrainHeader : true,
				layout : 'fit', items : [ grid ]
			});
		}
		return win;
	}
});
