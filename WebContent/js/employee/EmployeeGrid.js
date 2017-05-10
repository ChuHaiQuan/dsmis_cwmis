/**
 * 用户编辑列表
 */
Ext.define('WJM.employee.EmployeeGrid', {
	extend : 'Ext.grid.Panel',
	requires : [ 'Ext.grid.Panel', 'WJM.model.TEmployee', 'Ext.grid.plugin.RowEditing' ],
	/**
	 * 是否可以编辑
	 */
	editAble : false,

	initComponent : function() {
		this.editing = Ext.create('Ext.grid.plugin.RowEditing', {
			clicksToEdit : 2
		});

		this.editTopBar = Ext.create('Ext.toolbar.Toolbar', {
			items : [ {
				iconCls : 'add', text : '添加', scope : this, handler : this.onAddClick
			}, {
				iconCls : 'remove', text : '删除', scope : this, handler : this.onDeleteClick
			}, {
				iconCls : 'search', text : '打印优惠确认码', scope : this, handler : this.onPrintApproverClick
			}, {
				xtype : 'label', text : '双击列表项开始编辑'
			} ]
		});

		var _fileds = [ {
			xtype : 'rownumberer'
		}, {
			text : "code/工号", dataIndex : 'code', sortable : true, width : 100, editor : {
				xtype : 'textfield', name : 'code', allowBlank : false, inputType : 'text'
			}
		}, {
			text : "name/名字", dataIndex : 'name', sortable : true, width : 100, editor : {
				xtype : 'textfield', allowBlank : false, inputType : 'text'
			}
		}, {
			text : "department/部门", dataIndex : 'department', sortable : true, editor : {
				xtype : 'textfield'
			}
		}, {
			text : "position/职位", dataIndex : 'headShip', sortable : true, editor : {
				xtype : 'textfield'
			}
		}, {
			text : "tel/电话", dataIndex : 'tel', editor : {
				xtype : 'textfield'
			}
		}, {
			text : "cell phone/手机", dataIndex : 'mobile', editor : {
				xtype : 'textfield'
			}
		}, {
			text : "address/地址", dataIndex : 'address', editor : {
				xtype : 'textfield'
			}
		} ];

		Ext.apply(this, {
			store : 'EmployeeStore', disableSelection : false, loadMask : true,

			plugins : [],

			viewConfig : {
				plugins : [ Ext.create('Ext.grid.plugin.DragDrop', {
					ptype : 'gridviewdragdrop'
				}) ]
			},

			dockedItems : [],

			columns : _fileds,

			bbar : Ext.create('Ext.PagingToolbar', {
				store : 'EmployeeStore', displayInfo : true, displayMsg : '显示 用户 {0} - {1} 总共 {2}', emptyMsg : "没有用户数据"
			})
		});

		if (this.editAble) {
			_fileds.push({
				text : "password/密码", dataIndex : 'password1', field : {
					xtype : 'textfield', allowBlank : false
				}
			});
			_fileds.push({
				text : "approver code/优惠确认码", width : 150, xtype : 'templatecolumn',
				tpl : '<tpl if="password1.length &gt; 0"><img src="barcode?msg={password1}&type=code128&fmt=png&res=150"></img></tpl>'
			});
			_fileds.push({
				text : "权限", dataIndex : 'popedom', field : {
					xtype : 'combobox', allowBlank : false, displayField : 'power_name', valueField : 'id', store : 'PowerStore'
				},

				renderer : function(value) {
					var store = Ext.data.StoreManager.lookup('PowerStore');
					var record = store.getById(Number(value));
					if (record) {
						return record.get('power_name');
					}
				}
			});
			Ext.apply(this, {
				dockedItems : [ this.editTopBar ], plugins : [ this.editing ]
			});
		}
		this.callParent();
	},
	/**
	 * 删除
	 */
	onDeleteClick : function() {
		var selection = this.getView().getSelectionModel().getSelection()[0];
		if (selection) {
			Ext.Msg.confirm('提示', '确定要删除此用户么？', function(btn, text) {
				if (btn == 'yes') {
					this.store.remove(selection, WJM.Config.defaultOperation);
				}
			}, this);
		} else {
			Ext.Msg.alert('提示', '请选择用户');
		}
	},
	/**
	 * 添加
	 */
	onAddClick : function() {
		var rec = Ext.create('WJM.model.TEmployee'), edit = this.editing;
		edit.cancelEdit();
		this.store.insert(0, rec, WJM.Config.defaultOperation);
		edit.startEdit(0, 0);
	}

	,
	/**
	 * 添加
	 */
	onPrintApproverClick : function() {
		var selection = this.getView().getSelectionModel().getSelection()[0];
		if (selection) {
			window.open(location.context + '/back/print_barcode.jsp?code=' + selection.get('password1'), "_blank");
		} else {
			Ext.Msg.alert('提示', '请选择用户');
		}
	}
});