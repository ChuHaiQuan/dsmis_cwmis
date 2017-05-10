Ext.define('WJM.product.ProductManageModel', {
	extend : 'Ext.ux.desktop.Module',

	requires : [ 'WJM.model.TProduct' ],

	id : 'product',

	init : function() {
		this.id = this.config.moduleId || 'product';
		this.title = this.config.menuText || 'product/产品';
	},

	createWindow : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow(this.id);
		if (!win) {
			var grid = Ext.create('WJM.product.ProductGrid', {
				editAble : true, hasCost : true
			});
			win = desktop.createWindow({
				id : this.id, title : this.title, width : 800, height : 600, iconCls : 'icon-grid', animCollapse : false, constrainHeader : true,
				layout : 'fit', items : grid
			});
		}
		return win;
	}
});
