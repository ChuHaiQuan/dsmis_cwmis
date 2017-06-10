/**
 * 采购单查询
 */
Ext.define('WJM.purchase.PurchaseGrid', {
	extend : 'Ext.panel.Panel',
	requires : [ 'Ext.grid.Panel' ],
	collapsedStatistics : false,
	layout : {
		type : 'border', padding : 5
	},
	defaults : {
		split : true
	},
	/**
	 * 是否可以删除
	 */
	deleteAble : false,
	/**
	 * 是否可以编辑
	 */
	editAble : false,
	/**
	 * 可以付款
	 */
	cashAble : false,
	/**
	 * 可以收货
	 */
	receiveAble : false,

	receiveEditing : null,

	purchaseStore : 'PurchaseStore',

	purchaseProductStore : 'PurchaseProductStore',
	/**
	 * 只显示我的
	 */
	onlyMy : false,

	initComponent : function() {
		var _fileds = [
				{
					xtype : 'rownumberer'
				},
				{
					text : "P.O. #/定单号", dataIndex : 'purchase_bill_code', sortable : true
				},
				{
					text : "Work ID/操作员", dataIndex : 'oper_name', sortable : true
				},
				{
					text : "vendor name/供货商", dataIndex : 'provider_name', sortable : true
				},
				{
					text : "total/总计", dataIndex : 'all_purchase_price', sortable : true, xtype : 'numbercolumn', format : '$0.00'
				},
				{
					text : "actual received amount/完成货总额", dataIndex : 'actual_received_amount', sortable : true, xtype : 'numbercolumn',
					format : '$0.00'
				}, {
					text : "Invoice/账单", dataIndex : 'invoice_code', sortable : true
				}, {
					text : "P.O. balance/订单余额", dataIndex : 'balance', sortable : true, xtype : 'numbercolumn', format : '$0.00'
				}, {
					text : "received status/收货状态", dataIndex : 'if_stockStr', sortable : true
				}, {
					text : "payment status/付款状态", dataIndex : 'paidStr', sortable : true
				}, {
					text : "date/时间", dataIndex : 'oper_time', sortable : true
				} ];

		var _fileds2 = [ {
			xtype : 'rownumberer'
		}, {
			text : "barcode #/条码", dataIndex : 'product_code', sortable : true
		}, {
			text : "item name/名称", dataIndex : 'product_name', sortable : true
		}, {
			text : "unit price/单价", dataIndex : 'product_price', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "quantity/数量", dataIndex : 'product_num', sortable : true
		}, {
			text : "sub total/小计", dataIndex : 'sub_total', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "Actual received/已经收到", dataIndex : 'actual_received', sortable : true, xtype : 'numbercolumn'
		} ];
		var defaultItems = [ {
			iconCls : 'search', text : '搜索', scope : this, handler : this.onSearchClick
		}, {
			iconCls : 'search', text : '打印', scope : this, handler : this.onSalePrintClick
		}, {
			iconCls : 'search', text : '清空', scope : this, handler : this.clearSearch
		} ];
		if (this.cashAble) {
			defaultItems.push({
				iconCls : 'edit', text : '添加账单', scope : this, handler : this.onAddInvoiceClick
			}, {
				iconCls : 'edit', text : '付款', scope : this, handler : this.onCashClick
			});
		}
		if (this.receiveAble) {
			defaultItems.push({
				iconCls : 'edit', text : '全部收货', scope : this, handler : this.onReceiveClick
			});
			_fileds2.push({
				text : "received num/收到个数", dataIndex : 'receive_num', sortable : true, width : 150, xtype : 'numbercolumn', editor : {
					xtype : 'numberfield', allowBlank : false, allowDecimals : false, minValue : 1
				}
			}, {
				xtype : 'actioncolumn',
				text : "receive/收货",
				align : 'center',
				width : 100,
				items : [ {
					width : 66,
					height : 24,
					iconCls : 'shouhuo-button',
					html : '<span>receive/收货</span>',
					tooltip : 'receive/收货',
					handler : function(grid, rowIndex, colIndex) {
						var recod = grid.getStore().getAt(rowIndex);
						if (recod) {
							if (recod.get("if_stock") == 1) {
								Ext.Msg.alert('提示', '此货物已经完全收获');
							} else {
								if (!recod.get("receive_num") || recod.get("receive_num") <= 0
										|| recod.get("product_num") - recod.get("receive_num") - recod.get("actual_received") < 0) {
									Ext.Msg.alert('提示', '请填写正确的收货数量');
								} else {
									this.receivePrdouct([ recod ]);
								}
							}
						}
					}, scope : this
				} ]
			});
			this.receiveEditing = Ext.create('Ext.grid.plugin.CellEditing', {
				clicksToEdit : 1
			});
		}
		if (this.deleteAble) {
			defaultItems.push({
				iconCls : 'remove', text : '删除', scope : this, handler : this.onDeleteClick
			});
		}
		if (this.editAble) {
			defaultItems.push({
				iconCls : 'edit', text : '编辑', scope : this, handler : this.onEditClick
			});
		}
		
		this.editTopBar = Ext.create('Ext.toolbar.Toolbar', {
			items : defaultItems
		});

		var searchField = [];

		if (this.onlyMy) {
			searchField.push({
				xtype : 'datefield', fieldLabel : 'start date/开始时间', labelWidth : 150, name : 'oper_time_start', format : 'Y-m-d'
			}, {
				xtype : 'datefield', fieldLabel : 'end date/结束时间', labelWidth : 150, name : 'oper_time_end', format : 'Y-m-d'
			}, {
				xtype : 'combobox', fieldLabel : 'paid/付款', labelWidth : 150, name : 'paid', displayField : 'name', valueField : 'value',
				store : 'PurchasePaidStateStore', value : '-1'
			}, {
				xtype : 'combobox', fieldLabel : 'check/确认到货', labelWidth : 150, name : 'if_stock', displayField : 'name', valueField : 'value',
				store : 'PurchaseStockStateStore', value : '-1'
			}, {
				xtype : 'textfield', fieldLabel : 'P.O. #/定单号', labelWidth : 150, allowBlank : true, name : 'purchase_bill_code'
			}, {
				name : 'oper_id', value : window.user.userId, xtype : 'hiddenfield'
			});
		} else {
			searchField.push({
				xtype : 'datefield', fieldLabel : 'start date/开始时间', labelWidth : 150, name : 'oper_time_start', format : 'Y-m-d'
			}, {
				xtype : 'datefield', fieldLabel : 'end date/结束时间', labelWidth : 150, name : 'oper_time_end', format : 'Y-m-d'
			}, {
				xtype : 'combobox', fieldLabel : 'paid/付款', labelWidth : 150, name : 'paid', displayField : 'name', valueField : 'value',
				store : 'PurchasePaidStateStore', value : '-1'
			}, {
				xtype : 'combobox', fieldLabel : 'check/确认到货', labelWidth : 150, name : 'if_stock', displayField : 'name', valueField : 'value',
				store : 'PurchaseStockStateStore', value : '-1'
			}, {
				xtype : 'combobox', fieldLabel : 'Work ID/操作员', labelWidth : 150, allowBlank : true, name : 'oper_id', displayField : 'name',
				valueField : 'id', store : 'EmployeeAllStore'
			}, {
				xtype : 'textfield', fieldLabel : 'P.O. #/定单号', labelWidth : 150, allowBlank : true, name : 'purchase_bill_code'
			});
		}

		Ext.apply(this, {
			autoScroll : true,
			dockedItems : [ this.editTopBar ],

			items : [
					{
						name : 'id', xtype : 'hiddenfield'
					},
					{
						anchor : '100%', height : 100, xtype : 'form', region : 'north', autoScroll : true, collapsible : true, title : '采购单检索',
						layout : {
							columns : 3, type : 'table', tableAttrs : {
								style : {
									width : '100%'
								}
							}
						}, bodyPadding : 10, items : searchField
					},
					{
						store : this.purchaseStore, split : true, disableSelection : false, loadMask : true, autoScroll : true, region : 'center',
						title : '采购单', xtype : 'gridpanel', columns : _fileds,

						viewConfig : {
							plugins : []
						},

						listeners : {
							selectionchange : function(selectionModel, selecteds, eOpts) {
								var recode = selectionModel.getSelection()[0];
								if (recode) {
									var store = Ext.data.StoreManager.lookup(this.purchaseProductStore);
									store.getProxy().setExtraParam('purchase_id', recode.getId());
									store.load();
								}
							}, scope : this
						},

						bbar : Ext.create('Ext.PagingToolbar', {
							store : this.purchaseStore, displayInfo : true, displayMsg : '显示采购单 {0} - {1} 总共 {2}', emptyMsg : "没有采购单数据"
						})
					},
					{
						store : this.purchaseProductStore, split : true, disableSelection : false, collapsible : true, split : true, loadMask : true,
						height : 150, autoScroll : true, region : 'south', multiSelect : true, title : '采购单明细', xtype : 'gridpanel',
						columns : _fileds2, viewConfig : {
							plugins : [ Ext.create('Ext.grid.plugin.DragDrop', {
								ddGroup : 'TProduct', enableDrop : false, enableDrag : true
							}) ]
						}, plugins : this.receiveAble ? [ this.receiveEditing ] : []
					} ]
		});
		this.callParent();
		this.onSearchClick();
	},
	/**
	 * 搜索
	 */
	onSearchClick : function() {
		var data = this.down('form[title="采购单检索"]').getForm().getFieldValues();
		var store = Ext.data.StoreManager.lookup(this.purchaseStore);
		var purchaseProductStore = Ext.data.StoreManager.lookup(this.purchaseProductStore);
		purchaseProductStore.removeAll();
		Ext.Object.each(data, function(key, value) {
			store.getProxy().setExtraParam(key, value);
		});
		store.loadPage(1);
	},
	/**
	 * 清空
	 */
	clearSearch : function() {
		var fields = this.down('form[title="采购单检索"]').getForm().getFields();
		fields.each(function(field) {
			if (field.getName() == 'if_stock' || field.getName() == 'paid') {
				field.setValue('-1');
			} else {
				field.setValue('');
			}
		});

	},
	/**
	 * 付款
	 */
	onCashClick : function() {
		var selection = this.down('grid[title="采购单"]').getView().getSelectionModel().getSelection()[0];
		if (selection) {
			if (selection.get('paid') == 0) {
				if (selection.get('invoice_code') && selection.get('invoice_code') != '') {
					var des = myDesktopApp.getDesktop();
					var form = Ext.create('WJM.cash.PurchaseCashForm', {
						listeners : {
							saveSuccess : this.onSaveSuccess, scope : this
						}, record : selection
					});
					win = des.createWindow({
						title : "付款", iconCls : 'icon-grid', animCollapse : false, constrainHeader : true, layout : 'fit', items : [ form ]
					});
					win.show();
				} else {
					Ext.Msg.alert('提示', '请先为此订单添加账单');
				}
			} else {
				Ext.Msg.alert('提示', '此采购单已经付款');
			}
		} else {
			Ext.Msg.alert('提示', '请选择采购单');
		}
	},
	/**
	 * 添加账单
	 */
	onAddInvoiceClick : function() {
		var selection = this.down('grid[title="采购单"]').getView().getSelectionModel().getSelection()[0];
		if (selection) {
			if (!selection.get('invoice_code') || selection.get('invoice_code') == '') {
				var des = myDesktopApp.getDesktop();
				var form = Ext.create('WJM.purchase.PurchaseInvoiceForm', {
					listeners : {
						saveSuccess : this.onSaveSuccess, scope : this
					}, record : selection
				});
				win = des.createWindow({
					title : "添加账单", iconCls : 'icon-grid', animCollapse : false, constrainHeader : true, layout : 'fit', items : [ form ]
				});
				win.show();
			} else {
				Ext.Msg.alert('提示', '此订单已经添加了账单');
			}
		} else {
			Ext.Msg.alert('提示', '请选择采购单');
		}
	},
	/**
	 * 收货
	 */
	onReceiveClick : function() {
		var selection = this.down('grid[title="采购单"]').getView().getSelectionModel().getSelection()[0];
		var me = this;
		if (selection) {
			if (selection.get('if_stock') == 0) {
				Ext.Msg.confirm('提示', '确定此采购单' + selection.get('purchase_bill_code') + '收货么？', function(btn, text) {
					if (btn == 'yes') {
						var proxy = new Ext.data.proxy.Ajax({
							model : 'WJM.model.TPurchase', url : 'purchase_order.do?action=receivePurchase',

							reader : new Ext.data.reader.Json({
								type : 'json', messageProperty : 'msg'
							}),

							writer : Ext.create('WJM.FormWriter')
						});
						proxy.setExtraParam('id', selection.getId());
						var op = new Ext.data.Operation({
							action : 'update'
						});
						proxy.read(op, function() {
							if (op.wasSuccessful()) {
								Ext.Msg.alert('提示', '收货成功');
								var store = Ext.data.StoreManager.lookup(this.purchaseStore);
								store.loadPage(1);
							} else {
								Ext.Msg.alert('提示', '收货失败，请稍候再试');
							}
						}, me);
					}
				}, this);
			} else {
				Ext.Msg.alert('提示', '此采购单已经收货');
			}
		} else {
			Ext.Msg.alert('提示', '请选择采购单');
		}
	},
	/**
	 * 自定义收获
	 * 
	 * @param records
	 */
	receivePrdouct : function(records) {
		var datas = [], me = this;
		Ext.Array.each(records, function(record) {
			if (record.get('if_stock') != 1) {
				datas.push(record.getData());
			}
		});
		var selection = this.down('grid[title="采购单"]').getView().getSelectionModel().getSelection()[0];
		if (datas.length > 0 && selection) {
			var proxy = new Ext.data.proxy.Ajax({
				model : 'WJM.model.TPurchase', url : 'purchase_order.do?action=checkPurchase',

				reader : new Ext.data.reader.Json({
					type : 'json', messageProperty : 'msg'
				}),

				writer : Ext.create('WJM.FormWriter')
			});
			proxy.setExtraParam('purchaseProducts', Ext.JSON.encode(datas));
			proxy.setExtraParam('id', selection.getId());
			var op = new Ext.data.Operation({
				action : 'update'
			});
			proxy.read(op, function() {
				if (op.wasSuccessful()) {
					Ext.Msg.alert('提示', '收货成功');
					var store = Ext.data.StoreManager.lookup(this.purchaseProductStore);
					store.getProxy().setExtraParam('purchase_id', selection.getId());
					store.load();
					var store2 = Ext.data.StoreManager.lookup(this.purchaseStore);
					store2.load();
				} else {
					Ext.Msg.alert('提示', '收货失败，请稍候再试');
				}
			}, me);
		}
	},
	/**
	 * 保存成功回调
	 */
	onSaveSuccess : function(that) {
		if (that) {
			var win = that.ownerCt;
			win.destroy();
		}
		var store = Ext.data.StoreManager.lookup(this.purchaseStore);
		store.loadPage(1);
		this.show();
	},
	/**
	 * 删除
	 */
	onDeleteClick : function() {
		var selection = this.down('grid[title="采购单"]').getView().getSelectionModel().getSelection()[0];
		if (selection) {
			if (!selection.canDelete()) {
				Ext.Msg.alert('提示', '此采购单已经收货或者已经付款、或者已经绑定账单，无法删除！');
			} else {
				Ext.Msg.confirm('提示', '确定要删除此采购单么？', function(btn, text) {
					if (btn == 'yes') {
						var store = Ext.data.StoreManager.lookup(this.purchaseStore);
						store.remove(selection);
					}
				}, this);
			}
		} else {
			Ext.Msg.alert('提示', '请选择产品');
		}
	},
	/**
	 * 打印
	 */
	onSalePrintClick : function() {
		var selection = this.down('grid[title="采购单"]').getView().getSelectionModel().getSelection()[0];
		if (selection) {
			window.open(location.context + '/purchase_order.do?action=print_bill&id=' + selection.getId(), "_blank");
		} else {
			Ext.Msg.alert('提示', '请选择产品');
		}
	},
	onEditClick : function() {
		var selection = this.down('grid[title="采购单"]').getView().getSelectionModel().getSelection()[0];
		if (selection) {
			if (selection.canEdit()) {
				var des = myDesktopApp.getDesktop();
				var form = Ext.create('WJM.purchase.PurchaseForm', {
					listeners : {
						saveSuccess : this.onSaveSuccess, scope : this
					}, record : selection
				});
				win = des.createWindow({
					title : "编辑采购单", iconCls : 'icon-grid', animCollapse : false, width : 800, height : 500, constrainHeader : true, layout : 'fit',
					items : [ form ]
				});
				win.show();
			} else {
				Ext.Msg.alert('提示', '此采购不可以编辑。');
			}
		} else {
			Ext.Msg.alert('提示', '请选择采购');
		}
	}
});