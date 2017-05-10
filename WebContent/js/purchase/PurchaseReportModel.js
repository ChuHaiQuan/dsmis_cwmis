/**
 * 销售单查询
 */
Ext.define('WJM.purchase.PurchaseReportModel', {
	extend : 'Ext.ux.desktop.Module',

	requires : [ 'WJM.model.TPurchase', 'WJM.model.TPurchaseProduct'],

	id : 'purchasedetail',

	init : function() {
		this.id = this.config.moduleId || 'purchasedetail';
		this.title = this.config.menuText || 'purchase detail/购买报表';
	},

	createWindow : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow(this.id);
		if (!win) {
			var grid = Ext.create('WJM.purchase.PurchaseGrid', {
				editAble : false, receiveAble : false, cashAble : false, deleteAble : false
			});
			win = desktop.createWindow({
				id : this.id, title : this.title, width : 980, height : 600, iconCls : 'icon-grid', animCollapse : false, constrainHeader : true,
				layout : 'fit', items : grid
			});
		}
		return win;
	}
});
