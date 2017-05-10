Ext.define('WJM.product.ProductAlert', {
	mixins : {
		observable : 'Ext.util.Observable'
	},
	requires : [ 'Ext.window.MessageBox', 'WJM.model.TProduct' ],

	singleton : true,

	constructor : function(config) {
		this.mixins.observable.constructor.call(this, config);
		this.callParent(arguments);
		this.store = Ext.data.StoreManager.lookup('ProductAlertStore');
		this.store.on('load', this.onProductListLoad, this);
	},

	checkProduct : function() {
		this.store.load();
	},

	onProductListLoad : function() {
		if (this.store.getCount() <= 0) {
			return;
		} else {
			var des = myDesktopApp.getDesktop();
			win = des.createWindow({
				title : "产品库存报警(按住ctrl多选，拖动产品到订货列表)", width : 500, height : 500, iconCls : 'icon-grid', animCollapse : false, constrainHeader : true, layout : 'fit',
				items : [ Ext.create('WJM.product.widget.ProductGrid', {
					productStore : 'ProductAlertStore'
				}) ]
			});
			win.show();
		}
	}
});