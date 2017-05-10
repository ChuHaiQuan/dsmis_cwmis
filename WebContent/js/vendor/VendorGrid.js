/**
 * 供货商编辑列表
 */
Ext.define('WJM.vendor.VendorGrid', {
	extend : 'Ext.panel.Panel',
	requires : [ 'Ext.grid.Panel', 'WJM.model.TVendor', 'Ext.grid.plugin.RowEditing', 'WJM.model.TPurchaseCashHistory' ],
	/**
	 * 是否可以编辑
	 */
	editAble : false,
	height : 487,
	width : 569,
	layout : {
		type : 'border', padding : 5
	},
	defaults : {
		split : true
	},

	initComponent : function() {

		if (this.editAble) {
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
		} else {
			this.editTopBar = Ext.create('Ext.toolbar.Toolbar', {
				items : [ {
					iconCls : 'search', text : '搜索', scope : this, handler : this.onSearchClick
				} ]
			});
		}

		var _fileds = [ {
			xtype : 'rownumberer'
		}, {
			text : "company code/公司编号", dataIndex : 'code', sortable : true, width : 150
		}, {
			text : "name/名字", dataIndex : 'shortName', sortable : true, width : 100
		}, {
			text : "Company Address/地址", dataIndex : 'address', sortable : true, width : 100
		}, {
			text : "Contact Person/联系人", dataIndex : 'linkMan', sortable : true, width : 100
		}, {
			text : "phone/电话", dataIndex : 'mobile', sortable : true
		}, {
			text : "paid amount/已付金额", dataIndex : 'paid_total', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "account balance/账户余额", dataIndex : 'acc_balance', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "outstanding balance/未付余额", dataIndex : 'invoice_balance', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "P.O. total/定单总额", dataIndex : 'invoice_total', xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "remark/备注", dataIndex : 'myMemo'
		} ];

		var items = [
				{
					anchor : '100%', height : 100, xtype : 'form', autoScroll : true, title : '商家检索', region : 'north', collapsible : true,
					layout : {
						columns : 2, type : 'table'
					}, bodyPadding : 10, items : [ {
						xtype : 'textfield', fieldLabel : 'company name/名称', labelWidth : 150, name : 'shortName'
					}, {
						xtype : 'textfield', fieldLabel : 'company code/编号', labelWidth : 150, name : 'code'
					}, {
						xtype : 'textfield', fieldLabel : 'contact person/联系人', labelWidth : 150, name : 'linkMan'
					}, {
						xtype : 'textfield', fieldLabel : 'phone/电话', labelWidth : 150, name : 'mobile'
					} ]
				},
				{
					store : 'VendorSearchStore', split : true, disableSelection : false, loadMask : true, autoScroll : true, region : 'center',
					xtype : 'gridpanel', columns : _fileds, minHeight : 200, viewConfig : {
						plugins : [ Ext.create('Ext.grid.plugin.DragDrop', {
							ptype : 'gridviewdragdrop', ddGroup : 'TVendor'
						})

						]
					}, bbar : Ext.create('Ext.PagingToolbar', {
						store : 'VendorSearchStore', displayInfo : true, displayMsg : '显示 供货商 {0} - {1} 总共 {2}', emptyMsg : "没有供货商数据"
					}), listeners : {
						selectionchange : function(selectionModel, selecteds, eOpts) {
							var recode = selectionModel.getSelection()[0];
							if (recode) {
								var store = Ext.data.StoreManager.lookup('PurchaseVendorCashStore');
								store.getProxy().setExtraParam('provider_id', recode.getId());
								store.load();
							}
						}, scope : this
					}
				} ];
		if (this.editAble) {
			var cashGrid = Ext.create('WJM.cash.widget.PurchaseCashGrid', {
				region : 'south', title : '供货商采购单列表', height : 400, collapsed : false, collapsible : true,
				purchaseStore : 'PurchaseVendorCashStore', purchaseProductStore : 'PurchaseProductVendorCashStore',
				cashStore : 'PurchaseCashHistoryStore'
			});
			cashGrid.on('saveSuccess', this.onSaveSuccess, this);
			items.push(cashGrid);
		}

		Ext.apply(this, {
			autoScroll : true, dockedItems : [ this.editTopBar ], items : items
		});
		var store = Ext.data.StoreManager.lookup('VendorSearchStore');
		store.loadPage(1);
		this.callParent();
	},
	/**
	 * 删除
	 */
	onDeleteClick : function() {
		var selection = this.down('grid').getView().getSelectionModel().getSelection()[0];
		if (selection) {
			Ext.Msg.confirm('提示', '确定要删除此供货商么？', function(btn, text) {
				if (btn == 'yes') {
					var store = Ext.data.StoreManager.lookup('VendorSearchStore');
					store.remove(selection);
				}
			}, this);
		} else {
			Ext.Msg.alert('提示', '请选择供应商');
		}
	},
	/**
	 * 添加
	 */
	onAddClick : function() {
		var des = myDesktopApp.getDesktop();
		win = des.createWindow({
			title : "新建供应商", height : 380, width : 500, iconCls : 'icon-grid', animCollapse : false, constrainHeader : true, layout : 'fit',
			items : [ Ext.create('WJM.vendor.VendorForm', {
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
			var form = Ext.create('WJM.vendor.VendorForm', {
				listeners : {
					saveSuccess : this.onSaveSuccess, scope : this
				}
			});
			win = des.createWindow({
				title : "编辑供应商", height : 380, width : 500, iconCls : 'icon-grid', animCollapse : false, constrainHeader : true, layout : 'fit',
				items : [ form ]
			});
			win.show();
			form.getForm().loadRecord(selection);
		} else {
			Ext.Msg.alert('提示', '请选择供应商');
		}
	},
	/**
	 * 保存成功回调
	 */
	onSaveSuccess : function(that) {
		if (that.ownerCt) {
			var win = that.ownerCt;
			win.destroy();
		}
		var store = Ext.data.StoreManager.lookup('VendorSearchStore');
		store.load();
	},
	/**
	 * 搜索
	 */
	onSearchClick : function() {
		var data = this.down('form').getForm().getFieldValues();
		var store = Ext.data.StoreManager.lookup('VendorSearchStore');
		Ext.Object.each(data, function(key, value) {
			store.getProxy().setExtraParam(key, value);
		});
		store.loadPage(1);
	}
});