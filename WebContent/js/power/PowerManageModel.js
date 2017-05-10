Ext.define('WJM.power.PowerManageModel', {
	extend : 'Ext.ux.desktop.Module',

	requires : [ 'WJM.model.TPower', 'WJM.model.TPowerOperation' ],

	id : 'power',

	init : function() {
		this.id = this.config.moduleId || 'power';
		this.title = this.config.menuText || 'permission/权限';
	},

	createWindow : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow(this.id);
		if (!win) {
			var store = Ext.data.StoreManager.lookup('PowerStore');
			var forms = [];
			var me = this;
			store.each(function(record) {
				forms.push(Ext.create('WJM.power.PowerForm', {
					powerRecord : record,

					listeners : {
						deleteSuccess : me.onDeleteSuccess, scope : me
					}
				}));
				return true;
			});

			win = desktop.createWindow({
				id : this.id, title : this.title, width : 300, height : 500, iconCls : 'icon-grid', animCollapse : false, constrainHeader : true, layout : {
					type : 'accordion'
				}, items : forms,

				dockedItems : [ {
					xtype : 'toolbar', dock : 'top', items : [ {
						iconCls : 'add', text : '添加角色', scope : me, handler : me.onAddClick
					} ]
				} ]
			});
			forms[0].initOprations();
		}
		return win;
	},
	/**
	 * 添加一个权限类型
	 */
	onAddClick : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow(this.id);
		if (win) {
			var form = Ext.create('WJM.power.PowerForm', {
				powerRecord : null, parentId : this.id
			});
			win.add(form);
			form.expand(true);
		}
	},
	/**
	 * 当表单删除时
	 * 
	 * @param form
	 */
	onDeleteSuccess : function(form) {
		var win = form.up('window');
		win.remove(form, true);
		var formPanl = win.getComponent(0);
		if (formPanl) {
			formPanl.expand(true);
		}
	}
});
