/**
 * 产品列表
 */
Ext.define('WJM.product.widget.ProductGrid', {
	extend : 'Ext.panel.Panel',
	requires : [ 'Ext.grid.Panel' ],
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

	productStore : 'ProductStore',

	initComponent : function() {
		var _fileds = [];
		if (this.editAble) {
			this.editTopBar = Ext.create('Ext.toolbar.Toolbar', {
				items : [ {
					iconCls : 'add', text : '添加', scope : this, handler : this.onAddClick
				}, {
					iconCls : 'edit', text : '编辑', scope : this, handler : this.onEditClick
				}, {
					iconCls : 'remove', text : '删除', scope : this, handler : this.onDeleteClick
				} ]
			});
		} else {
			this.editTopBar = null;
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
			}, {
				text : "min Stock/最小库存", dataIndex : 'downLimit', sortable : true
			}, {
				text : "vendor/供货商", dataIndex : 'vendortName', sortable : true
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
				text : "sale price/销售价格", dataIndex : 'price_simgle', sortable : true, xtype : 'numbercolumn'
			}, {
				text : "WHLS price", dataIndex : 'price_wholesale', sortable : true, xtype : 'numbercolumn'
			}, {
				text : "quantity/数量", dataIndex : 'num', sortable : true
			}, {
				text : "min Stock/最小库存", dataIndex : 'downLimit', sortable : true
			}, {
				text : "vendor/供货商", dataIndex : 'vendortName', sortable : true
			} ];
		}
		Ext.apply(this, {
			autoScroll : true,
			dockedItems : [ this.editTopBar ],

			items : [ {
				store : this.productStore, disableSelection : false, multiSelect : true, loadMask : true, region : 'center', xtype : 'gridpanel',
				columns : _fileds, viewConfig : {
					plugins : [ Ext.create('Ext.grid.plugin.DragDrop', {
						ptype : 'gridviewdragdrop', ddGroup : 'TProduct', enableDrop : false
					}) ]
				}, bbar : Ext.create('Ext.PagingToolbar', {
					store : this.productStore, displayInfo : true, displayMsg : '显示 产品 {0} - {1} 总共 {2}', emptyMsg : "没有产品数据"
				})
			} ]
		});
		this.callParent();
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
	}
});