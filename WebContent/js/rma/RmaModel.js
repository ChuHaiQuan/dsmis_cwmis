/**
 * 销售月报表
 */
Ext.define('WJM.rma.RmaModel', {
	extend : 'Ext.ux.desktop.Module',

	requires : [ 'WJM.model.TSaleTop' ],

	id : 'RMA',

	init : function() {
		this.id = this.config.moduleId || 'RMA';
		this.title = this.config.menuText || 'RMA/退货';
	},

	createWindow : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow(this.id);
		if (!win) {
			var grid = Ext.create('WJM.rma.RmaForm', {});
			win = desktop.createWindow({
				id : this.id, title : this.title, width : 900, height : 600, iconCls : 'icon-grid', animCollapse : false, constrainHeader : true,
				layout : 'fit', items : grid
			});
		} else {
		}
		return win;
	}
});
