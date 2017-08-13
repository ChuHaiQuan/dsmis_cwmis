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
			
			
			var grid3 = Ext.create('Ext.form.Panel', {
				title : '商品导入',
				layout : {
					type : 'vbox', // Arrange child items vertically
					align : 'center', // Each takes up full width
					padding : 10
				},
				items : [
						,
						{
							xtype : 'button', text : '<span style="font-size: 20px;">模板下载</span>', scale : 'large', margin : '30 0 0 0', scope : this,
							handler : this.onDownTemplateClick
						},{
							xtype : 'label', html : '<span style="font-size: 20px;color: red;">产品数据导入</span>',margin : '30 0 0 0'
						},
						{
							xtype : 'filefield', name : 'theFile',allowBlank : false,buttonText:"请选择文件", scale : 'large', margin : '10 0 0 0', scope : this,
							change : function(){}
						} ],
						buttons: [{
					        text: '立即导入',
					        handler: function() {
								var form = this.up('form').getForm();
					            if(form.isValid()){
					                form.submit({
					                    url: 'setting.do?action=uploadFile',
					                    waitMsg: 'Uploading...',
					                    success: function(fp, o) {
					                    	var path = o.result.filePath;
					                    	Ext.Ajax.request({
					                    	    url: location.context + '/product.do?action=importProduct',
					                    	    timeout: 100000000,
					                    	    params: {
					                    	    	path: path
					                    	    },
					                    	    reader: {
					                    	        type : 'json'
					                    	    },
					                    	    success: function(response,a,b){
					                    	    	Ext.Msg.alert("提示",JSON.parse(response.responseText).msg);
					                    	    },
					                    	    failure:function(response, opts){
					                    	    	Ext.Msg.alert("提示","导入失败");
					                    	    }
					                    	});
					                    	
					                    }
					                });
					            }
							}
					    }]
			});
			var grid2 = Ext.create('WJM.admin.CompanyForm');
			win = desktop.createWindow({
				id : this.id, title : this.title, width : 400, height : 400, iconCls : 'icon-grid', animCollapse : false, constrainHeader : true,
				layout : 'fit', items : {
					xtype : 'tabpanel', items : [ grid2, grid,grid3 ]
				}
			});
		}
		return win;
	},
	
	onImportClick:function(){
		
	},
	onDownTemplateClick:function(){
		window.open('setting.do?action=downProductImportTemplate');
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
