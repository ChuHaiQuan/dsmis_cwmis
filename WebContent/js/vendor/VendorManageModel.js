Ext.define('WJM.vendor.VendorManageModel', {
	extend : 'Ext.ux.desktop.Module',

	requires : [ 'WJM.model.TVendor' ],

	id : 'vendor',

	init : function() {
		this.id = this.config.moduleId || 'vendor';
		this.title = this.config.menuText || 'vendor/商家';
	},

	createWindow : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow(this.id);
		if (!win) {
			var grid = Ext.create('WJM.vendor.VendorGrid', {
				editAble : true
			});
			win = desktop.createWindow({
				id : this.id, title : this.title, width : 900, height : 800, iconCls : 'icon-grid', animCollapse : false, constrainHeader : true, layout : 'fit',
				items : [ grid ]
			});
		}
		return win;
	}
});
