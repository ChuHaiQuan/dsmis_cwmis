/**
 * 产品列表
 */
Ext.define('WJM.product.ProductGridNew', {
	extend : 'Ext.panel.Panel',
	requires : [ 'Ext.grid.Panel', 'WJM.product.ProductCategoryTree' ],
	/**
	 * 是否可以编辑
	 */
	editAble : false,
	/**
	 * 进货价格显示
	 */
	hasCost : true,

	layout : {
		type : 'border', padding : 2
	},
	defaults : {
		split : true
	},

	initComponent : function() {
		var _fileds = [];
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
		if (this.hasCost) {
			_fileds = [ {
				xtype : 'rownumberer'
			}, {
				text : "items id/助记符", dataIndex : 'product_id', sortable : true, width : 100
			}, {
				text : "barcode #/条码", dataIndex : 'code', sortable : true, width : 100
			}, {
				text : "description 1", dataIndex : 'product_name', sortable : true, width : 200
			}, {
				text : "description 2", dataIndex : 'product_name_cn', sortable : true, width : 200
			}, {
				text : "category id/分类", dataIndex : 'product_type', sortable : true, width : 100, renderer : function(value) {
					var store = Ext.data.StoreManager.lookup('ProductCategoryAllStore');
					var record = store.getById(Number(value));
					if (record) {
						return record.get('product_type_name');
					}
				}
			}, {
				text : "cost/进货价", dataIndex : 'price_income', sortable : true, xtype : 'numbercolumn', format : '$0.00'
			}, {
				text : "sale price/销售价格", dataIndex : 'price_simgle', sortable : true, xtype : 'numbercolumn', format : '$0.00'
			}, {
				text : "WHLS price", dataIndex : 'price_wholesale', sortable : true, xtype : 'numbercolumn', format : '$0.00'
			}, {
				text : "quantity/数量", dataIndex : 'num', sortable : true
			} ];
		} else {
			_fileds = [ {
				xtype : 'rownumberer'
			}, {
				text : "items id/助记符", dataIndex : 'product_id', sortable : true, width : 100
			}, {
				text : "barcode #/条码", dataIndex : 'code', sortable : true, width : 100
			}, {
				text : "description 1", dataIndex : 'product_name', sortable : true, width : 200
			}, {
				text : "description 2", dataIndex : 'product_name_cn', sortable : true, width : 200
			}, {
				text : "category id/分类", dataIndex : 'product_type', sortable : true, width : 100, renderer : function(value) {
					var store = Ext.data.StoreManager.lookup('ProductCategoryAllStore');
					var record = store.getById(Number(value));
					if (record) {
						return record.get('product_type_name');
					}
				}
			}, {
				text : "sale price/销售价格", dataIndex : 'price_simgle', sortable : true, xtype : 'numbercolumn', format : '$0.00'
			}, {
				text : "WHLS price", dataIndex : 'price_wholesale', sortable : true, xtype : 'numbercolumn', format : '$0.00'
			}, {
				text : "quantity/数量", dataIndex : 'num', sortable : true
			} ];
		}
		Ext.apply(this, {
			autoScroll : true,
			dockedItems : [ this.editTopBar ],

			items : [
					{
						anchor : '100%', height : 100, xtype : 'form', region : 'north', autoScroll : true, collapsible : true, title : '名称检索',
						layout : {
							columns : 2, type : 'table'
						}, bodyPadding : 10, items : [ {
							xtype : 'textfield', fieldLabel : 'items id/助记符', labelWidth : 150, name : 'product_id', listeners : {
								change : this.onAutoSearch, scope : this
							}
						}, {
							xtype : 'textfield', fieldLabel : 'barcode #/条码', labelWidth : 150, name : 'code', listeners : {
								change : this.onAutoSearch, scope : this
							}
						}, {
							xtype : 'textfield', fieldLabel : 'description', labelWidth : 150, name : 'product_name', listeners : {
								change : this.onAutoSearch, scope : this
							}
						} ]
					},
					Ext.create('WJM.product.ProductCategoryTree', {
						region : 'west', width : 200, editAble : false, collapsible : true, title : '类别检索', editAble : this.editAble, listeners : {
							selectionchange : function(selectionModel, selecteds, eOpts) {
								var recode = selectionModel.getSelection()[0];
								if (recode) {
									this.clearExtraParam();
									var store = Ext.data.StoreManager.lookup('ProductStore');
									store.getProxy().setExtraParam('product_type', recode.getId());
									store.loadPage(1);
								}
							}, scope : this
						}
					}),
					{
						store : 'ProductStore', disableSelection : false, multiSelect : true, loadMask : true, region : 'center', xtype : 'gridpanel',
						columns : _fileds, viewConfig : {
							plugins : [ Ext.create('Ext.grid.plugin.DragDrop', {
								ptype : 'gridviewdragdrop', ddGroup : 'TProduct', enableDrop : false
							}) ]
						}, bbar : Ext.create('Ext.PagingToolbar', {
							store : 'ProductStore', displayInfo : true, displayMsg : '显示 产品 {0} - {1} 总共 {2}', emptyMsg : "没有产品数据"
						})
					} ]
		});
		var store = Ext.data.StoreManager.lookup('ProductStore');
		store.loadPage(1);
		this.callParent();
	},
	/**
	 * 自动搜索
	 */
	onAutoSearch : function(field, newValue, oldValue, eOpts) {
		if (newValue && newValue.length >= 3) {
			this.onSearchClick();
		}
	},
	/**
	 * 删除
	 */
	onDeleteClick : function() {
		var selection = this.down('grid').getView().getSelectionModel().getSelection()[0];
		if (selection) {
			Ext.Msg.confirm('提示', '确定要删除此产品么？', function(btn, text) {
				if (btn == 'yes') {
					var store = Ext.data.StoreManager.lookup('ProductStore');
					store.remove(selection);
				}
			}, this);
		} else {
			Ext.Msg.alert('提示', '请选择产品');
		}
	},
	/**
	 * 添加
	 */
	onAddClick : function() {
		var des = myDesktopApp.getDesktop();
		var win = des.getWindow('ProductForm');
		if (win) {
			win.destroy();
		}
		win = des.createWindow({
			title : "新建产品", iconCls : 'icon-grid', animCollapse : false, constrainHeader : true, layout : 'fit',
			items : [ Ext.create('WJM.product.ProductForm', {
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
			var form = Ext.create('WJM.product.ProductForm', {
				listeners : {
					saveSuccess : this.onSaveSuccess, scope : this
				}, record : selection
			});
			var win = des.getWindow('ProductForm');
			if (win) {
				win.destroy();
			}
			win = des.createWindow({
				title : "编辑产品", iconCls : 'icon-grid', animCollapse : false, constrainHeader : true, layout : 'fit', items : [ form ]
			});
			win.show();
			form.getForm().loadRecord(selection);
		} else {
			Ext.Msg.alert('提示', '请选择产品');
		}
	},
	/**
	 * 保存成功回调
	 */
	onSaveSuccess : function(that) {
		var win = that.ownerCt;
		win.destroy();
		var store = Ext.data.StoreManager.lookup('ProductStore');
		store.loadPage(1);
		this.show();
	},
	/**
	 * 搜索
	 */
	onSearchClick : function() {
		this.clearExtraParam();
		var data = this.down('form').getForm().getFieldValues();
		var store = Ext.data.StoreManager.lookup('ProductStore');
		Ext.Object.each(data, function(key, value) {
			store.getProxy().setExtraParam(key, value);
		});
		store.loadPage(1);
	},
	/**
	 * 清除store
	 */
	clearExtraParam : function() {
		var data = this.down('form').getForm().getFieldValues();
		var store = Ext.data.StoreManager.lookup('ProductStore');
		Ext.Object.each(data, function(key, value) {
			store.getProxy().setExtraParam(key, null);
		});
		store.getProxy().setExtraParam('product_type', null);
	}
});