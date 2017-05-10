/**
 * 损害报表
 */
Ext.define('WJM.rma.DamageReportModel', {
	extend : 'Ext.ux.desktop.Module',

	requires : [ 'WJM.model.TDamageReport' ],

	id : 'damagereport',

	init : function() {
		this.id = this.config.moduleId || 'damagereport';
		this.title = this.config.menuText || 'damage report/损坏报表';
	},

	createWindow : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow(this.id);
		if (!win) {
			var grid = Ext.create('WJM.rma.DamageReportGrid', {});
			win = desktop.createWindow({
				id : this.id, title : this.title, width : 500, height : 400, iconCls : 'icon-grid', animCollapse : false, constrainHeader : true,
				layout : 'fit', items : grid
			});
		}
		return win;
	}
});
