/**
 * 客户列表
 */
Ext.define('WJM.customer.CustomerGrid', {
	extend : 'Ext.panel.Panel',
	requires : [ 'Ext.grid.Panel', 'WJM.model.TVendor', 'Ext.grid.plugin.RowEditing' ],
	/**
	 * 是否可以编辑
	 */
	editAble : false,
	/**
	 * 是否可以付款
	 */
	cashAble : false,
	height : 487,
	width : 569,
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
				iconCls : 'add', text : '添加', scope : this, handler : this.onAddClick
			}, {
				iconCls : 'edit', text : '编辑', scope : this, handler : this.onEditClick
			}, {
				iconCls : 'remove', text : '删除', scope : this, handler : this.onDeleteClick
			} ]
		});

		var _fileds = [ {
			xtype : 'rownumberer'
		}, {
			text : "customer code/客户代码", dataIndex : 'code', sortable : true, width : 150
		}, {
			text : "customer name/客户名字", dataIndex : 'shortName', sortable : true, width : 100
		}, {
			text : "customer type/客户类型", dataIndex : 'acc_type_cn', sortable : true, width : 70
		}, {
			text : "deposit/预付金额", dataIndex : 'show_leav_money', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "Credit Line/信用金额", dataIndex : 'credit_Line', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "account balance/帐号余额", dataIndex : 'acc_balance', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "Outstanding Balance/未付金额", dataIndex : 'balance', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "total/总消费额", dataIndex : 'total', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "tax id/税号", dataIndex : 'taxCode', sortable : true, width : 100
		}, {
			text : "Contact Person/联系人", dataIndex : 'linkMan', sortable : true, width : 100
		}, {
			text : "phone/电话", dataIndex : 'mobile', sortable : true
		}, {
			text : "Address/地址", dataIndex : 'address', sortable : true
		}, {
			text : "remark/注释", dataIndex : 'myMemo', sortable : true, flex : 1
		} ];
		var items = [];
		items.push({
			anchor : '100%', height : 100, xtype : 'form', region : 'north', autoScroll : true, collapsible : true, title : '客户检索', layout : {
				columns : 2, type : 'table'
			}, bodyPadding : 10, items : [ {
				xtype : 'textfield', fieldLabel : 'customer name/客户名字', labelWidth : 150, name : 'shortName'
			}, {
				xtype : 'textfield', fieldLabel : 'contact person/联系人', labelWidth : 150, name : 'linkMan'
			}, {
				xtype : 'textfield', fieldLabel : 'phone/电话', labelWidth : 150, name : 'mobile'
			} ]
		}, {
			store : 'CustomerSearchStore', split : true, disableSelection : false, loadMask : true, autoScroll : true, region : 'center',
			xtype : 'gridpanel', columns : _fileds, viewConfig : {
				plugins : [ Ext.create('Ext.grid.plugin.DragDrop', {
					ptype : 'gridviewdragdrop', ddGroup : 'TCustomer', enableDrop : false
				}) ]
			}, bbar : Ext.create('Ext.PagingToolbar', {
				store : 'CustomerSearchStore', displayInfo : true, displayMsg : '显示 客户 {0} - {1} 总共 {2}', emptyMsg : "没有客户数据"
			}), listeners : {
				selectionchange : function(selectionModel, selecteds, eOpts) {
					if (this.cashGrid) {
						var recode = selectionModel.getSelection()[0];
						if (recode) {
							this.cashGrid.setCustomer(recode);
						}
					}
				}, scope : this
			}
		});
		if (this.cashAble) {
			this.cashGrid = Ext.create('WJM.cash.widget.SaleCashGrid', {
				region : 'south', title : '客户订单列表', height : 400, collapsed : false, collapsible : true, saleStore : 'SaleCustomerCashStore',
				saleCashHistoryStore : 'SaleCashHistoryStore'
			});
			this.cashGrid.on('saveSuccess', this.onSaveSuccess, this);
			items.push(this.cashGrid);
		}
		Ext.apply(this, {
			autoScroll : true, dockedItems : [ this.editTopBar ], items : items
		});
		var store = Ext.data.StoreManager.lookup('CustomerSearchStore');
		store.loadPage(1);
		this.callParent();
	},
	/**
	 * 删除
	 */
	onDeleteClick : function() {
		var selection = this.down('grid').getView().getSelectionModel().getSelection()[0];
		if (selection) {
			Ext.Msg.confirm('提示', '确定要删除此客户么？', function(btn, text) {
				if (btn == 'yes') {
					var store = Ext.data.StoreManager.lookup('CustomerSearchStore');
					store.remove(selection);
				}
			}, this);
		} else {
			Ext.Msg.alert('提示', '请选择客户');
		}
	},
	/**
	 * 添加
	 */
	onAddClick : function() {
		var des = myDesktopApp.getDesktop();
		win = des.createWindow({
			title : "新建客户", height : 680, width : 500, iconCls : 'icon-grid', animCollapse : false, constrainHeader : true, layout : 'fit',
			items : [ Ext.create('WJM.customer.CustomerForm', {
				listeners : {
					saveSuccess : this.onSaveSuccess, scope : this
				}
			}) ]
		});
		win.show();
	},
	/**
	 * 编辑
	 */
	onEditClick : function() {
		var selection = this.down('grid').getView().getSelectionModel().getSelection()[0];
		if (selection) {
			var des = myDesktopApp.getDesktop();
			var form = Ext.create('WJM.customer.CustomerForm', {
				listeners : {
					saveSuccess : this.onSaveSuccess, scope : this
				}
			});
			win = des.createWindow({
				title : "编辑客户", height : 680, width : 500, iconCls : 'icon-grid', animCollapse : false, constrainHeader : true, layout : 'fit',
				items : [ form ]
			});
			win.show();
			form.getForm().loadRecord(selection);
		} else {
			Ext.Msg.alert('提示', '请选择客户');
		}
	},
	/**
	 * 保存成功回调
	 */
	onSaveSuccess : function(that) {
		if (that) {
			var win = that.ownerCt;
			if (win) {
				win.destroy();
			}
		}
		var store = Ext.data.StoreManager.lookup('CustomerSearchStore');
		store.loadPage(1);
	},
	/**
	 * 搜索
	 */
	onSearchClick : function() {
		var data = this.down('form').getForm().getFieldValues();
		var store = Ext.data.StoreManager.lookup('CustomerSearchStore');
		Ext.Object.each(data, function(key, value) {
			store.getProxy().setExtraParam(key, value);
		});
		store.loadPage(1);
	}
});