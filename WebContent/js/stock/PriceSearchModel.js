/**
 * 价格查询
 */
Ext.define('WJM.stock.PriceSearchModel', {
  extend : 'Ext.ux.desktop.Module',

  requires : [ 'WJM.model.TStock', 'WJM.model.TStockAndProduct' ],

  id : 'pricesearch',

  init : function() {
	this.id = this.config.moduleId || 'pricesearch';
	this.title = this.config.menuText || 'price search/价格搜索';
  },

  createWindow : function() {
	var desktop = this.app.getDesktop();
	var win = desktop.getWindow(this.id);
	if (!win) {
	  var grid = Ext.create('WJM.stock.StockAndProductGrid');
	  win = desktop.createWindow({
		id : this.id, title : this.title, width : 800, height : 600, iconCls : 'icon-grid', animCollapse : false, constrainHeader : true,
		layout : 'fit', items : grid
	  });
	}
	return win;
  }
});
