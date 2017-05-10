/**
 * 付款表单
 */
Ext.define('WJM.employee.ChangePasswordForm', {
	extend : 'Ext.form.Panel',

	bodyPadding : 10,
	closeAction : 'destroy',
	initComponent : function() {
		var me = this;
		Ext.applyIf(me, {
			defaults : {
				xtype : 'textfield', anchor : '100%', labelWidth : 200
			}, items : [ {
				name : 'password1', fieldLabel : 'old password/旧密码', xtype : 'textfield', allowBlank : false, inputType : 'password'
			}, {
				name : 'newpassword1', fieldLabel : 'new password/新密码', xtype : 'textfield', allowBlank : false, inputType : 'password'
			}, {
				name : 'newpassword2', fieldLabel : 'confirm password/确认密码', xtype : 'textfield', allowBlank : false, inputType : 'password'
			} ],

			dockedItems : [ {
				xtype : 'toolbar', dock : 'top', items : [ {
					xtype : 'button', iconCls : 'save', text : '保存', scope : this, handler : this.onSaveClick
				} ]
			} ]
		});
		me.callParent(arguments);
	},

	/**
	 * 保存
	 */
	onSaveClick : function() {
		var form = this.getForm();
		var me = this;
		if (form.isValid()) {
			this.submit({
				url : 'employee.do?action=change_password', success : function(form, action) {
					Ext.Msg.alert('提示', '保存成功');
					me.fireEvent('saveSuccess', me);
				}, failure : function(form, action) {
					Ext.Msg.alert('提示', action.result.msg || '保存失败，请稍候重试');
				}
			});
		}
	}
});