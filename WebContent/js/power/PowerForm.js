/**
 * 角色编辑
 */
Ext.define('WJM.power.PowerForm', {
	extend : 'Ext.form.Panel',
	requires : [ 'Ext.form.*', 'WJM.model.TPower', 'WJM.model.TPowerOperation' ],
	closeAction : 'destroy',
	powerRecord : null,

	initComponent : function() {
		var operationsFields = [];
		var formItems = [
				{
					fieldLabel : 'role name/角色', name : 'power_name', xtype : 'textfield', allowBlank : false,
					value : this.powerRecord ? this.powerRecord.get('power_name') : '', anchor : '100%'
				}, {
					xtype : 'hiddenfield', value : this.powerRecord ? this.powerRecord.get('id') : '0', name : "id", anchor : '100%'
				}, {
					xtype : 'fieldset', title : 'power/权限', items : operationsFields
				} ];

		Ext.Object.each(WJM.Config.powerOperationModule, function(key, value) {
			operationsFields.push(Ext.create('Ext.form.field.Checkbox', {
				boxLabel : value['menuText'], name : 'power_items', inputValue : key, anchor : '100%'
			}));
		});

		Ext.apply(this, {
			title : this.powerRecord ? this.powerRecord.get('power_name') : '新建角色', bodyPadding : 10, autoScroll : true,
			url : location.context + '/power.do?action=save', collapsed : false,

			items : formItems,

			// listeners : {
			// expand : this.initOprations, scope : this
			// },

			dockedItems : [ {
				xtype : 'toolbar', dock : 'bottom', items : [ {
					iconCls : 'save', text : '保存', scope : this, handler : this.onSaveClick
				}, {
					iconCls : 'remove', text : '删除', scope : this, handler : this.onDeleteClick
				} ]
			} ]
		});
		this.on("expand", this.initOprations, this);
		this.callParent(arguments);
	},
	/**
	 * 初始化选项
	 */
	initOprations : function() {
		if (this.powerRecord) {
			var id = this.powerRecord.getId();
			var p = Ext.ModelManager.getModel('WJM.model.TPower');
			var that = this;
			p.load(id, {
				success : function(power) {
					var ops = power.getAssociatedData()['operations'];
					Ext.Array.each(ops, function(item, index) {
						var fields = that.getForm().getFields();
						fields.each(function(field, index) {
							if (field.inputValue == item['operationCode']) {
								field.setValue(true);
							}
						});
					});
				}
			});
		}
	},

	/**
	 * 删除一个权限类型
	 */
	onDeleteClick : function() {
		Ext.Msg.confirm('提示', '确定要删除此角色么？', function(btn, text) {
			if (btn == 'yes') {
				var form = this.getForm();
				var me = this;
				form.submit({
					url : 'power.do?action=del',

					success : function(form, action) {
						var store = Ext.data.StoreManager.lookup('PowerStore');
						store.load();
						me.fireEvent('deleteSuccess', me);
						Ext.Msg.alert('提示', '删除成功');
					}, failure : function(form, action) {
						Ext.Msg.alert('错误', "删除失败，请稍后重试");
					}
				});
			}
		}, this);
	},
	/**
	 * 保存一个权限类型
	 */
	onSaveClick : function() {
		var form = this.getForm();
		var me = this;
		form.submit({
			url : 'power.do?action=save',

			success : function(form, action) {
				var store = Ext.data.StoreManager.lookup('PowerStore');
				store.load();
				var power_name = form.findField('power_name');
				me.setTitle(power_name.getValue());
				Ext.Msg.alert('提示', '保存成功');
			}, failure : function(form, action) {
				Ext.Msg.alert('错误', "保存失败，请稍后重试");
			}
		});
	}
});