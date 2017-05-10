/**
 * 销售月报表
 */
Ext.define('WJM.sale.SaleMonthlyReportModel', {
	extend : 'Ext.ux.desktop.Module',

	requires : [ 'WJM.model.TSaleTop' ],

	id : 'monthlyreport',

	init : function() {
		this.id = this.config.moduleId || 'monthlyreport';
		this.title = this.config.menuText || 'monthly report/每月报表';
	},

	createWindow : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow(this.id);
		if (!win) {
			var grid = Ext.create('WJM.sale.SaleTopGrid', {
				reportType : 'monthlySaleReport'
			});
			win = desktop.createWindow({
				id : this.id, title : this.title, width : 500, height : 500, iconCls : 'icon-grid', animCollapse : false, constrainHeader : true,
				layout : 'fit', items : grid
			});
		}
		return win;
	}
});
