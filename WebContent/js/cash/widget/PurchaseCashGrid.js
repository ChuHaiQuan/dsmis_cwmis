/**
 * 采购单付款组件
 */
Ext.define('WJM.cash.widget.PurchaseCashGrid', {
	extend : 'Ext.panel.Panel',
	requires : [ 'Ext.grid.Panel' ],
	layout : {
		type : 'border', padding : 5
	},
	defaults : {
		split : true
	},

	purchaseStore : 'PurchaseStore',

	cashStore : 'PurchaseCashHistoryStore',

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
			text : "amount/付款金额", dataIndex : 'amout', sortable : true
		}, {
			text : "date/时间", dataIndex : 'payDateForDB', sortable : true
		}, {
			text : "payment/支付方式", dataIndex : 'payment', sortable : true
		}, {
			text : "remark/备注", dataIndex : 'remark', sortable : true, width : 200
		} ];
		var defaultItems = [ {
			iconCls : 'search', text : '打印', scope : this, handler : this.onSalePrintClick
		} ];
		defaultItems.push({
			iconCls : 'edit', text : '添加账单', scope : this, handler : this.onAddInvoiceClick
		}, {
			iconCls : 'edit', text : '付款', scope : this, handler : this.onCashClick
		});
		this.editTopBar = Ext.create('Ext.toolbar.Toolbar', {
			items : defaultItems
		});

		Ext.apply(this, {
			autoScroll : true,
			dockedItems : [ this.editTopBar ],

			items : [
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
									var store = Ext.data.StoreManager.lookup(this.cashStore);
									store.getProxy().setExtraParam('provider_id', recode.get('provider_id'));
									store.getProxy().setExtraParam('purchase_bill_code', recode.get('purchase_bill_code'));
									store.load();
								}
							}, scope : this
						},

						bbar : Ext.create('Ext.PagingToolbar', {
							store : this.purchaseStore, displayInfo : true, displayMsg : '显示采购单 {0} - {1} 总共 {2}', emptyMsg : "没有采购单数据"
						})
					},
					{
						store : this.cashStore, split : true, disableSelection : false, collapsible : true, split : true, loadMask : true,
						height : 150, autoScroll : true, region : 'south', multiSelect : true, title : '账单付款明细', xtype : 'gridpanel',
						columns : _fileds2, viewConfig : {
							plugins : []
						}, plugins : []
					} ]
		});
		this.callParent();
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
	 * 打印
	 */
	onSalePrintClick : function() {
		var selection = this.down('grid[title="采购单"]').getView().getSelectionModel().getSelection()[0];
		if (selection) {
			window.open(location.context + '/purchase_order.do?action=print_bill&id=' + selection.getId(), "_blank");
		} else {
			Ext.Msg.alert('提示', '请选择采购单');
		}
	},
	/**
	 * 保存成功回调
	 */
	onSaveSuccess : function(that) {
		var win = that.ownerCt;
		win.destroy();
		var store = Ext.data.StoreManager.lookup(this.purchaseStore);
		store.loadPage(1);
		this.show();
		this.fireEvent('saveSuccess');
	}
});