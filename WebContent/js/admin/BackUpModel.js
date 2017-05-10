/**
 * 备份
 */
Ext.define('WJM.admin.BackUpModel', {
	extend : 'Ext.ux.desktop.Module',

	id : 'backup',

	init : function() {
		this.id = this.config.moduleId || 'backup';
		this.title = this.config.menuText || 'setting/设置';
	},

	createWindow : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow(this.id);
		if (!win) {
			var grid = Ext.create('Ext.panel.Panel', {
				title : '备份',
				layout : {
					type : 'vbox', // Arrange child items vertically
					align : 'center', // Each takes up full width
					padding : 10
				},
				items : [
						{
							xtype : 'label', html : '<span style="font-size: 20px;color: red;">Please backup database every week!</span>'
						},
						{
							xtype : 'button', text : '<span style="font-size: 20px;">backup</span>', scale : 'large', margin : '30 0 0 0', scope : this,
							handler : this.onBackupClick
						} ]
			});

			var grid2 = Ext.create('WJM.admin.CompanyForm');
			win = desktop.createWindow({
				id : this.id, title : this.title, width : 400, height : 400, iconCls : 'icon-grid', animCollapse : false, constrainHeader : true,
				layout : 'fit', items : {
					xtype : 'tabpanel', items : [ grid2, grid ]
				}
			});
		}
		return win;
	},
	/**
	 * 备份
	 */
	onBackupClick : function() {
		var me = this;
		window.open('setting.do?action=backupdatabase');
		return;
		var proxy = new Ext.data.proxy.Ajax({
			url : 'setting.do?action=backupdatabase', reader : new Ext.data.reader.Json({
				type : 'json', messageProperty : 'msg', model : 'WJM.model.TPurchase'
			}),

			writer : Ext.create('WJM.FormWriter')
		});
		proxy.read(new Ext.data.Operation({}), function(op) {
			Ext.Msg.alert('提示', '备份成功，备份到' + op.resultSet.message);
			var desktop = this.app.getDesktop();
			var win = desktop.getWindow(this.id);
			win.destroy();
		}, me);
	}

});
