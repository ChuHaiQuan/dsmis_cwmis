/**
 * 销售单查询
 */
Ext.define('WJM.sale.MySaleModel', {
	extend : 'Ext.ux.desktop.Module',

	requires : [ 'WJM.model.TSale', 'WJM.model.TSaleProduct' ],

	id : 'mysale',

	init : function() {
		this.id = this.config.moduleId || 'mysale';
		this.title = this.config.menuText || 'my sale/我的销售';
	},

	createWindow : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow(this.id);
		if (!win) {
			var grid = Ext.create('WJM.sale.SaleGrid', {
				deleteAble : true, editAble : true, onlyMy : false, saleStore : 'SaleMyStore', saleProductStore : 'SaleProductMyStore',
				reciveAble : true, title : '销售订单'
			});
			win = desktop.createWindow({
				id : this.id, title : this.title, width : 980, height : 600, iconCls : 'icon-grid', animCollapse : false, constrainHeader : true,
				layout : 'fit', items : [ grid ]
			});
		}
		return win;
	}
});
