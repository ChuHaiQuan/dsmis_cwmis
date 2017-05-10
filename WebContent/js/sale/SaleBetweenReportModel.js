/**
 * 销售月报表
 */
Ext.define('WJM.sale.SaleBetweenReportModel', {
	extend : 'Ext.ux.desktop.Module',

	requires : [ 'WJM.model.TSaleTop' ],

	id : 'reportbetween',

	init : function() {
		this.id = this.config.moduleId || 'reportbetween';
		this.title = this.config.menuText || 'Sales Report Between/自选销售报表';
	},

	createWindow : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow(this.id);
		if (!win) {
			var grid = Ext.create('WJM.sale.SaleTopGrid', {
				reportType : 'bettenSaleReport'
			});
			win = desktop.createWindow({
				id : this.id, title : this.title, width : 500, height : 500, iconCls : 'icon-grid', animCollapse : false, constrainHeader : true,
				layout : 'fit', items : grid
			});
		}
		return win;
	}
});
