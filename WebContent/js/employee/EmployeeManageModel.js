Ext.define('WJM.employee.EmployeeManageModel', {
	extend : 'Ext.ux.desktop.Module',

	requires : [ 'WJM.model.TEmployee' ],

	id : 'employee',

	init : function() {
		this.id = this.config.moduleId || 'employee';
		this.title = this.config.menuText || 'employee/员工';
	},

	createWindow : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow(this.id);
		if (!win) {
			var grid = Ext.create('WJM.employee.EmployeeGrid', {
				editAble : true
			});
			win = desktop.createWindow({
				id : this.id, title : this.title, width : 740, height : 480, iconCls : 'icon-grid', animCollapse : false, constrainHeader : true, layout : 'fit',
				items : [ grid ]
			});
			grid.getStore().loadPage(1);
		}
		return win;
	}
});
