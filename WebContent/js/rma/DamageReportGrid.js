/**
 * 损害报表
 */
Ext.define('WJM.rma.DamageReportGrid', {
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
			}, {
				iconCls : 'search', text : '打印列表', scope : this, handler : this.printGrid
			} ]
		});

		var _fileds = [ {
			xtype : 'rownumberer'
		}, {
			text : "item name/名称", dataIndex : 'product_name', sortable : true
		}, {
			text : "total price/总价", dataIndex : 'all_price', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "total number/总损坏个数", dataIndex : 'rma_num', sortable : true
		} ];

		var formFileds = [];

		formFileds.push({
			xtype : 'datefield', fieldLabel : 'start date/开始时间', labelWidth : 150, name : 'begin', format : 'Y-m-d', allowBlank : false
		});
		formFileds.push({
			xtype : 'datefield', fieldLabel : 'end date/结束时间', labelWidth : 150, name : 'end', format : 'Y-m-d', allowBlank : false
		});
		this.storeId = 'DamageReportStore';

		Ext.apply(this, {
			autoScroll : true,
			dockedItems : [ this.editTopBar ],

			items : [
					{
						anchor : '100%', height : 100, xtype : 'form', region : 'north', autoScroll : true, collapsible : true, title : '退货日期',
						bodyPadding : 10, items : formFileds
					},
					{
						store : this.storeId, split : true, disableSelection : false, loadMask : true, autoScroll : true, region : 'center',
						title : '损害报表', xtype : 'gridpanel', columns : _fileds,

						viewConfig : {
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
		if (this.down('form').getForm().isValid()) {
			var data = this.down('form').getForm().getFieldValues();
			var store = Ext.data.StoreManager.lookup(this.storeId);
			Ext.Object.each(data, function(key, value) {
				store.getProxy().setExtraParam(key, value);
			});
			store.load();
		}
	},
	/**
	 * 清空
	 */
	clearSearch : function() {
		var fields = this.down('form').getForm().getFields();
		fields.each(function(field) {
			field.setValue('');
		});
	},
	/**
	 * 
	 */
	printGrid : function() {
		Ext.ux.grid.Printer.print(this.down('grid'));
	}
});