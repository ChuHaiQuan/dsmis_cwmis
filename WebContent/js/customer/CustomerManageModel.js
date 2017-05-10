Ext.define('WJM.customer.CustomerManageModel', {
	extend : 'Ext.ux.desktop.Module',

	requires : [ 'WJM.model.TCustomer' ],

	id : 'customer',

	init : function() {
		this.id = this.config.moduleId || 'customer';
		this.title = this.config.menuText || 'customer/客户';
	},

	createWindow : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow(this.id);
		if (!win) {
			var grid = Ext.create('WJM.customer.CustomerGrid', {
				editAble : true, cashAble : true
			});
			win = desktop.createWindow({
				id : this.id, title : this.title, width : 900, height : 800, iconCls : 'icon-grid', animCollapse : false, constrainHeader : true,
				layout : 'fit', items : [ grid ]
			});
		}
		return win;
	}
});
