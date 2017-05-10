Ext.define('WJM.App', {
	extend : 'Ext.ux.desktop.App',

	requires : [ 'Ext.window.MessageBox', 'Ext.ux.desktop.ShortcutModel', 'WJM.Settings', 'WJM.FormWriter', 'WJM.ShortcutModel',
			'WJM.product.ProductAlert' ],

	init : function() {
		this.callParent();
		if (WJM.Config.hasProductManageRole) {
			WJM.product.ProductAlert.checkProduct();
		}
	},

	getModules : function() {
		var defaultModules = [];
		if (WJM.Config.hasOperationMenu()) {
			defaultModules.push(this.createOperationMenu());
		}
		if (WJM.Config.hasAdminMenu()) {
			defaultModules.push(this.createAdminMenu());
		}
		if (WJM.Config.hasReportMenu()) {
			defaultModules.push(this.createReportMenu());
		}
		var userModels = this.getUserModels();
		for ( var i = 0; i < userModels.length; i++) {
			var powerConfig = userModels[i];
			if (powerConfig.moduleName && powerConfig.moduleName != '') {
				defaultModules.push(Ext.create(powerConfig.moduleName, powerConfig));
			}
		}
		return defaultModules;
	},

	getDesktopConfig : function() {
		var me = this, ret = me.callParent();
		var shortcutsData = [];
		var userModels = this.getUserModels();
		for ( var i = 0; i < userModels.length; i++) {
			var powerConfig = userModels[i];
			shortcutsData.push({
				powerId : powerConfig.powerId, name : powerConfig.menuText, iconCls : powerConfig.iconClsBig || 'grid-shortcut',
				module : powerConfig.moduleId
			});
		}
		return Ext.apply(ret, {
			// cls: 'ux-desktop-black',

			contextMenuItems : [ {
				text : '桌面设置', handler : me.onSettings, scope : me
			} ],

			shortcuts : Ext.create('Ext.data.Store', {
				model : 'WJM.ShortcutModel', data : shortcutsData
			}),

			wallpaper : 'wallpapers/Wood-Sencha.jpg', wallpaperStretch : false, shortcutTpl : [

			'<div class="g-area f-clear">',

			'<tpl for=".">',

			'<tpl if="this.isOperaction(powerId)">',

			'<div class="ux-desktop-shortcut" id="{name}-shortcut">',

			'<div class="ux-desktop-shortcut-icon {iconCls}">',

			'<img src="', Ext.BLANK_IMAGE_URL, '" title="{name}">',

			'</div>',

			'<span class="ux-desktop-shortcut-text">{name}</span>',

			'</div>',

			'</tpl>',

			'</tpl>',

			'</div>',

			'<div class="g-area f-clear">',

			'<tpl for=".">',

			'<tpl if="this.isAdmin(powerId)">',

			'<div class="ux-desktop-shortcut" id="{name}-shortcut">',

			'<div class="ux-desktop-shortcut-icon {iconCls}">',

			'<img src="', Ext.BLANK_IMAGE_URL, '" title="{name}">',

			'</div>',

			'<span class="ux-desktop-shortcut-text">{name}</span>',

			'</div>',

			'</tpl>',

			'</tpl>',

			'</div>',

			'<div class="g-area f-clear">',

			'<tpl for=".">',

			'<tpl if="this.isReport(powerId)">',

			'<div class="ux-desktop-shortcut" id="{name}-shortcut">',

			'<div class="ux-desktop-shortcut-icon {iconCls}">',

			'<img src="', Ext.BLANK_IMAGE_URL, '" title="{name}">',

			'</div>',

			'<span class="ux-desktop-shortcut-text">{name}</span>',

			'</div>',

			'</tpl>',

			'</tpl>',

			'</div>',

			'<div class="x-clear"></div>', {
				isOperaction : function(powerId) {
					return Ext.Array.contains(WJM.Config.operationPowerCode, parseInt(powerId));
				},

				isAdmin : function(powerId) {
					return Ext.Array.contains(WJM.Config.adminPowerCode, parseInt(powerId));
				},

				isReport : function(powerId) {
					return Ext.Array.contains(WJM.Config.reportPowerCode, parseInt(powerId));
				}
			} ]
		});
	},

	// config for the start menu
	getStartConfig : function() {
		var me = this, ret = me.callParent();

		return Ext.apply(ret, {
			title : WJM.Config.user.userName, iconCls : 'user', height : 300, toolConfig : {
				width : 100, items : [ {
					text : '桌面设置', iconCls : 'settings', handler : me.onSettings, textAlign : 'left', scope : me
				}, '-', {
					text : '退出', iconCls : 'logout', textAlign : 'left', handler : me.onLogout, scope : me
				} ]
			}
		});
	},

	getTaskbarConfig : function() {
		var ret = this.callParent();

		var me = this;
		return Ext.apply(ret, {
			quickStart : [ {
				name : '折叠', iconCls : 'accordion', tooltipText : '折叠全部窗口', handler : function() {
					me.getDesktop().cascadeWindows();
				}
			}, {
				name : '平铺', tooltipText : '平铺全部窗口', iconCls : 'icon-grid', handler : function() {
					me.getDesktop().tileWindows();
				}
			} ], trayItems : [ {
				xtype : 'trayclock', flex : 1
			} ]
		});
	},

	onLogout : function() {
		Ext.Msg.confirm('Logout', 'Are you sure you want to logout?', function(btn, text) {
			if (btn == 'yes') {
				location.href = location.context + "/login.do?action=logout";
			}
		}, this);
	},

	onSettings : function() {
		var dlg = new WJM.Settings({
			desktop : this.desktop
		});
		dlg.show();
	},
	/**
	 * 创建操作菜单
	 */
	createOperationMenu : function() {
		Ext.require('WJM.MenuItem');
		var menuItems = [];
		var codes = Ext.Array.clone(WJM.Config.operationPowerCode);
		for ( var i = 0; i < codes.length; i++) {
			var code = codes[i];
			if (Ext.Array.contains(WJM.Config.user.userPowers, code)) {
				menuItems.push(WJM.Config.powerOperationModule[String(code)]);
			}
		}
		return Ext.create('WJM.MenuItem', {
			menuText : 'operation/操作', menuItems : menuItems, iconCls : 'ico-operation'
		});
	},
	/**
	 * 创建操作菜单
	 */
	createAdminMenu : function() {
		Ext.require('WJM.MenuItem');
		var menuItems = [];
		var codes = Ext.Array.clone(WJM.Config.adminPowerCode);
		for ( var i = 0; i < codes.length; i++) {
			var code = codes[i];
			if (Ext.Array.contains(WJM.Config.user.userPowers, code)) {
				menuItems.push(WJM.Config.powerOperationModule[String(code)]);
			}
		}
		return Ext.create('WJM.MenuItem', {
			menuText : 'admin/管理', menuItems : menuItems, iconCls : 'ico-operation'
		});
	},
	/**
	 * 创建操作菜单
	 */
	createReportMenu : function() {
		Ext.require('WJM.MenuItem');
		var menuItems = [];
		var codes = Ext.Array.clone(WJM.Config.reportPowerCode);
		for ( var i = 0; i < codes.length; i++) {
			var code = codes[i];
			if (Ext.Array.contains(WJM.Config.user.userPowers, code)) {
				menuItems.push(WJM.Config.powerOperationModule[String(code)]);
			}
		}
		return Ext.create('WJM.MenuItem', {
			menuText : 'report/报表', menuItems : menuItems, iconCls : 'ico-operation'
		});
	},
	/**
	 * 获得用户所有的模块
	 */
	getUserModels : function() {
		var powers = WJM.Config.user.userPowers;
		var userModels = [];
		var codes = Ext.Array.clone(WJM.Config.operationPowerCode);
		for ( var i = 0; i < codes.length; i++) {
			var code = codes[i];
			if (Ext.Array.contains(powers, code)) {
				var powerConfig = WJM.Config.powerOperationModule[new String(code)];
				if (powerConfig) {
					userModels.push(powerConfig);
				}
			}
		}
		codes = Ext.Array.clone(WJM.Config.adminPowerCode);
		for ( var i = 0; i < codes.length; i++) {
			var code = codes[i];
			if (Ext.Array.contains(powers, code)) {
				var powerConfig = WJM.Config.powerOperationModule[new String(code)];
				if (powerConfig) {
					userModels.push(powerConfig);
				}
			}
		}
		codes = Ext.Array.clone(WJM.Config.reportPowerCode);
		for ( var i = 0; i < codes.length; i++) {
			var code = codes[i];
			if (Ext.Array.contains(powers, code)) {
				var powerConfig = WJM.Config.powerOperationModule[new String(code)];
				if (powerConfig) {
					userModels.push(powerConfig);
				}
			}
		}
		return userModels;
	}
});
