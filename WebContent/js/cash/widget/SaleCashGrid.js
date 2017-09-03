/**
 * 销售单收款模块
 */
Ext.define('WJM.cash.widget.SaleCashGrid', {
	extend : 'Ext.panel.Panel',
	requires : [ 'Ext.grid.Panel', 'WJM.model.TSaleCashHistory' ],
	collapsedStatistics : false,
	layout : {
		type : 'border', padding : 5
	},
	defaults : {
		split : true
	},

	customer : null,

	saleStore : 'SaleStore',

	saleCashHistoryStore : 'SaleCashHistoryStore',

	initComponent : function() {
		var topbarbuttons = [ {
			iconCls : 'search', text : '打印订单', scope : this, handler : this.onSalePrintClick
		} ];

		topbarbuttons.push({
			iconCls : 'search', text : '打印出货单', scope : this, handler : this.onPackePrintClick
		});

		topbarbuttons.push(
		// {
		// iconCls : 'edit', text : '收款', scope : this, handler : this.onCashClick
		// }
		{
			iconCls : 'edit', text : '批量收款', scope : this, handler : this.onCashGridClick
		}, {
			text : '按住control键多选', xtype : 'label'
		});

		this.editTopBar = Ext.create('Ext.toolbar.Toolbar', {
			items : topbarbuttons
		});

		var _fileds = [ {
			xtype : 'rownumberer'
		}, {
			text : "receive #/销售单", dataIndex : 'sale_bill_code', sortable : true
		}, {
			text : "invoice #/invoice单号", dataIndex : 'invoice', sortable : true
		}, {
			text : "saleman/销售员", dataIndex : 'oper_name', sortable : true
		}, {
			text : "customer/客户", dataIndex : 'buyer_name', sortable : true
		}, {
			text : "total/合计", dataIndex : 'all_price', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "invoice balance/账单余额", dataIndex : 'balance', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "state/状态", dataIndex : 'if_cashedStr', sortable : true
		}, {
			text : "date/时间", dataIndex : 'oper_time', sortable : true
		}, {
			text : "tax/税", dataIndex : 'tax', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "payment/支付方式", dataIndex : 'payment', sortable : true
		}, {
			text : "sub total/小计", dataIndex : 'sub_total', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "discount/优惠", dataIndex : 'discount', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		} ];

		var _fileds2 = [ {
			xtype : 'rownumberer'
		}, {
			text : "amount/收款金额", dataIndex : 'amount', sortable : true
		}, {
			text : "date/时间", dataIndex : 'payDate', sortable : true
		}, {
			text : "payment/支付方式", dataIndex : 'payment', sortable : true
		}, {
			text : "remark/备注", dataIndex : 'remark', sortable : true, width : 200
		} ];

		Ext.apply(this, {
			autoScroll : true,
			dockedItems : [ this.editTopBar ],

			items : [
					{
						store : this.saleStore, split : true, disableSelection : false, loadMask : true, autoScroll : true, region : 'center',
						multiSelect : true, title : '订单', xtype : 'gridpanel', columns : _fileds,

						viewConfig : {
							plugins : []
						},

						listeners : {
							selectionchange : function(selectionModel, selecteds, eOpts) {
								var recode = selectionModel.getSelection()[0];
								if (recode) {
									var store = Ext.data.StoreManager.lookup(this.saleCashHistoryStore);
									store.getProxy().setExtraParam('id', recode.getId());
									store.load();
								}
							}, scope : this
						},

						bbar : Ext.create('Ext.PagingToolbar', {
							store : this.saleStore, displayInfo : true, displayMsg : '显示订单 {0} - {1} 总共 {2}', emptyMsg : "没有订单数据"
						})
					},
					{
						region : 'south', store : this.saleCashHistoryStore, split : true, disableSelection : false, collapsible : true, split : true,
						loadMask : true, height : 150, autoScroll : true, multiSelect : true, title : '收款明细', xtype : 'gridpanel', columns : _fileds2
					} ]
		});
		this.callParent();
	},

	/**
	 * 收款
	 */
	onCashClick : function() {
		var selection = this.down('grid[title="订单"]').getView().getSelectionModel().getSelection()[0];
		if (selection) {
			if (selection.get('if_cashed') == 0) {
				var des = myDesktopApp.getDesktop();
				var form = Ext.create('WJM.cash.SaleCashForm', {
					listeners : {
						saveSuccess : this.onSaveSuccess, scope : this
					}, record : selection
				});
				win = des.createWindow({
					title : "收款", iconCls : 'icon-grid', animCollapse : false, constrainHeader : true, layout : 'fit', items : [ form ]
				});
				win.show();
			} else {
				Ext.Msg.alert('提示', '此订单已经收款');
			}
		} else {
			Ext.Msg.alert('提示', '请选择订单');
		}
	},

	/**
	 * 批量收款
	 */
	onCashGridClick : function() {
		var selection = this.down('grid[title="订单"]').getView().getSelectionModel().getSelection();
		if (selection[0]) {
			var records = [];
			Ext.Array.each(selection, function(item) {
				if (item.get('if_cashed') == 0) {
					var tSaleCashHistory = Ext.create('WJM.model.TSale', item.getData());
					records.push(tSaleCashHistory);
				}
			});
			if (records.length > 0) {
				var des = myDesktopApp.getDesktop();
				var form = Ext.create('WJM.cash.widget.SaleCashGridForm', {
					listeners : {
						saveSuccess : this.onSaveSuccess, scope : this
					}, records : records, customer : this.customer
				});
				win = des.createWindow({
					title : "批量收款", iconCls : 'icon-grid', animCollapse : false, constrainHeader : true, layout : 'fit', items : [ form ]
				});
				win.show();
			} else {
				Ext.Msg.alert('提示', '没有未收款的订单！');
			}
		} else {
			Ext.Msg.alert('提示', '请选择订单');
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
		this.fireEvent('saveSuccess');
	},

	/**
	 * 打印
	 */
	onSalePrintClick : function() {
		var selection = this.down('grid[title="订单"]').getView().getSelectionModel().getSelection()[0];
		if (selection) {
			window.open(location.context + '/sale.do?action=re_print&id=' + selection.getId(), "_blank");
		} else {
			Ext.Msg.alert('提示', '请选择订单');
		}
	},
	/**
	 * 打印
	 */
	onPackePrintClick : function() {
		var selection = this.down('grid[title="订单"]').getView().getSelectionModel().getSelection()[0];
		if (selection) {
//			if (selection.get('if_cashed') == 0) {
//				Ext.Msg.alert('提示', '此订单未完全收款，无法打印出货单');
//			} else {
				window.open(location.context + '/sale.do?action=packing_print&id=' + selection.getId(), "_blank");
//			}
		} else {
			Ext.Msg.alert('提示', '请选择订单');
		}
	},
	/**
	 * 设置客户
	 */
	setCustomer : function(recode) {
		this.customer = recode;
		var store = Ext.data.StoreManager.lookup(this.saleStore);
		store.getProxy().setExtraParam('buyer_id', recode.getId());
		store.getProxy().setExtraParam('type', -1);
		
		store.load({
			callback:function(){
				store.getProxy().setExtraParam('type', 0);
			}
		});
	}
});