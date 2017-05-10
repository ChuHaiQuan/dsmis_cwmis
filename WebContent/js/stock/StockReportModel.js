/**
 * 价格查询
 */
Ext.define('WJM.stock.StockReportModel', {
  extend : 'Ext.ux.desktop.Module',

  requires : [ 'WJM.model.TStock', 'WJM.model.TStockAndProduct', 'WJM.model.TStockProduct' ],

  id : 'stockdetail',

  init : function() {
	this.id = this.config.moduleId || 'stockdetail';
	this.title = this.config.menuText || 'stock detail/库存报表';
  },

  createWindow : function() {
	var desktop = this.app.getDesktop();
	var win = desktop.getWindow(this.id);
	if (!win) {
	  var grid = Ext.create('WJM.stock.StockGrid');
	  win = desktop.createWindow({
		id : this.id, title : this.title, width : 800, height : 600, iconCls : 'icon-grid', animCollapse : false, constrainHeader : true,
		layout : 'fit', items : grid
	  });
	}
	return win;
  }
});
