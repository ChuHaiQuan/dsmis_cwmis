/**
 * 库存报表
 */
Ext.define('WJM.stock.StockGrid', {
  extend : 'Ext.panel.Panel',
  requires : [ 'Ext.grid.Panel' ],
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
	  }, {
		iconCls : 'search', text : '清空', scope : this, handler : this.clearSearch
	  } ]
	});

	var _fileds = [ {
	  xtype : 'rownumberer'
	}, {
	  text : "Packing list #/进货单", dataIndex : 'stock_bill_code', sortable : true, width : 150
	}, {
	  text : "Work ID/操作员", dataIndex : 'oper_name', sortable : true, width : 100
	}, {
	  text : "total/合计", dataIndex : 'all_stock_price', sortable : true, width : 100
	}, {
	  text : "date/时间", dataIndex : 'oper_time', sortable : true, width : 200
	} ];

	var _fileds2 = [ {
	  xtype : 'rownumberer'
	}, {
	  text : "barcode #/条码", dataIndex : 'product_code', sortable : true, width : 100
	}, {
	  text : "product name/名称", dataIndex : 'product_name', sortable : true, width : 200
	}, {
	  text : "vendor/供应商", dataIndex : 'provider_name', sortable : true, width : 200
	}, {
	  text : "quantity/数量", dataIndex : 'product_num', sortable : true, width : 100
	}, {
	  text : "price/价格", dataIndex : 'product_price', sortable : true, width : 100
	}, {
	  text : "sub total/小计", dataIndex : 'product_price', sortable : true
	} ];

	Ext.apply(this, {
	  autoScroll : true,
	  dockedItems : [ this.editTopBar ],

	  items : [
		  {
			anchor : '100%',
			height : 100,
			xtype : 'form',
			region : 'north',
			autoScroll : true,
			collapsible : true,
			title : '库存检索',
			layout : {
			  columns : 2, type : 'table', tableAttrs : {
				style : {
				  width : '100%'
				}
			  }
			},
			bodyPadding : 10,
			items : [
				{
				  xtype : 'datefield', fieldLabel : 'start date/开始时间', labelWidth : 150, name : 'oper_time_start', format : 'Y-m-d'
				},
				{
				  xtype : 'datefield', fieldLabel : 'end date/结束时间', labelWidth : 150, name : 'oper_time_end', format : 'Y-m-d'
				},
				{
				  xtype : 'combobox', fieldLabel : 'Work ID/操作员', labelWidth : 150, allowBlank : true, name : 'oper_id',
				  displayField : 'name', valueField : 'id', store : 'EmployeeAllStore'
				}
			// {
			// title : '从任意的供货商列表中拖动列表项此区域',
			// xtype : 'fieldset',
			// layout : {
			// columns : 2, type : 'table', tableAttrs : {
			// style : {
			// width : '100%'
			// }
			// }
			// },
			// allowBlank : false,
			// colspan : 2,
			// items : [
			// {
			// fieldLabel : 'vendor name/供货商', name : 'provider_name',
			// allowBlank : false, xtype : 'textfield', anchor : '100%',
			// labelWidth : 150
			// },
			// {
			// fieldLabel : 'vendor code/供货商', name : 'provider_id', allowBlank
			// : false, xtype : 'textfield', anchor : '100%',
			// labelWidth : 150
			// } ]
			// }
			]
		  },
		  {
			store : 'StockStore', split : true, disableSelection : false, loadMask : true, autoScroll : true, region : 'center',
			title : '进货单', xtype : 'gridpanel', columns : _fileds,

			viewConfig : {
			  plugins : []
			},

			listeners : {
			  selectionchange : function(selectionModel, selecteds, eOpts) {
				var recode = selectionModel.getSelection()[0];
				if (recode) {
				  var store = Ext.data.StoreManager.lookup('StockProductStore');
				  store.getProxy().setExtraParam('stock_id', recode.getId());
				  store.load();
				}
			  }, scope : this
			},

			bbar : Ext.create('Ext.PagingToolbar', {
			  store : 'StockStore', displayInfo : true, displayMsg : '显示库存 {0} - {1} 总共 {2}', emptyMsg : "没有库存数据"
			})
		  },
		  {
			store : 'StockProductStore', split : true, disableSelection : false, loadMask : true, height : 150, autoScroll : true,
			region : 'south', title : '进货单明细', xtype : 'gridpanel', columns : _fileds2, viewConfig : {
			  plugins : []
			}
		  } ]
	});
	var store = Ext.data.StoreManager.lookup('StockStore');
	store.loadPage(1);
	this.callParent();
  },
  /**
   * 搜索
   */
  onSearchClick : function() {
	var data = this.down('form').getForm().getFieldValues();
	var store = Ext.data.StoreManager.lookup('StockStore');
	var stockProductStore = Ext.data.StoreManager.lookup('StockProductStore');
	stockProductStore.removeAll();
	Ext.Object.each(data, function(key, value) {
	  store.getProxy().setExtraParam(key, value);
	});
	store.loadPage(1);
  },
  /**
   * 清空
   */
  clearSearch : function() {
	var fields = this.down('form').getForm().getFields();
	fields.each(function(field) {
	  field.setValue('');
	});
  }
});