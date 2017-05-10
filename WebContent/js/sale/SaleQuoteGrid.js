/**
 * 销售单查询
 */
Ext.define('WJM.sale.SaleQuoteGrid', {
	extend : 'Ext.panel.Panel',
	requires : [ 'Ext.grid.Panel' ],
	collapsedStatistics : false,
	layout : {
		type : 'border', padding : 5
	},
	defaults : {
		split : true
	},

	saleStore : 'SaleMyQuoteStore',

	saleProductStore : 'SaleQuoteProductMyStore',
	/**
	 * 是否可以删除
	 */
	deleteAble : false,
	/**
	 * 是否可以编辑
	 */
	editAble : false,
	/**
	 * 只显示我的
	 */
	onlyMy : false,

	initComponent : function() {
		var topbarbuttons = [ {
			iconCls : 'search', text : '搜索', scope : this, handler : this.onSearchClick
		}, {
			iconCls : 'search', text : '打印报价单', scope : this, handler : this.onSalePrintClick
		}, {
			iconCls : 'search', text : '清空', scope : this, handler : this.clearSearch
		} ];

		if (this.deleteAble) {
			topbarbuttons.push({
				iconCls : 'remove', text : '删除', scope : this, handler : this.onDeleteClick
			});
		}
		if (this.editAble) {
			topbarbuttons.push({
				iconCls : 'edit', text : '编辑', scope : this, handler : this.onEditClick
			});
		}
		topbarbuttons.push({
			iconCls : 'search', text : '打印出货单', scope : this, handler : this.onPackePrintClick
		});
		topbarbuttons.push({
			iconCls : 'search', text : '转销售订单', scope : this, handler : this.onTranferInvoiceOrder
		});
		var searchFields = [];
		if (this.onlyMy) {
//			searchFields.push({
//				xtype : 'datefield', fieldLabel : 'start date/开始时间', labelWidth : 150, name : 'oper_time_start', format : 'Y-m-d'
//			}, {
//				xtype : 'datefield', fieldLabel : 'end date/结束时间', labelWidth : 150, name : 'oper_time_end', format : 'Y-m-d'
//			}, {
//				xtype : 'textfield', fieldLabel : 'receive #/销售单号', labelWidth : 150, allowBlank : true, name : 'sale_bill_code'
//			}, {
//				xtype : 'textfield', fieldLabel : 'invoice #/invoice单号', labelWidth : 150, allowBlank : true, name : 'invoicecode'
//			}, {
//				name : 'oper_id', value : window.user.userId, xtype : 'hiddenfield'
//			});
			searchFields.push({
				xtype : 'datefield', fieldLabel : 'start date/开始时间', labelWidth : 150, name : 'oper_time_start', format : 'Y-m-d'
			}, {
				xtype : 'datefield', fieldLabel : 'end date/结束时间', labelWidth : 150, name : 'oper_time_end', format : 'Y-m-d'
			}, {
				xtype : 'combobox', fieldLabel : 'sate/订单状态', labelWidth : 150, name : 'if_cashed', displayField : 'name', valueField : 'value',
				store : 'SaleCashStateStore', value : '-1'
			}, {
				xtype : 'textfield', fieldLabel : 'receive #/销售单号', labelWidth : 150, allowBlank : true, name : 'sale_bill_code'
			}, {
				xtype : 'textfield', fieldLabel : 'invoice #/invoice单号', labelWidth : 150, allowBlank : true, name : 'invoicecode'
			}, {
				name : 'oper_id', value : window.user.userId, xtype : 'hiddenfield'
			});
		} else {
//			searchFields.push({
//				xtype : 'datefield', fieldLabel : 'start date/开始时间', labelWidth : 150, name : 'oper_time_start', format : 'Y-m-d'
//			}, {
//				xtype : 'datefield', fieldLabel : 'end date/结束时间', labelWidth : 150, name : 'oper_time_end', format : 'Y-m-d'
//			}, {
//				xtype : 'combobox', fieldLabel : 'Work ID/操作员', labelWidth : 150, allowBlank : true, name : 'oper_id', displayField : 'name',
//				valueField : 'id', store : 'EmployeeAllStore'
//			}, {
//				xtype : 'textfield', fieldLabel : 'receive #/销售单号', labelWidth : 150, allowBlank : true, name : 'sale_bill_code'
//			}, {
//				xtype : 'textfield', fieldLabel : 'invoice #/invoice单号', labelWidth : 150, allowBlank : true, name : 'invoicecode'
//			});
			searchFields.push({
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
			}, {
				xtype : 'textfield', fieldLabel : '产品名称', labelWidth : 150, allowBlank : true, name : 'product_name'
			});
		}

		this.editTopBar = Ext.create('Ext.toolbar.Toolbar', {
			items : topbarbuttons
		});

//		var _fileds = [ {
//			xtype : 'rownumberer'
//		}, {
//			text : "receive #/销售单", dataIndex : 'sale_bill_code', sortable : true
//		}, {
//			text : "saleman/销售员", dataIndex : 'oper_name', sortable : true
//		}, {
//			text : "customer/客户", dataIndex : 'buyer_code', sortable : true
//		},  {
//			text : "customer tel/客户电话", dataIndex : 'buyer_mobile', width : 150,sortable : true
//		},{
//			text : "sub total/小计", dataIndex : 'sub_total', sortable : true, xtype : 'numbercolumn', format : '$0.00'
//		}, {
//			text : "tax/税", dataIndex : 'tax', sortable : true, xtype : 'numbercolumn', format : '$0.00'
//		}, {
//			text : "total/合计", dataIndex : 'all_price', sortable : true, xtype : 'numbercolumn', format : '$0.00'
//		}, {
//			text : "date/时间", dataIndex : 'oper_time', sortable : true
//		} ];

//		var _fileds2 = [ {
//			xtype : 'rownumberer'
//		}, {
//			text : "barcode #/条码", dataIndex : 'product_code', sortable : true
//		}, {
//			text : "item name/名称", dataIndex : 'product_name', sortable : true
//		}, {
//			text : "unit price/单价", dataIndex : 'product_price', sortable : true, xtype : 'numbercolumn', format : '$0.00'
//		}, {
//			text : "quantity/数量", dataIndex : 'product_num', sortable : true
//		}, {
//			text : "sub total/小计", dataIndex : 'sub_total', sortable : true, xtype : 'numbercolumn', format : '$0.00'
//		} ];

		var _fileds = [ {
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

		Ext.apply(this, {
			autoScroll : true,
			dockedItems : [ this.editTopBar ],

			items : [
					{
						anchor : '100%', height : 100, xtype : 'form', region : 'north', autoScroll : true, collapsible : true, title : '报价单检索',
						layout : {
							columns : 3, type : 'table', tableAttrs : {
								style : {
									width : '100%'
								}
							}
						}, bodyPadding : 10, items : searchFields
					},
					{
						store : this.saleStore, split : true, disableSelection : false, loadMask : true, autoScroll : true, region : 'center',
						title : '报价单', xtype : 'gridpanel', columns : _fileds,

						viewConfig : {
							plugins : []
						},

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
							store : this.saleStore, displayInfo : true, displayMsg : '显示报价单 {0} - {1} 总共 {2}', emptyMsg : "没有报价单数据"
						})
					},
					{
						region : 'south',
						split : true,
						height : 150,
						layout : {
							type : 'border', padding : 5
						},
						items : [
								
								{
									store : this.saleProductStore, split : true, disableSelection : false, collapsible : true, split : true, loadMask : true,
									height : 150, autoScroll : true, region : 'center', multiSelect : true, title : '报价单明细', xtype : 'gridpanel',
									columns : _fileds2, viewConfig : {
										plugins : [ Ext.create('Ext.grid.plugin.DragDrop', {
											ddGroup : 'TProduct', enableDrop : false, enableDrag : true
										}) ]
									}
								},
								{
									xtype : 'form', title : '报价统计', region : 'east', width : 250, collapsible : true, split : true,
									collapsed : this.collapsedStatistics, defaults : {
										xtype : 'textfield', anchor : '100%', labelWidth : 100, bodyPadding : 10
									}, items : [ {
										fieldLabel : 'total sales/次数', name : 'total_sales', readOnly : true
									}, {
										fieldLabel : 'amount/总计', name : 'amount', readOnly : true, xtype : 'adnumberfield'
									} ]
								} ]
					} ]
		});
		var store = Ext.data.StoreManager.lookup(this.saleStore);
		store.on('load', this.onDataRefresh, this);
		this.callParent();
		this.onSearchClick();
	},
	
	onDataRefresh : function() {
		var store = Ext.data.StoreManager.lookup(this.saleStore);
		var formPanel = this.down('form[title="报价统计"]');
		if (formPanel) {
			var form = formPanel.getForm();
			var count = 0;var allPrice = 0;
			store.each(function(record){
				if(record.data.if_cashed != 3){
					count ++ ;
					allPrice +=record.data.all_price;
				}
				
			});
			form.findField('total_sales').setValue(count);
			form.findField('amount').setValue(allPrice);
		}
	},
	/**
	 * 搜索
	 */
	onSearchClick : function() {
		var data = this.down('form[title="报价单检索"]').getForm().getFieldValues();
		var store = Ext.data.StoreManager.lookup(this.saleStore);
		var saleProductStore = Ext.data.StoreManager.lookup(this.saleProductStore);
		saleProductStore.removeAll();
		Ext.Object.each(data, function(key, value) {
			store.getProxy().setExtraParam(key, value);
		});
		store.loadPage(1);
	},
	/**
	 * 清空
	 */
	clearSearch : function() {
		var fields = this.down('form[title="报价单检索"]').getForm().getFields();
		fields.each(function(field) {
			if (field.getName() == 'if_cashed') {
				field.setValue('-1');
			} else {
				field.setValue('');
			}
		});
	},

	/**
	 * 删除
	 */
	onDeleteClick : function() {
		var selection = this.down('grid[title="报价单"]').getView().getSelectionModel().getSelection()[0];
		if (selection) {
			if (selection.canDelete()) {
				Ext.Msg.confirm('提示', '确定要删除此报价单么？', function(btn, text) {
					if (btn == 'yes') {
						var store = Ext.data.StoreManager.lookup(this.saleStore);
						store.remove(selection);
					}
				}, this);
			} else {
				Ext.Msg.alert('提示', '此报价单不可以删除！');
			}
		} else {
			Ext.Msg.alert('提示', '请选择产品');
		}
	},
	/**
	 * 打印
	 */
	onSalePrintClick : function() {
		var selection = this.down('grid[title="报价单"]').getView().getSelectionModel().getSelection()[0];
		if (selection) {
			window.open(location.context + '/sale.do?action=re_print&id=' + selection.getId(), "_blank");
		} else {
			Ext.Msg.alert('提示', '请选择产品');
		}
	},
	
	
	onTranferInvoiceOrder:function(){
		var selection = this.down('grid[title="报价单"]').getView().getSelectionModel().getSelection()[0];
		if (selection) {
			Ext.Msg.confirm('confirm', '您确定要转为销售订单吗？', function (btn, text) {
				if(btn == "yes"){

	            	Ext.Ajax.request({
	            	    url: location.context + '/sale.do?action=packeTransferToInvoiceOrder',
	            	    params: {
	            	    	id: selection.getId()
	            	    },
	            	    reader: {
	            	        type : 'json'
	            	    },
	            	    success: function(response,a,b){
	            	    	Ext.Msg.alert('提示', '生成销售订单成功! '+response.responseText);
	            	    }
	            	});
	            	
	            
				}
			});
		} else {
			Ext.Msg.alert('提示', '请选择订单');
		}
	},
	
	
	/**
	 * 打印出货单
	 */
	onPackePrintClick : function() {
		var selection = this.down('grid[title="报价单"]').getView().getSelectionModel().getSelection()[0];
		if (selection) {
				window.open(location.context + '/sale.do?action=packing_print&notNeedPaid=1&id=' + selection.getId(), "_blank");
		} else {
			Ext.Msg.alert('提示', '请选择订单');
		}
	},
	
	/**
	 * 
	 */
	onEditClick : function() {
		var selection = this.down('grid[title="报价单"]').getView().getSelectionModel().getSelection()[0];
		if (selection) {
			if (selection.canEdit()) {
				var des = myDesktopApp.getDesktop();
				var form = Ext.create('WJM.sale.SaleForm', {
					listeners : {
						saveSuccess : this.onSaveSuccess, scope : this
					}, record : selection
				});
				win = des.createWindow({
					title : "编辑报价单", iconCls : 'icon-grid', animCollapse : false, width : 800, height : 750, constrainHeader : true, layout : 'fit',
					items : [ form ]
				});
				win.show();
			} else {
				Ext.Msg.alert('提示', '此报价单不可以编辑。');
			}
		} else {
			Ext.Msg.alert('提示', '请选择报价单');
		}
	},
	/**
	 * 保存成功回调
	 */
	onSaveSuccess : function(that) {
		var win = that.ownerCt;
		win.destroy();
		var store = Ext.data.StoreManager.lookup(this.saleStore);
		store.loadPage(1);
		this.show();
	}
});