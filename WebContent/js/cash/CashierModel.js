/**
 * 付款
 */
Ext.define('WJM.cash.CashierModel', {
	extend : 'Ext.ux.desktop.Module',

	requires : [ 'WJM.model.TSale', 'WJM.model.TSaleProduct' ],

	id : 'cash',

	init : function() {
		this.id = this.config.moduleId || 'cash';
		this.title = this.config.menuText || 'cashier/支付';
	},

	createWindow : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow(this.id);
		if (!win) {
			var grid = Ext.create('WJM.sale.SaleGrid', {
				title : 'sale', deleteAble : true, cashAble : true, reciveAble : true
			});
			var grid2 = Ext.create('WJM.purchase.PurchaseGrid', {
				title : 'purchase', deleteAble : true, cashAble : true
			});
			win = desktop.createWindow({
				id : this.id, title : this.title, width : 980, height : 600, iconCls : 'icon-grid', animCollapse : false, constrainHeader : true,
				layout : 'fit', items : {
					xtype : 'tabpanel', items : [ grid, grid2 ]
				}
			});
		}
		return win;
	}
});
