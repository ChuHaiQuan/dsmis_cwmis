/**
 * 超期未付款报表
 */
Ext.define('WJM.sale.CreditWarningModel', {
	extend : 'Ext.ux.desktop.Module',

	requires : [ 'WJM.model.TCreditWarning' ],

	id : 'pastDueReport',

	init : function() {
		this.id = this.config.moduleId || 'pastDueReport';
		this.title = this.config.menuText || 'past due report/超时付款报表';
	},

	createWindow : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow(this.id);
		if (!win) {
			var grid = Ext.create('WJM.sale.CreditWarningGrid', {
			});
			win = desktop.createWindow({
				id : this.id, title : this.title, width : 500, height : 500, iconCls : 'icon-grid', animCollapse : false, constrainHeader : true,
				layout : 'fit', items : grid
			});
		}
		return win;
	}
});
