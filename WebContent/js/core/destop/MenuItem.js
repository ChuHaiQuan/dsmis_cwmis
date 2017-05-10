/*!
 * Ext JS Library 4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

Ext.define('WJM.MenuItem', {
	extend : 'Ext.ux.desktop.Module',

	menuText : '',

	menuItems : [],

	iconCls : '',

	moduleId : null,

	init : function() {
		this.launcher = {
			text : this.menuText, iconCls : this.iconCls, handler : function() {
				return false;
			}, scope : this
		};
		if (this.moduleId) {
			Ext.apply(this.launcher, {
				handler : this.onMenuClick, moduleId : this.moduleId
			});
		}
		if (this.menuItems.length > 0) {
			Ext.apply(this.launcher, {
				menu : {
					items : []
				}
			});
		}
		for ( var i = 0; i < this.menuItems.length; ++i) {
			this.launcher.menu.items.push({
				text : this.menuItems[i].menuText, iconCls : this.menuItems[i].iconClsSmall || '', handler : this.onMenuClick, scope : this,
				moduleId : this.menuItems[i].moduleId
			});
		}
	},

	onMenuClick : function(src) {
		var module = this.app.getModule(src.moduleId);
		if (module) {
			this.app.createWindow(module);
		}
	}
});