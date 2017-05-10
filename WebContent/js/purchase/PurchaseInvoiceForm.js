/**
 * 付款表单
 */
Ext.define('WJM.purchase.PurchaseInvoiceForm', {
	extend : 'Ext.form.Panel',

	record : null, bodyPadding : 10, closeAction : 'destroy',
	
	initComponent : function() {
		var me = this;
		Ext.applyIf(me, {
			defaults : {
				xtype : 'textfield', anchor : '100%', labelWidth : 150
			}, items : [ {
				name : 'id', xtype : 'hiddenfield'
			}, {
				xtype : 'hiddenfield', dataIndex : 'provider_id', name : 'provider_id'
			}, {
				name : 'provider_name', fieldLabel : 'Vendor Name/商家名', readOnly : true
			}, {
				name : 'purchase_bill_code', fieldLabel : 'P.O. #/定单号', readOnly : true
			}, {
				name : 'invoice_code', fieldLabel : 'Invoice Number/帐单编号', readOnly : false, allowBlank : false
			}, {
				name : 'amout', fieldLabel : 'Invoice Amout/帐单金额', readOnly : false, xtype : 'adnumberfield', allowBlank : false
			}, {
				name : 'invoiceDate', fieldLabel : 'Invoice Date/帐单日期', value : Ext.Date.format(new Date(), 'Y-m-d H:i:s')
			}, {
				name : 'description', fieldLabel : 'Invoice Decription/帐单描述', xtype : 'textareafield'
			} ],

			dockedItems : [ {
				xtype : 'toolbar', dock : 'top', items : [ {
					xtype : 'button', iconCls : 'save', text : '保存', scope : this, handler : this.onSaveClick
				} ]
			} ]
		});
		me.callParent(arguments);
		if (this.record) {
			if (this.record.modelName == 'WJM.model.TPurchase') {
				this.getForm().findField('provider_id').setValue(this.record.get('provider_id'));
				this.getForm().findField('purchase_bill_code').setValue(this.record.get('purchase_bill_code'));
				this.getForm().findField('amout').setValue(this.record.get('actual_received_amount'));
				this.getForm().findField('provider_name').setValue(this.record.get('provider_name'));
				this.getForm().findField('provider_id').setValue(this.record.get('provider_id'));
			}
			// me.loadRecord(this.record);
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
				url : 'invoice.do?action=save', success : function(form, action) {
					Ext.Msg.alert('提示', '保存成功');
					me.fireEvent('saveSuccess', me);
				}, failure : function(form, action) {
					Ext.Msg.alert('提示', action.result.msg || '保存失败，请稍候重试');
				}
			});
		}
	}
});