/**
 * 报价单查询
 */
Ext.define('WJM.sale.MyQuoteModel', {
	extend : 'Ext.ux.desktop.Module',

	requires : [ 'WJM.model.TSale', 'WJM.model.TSaleProduct' ],

	id : 'myquote',

	init : function() {
		this.id = this.config.moduleId || 'myquote';
		this.title = this.config.menuText || 'my quote/我的报价';
	},

	createWindow : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow(this.id);
		if (!win) {
			var grid2 = Ext.create('WJM.sale.SaleQuoteGrid', {
				deleteAble : true, editAble : true, onlyMy : false, title : '报价单'
			});
			win = desktop.createWindow({
				id : this.id, title : this.title, width : 980, height : 600, iconCls : 'icon-grid', animCollapse : false, constrainHeader : true,
				layout : 'fit', items : [ grid2 ]
			});
		}
		return win;
	}
});
