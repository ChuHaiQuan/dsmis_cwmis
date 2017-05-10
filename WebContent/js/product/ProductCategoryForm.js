/**
 * 产品类别表单
 */
Ext.define('WJM.product.ProductCategoryForm', {
	extend : 'Ext.form.Panel',

	record : null, bodyPadding : 10, closeAction : 'destroy', initComponent : function() {
		var me = this;

		Ext.applyIf(me, {
			defaults : {
				xtype : 'textfield', anchor : '100%', labelWidth : 100
			}, items : [ {
				name : 'id', xtype : 'hiddenfield'
			}, {
				name : 'parent_id', xtype : 'hiddenfield'
			}, {
				name : 'code', fieldLabel : 'code/类别编码', allowBlank : false
			}, {
				name : 'product_type_name', fieldLabel : 'name/类别名', allowBlank : false
			}, {
				fieldLabel : 'Upper Category/上一级类别', readOnly : true, name : 'parent_product_type_name', xtype : 'hiddenfield'
			}, {
				fieldLabel : 'level/级别', name : 'level', readOnly : true, xtype : 'hiddenfield'
			} ], dockedItems : [ {
				xtype : 'toolbar', dock : 'top', items : [ {
					xtype : 'button', iconCls : 'save', text : '保存', scope : this, handler : this.onSaveClick
				} ]
			} ]
		});
		me.callParent(arguments);
		if (this.record) {
			me.loadRecord(this.record);
		}
	},

	/**
	 * 保存
	 */
	onSaveClick : function() {
		var form = this.getForm();
		var me = this;
		if (form.isValid()) {
			this.submit({
				url : 'product_type.do?action=save', success : function(form, action) {
					Ext.Msg.alert('提示', '保存成功');
					me.fireEvent('saveSuccess', me);
				}, failure : function(form, action) {
					Ext.Msg.alert('提示', '保存失败，请稍候重试');
				}
			});
		}
	}

});