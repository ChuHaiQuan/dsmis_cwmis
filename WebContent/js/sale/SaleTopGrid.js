/**
 * 销售单查询
 */
Ext.define('WJM.sale.SaleTopGrid', {
	extend : 'Ext.panel.Panel',
	requires : [ 'Ext.grid.Panel' ],
	layout : {
		type : 'border', padding : 5
	},
	saleStore : 'SaleStore',
	reportType : 'daySaleReport',
	saleProductStore : 'SaleProductStore',
	closeAction : 'destroy',
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
			text : "item name/产品名称", dataIndex : 'product_name', sortable : true
		}, {
			text : "total price/总价", dataIndex : 'all_price', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "item number/产品数量", dataIndex : 'sale_times', sortable : true
		} ];

		var formFileds = [];
		switch (this.reportType) {
		case 'daySaleReport':
			formFileds.push({
				xtype : 'datefield', fieldLabel : 'start date/开始时间', labelWidth : 150, name : 'oper_time_start', format : 'Y-m-d'
			}, {
				xtype : 'datefield', fieldLabel : 'end date/结束时间', labelWidth : 150, name : 'oper_time_end', format : 'Y-m-d'
			}, {
				xtype : 'combobox', fieldLabel : 'sate/订单状态', labelWidth : 150, name : 'if_cashed', displayField : 'name', valueField : 'value',
				store : 'SaleCashStateStore', value : '-1'
			}, {
				xtype : 'combobox', fieldLabel : 'Work ID/操作员', labelWidth : 150, allowBlank : true, name : 'oper_id', displayField : 'name',
				valueField : 'id', store : 'EmployeeAllStore'
			}, {
				xtype : 'textfield', fieldLabel : 'invoice #/invoice单号', labelWidth : 150, allowBlank : true, name : 'invoicecode'
			}, {
				xtype : 'textfield', fieldLabel : 'name/客户名称', labelWidth : 150, allowBlank : true, name : 'buyer_name'
			}, {
				xtype : 'textfield', fieldLabel : 'address/客户地址', labelWidth : 150, allowBlank : true, name : 'buyer_address'
			}, {
				xtype : 'textfield', fieldLabel : 'Phone/电话', labelWidth : 150, allowBlank : true, name : 'buyer_mobile'
			});
//			formFileds.push({
//				xtype : 'datefield', fieldLabel : 'sale date/销售日期', labelWidth : 150, name : 'date', format : 'Y-m-d', allowBlank : false
//			});
			this.storeId = 'SaleTopDayStore';
			break;
		case 'monthlySaleReport':
			formFileds.push({
				xtype : 'datefield', fieldLabel : 'sale date/销售日期', labelWidth : 150, name : 'date', format : 'Y-m', allowBlank : false
			});
			this.storeId = 'SaleTopMonthStore';
			break;
		case 'bettenSaleReport':
			formFileds.push({
				xtype : 'datefield', fieldLabel : 'start date/开始时间', labelWidth : 150, name : 'begin', format : 'Y-m-d', allowBlank : false
			});
			formFileds.push({
				xtype : 'datefield', fieldLabel : 'end date/结束时间', labelWidth : 150, name : 'end', format : 'Y-m-d', allowBlank : false
			});
			this.storeId = 'SaleTopBetweenStore';
			break;
		default:
			break;
		}
		
		var _fileds1 = [ {
			xtype : 'rownumberer'
		}, {
			text : "saleman/销售员", dataIndex : 'oper_name', sortable : true
		}, {
			text : "invoice #/invoice单号", dataIndex : 'invoice', sortable : true
		}, {
			text : "phone/电话", dataIndex : 'buyer_mobile', sortable : true
		}, {
			text : "customer/客户", dataIndex : 'buyer_name', sortable : true
		}, {
			text : "address/客户地址", dataIndex : 'buyer_address', sortable : true
		}, {
			text : "sub total/小计", dataIndex : 'sub_total', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "tax/税", dataIndex : 'tax', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "total/合计", dataIndex : 'all_price', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "state/状态", dataIndex : 'if_cashedStr', sortable : true
		}, {
			text : "discount/优惠", dataIndex : 'discount', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "balance/余额", dataIndex : 'balance', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "date/时间", dataIndex : 'oper_time', sortable : true
		}, {
			text : "payment/支付方式", dataIndex : 'payment', sortable : true
		}];

		var _fileds2 = [ {
			xtype : 'rownumberer'
		}, {
			text : "barcode #/条码", dataIndex : 'product_code', sortable : true
		}, {
			text : "item name/名称", dataIndex : 'product_name', sortable : true
		}, {
			text : "unit price/单价", dataIndex : 'agio_price', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "quantity/数量", dataIndex : 'product_num', sortable : true
		}, {
			text : "sub total/小计", dataIndex : 'sub_total2', sortable : true, xtype : 'numbercolumn'
		}, {
			text : "RMAed credit quantity/已退货无损数量", dataIndex : 'credit_num', sortable : true, xtype : 'numbercolumn'
		}, {
			text : "RMAed damage quantity/已退货损坏数量", dataIndex : 'damage_num', sortable : true, xtype : 'numbercolumn'
		} ];
		
		var item=[
					{
						anchor : '100%', height : 130, xtype : 'form', region : 'north', autoScroll : true, collapsible : true, title : '搜索信息',
						layout : {
							columns : 3, type : 'table', tableAttrs : {
								style : {
									width : '100%'
								}
							}
						},bodyPadding : 10, items : formFileds
					},{store : this.storeId, split : true,
						disableSelection : false, loadMask : true, autoScroll : true, region : 'center',
						title : '日销售产品报表', xtype : 'gridpanel', columns : _fileds,height : 200,width : 400,
					    collapsible: true,  
					    animCollapse: false, 
						},
					{
						region : 'south',
						split : true,
						height : 200,
						layout : {
							type : 'border', padding : 5
						},
						items : [{
							store : this.saleStore, split : true, disableSelection : false, loadMask : true, autoScroll : true, region : 'west',
							title : '订单', xtype : 'gridpanel', columns : _fileds1,height : 200,width : 350,
							collapsible: true,  
						    animCollapse: false, 
							listeners : {
								selectionchange : function(selectionModel, selecteds, eOpts) {
									var recode = selectionModel.getSelection()[0];
									if (recode) {
										var store = Ext.data.StoreManager.lookup(this.saleProductStore);
										store.getProxy().setExtraParam('sale_id', recode.getId());
										store.load();
									}
								}, scope : this
							},

							bbar : Ext.create('Ext.PagingToolbar', {
								store : this.saleStore, displayInfo : true, displayMsg : '显示订单 {0} - {1} 总共 {2}', emptyMsg : "没有订单数据"
							})
						},
								{
									store : this.saleProductStore, split : true, disableSelection : false, collapsible : true, split : true, loadMask : true,
									height : 150, autoScroll : true, region : 'center', multiSelect : true, title : '订单明细', xtype : 'gridpanel',
									columns : _fileds2, viewConfig : {
										plugins : [ Ext.create('Ext.grid.plugin.DragDrop', {
											ddGroup : 'TProduct', enableDrop : false, enableDrag : true
										}) ]
									}
								},
								{
									xtype : 'form', title : '销售统计', region : 'east', width : 250, collapsible : true, split : true,
									collapsed : this.collapsedStatistics, defaults : {
										xtype : 'textfield', anchor : '100%', labelWidth : 100, bodyPadding : 10
									}, items : [ {
										fieldLabel : 'total sales/次数', name : 'total_sales', readOnly : true
									}, {
										fieldLabel : 'amount/总计', name : 'amount', readOnly : true, xtype : 'adnumberfield'
									} ]
								} ]
					}  ]
		;
			
		Ext.apply(this, {
			autoScroll : true,
			dockedItems : [ this.editTopBar ],

			items : item

		});
		var store = Ext.data.StoreManager.lookup(this.saleStore);
		store.on('load', this.onDataRefresh, this);
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
			
			var store = Ext.data.StoreManager.lookup(this.saleStore);
			var saleProductStore = Ext.data.StoreManager.lookup(this.saleProductStore);
			saleProductStore.removeAll();
			Ext.Object.each(data, function(key, value) {
				store.getProxy().setExtraParam(key, value);
			});
			store.loadPage(1);
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
	onDataRefresh : function() {
		var store = Ext.data.StoreManager.lookup(this.saleStore);
		var formPanel = this.down('form[title="销售统计"]');
		if (formPanel) {
			var form = formPanel.getForm();
			form.findField('total_sales').setValue(store.getCount());
			form.findField('amount').setValue(store.sum('all_price'));
		}
	},
	/**
	 * 
	 */
	printGrid : function() {
		Ext.ux.grid.Printer.print(this.down('grid'));
	}
});