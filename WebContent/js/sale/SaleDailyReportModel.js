/**
 * 销售天报表
 */
Ext.define('WJM.sale.SaleDailyReportModel', {
	extend : 'Ext.ux.desktop.Module',

	requires : [ 'WJM.model.TSaleTop' ],

	id : 'dailyreport',

	init : function() {
		this.id = this.config.moduleId || 'dailyreport';
		this.title = this.config.menuText || 'sale detail/销售报表';
	},

	createWindow : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow(this.id);
		if (!win) {
			var grid = Ext.create('WJM.sale.SaleTopGrid', {
				reportType : 'daySaleReport'
			});
			win = desktop.createWindow({
				id : this.id, title : this.title,width : 980, height : 600,iconCls : 'icon-grid', animCollapse : false, constrainHeader : true,
				layout : 'fit', items : grid
			});
		}
		return win;
	}
});
