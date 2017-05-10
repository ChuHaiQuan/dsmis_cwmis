/**
 * 用户登录窗口
 */
Ext.define('WJM.employee.LoginWindow', {
	extend : 'Ext.window.Window',
	height : 350,
	width : 350,
	resizable : false,
	layout : {
		type : 'fit'
	},
	closable : false,
	title : '欢迎您，请登录',
	constrain : false,
	submitConfig : {
		success : function(form, action) {
			Ext.Msg.alert('Success', action.result.msg);
		}, failure : function(form, action) {
			Ext.Msg.alert('Failed', action.result.msg);
		}
	},
	initComponent : function() {
		var me = this;

		Ext.applyIf(me, {
			items : [ {
				url : 'login.do?action=login',
				xtype : 'form',
				bodyPadding : 20,
				items : [
						{
							xtype : 'container', height : 180, layout : {
								align : 'center', type : 'vbox'
							}, items : [ {
								xtype : 'image', height : 140, src : 'images/duser140.png', width : 140
							} ]
						},
						{
							xtype : 'textfield', fieldLabel : '用户名', anchor : '100%', name : 'code', labelWidth : 50, allowBlank : false
						},
						{
							xtype : 'textfield', fieldLabel : '密码', anchor : '100%', inputType : 'password', name : 'password1', labelWidth : 50,
							allowBlank : false
						},
						{
							xtype : 'container',
							height : 60,
							padding : '10 0 0 0',
							layout : {
								align : 'center', type : 'vbox'
							},
							items : [ {
								xtype : 'button', scale : 'medium', width : 90, text : '<span style="font-size:16px;">登&nbsp;&nbsp;&nbsp;&nbsp;录</span>',
								type : 'submit', listeners : {
									click : {
										fn : me.onButtonClick, scope : me
									}
								}
							} ]
						} ]
			} ]
		});

		me.callParent(arguments);
		me.on("afterrender", this.initKeyNav, this);
	},
	/**
	 * 登录按钮
	 * 
	 * @param button
	 * @param e
	 * @param options
	 */
	onButtonClick : function(button, e, options) {
		this.loginIn();
	},
	/**
	 * 登录
	 */
	loginIn : function() {
		var form = this.down('form').getForm();
		if (form.isValid()) {
			form.submit(this.submitConfig);
		}
	},
	/**
	 * 监听enter
	 */
	initKeyNav : function() {
		var me = this;
		Ext.create('Ext.util.KeyNav', me.getEl().dom, {
			scope : me, enter : function(e) {
				this.loginIn();
			}
		});
	}
});