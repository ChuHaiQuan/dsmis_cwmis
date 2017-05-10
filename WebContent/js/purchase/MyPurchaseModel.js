/**
 * 我的销售单
 */
Ext.define('WJM.purchase.MyPurchaseModel', {
	extend : 'Ext.ux.desktop.Module',

	requires : [ 'WJM.model.TPurchase', 'WJM.model.TPurchaseProduct' ],

	id : 'mypurchase',

	init : function() {
		this.id = this.config.moduleId || 'mypurchase';
		this.title = this.config.menuText || 'my P.O./我的订货';
	},

	createWindow : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow(this.id);
		if (!win) {
			var grid = Ext.create('WJM.purchase.PurchaseGrid', {
				editAble : true, receiveAble : false, cashAble : false, deleteAble : true, purchaseStore : 'PurchaseMyStore',
				purchaseProductStore : 'PurchaseProductMyStore', onlyMy : true
			});
			win = desktop.createWindow({
				id : this.id, title : this.title, width : 980, height : 600, iconCls : 'icon-grid', animCollapse : false, constrainHeader : true,
				layout : 'fit', items : grid
			});
		}
		return win;
	}
});
