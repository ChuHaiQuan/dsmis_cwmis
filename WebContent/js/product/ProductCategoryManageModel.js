Ext.define('WJM.product.ProductCategoryManageModel', {
	extend : 'Ext.ux.desktop.Module',

	requires : ['WJM.model.TProductCategory' ],

	id : 'productcategory',

	init : function() {
		this.id = this.config.moduleId || 'productcategory';
		this.title = this.config.menuText || 'product category/产品种类';
	},

	createWindow : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow(this.id);
		if (!win) {
			var tree = Ext.create('WJM.product.ProductCategoryTree', {
				editAble : true
			});
			win = desktop.createWindow({
				id : this.id, title : this.title, width : 400, height : 500, iconCls : 'icon-grid', animCollapse : false, constrainHeader : true, layout : 'fit',
				items : tree
			});
		}
		return win;
	}
});
