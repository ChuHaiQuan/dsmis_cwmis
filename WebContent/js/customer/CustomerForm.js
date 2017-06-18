/**
 * 供货商表单
 */
Ext.define('WJM.customer.CustomerForm', {
	extend : 'Ext.form.Panel',
	closeAction : 'destroy',
	record : null, height : 600, width : 492, bodyPadding : 10,

	initComponent : function() {
		var me = this;

		Ext.applyIf(me, {
			defaults : {
				xtype : 'textfield', anchor : '100%', labelWidth : 150
			}, items : [ {
				name : 'id', xtype : 'hiddenfield'
			}, {
				name : 'recDate', xtype : 'hiddenfield', value : Ext.Date.format(new Date(), 'Y-m-d H:i:s')
			},
			{
				xtype : 'combobox', fieldLabel : 'Customer type/客户类型', labelWidth : 150, name : 'acc_type', displayField : 'name',
				valueField : 'value', store : 'CustomerTypeStore', allowBlank : false,listeners : {
					 scope : me
				}
			}, {
				name : 'code', fieldLabel : 'Customer Code/客户代码', labelWidth : 150, allowBlank : false
			}, {
				name : 'shortName', fieldLabel : 'Customer Name/客户名字', allowBlank : false
			}, {
				name : 'address', fieldLabel : 'Address/地址'
			}, {
				name : 'city', fieldLabel : 'City/城市'
			}, {
				name : 'state', fieldLabel : 'State/州'
			}, {
				name : 'postCode', fieldLabel : 'Zip Code/邮编'
			}, {
				name : 'mobile', fieldLabel : 'Phone/电话'
			}, {
				name : 'FAX', fieldLabel : 'Fax/传真'
			}, {
				name : 'linkMan', fieldLabel : 'Contact Person/联系人'
			}, {
				name : 'taxCode', fieldLabel : 'Tax Id/税号'
			}, {
				name : 'EMail', fieldLabel : 'Email/电子邮件'
			}, {
				name : 'http', fieldLabel : 'Website/网址'
			}, {
				name : 'bank_Name', fieldLabel : 'Bank Name/银行'
			}, {
				name : 'bank_Acount', fieldLabel : 'Bank Acount/银行帐号'
			}, {
				name : 'leav_money', fieldLabel : 'deposit/预付金额', xtype : 'adnumberfield'
			}, {
				name : 'credit_Line', fieldLabel : 'Credit Line/信用金额', xtype : 'adnumberfield'
			},
			{
				xtype : 'combobox', fieldLabel : 'Taxable/是否交税', labelWidth : 150, name : 'taxable', displayField : 'name',
				valueField : 'value', store : 'CustomerTaxableStore', allowBlank : false,listeners : {
					 scope : me,change:function(model,b,n){
						 debugger;
						 if(b==1 && n==0){
							 
							 function dialog(){
								 var messageBox = Ext.Msg.prompt('approver', '请输入优惠确认人code:', function (btn, text) {
		                                if (btn == 'ok') {
		                                    var proxy = new Ext.data.proxy.Ajax({
		                                        model: 'WJM.model.TEmployee', url: 'sale.do?action=checkApprover',

		                                        reader: new Ext.data.reader.Json({
		                                            type: 'json', messageProperty: 'msg'
		                                        }),

		                                        extraParams: {
		                                            confirm_code: text
		                                        },

		                                        writer: Ext.create('WJM.FormWriter')
		                                    });
		                                    proxy.read(new Ext.data.Operation({}), function (records, operation) {
		                                        if (records.success) {
		                                        	
		                                        } else {
		                                            Ext.Msg.alert('提示', records.error);
		                                            dialog();
		                                        }
		                                    }, me);
		                                }
		                            });
		                            // 将弹出框hack 为 密码弹框
		                            Ext.dom.Element.get(messageBox.down('textfield').getInputId()).dom.type = 'password';
							 }
							 
							 
							 dialog();
							 
						 }
					 }
				}
			}, {
				name : 'myMemo', fieldLabel : 'remark/注释', xtype : 'textareafield'
			} ], dockedItems : [ {
				xtype : 'toolbar', dock : 'top', items : [ {
					xtype : 'button', iconCls : 'save', text : '保存', scope : this, handler : this.onSaveClick
				} ]
			} ]
		});
		me.on("afterrender", this.initDragDorp, this);
		me.callParent(arguments);
		if (this.record) {
			me.loadRecord(this.record);
		}
	},
	/**
	 * 
	 */
	initDragDorp : function() {
		var me = this;
		this.dragDorp = Ext.create('Ext.dd.DropTarget', this.getEl().dom, {
			ddGroup : 'TCustomer', notifyEnter : function(ddSource, e, data) {
				me.stopAnimation();
				me.getEl().highlight();
			}, notifyDrop : function(ddSource, e, data) {
				var selectedRecord = ddSource.dragData.records[0];
				me.getForm().loadRecord(selectedRecord);
				return true;
			}
		});
	},
	/**
	 * 保存
	 */
	onSaveClick : function() {
		var form = this.getForm();
		var me = this;
		if (form.isValid()) {
			this.submit({
				url : 'buyer.do?action=save', success : function(form, action) {
					Ext.Msg.alert('提示', '保存成功');
					me.fireEvent('saveSuccess', me);
				}, failure : function(form, action) {
					Ext.Msg.alert('提示', '保存失败，请稍候重试');
				}
			});
		}
	},

	beforeDestroy : function() {
		Ext.destroy(this.dragDorp);
		this.callParent();
	}

});