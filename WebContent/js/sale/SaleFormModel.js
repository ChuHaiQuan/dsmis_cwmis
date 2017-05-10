/**
 * 订单模块
 */
Ext.define('WJM.sale.SaleFormModel', {
	extend : 'Ext.ux.desktop.Module',

	requires : [ 'WJM.model.TSale', 'WJM.model.TSaleProduct' ],

	id : 'sale',

	init : function() {
		this.id = this.config.moduleId || 'sale';
		this.title = this.config.menuText || 'sale/销售';
	},

	createWindow : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow(this.id);
		if (!win) {
			var grid = Ext.create('WJM.sale.SaleForm');
			win = desktop.createWindow({
				id : this.id, title : this.title, width : 900, height : 750, iconCls : 'icon-grid', animCollapse : false, constrainHeader : true,
				layout : 'fit', items : grid
			});
			win.down('form').clearForm(true);
		} else {
			win.down('form').clearForm(true);
		}
		return win;
	}
});
