/**
 * 订单模块
 */
Ext.define('WJM.purchase.PurchaseFormModel', {
	extend : 'Ext.ux.desktop.Module',

	requires : [ 'WJM.model.TPurchase', 'WJM.model.TPurchaseProduct' ],

	id : 'purchase',

	init : function() {
		this.id = this.config.moduleId || 'purchase';
		this.title = this.config.menuText || 'P.O.(General)/订货';
	},

	createWindow : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow(this.id);
		if (!win) {
			var grid = Ext.create('WJM.purchase.PurchaseForm');
			win = desktop.createWindow({
				id : this.id, title : this.title, width : 800, height : 500, iconCls : 'icon-grid', animCollapse : false, constrainHeader : true,
				layout : 'fit', items : grid
			});
			win.down('form').clearForm();
		} else {
			win.down('form').clearForm();
		}
		return win;
	}
});
