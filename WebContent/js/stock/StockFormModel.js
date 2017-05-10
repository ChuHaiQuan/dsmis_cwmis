/**
 * 库存表单模块 po 收货
 */
Ext.define('WJM.stock.StockFormModel', {
	extend : 'Ext.ux.desktop.Module',

	requires : [ 'WJM.model.TStock', 'WJM.model.TStockProduct', 'WJM.model.TPurchase','WJM.purchase.PurchaseGrid' ],

	id : 'stock',

	init : function() {
		this.id = this.config.moduleId || 'stock';
		this.title = this.config.menuText || 'Inventory/收货';
	},

	createWindow : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow(this.id);
		if (!win) {
			var grid = Ext.create('WJM.purchase.PurchaseGrid', {
				editAble : false, receiveAble : true, cashAble : false
			});
			win = desktop.createWindow({
				id : this.id, title : this.title, width : 980, height : 600, iconCls : 'icon-grid', animCollapse : false, constrainHeader : true,
				layout : 'fit', items : grid
			});
		} else {
			win.down('form').clearForm();
		}
		return win;
	}
});
