/**
 * 供货商表单
 */
Ext.define('WJM.vendor.VendorForm', {
	extend : 'Ext.form.Panel',
	closeAction : 'destroy',
	record : null, height : 370, width : 492, bodyPadding : 10,

	initComponent : function() {
		var me = this;

		Ext.applyIf(me, {
			defaults : {
				xtype : 'textfield', anchor : '100%', labelWidth : 150
			}, items : [ {
				name : 'id', xtype : 'hiddenfield'
			}, {
				name : 'recDate', xtype : 'hiddenfield', value : Ext.Date.format(new Date(), 'Y-m-d H:i:s')
			}, {
				name : 'code', fieldLabel : 'Company code/公司代码', labelWidth : 150, allowBlank : false
			}, {
				name : 'shortName', fieldLabel : 'Company Name/公司名', allowBlank : false
			}, {
				name : 'address', fieldLabel : 'Company Address/地址'
			}, {
				name : 'city', fieldLabel : 'City/城市'
			}, {
				name : 'state', fieldLabel : 'State/州'
			}, {
				name : 'postCode', fieldLabel : 'Zip code/邮编'
			}, {
				name : 'mobile', fieldLabel : 'Phone/电话'
			}, {
				name : 'FAX', fieldLabel : 'Fax/传真'
			}, {
				name : 'linkMan', fieldLabel : 'Contact Person/联系人'
			}, {
				name : 'EMail', fieldLabel : 'Email/电子邮件'
			}, {
				name : 'http', fieldLabel : 'Website/网址'
			}, {
				name : 'acc_balance', fieldLabel : 'account balance/账户余额', xtype : 'adnumberfield'
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
			ddGroup : 'TVendor', notifyEnter : function(ddSource, e, data) {
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
				url : 'provider.do?action=save', success : function(form, action) {
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