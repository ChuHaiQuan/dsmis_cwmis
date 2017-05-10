/**
 * 库存价格查询
 */
Ext.define('WJM.stock.StockAndProductGrid', {
	extend : 'Ext.panel.Panel',
	requires : [ 'Ext.grid.Panel', 'WJM.model.TStockAndProduct' ],
	layout : {
		type : 'border', padding : 5
	},
	defaults : {
		split : true
	},

	initComponent : function() {
		this.editTopBar = Ext.create('Ext.toolbar.Toolbar', {
			items : [ {
				iconCls : 'search', text : '搜索', scope : this, handler : this.onSearchClick
			} ]
		});

		var _fileds = [ {
			xtype : 'rownumberer'
		}, {
			text : "item id/助记符", dataIndex : 'product_id', sortable : true, width : 100
		}, {
			text : "description 1", dataIndex : 'product_name', sortable : true, width : 200
		}, {
			text : "price/价格", dataIndex : 'product_price', sortable : true, width : 150, xtype : 'numbercolumn'
		}, {
			text : "stock date/进货日期", dataIndex : 'stock_time', sortable : true, width : 150
		} ];

		Ext.apply(this, {
			autoScroll : true,
			dockedItems : [ this.editTopBar ],

			items : [
					{
						anchor : '100%', height : 100, xtype : 'form', region : 'north', autoScroll : true, collapsible : true, title : '产品检索',
						layout : {
							columns : 2, type : 'table'
						}, bodyPadding : 10, items : [ {
							xtype : 'textfield', fieldLabel : 'item id/助记符', labelWidth : 150, name : 'product_id'
						}, {
							xtype : 'textfield', fieldLabel : 'description', labelWidth : 150, name : 'product_name'
						} ]
					},
					{
						store : 'StockAndProductStore', split : true, disableSelection : false, loadMask : true, autoScroll : true, region : 'center',
						xtype : 'gridpanel', columns : _fileds, viewConfig : {
							plugins : []
						}
					} ]
		});
		this.callParent();
	},
	/**
	 * 搜索
	 */
	onSearchClick : function() {
		var data = this.down('form').getForm().getFieldValues();
		var store = Ext.data.StoreManager.lookup('StockAndProductStore');
		Ext.Object.each(data, function(key, value) {
			store.getProxy().setExtraParam(key, value);
		});
		store.load();
	}
});