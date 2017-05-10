/**
 * 付款表单
 */
Ext.define('WJM.cash.SaleCashForm', {
	extend : 'Ext.form.Panel',
	closeAction : 'destroy',
	record : null, bodyPadding : 10,

	initComponent : function() {
		var me = this;
		Ext.applyIf(me, {
			defaults : {
				xtype : 'textfield', anchor : '100%', labelWidth : 150
			}, items : [ {
				name : 'id', xtype : 'hiddenfield'
			}, {
				name : 'sale_bill_code', fieldLabel : 'receive #/销售单号', readOnly : true
			}, {
				name : 'oper_name', fieldLabel : 'saleman/销售员', readOnly : true
			}, {
				name : 'oper_time', fieldLabel : 'sale time/销售时间', readOnly : true
			}, {
				name : 'code', fieldLabel : 'casher/收银员', value : window.user.userName, readOnly : true
			}, {
				name : 'cash_time', fieldLabel : 'cash time/收银时间', value : Ext.Date.format(new Date(), 'Y-m-d H:i:s'), readOnly : true
			}, {
				name : 'all_price', fieldLabel : 'total/合计', minValue : 0, xtype : 'adnumberfield', readOnly : true
			}, {
				name : 'balance', fieldLabel : 'balance/余额', xtype : 'adnumberfield', readOnly : true
			}, {
				name : 'accept', fieldLabel : 'paid/金额', xtype : 'adnumberfield', listeners : {
					change : me.calculateBalance, scope : me
				}
			}, {
				name : 'remark', fieldLabel : 'remark/备注', xtype : 'textareafield', allowBlank : true
			} ],

			dockedItems : [ {
				xtype : 'toolbar', dock : 'top', items : [ {
					xtype : 'button', iconCls : 'save', text : '确定收款', scope : this, handler : this.onSaveClick
				} ]
			} ]
		});
		me.callParent(arguments);
		if (this.record) {
			me.loadRecord(this.record);
			this.getForm().findField('accept').setValue(-this.record.get('balance'));
			this.getForm().findField('cash_time').setValue(Ext.Date.format(new Date(), 'Y-m-d H:i:s'));
		}
		this.getForm().findField('accept').focus(true, true);
	},

	/**
	 * 保存
	 */
	onSaveClick : function() {
		var form = this.getForm();
		var me = this;
		if (form.isValid()) {
			this.submit({
				url : 'sale.do?action=cash_submit', success : function(form, action) {
					Ext.Msg.alert('提示', '保存成功');
					me.fireEvent('saveSuccess', me);
				}, failure : function(form, action) {
					Ext.Msg.alert('提示', action.result.msg || '保存失败，请稍候重试');
				}
			});
		}
	},
	/**
	 * 余额
	 */
	calculateBalance : function() {
		this.getForm().findField('balance').setValue(-this.record.get('balance') - this.getForm().findField('accept').getValue());
	}
});