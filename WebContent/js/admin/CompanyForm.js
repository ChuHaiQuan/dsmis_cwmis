/**
 * 供货商表单
 */
Ext.define('WJM.admin.CompanyForm', {
	extend : 'Ext.form.Panel',
	requires : [ 'WJM.model.TCompany' ],
	title : '公司',
	record : null,
	closeAction : 'destroy',
	autoScroll : true,
	bodyPadding : 10,

	initComponent : function() {
		var me = this;

		Ext.applyIf(me, {
			defaults : {
				xtype : 'textfield', anchor : '100%', labelWidth : 150
			},
			items : [{
						name : 'company_name', fieldLabel : 'company name/公司名称'
					},
					{
						name : 'company_address', fieldLabel : 'company address/公司地址'
					},
					{
						name : 'company_tel', fieldLabel : 'company tel/公司电话'
					},
					{
						name : 'company_fax', fieldLabel : 'company fax/公司传真'
					},
					{
						name : 'invoiceTax', fieldLabel : 'Invoice Tax/订单税率', xtype : 'numberfield', decimalPrecision : 5
					},
					{
						xtype : 'image', src : '', id : 'image1'
					},
					{
						xtype : 'filefield', name : 'theFile', fieldLabel : 'company name logo/公司名称', allowBlank : true, anchor : '100%',
						buttonText : '选择图片'
					},
					{
						xtype : 'image', src : '', id : 'image2', maxWidth : '100'
					},
					{
						xtype : 'filefield', name : 'theFile2', fieldLabel : 'company logo/公司图标', allowBlank : true, anchor : '100%',
						buttonText : '选择图片'
					} ], dockedItems : [ {
				xtype : 'toolbar', dock : 'top', items : [ {
					xtype : 'button', iconCls : 'save', text : '保存', scope : this, handler : this.onSaveClick
				} ]
			} ]
		});
		me.callParent(arguments);
		WJM.model.TCompany.load(10, {
			scope : me, success : function(record, operation) {
				this.record = record;
				me.loadRecord(this.record);
				me.getComponent('image1').setSrc(location.context + this.record.get('company_name_pic_logo'));
				me.getComponent('image2').setSrc(location.context + this.record.get('company_logo_pic_logo'));
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
				url : 'setting.do?action=saveCompany', success : function(form, action) {
					Ext.Msg.alert('提示', '保存成功');
					me.fireEvent('saveSuccess', me);
				}, failure : function(form, action) {
					Ext.Msg.alert('提示', '保存失败，请稍候重试');
				}
			});
		}
	}

});