/**
 * 销售单查询
 */
Ext.define('WJM.sale.SaleReportModel', {
	extend : 'Ext.ux.desktop.Module',

	requires : [ 'WJM.model.TSale', 'WJM.model.TSaleProduct' ],

	id : 'saledetail',

	init : function() {
		this.id = this.config.moduleId || 'saledetail';
		this.title = this.config.menuText || 'daily report/日常报表';
	},

	createWindow : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow(this.id);
		if (!win) {
			var grid = Ext.create('WJM.sale.SaleGrid', {
				rmaAble : true
			});
			win = desktop.createWindow({
				id : this.id, title : this.title, width : 980, height : 600, iconCls : 'icon-grid', animCollapse : false, constrainHeader : true,
				layout : 'fit', items : grid
			});
		}
		return win;
	}
});
