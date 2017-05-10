/**
 * 付款表单
 */
Ext.define('WJM.cash.PurchaseCashForm', {
	extend : 'Ext.form.Panel',
	closeAction : 'destroy',
	record : null,
	bodyPadding : 10,

	initComponent : function() {
		var me = this;

		Ext.applyIf(me, {
			defaults : {
				xtype : 'textfield', anchor : '100%', labelWidth : 150
			},
			items : [
					{
						name : 'id', xtype : 'hiddenfield'
					},
					{
						name : 'invoice_code', xtype : 'hiddenfield'
					},
					{
						name : 'purchase_bill_code', fieldLabel : 'P.O. #/定单号', readOnly : true
					},
					{
						name : 'oper_name', fieldLabel : 'buyman/采购员', readOnly : true
					},
					{
						name : 'oper_time', fieldLabel : 'buy time/采购时间', readOnly : true
					},
					{
						name : 'code', fieldLabel : 'casher/收银员', value : window.user.userName, readOnly : true
					},
					{
						name : 'cash_time', fieldLabel : 'cash time/收银时间', value : Ext.Date.format(new Date(), 'Y-m-d H:i:s'), readOnly : true
					},
					{
						name : 'all_purchase_price', fieldLabel : 'total/合计', minValue : 0, xtype : 'adnumberfield', readOnly : true
					},
					{
						name : 'balance', fieldLabel : 'balance/余额', xtype : 'adnumberfield', readOnly : true
					},
					{
						name : 'paidAmount', fieldLabel : 'paid/金额', xtype : 'adnumberfield', listeners : {
							change : me.calculateBalance, scope : me
						}
					},
					{
						xtype : 'combobox', fieldLabel : 'Payment Method/支付方式', labelWidth : 170, name : 'paymentMethod', displayField : 'name',
						valueField : 'value', store : 'PurchaseCacheMethodStore', value : 'Cash', allowBlank : false
					}, {
						name : 'remark', fieldLabel : 'remark/备注', xtype : 'textareafield', allowBlank : true
					} ],

			dockedItems : [ {
				xtype : 'toolbar', dock : 'top', items : [ {
					xtype : 'button', iconCls : 'save', text : '确定付款', scope : this, handler : this.onSaveClick
				} ]
			} ]
		});
		me.callParent(arguments);
		if (this.record) {
			me.loadRecord(this.record);
			this.getForm().findField('paidAmount').setValue(-this.record.get('balance'));
			this.getForm().findField('cash_time').setValue(Ext.Date.format(new Date(), 'Y-m-d H:i:s'));
		}
		this.getForm().findField('paidAmount').focus();
	},

	/**
	 * 保存
	 */
	onSaveClick : function() {
		var form = this.getForm();
		var me = this;
		if (form.isValid()) {
			this.submit({
				url : 'invoice.do?action=payInvoice', success : function(form, action) {
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
		this.getForm().findField('balance').setValue(-this.record.get('balance') - this.getForm().findField('paidAmount').getValue());
	}
});