Ext.define('WJM.product.ProductSearchModel', {
	extend : 'Ext.ux.desktop.Module',

	requires : [ 'WJM.model.TProduct' ],

	id : 'productsearch',

	init : function() {
		this.id = this.config.moduleId || 'productsearch';
		this.title = this.config.menuText || 'search/产品搜索';
	},

	createWindow : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow(this.id);
		if (!win) {
			var grid = Ext.create('WJM.product.ProductGridNew', {
				editAble : false, hasCost : WJM.Config.hasProductManageRole()
			});
			win = desktop.createWindow({
				id : this.id, title : this.title, width : 800, height : 600, iconCls : 'icon-grid', animCollapse : false, constrainHeader : true,
				layout : 'fit', items : grid
			});
		}
		return win;
	}
});
