/**
 * 产品类别编辑
 */
Ext.define('WJM.product.ProductCategoryTree', {
	extend : 'Ext.tree.Panel',
	requires : [ 'Ext.tree.Panel', 'WJM.model.TProductCategory' ],
	/**
	 * 是否可以编辑
	 */
	editAble : false,

	initComponent : function() {
		var me = this;
		this.editTopBar = Ext.create('Ext.toolbar.Toolbar', {
			dock : 'top', items : [ {
				iconCls : 'add', text : '添加根类别', scope : this, handler : this.onAddRootClick
			}, {
				iconCls : 'add', text : '添加子类别', scope : this, handler : this.onAddLeafClick
			}, {
				iconCls : 'edit', text : '编辑类别', scope : this, handler : this.onEditClick
			}, {
				iconCls : 'remove', text : '删除', scope : this, handler : this.onDeleteClick
			} ]
		});

		var _fileds = [ {
			xtype : 'treecolumn', text : 'name/类别', flex : 2, sortable : true, dataIndex : 'product_type_name'
		}, {
			text : 'code/类别编号', sortable : true, dataIndex : 'code', align : 'center'
		} ];

		Ext.apply(this, {
			store : 'ProductCategoryStore', loadMask : true, rootVisible : true, multiSelect : false, singleExpand : false,

			viewConfig : {
				plugins : [ {
					ptype : 'treeviewdragdrop', ddGroup : 'TProductCategory', enableDrop : false
				} ]
			}, columns : _fileds
		});

		if (this.editAble) {
			Ext.apply(this, {
				dockedItems : [], viewConfig : {
					plugins : [ {
						ptype : 'treeviewdragdrop', ddGroup : 'TProductCategory', enableDrop : true
					} ]
				}
			});
			_fileds.push({
				text : 'id/类别id', flex : 1, dataIndex : 'id', sortable : true
			});
			this.on("afterrender", this.initContextmenu, this);
		}
		this.callParent();
	},

	/**
	 * 右键初始化
	 */
	initContextmenu : function() {
		var me = this;
		var ret = {
			items : [ {
				text : '添加类别', handler : me.onAddClick, scope : me, minWindows : 1
			}, {
				text : '修改类别', handler : me.onEditClick, scope : me, minWindows : 1
			}, {
				text : '删除类别', handler : me.onDeleteClick, scope : me, minWindows : 1
			} ]
		};

		this.contextMenu = new Ext.menu.Menu(ret);
		this.getEl().on('contextmenu', function(e) {
			var me = this, menu = me.contextMenu;
			// this.getView().getSelectionModel().deselectAll();
			e.stopEvent();
			menu.showAt(e.getXY());
			menu.doConstrain();
		}, this);
	},
	/**
	 * 删除
	 */
	onDeleteClick : function() {
		var selection = this.getView().getSelectionModel().getSelection()[0];
		if (selection) {
			Ext.Msg.confirm('提示', '确定要删除此类别么？', function(btn, text) {
				if (btn == 'yes') {
					selection.remove(true);
				}
			}, this);
		} else {
			Ext.Msg.alert('提示', '请选择类别');
		}
	},
	/**
	 * 添加根类别
	 */
	onAddRootClick : function() {
		var des = myDesktopApp.getDesktop();
		win = des.createWindow({
			title : "新建类别", height : 150, width : 300, iconCls : 'icon-grid', animCollapse : false, constrainHeader : true, layout : 'fit',
			items : [ Ext.create('WJM.product.ProductCategoryForm', {
				record : Ext.create('WJM.model.TProductCategory', {
					level : 1, parent_id : 0, parent_product_type_name : '根节点'
				}), listeners : {
					saveSuccess : this.onSaveSuccess, scope : this
				}
			}) ]
		});
		win.show();
	},
	/**
	 * 添加叶子类别
	 */
	onAddLeafClick : function() {
		var selection = this.getSelectionModel().getSelection()[0];
		if (selection) {
			var des = myDesktopApp.getDesktop();
			win = des.createWindow({
				title : "新建类别",
				height : 150,
				width : 300,
				iconCls : 'icon-grid',
				animCollapse : false,
				constrainHeader : true,
				layout : 'fit',
				items : [ Ext.create('WJM.product.ProductCategoryForm', {
					record : Ext.create('WJM.model.TProductCategory', {
						level : selection.get('level') + 1, parent_id : selection.get('id'),
						parent_product_type_name : selection.get('product_type_name')
					}), listeners : {
						saveSuccess : this.onSaveSuccess, scope : this
					}
				}) ]
			});
			win.show();
		} else {
			Ext.Msg.alert('提示', '请选择类别');
		}
	},

	/**
	 * 添加类别
	 */
	onAddClick : function() {
		var selection = this.getSelectionModel().getSelection()[0];
		if (selection) {
			this.onAddLeafClick();
		} else {
			this.onAddRootClick();
		}
	},
	/**
	 * 保存成功
	 */
	onSaveSuccess : function(win) {
		var store = Ext.data.StoreManager.lookup('ProductCategoryStore');
		store.load();
		var store2 = Ext.data.StoreManager.lookup('ProductCategoryAllStore');
		store2.load();
		win.up('window').destroy();
	},
	/**
	 * 编辑类别
	 */
	onEditClick : function() {
		var selection = this.getSelectionModel().getSelection()[0];
		if (selection) {
			var store = Ext.data.StoreManager.lookup('ProductCategoryStore');
			var parent = store.getNodeById(selection.get('parent_id'));
			if (parent) {
				selection.set('parent_product_type_name', parent.get('product_type_name'));
			} else {
				selection.set('parent_product_type_name', '根节点');
			}
			var des = myDesktopApp.getDesktop();
			win = des.createWindow({
				title : selection.get('product_type_name'), height : 150, width : 300, iconCls : 'icon-grid', animCollapse : false,
				constrainHeader : true, layout : 'fit', items : [ Ext.create('WJM.product.ProductCategoryForm', {
					record : selection, listeners : {
						saveSuccess : this.onSaveSuccess, scope : this
					}
				}) ]
			});
			win.show();
		} else {
			Ext.Msg.alert('提示', '请选择类别');
		}
	}
});