/*!
 * Ext JS Library 4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

Ext.define('Ext.ux.desktop.Module', {
	mixins : {
		observable : 'Ext.util.Observable'
	},

	constructor : function(config) {
		this.config = config || {};
		this.mixins.observable.constructor.call(this, config);
		this.init();
	},

	init : Ext.emptyFn
});
/*!
 * Ext JS Library 4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

/**
 * @class Ext.ux.desktop.ShortcutModel
 * @extends Ext.data.Model This model defines the minimal set of fields for desktop shortcuts.
 */
Ext.define('Ext.ux.desktop.ShortcutModel', {
	extend : 'Ext.data.Model', fields : [ {
		name : 'name'
	}, {
		name : 'iconCls'
	}, {
		name : 'module'
	}]
});
/*!
 * Ext JS Library 4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

Ext.define('Ext.ux.desktop.StartMenu', {
	extend : 'Ext.panel.Panel',

	requires : [ 'Ext.menu.Menu', 'Ext.toolbar.Toolbar' ],

	ariaRole : 'menu',

	cls : 'x-menu ux-start-menu',

	defaultAlign : 'bl-tl',

	iconCls : 'user',

	floating : true,

	shadow : true,

	// We have to hardcode a width because the internal Menu cannot drive our width.
	// This is combined with changing the align property of the menu's layout from the
	// typical 'stretchmax' to 'stretch' which allows the the items to fill the menu
	// area.
	width : 300,

	initComponent : function() {
		var me = this, menu = me.menu;

		me.menu = new Ext.menu.Menu({
			cls : 'ux-start-menu-body',
			border : false,
			floating : false,
			items : menu
		});
		me.menu.layout.align = 'stretch';

		me.items = [ me.menu ];
		me.layout = 'fit';

		Ext.menu.Manager.register(me);
		me.callParent();
		// TODO - relay menu events

		me.toolbar = new Ext.toolbar.Toolbar(Ext.apply({
			dock : 'right',
			cls : 'ux-start-menu-toolbar',
			vertical : true,
			width : 100
		}, me.toolConfig));

		me.toolbar.layout.align = 'stretch';
		me.addDocked(me.toolbar);

		delete me.toolItems;

		me.on('deactivate', function() {
			me.hide();
		});
	},

	addMenuItem : function() {
		var cmp = this.menu;
		cmp.add.apply(cmp, arguments);
	},

	addToolItem : function() {
		var cmp = this.toolbar;
		cmp.add.apply(cmp, arguments);
	},

	showBy : function(cmp, pos, off) {
		var me = this;

		if (me.floating && cmp) {
			me.layout.autoSize = true;
			me.show();

			// Component or Element
			cmp = cmp.el || cmp;

			// Convert absolute to floatParent-relative coordinates if necessary.
			var xy = me.el.getAlignToXY(cmp, pos || me.defaultAlign, off);
			if (me.floatParent) {
				var r = me.floatParent.getTargetEl().getViewRegion();
				xy[0] -= r.x;
				xy[1] -= r.y;
			}
			me.showAt(xy);
			me.doConstrain();
		}
		return me;
	}
}); // StartMenu
/*!
 * Ext JS Library 4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

/**
 * @class Ext.ux.desktop.TaskBar
 * @extends Ext.toolbar.Toolbar
 */
Ext.define('Ext.ux.desktop.TaskBar', {
	extend : 'Ext.toolbar.Toolbar', // TODO - make this a basic hbox panel...

	requires : [ 'Ext.button.Button', 'Ext.resizer.Splitter', 'Ext.menu.Menu',

	'Ext.ux.desktop.StartMenu' ],

	alias : 'widget.taskbar',

	cls : 'ux-taskbar',

	/**
	 * @cfg {String} startBtnText The text for the Start Button.
	 */
	startBtnText : 'Start',

	initComponent : function() {
		var me = this;

		me.startMenu = new Ext.ux.desktop.StartMenu(me.startConfig);

		me.quickStart = new Ext.toolbar.Toolbar(me.getQuickStart());

		me.windowBar = new Ext.toolbar.Toolbar(me.getWindowBarConfig());

		me.tray = new Ext.toolbar.Toolbar(me.getTrayConfig());

		me.items = [ {
			xtype : 'button',
			cls : 'ux-start-button',
			iconCls : 'ux-start-button-icon',
			menu : me.startMenu,
			menuAlign : 'bl-tl',
			text : me.startBtnText
		}, me.quickStart, {
			xtype : 'splitter',
			html : '&#160;',
			height : 14,
			width : 2, // TODO - there should be a CSS way here
			cls : 'x-toolbar-separator x-toolbar-separator-horizontal'
		},
		// '-',
		me.windowBar, '-', me.tray ];

		me.callParent();
	},

	afterLayout : function() {
		var me = this;
		me.callParent();
		me.windowBar.el.on('contextmenu', me.onButtonContextMenu, me);
	},

	/**
	 * This method returns the configuration object for the Quick Start toolbar. A derived class can override this method, call the base version to build the
	 * config and then modify the returned object before returning it.
	 */
	getQuickStart : function() {
		var me = this, ret = {
			minWidth : 20,
			width : 60,
			items : [],
			enableOverflow : true
		};

		Ext.each(this.quickStart, function(item) {
			ret.items.push({
				tooltip : {
					text : item.tooltipText || item.name,
					align : 'bl-tl'
				},
				// tooltip: item.name,
				overflowText : item.name,
				iconCls : item.iconCls,
				module : item.module,
				handler : item.handler || me.onQuickStartClick,
				scope : me
			});
		});

		return ret;
	},

	/**
	 * This method returns the configuration object for the Tray toolbar. A derived class can override this method, call the base version to build the config and
	 * then modify the returned object before returning it.
	 */
	getTrayConfig : function() {
		var ret = {
			width : 80,
			items : this.trayItems
		};
		delete this.trayItems;
		return ret;
	},

	getWindowBarConfig : function() {
		return {
			flex : 1,
			cls : 'ux-desktop-windowbar',
			items : [ '&#160;' ],
			layout : {
				overflowHandler : 'Scroller'
			}
		};
	},

	getWindowBtnFromEl : function(el) {
		var c = this.windowBar.getChildByElement(el);
		return c || null;
	},

	onQuickStartClick : function(btn) {
		var module = this.app.getModule(btn.module), window;

		if (module) {
			window = module.createWindow();
			window.show();
		}
	},

	onButtonContextMenu : function(e) {
		var me = this, t = e.getTarget(), btn = me.getWindowBtnFromEl(t);
		if (btn) {
			e.stopEvent();
			me.windowMenu.theWin = btn.win;
			me.windowMenu.showBy(t);
		}
	},

	onWindowBtnClick : function(btn) {
		var win = btn.win;

		if (win.minimized || win.hidden) {
			win.show();
		} else if (win.active) {
			win.minimize();
		} else {
			win.toFront();
		}
	},

	addTaskButton : function(win) {
		var config = {
			iconCls : win.iconCls,
			enableToggle : true,
			toggleGroup : 'all',
			width : 140,
			margins : '0 2 0 3',
			text : Ext.util.Format.ellipsis(win.title, 20),
			listeners : {
				click : this.onWindowBtnClick,
				scope : this
			},
			win : win
		};

		var cmp = this.windowBar.add(config);
		cmp.toggle(true);
		return cmp;
	},

	removeTaskButton : function(btn) {
		var found, me = this;
		me.windowBar.items.each(function(item) {
			if (item === btn) {
				found = item;
			}
			return !found;
		});
		if (found) {
			me.windowBar.remove(found);
		}
		return found;
	},

	setActiveButton : function(btn) {
		if (btn) {
			btn.toggle(true);
		} else {
			this.windowBar.items.each(function(item) {
				if (item.isButton) {
					item.toggle(false);
				}
			});
		}
	}
});

/**
 * @class Ext.ux.desktop.TrayClock
 * @extends Ext.toolbar.TextItem This class displays a clock on the toolbar.
 */
Ext.define('Ext.ux.desktop.TrayClock', {
	extend : 'Ext.toolbar.TextItem',

	alias : 'widget.trayclock',

	cls : 'ux-desktop-trayclock',

	html : '&#160;',

	timeFormat : 'g:i A',

	tpl : '{time}',

	initComponent : function() {
		var me = this;

		me.callParent();

		if (typeof (me.tpl) == 'string') {
			me.tpl = new Ext.XTemplate(me.tpl);
		}
	},

	afterRender : function() {
		var me = this;
		Ext.Function.defer(me.updateTime, 100, me);
		me.callParent();
	},

	onDestroy : function() {
		var me = this;

		if (me.timer) {
			window.clearTimeout(me.timer);
			me.timer = null;
		}

		me.callParent();
	},

	updateTime : function() {
		var me = this, time = Ext.Date.format(new Date(), me.timeFormat), text = me.tpl.apply({
			time : time
		});
		if (me.lastText != text) {
			me.setText(text);
			me.lastText = text;
		}
		me.timer = Ext.Function.defer(me.updateTime, 10000, me);
	}
});
/*!
 * Ext JS Library 4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

/**
 * @class Ext.ux.desktop.Wallpaper
 * @extends Ext.Component
 *          <p>
 *          This component renders an image that stretches to fill the component.
 *          </p>
 */
Ext.define('Ext.ux.desktop.Wallpaper', {
	extend : 'Ext.Component',

	alias : 'widget.wallpaper',

	cls : 'ux-wallpaper', html : '<img src="' + Ext.BLANK_IMAGE_URL + '">',

	stretch : false, wallpaper : null, stateful : true, stateId : 'desk-wallpaper',

	afterRender : function() {
		var me = this;
		me.callParent();
		me.setWallpaper(me.wallpaper, me.stretch);
	},

	applyState : function() {
		var me = this, old = me.wallpaper;
		me.callParent(arguments);
		if (old != me.wallpaper) {
			me.setWallpaper(me.wallpaper);
		}
	},

	getState : function() {
		return this.wallpaper && {
			wallpaper : this.wallpaper
		};
	},

	setWallpaper : function(wallpaper, stretch) {
		var me = this, imgEl, bkgnd;

		me.stretch = (stretch !== false);
		me.wallpaper = wallpaper;

		if (me.rendered) {
			imgEl = me.el.dom.firstChild;

			if (!wallpaper || wallpaper == Ext.BLANK_IMAGE_URL) {
				Ext.fly(imgEl).hide();
			} else if (me.stretch) {
				imgEl.src = wallpaper;

				me.el.removeCls('ux-wallpaper-tiled');
				Ext.fly(imgEl).setStyle({
					width : '100%', height : '100%'
				}).show();
			} else {
				Ext.fly(imgEl).hide();

				bkgnd = 'url(' + wallpaper + ')';
				me.el.addCls('ux-wallpaper-tiled');
			}

			me.el.setStyle({
				backgroundImage : bkgnd || ''
			});
			if (me.stateful) {
				me.saveState();
			}
		}
		return me;
	}
});
/*!
 * Ext JS Library 4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

/**
 * @class Ext.ux.desktop.Desktop
 * @extends Ext.panel.Panel
 * <p>This class manages the wallpaper, shortcuts and taskbar.</p>
 */
Ext.define('Ext.ux.desktop.Desktop', {
    extend: 'Ext.panel.Panel',

    alias: 'widget.desktop',

    uses: [
        'Ext.util.MixedCollection',
        'Ext.menu.Menu',
        'Ext.view.View', // dataview
        'Ext.window.Window',

        'Ext.ux.desktop.TaskBar',
        'Ext.ux.desktop.Wallpaper'
    ],

    activeWindowCls: 'ux-desktop-active-win',
    inactiveWindowCls: 'ux-desktop-inactive-win',
    lastActiveWindow: null,

    border: false,
    html: '&#160;',
    layout: 'fit',

    xTickSize: 1,
    yTickSize: 1,

    app: null,

    /**
     * @cfg {Array|Store} shortcuts
     * The items to add to the DataView. This can be a {@link Ext.data.Store Store} or a
     * simple array. Items should minimally provide the fields in the
     * {@link Ext.ux.desktop.ShorcutModel ShortcutModel}.
     */
    shortcuts: null,

    /**
     * @cfg {String} shortcutItemSelector
     * This property is passed to the DataView for the desktop to select shortcut items.
     * If the {@link #shortcutTpl} is modified, this will probably need to be modified as
     * well.
     */
    shortcutItemSelector: 'div.ux-desktop-shortcut',

    /**
     * @cfg {String} shortcutTpl
     * This XTemplate is used to render items in the DataView. If this is changed, the
     * {@link shortcutItemSelect} will probably also need to changed.
     */
    shortcutTpl: [
        '<tpl for=".">',
            '<div class="ux-desktop-shortcut" id="{name}-shortcut">',
                '<div class="ux-desktop-shortcut-icon {iconCls}">',
                    '<img src="',Ext.BLANK_IMAGE_URL,'" title="{name}">',
                '</div>',
                '<span class="ux-desktop-shortcut-text">{name}</span>',
            '</div>',
        '</tpl>',
        '<div class="x-clear"></div>'
    ],

    /**
     * @cfg {Object} taskbarConfig
     * The config object for the TaskBar.
     */
    taskbarConfig: null,

    windowMenu: null,

    initComponent: function () {
        var me = this;

        me.windowMenu = new Ext.menu.Menu(me.createWindowMenu());

        me.bbar = me.taskbar = new Ext.ux.desktop.TaskBar(me.taskbarConfig);
        me.taskbar.windowMenu = me.windowMenu;

        me.windows = new Ext.util.MixedCollection();

        me.contextMenu = new Ext.menu.Menu(me.createDesktopMenu());

        me.items = [
            { xtype: 'wallpaper', id: me.id+'_wallpaper' },
            me.createDataView()
        ];

        me.callParent();

        me.shortcutsView = me.items.getAt(1);
        me.shortcutsView.on('itemclick', me.onShortcutItemClick, me);

        var wallpaper = me.wallpaper;
        me.wallpaper = me.items.getAt(0);
        if (wallpaper) {
            me.setWallpaper(wallpaper, me.wallpaperStretch);
        }
    },

    afterRender: function () {
        var me = this;
        me.callParent();
        me.el.on('contextmenu', me.onDesktopMenu, me);
    },

    //------------------------------------------------------
    // Overrideable configuration creation methods

    createDataView: function () {
        var me = this;
        return {
            xtype: 'dataview',
            overItemCls: 'x-view-over',
            trackOver: true,
            itemSelector: me.shortcutItemSelector,
            store: me.shortcuts,
            style: {
                position: 'absolute'
            },
            x: 0, y: 0,
            tpl: new Ext.XTemplate(me.shortcutTpl)
        };
    },

    createDesktopMenu: function () {
        var me = this, ret = {
            items: me.contextMenuItems || []
        };

        if (ret.items.length) {
            ret.items.push('-');
        }

        ret.items.push(
                { text: '平铺', handler: me.tileWindows, scope: me, minWindows: 1 },
                { text: '折叠', handler: me.cascadeWindows, scope: me, minWindows: 1 });

        return ret;
    },

    createWindowMenu: function () {
        var me = this;
        return {
            defaultAlign: 'br-tr',
            items: [
                { text: 'Restore', handler: me.onWindowMenuRestore, scope: me },
                { text: 'Minimize', handler: me.onWindowMenuMinimize, scope: me },
                { text: 'Maximize', handler: me.onWindowMenuMaximize, scope: me },
                '-',
                { text: 'Close', handler: me.onWindowMenuClose, scope: me }
            ],
            listeners: {
                beforeshow: me.onWindowMenuBeforeShow,
                hide: me.onWindowMenuHide,
                scope: me
            }
        };
    },

    //------------------------------------------------------
    // Event handler methods

    onDesktopMenu: function (e) {
        var me = this, menu = me.contextMenu;
        e.stopEvent();
        if (!menu.rendered) {
            menu.on('beforeshow', me.onDesktopMenuBeforeShow, me);
        }
        menu.showAt(e.getXY());
        menu.doConstrain();
    },

    onDesktopMenuBeforeShow: function (menu) {
        var me = this, count = me.windows.getCount();

        menu.items.each(function (item) {
            var min = item.minWindows || 0;
            item.setDisabled(count < min);
        });
    },

    onShortcutItemClick: function (dataView, record) {
        var me = this, module = me.app.getModule(record.data.module),
            win = module && module.createWindow();

        if (win) {
            me.restoreWindow(win);
        }
    },

    onWindowClose: function(win) {
        var me = this;
        me.windows.remove(win);
        me.taskbar.removeTaskButton(win.taskButton);
        me.updateActiveWindow();
    },

    //------------------------------------------------------
    // Window context menu handlers

    onWindowMenuBeforeShow: function (menu) {
        var items = menu.items.items, win = menu.theWin;
        items[0].setDisabled(win.maximized !== true && win.hidden !== true); // Restore
        items[1].setDisabled(win.minimized === true); // Minimize
        items[2].setDisabled(win.maximized === true || win.hidden === true); // Maximize
    },

    onWindowMenuClose: function () {
        var me = this, win = me.windowMenu.theWin;

        win.close();
    },

    onWindowMenuHide: function (menu) {
        menu.theWin = null;
    },

    onWindowMenuMaximize: function () {
        var me = this, win = me.windowMenu.theWin;

        win.maximize();
        win.toFront();
    },

    onWindowMenuMinimize: function () {
        var me = this, win = me.windowMenu.theWin;

        win.minimize();
    },

    onWindowMenuRestore: function () {
        var me = this, win = me.windowMenu.theWin;

        me.restoreWindow(win);
    },

    //------------------------------------------------------
    // Dynamic (re)configuration methods

    getWallpaper: function () {
        return this.wallpaper.wallpaper;
    },

    setTickSize: function(xTickSize, yTickSize) {
        var me = this,
            xt = me.xTickSize = xTickSize,
            yt = me.yTickSize = (arguments.length > 1) ? yTickSize : xt;

        me.windows.each(function(win) {
            var dd = win.dd, resizer = win.resizer;
            dd.xTickSize = xt;
            dd.yTickSize = yt;
            resizer.widthIncrement = xt;
            resizer.heightIncrement = yt;
        });
    },

    setWallpaper: function (wallpaper, stretch) {
        this.wallpaper.setWallpaper(wallpaper, stretch);
        return this;
    },

    //------------------------------------------------------
    // Window management methods

    cascadeWindows: function() {
        var x = 0, y = 0,
            zmgr = this.getDesktopZIndexManager();

        zmgr.eachBottomUp(function(win) {
            if (win.isWindow && win.isVisible() && !win.maximized) {
                win.setPosition(x, y);
                x += 20;
                y += 20;
            }
        });
    },

    createWindow: function(config, cls) {
        var me = this, win, cfg = Ext.applyIf(config || {}, {
                stateful: false,
                isWindow: true,
                constrainHeader: true,
                minimizable: true,
                maximizable: true
            });

        cls = cls || Ext.window.Window;
        win = me.add(new cls(cfg));

        me.windows.add(win);

        win.taskButton = me.taskbar.addTaskButton(win);
        win.animateTarget = win.taskButton.el;

        win.on({
            activate: me.updateActiveWindow,
            beforeshow: me.updateActiveWindow,
            deactivate: me.updateActiveWindow,
            minimize: me.minimizeWindow,
            destroy: me.onWindowClose,
            scope: me
        });

        win.on({
            boxready: function () {
                win.dd.xTickSize = me.xTickSize;
                win.dd.yTickSize = me.yTickSize;

                if (win.resizer) {
                    win.resizer.widthIncrement = me.xTickSize;
                    win.resizer.heightIncrement = me.yTickSize;
                }
            },
            single: true
        });

        // replace normal window close w/fadeOut animation:
        win.doClose = function ()  {
            win.doClose = Ext.emptyFn; // dblclick can call again...
            win.el.disableShadow();
            win.el.fadeOut({
                listeners: {
                    afteranimate: function () {
                        win.destroy();
                    }
                }
            });
        };

        return win;
    },

    getActiveWindow: function () {
        var win = null,
            zmgr = this.getDesktopZIndexManager();

        if (zmgr) {
            // We cannot rely on activate/deactive because that fires against non-Window
            // components in the stack.

            zmgr.eachTopDown(function (comp) {
                if (comp.isWindow && !comp.hidden) {
                    win = comp;
                    return false;
                }
                return true;
            });
        }

        return win;
    },

    getDesktopZIndexManager: function () {
        var windows = this.windows;
        // TODO - there has to be a better way to get this...
        return (windows.getCount() && windows.getAt(0).zIndexManager) || null;
    },

    getWindow: function(id) {
        return this.windows.get(id);
    },

    minimizeWindow: function(win) {
        win.minimized = true;
        win.hide();
    },

    restoreWindow: function (win) {
        if (win.isVisible()) {
            win.restore();
            win.toFront();
        } else {
            win.show();
        }
        return win;
    },

    tileWindows: function() {
        var me = this, availWidth = me.body.getWidth(true);
        var x = me.xTickSize, y = me.yTickSize, nextY = y;

        me.windows.each(function(win) {
            if (win.isVisible() && !win.maximized) {
                var w = win.el.getWidth();

                // Wrap to next row if we are not at the line start and this Window will
                // go off the end
                if (x > me.xTickSize && x + w > availWidth) {
                    x = me.xTickSize;
                    y = nextY;
                }

                win.setPosition(x, y);
                x += w + me.xTickSize;
                nextY = Math.max(nextY, y + win.el.getHeight() + me.yTickSize);
            }
        });
    },

    updateActiveWindow: function () {
        var me = this, activeWindow = me.getActiveWindow(), last = me.lastActiveWindow;
        if (activeWindow === last) {
            return;
        }

        if (last) {
            if (last.el.dom) {
                last.addCls(me.inactiveWindowCls);
                last.removeCls(me.activeWindowCls);
            }
            last.active = false;
        }

        me.lastActiveWindow = activeWindow;

        if (activeWindow) {
            activeWindow.addCls(me.activeWindowCls);
            activeWindow.removeCls(me.inactiveWindowCls);
            activeWindow.minimized = false;
            activeWindow.active = true;
        }

        me.taskbar.setActiveButton(activeWindow && activeWindow.taskButton);
    }
});
/*!
 * Ext JS Library 4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

Ext.define('Ext.ux.desktop.App', {
    mixins: {
        observable: 'Ext.util.Observable'
    },

    requires: [
        'Ext.container.Viewport',

        'Ext.ux.desktop.Desktop'
    ],

    isReady: false,
    modules: null,
    useQuickTips: true,

    constructor: function (config) {
        var me = this;
        me.addEvents(
            'ready',
            'beforeunload'
        );

        me.mixins.observable.constructor.call(this, config);

        if (Ext.isReady) {
            Ext.Function.defer(me.init, 10, me);
        } else {
            Ext.onReady(me.init, me);
        }
    },

    init: function() {
        var me = this, desktopCfg;

        if (me.useQuickTips) {
            Ext.QuickTips.init();
        }
        me.modules = me.getModules();
        if (me.modules) {
            me.initModules(me.modules);
        }

        desktopCfg = me.getDesktopConfig();
        me.desktop = new Ext.ux.desktop.Desktop(desktopCfg);

        me.viewport = new Ext.container.Viewport({
            layout: 'fit',
            items: [ me.desktop ]
        });

        Ext.EventManager.on(window, 'beforeunload', me.onUnload, me);

        me.isReady = true;
        me.fireEvent('ready', me);
    },

    /**
     * This method returns the configuration object for the Desktop object. A derived
     * class can override this method, call the base version to build the config and
     * then modify the returned object before returning it.
     */
    getDesktopConfig: function () {
        var me = this, cfg = {
            app: me,
            taskbarConfig: me.getTaskbarConfig()
        };

        Ext.apply(cfg, me.desktopConfig);
        return cfg;
    },

    getModules: Ext.emptyFn,

    /**
     * This method returns the configuration object for the Start Button. A derived
     * class can override this method, call the base version to build the config and
     * then modify the returned object before returning it.
     */
    getStartConfig: function () {
        var me = this,
            cfg = {
                app: me,
                menu: []
            },
            launcher;

        Ext.apply(cfg, me.startConfig);

        Ext.each(me.modules, function (module) {
            launcher = module.launcher;
            if (launcher) {
                launcher.handler = launcher.handler || Ext.bind(me.createWindow, me, [module]);
                cfg.menu.push(module.launcher);
            }
        });

        return cfg;
    },

    createWindow: function(module) {
        var window = module.createWindow();
        window.show();
    },

    /**
     * This method returns the configuration object for the TaskBar. A derived class
     * can override this method, call the base version to build the config and then
     * modify the returned object before returning it.
     */
    getTaskbarConfig: function () {
        var me = this, cfg = {
            app: me,
            startConfig: me.getStartConfig()
        };

        Ext.apply(cfg, me.taskbarConfig);
        return cfg;
    },

    initModules : function(modules) {
        var me = this;
        Ext.each(modules, function (module) {
            module.app = me;
        });
    },

    getModule : function(name) {
    	var ms = this.modules;
        for (var i = 0, len = ms.length; i < len; i++) {
            var m = ms[i];
            if (m.id == name || m.appType == name) {
                return m;
            }
        }
        return null;
    },

    onReady : function(fn, scope) {
        if (this.isReady) {
            fn.call(scope, this);
        } else {
            this.on({
                ready: fn,
                scope: scope,
                single: true
            });
        }
    },

    getDesktop : function() {
        return this.desktop;
    },

    onUnload : function(e) {
        if (this.fireEvent('beforeunload', this) === false) {
            e.stopEvent();
        }
    }
});
/**
 * 用于替代json方式<br>
 * FormAjaxWriter
 */
Ext.define('WJM.FormWriter', {
	extend : 'Ext.data.writer.Writer',

	writeRecords : function(request, data) {
		if (data.length > 1) {
			throw new Error('保存失败');
		}

		data = data[0];
		Ext.Object.each(data, function(key, value, myself) {
			request.params[key] = value;
		});
		return request;
	}
});/*!
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
});/*!
 * Ext JS Library 4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

Ext.define('WJM.WallpaperModel', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'text' },
        { name: 'img' }
    ]
});
/*!
 * Ext JS Library 4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

Ext.define('WJM.Settings', {
    extend: 'Ext.window.Window',

    uses: [
        'Ext.tree.Panel',
        'Ext.tree.View',
        'Ext.form.field.Checkbox',
        'Ext.layout.container.Anchor',
        'Ext.layout.container.Border',

        'Ext.ux.desktop.Wallpaper',

        'WJM.WallpaperModel'
    ],

    layout: 'anchor',
    title: 'Change Settings',
    modal: true,
    width: 640,
    height: 480,
    border: false,

    initComponent: function () {
        var me = this;

        me.selected = me.desktop.getWallpaper();
        me.stretch = me.desktop.wallpaper.stretch;

        me.preview = Ext.create('widget.wallpaper');
        me.preview.setWallpaper(me.selected);
        me.tree = me.createTree();

        me.buttons = [
            { text: 'OK', handler: me.onOK, scope: me },
            { text: 'Cancel', handler: me.close, scope: me }
        ];

        me.items = [
            {
                anchor: '0 -30',
                border: false,
                layout: 'border',
                items: [
                    me.tree,
                    {
                        xtype: 'panel',
                        title: 'Preview',
                        region: 'center',
                        layout: 'fit',
                        items: [ me.preview ]
                    }
                ]
            },
            {
                xtype: 'checkbox',
                boxLabel: 'Stretch to fit',
                checked: me.stretch,
                listeners: {
                    change: function (comp) {
                        me.stretch = comp.checked;
                    }
                }
            }
        ];

        me.callParent();
    },

    createTree : function() {
        var me = this;

        function child (img) {
            return { img: img, text: me.getTextOfWallpaper(img), iconCls: '', leaf: true };
        }

        var tree = new Ext.tree.Panel({
            title: 'Desktop Background',
            rootVisible: false,
            lines: false,
            autoScroll: true,
            width: 150,
            region: 'west',
            split: true,
            minWidth: 100,
            listeners: {
                afterrender: { fn: this.setInitialSelection, delay: 100 },
                select: this.onSelect,
                scope: this
            },
            store: new Ext.data.TreeStore({
                model: 'WJM.WallpaperModel',
                root: {
                    text:'Wallpaper',
                    expanded: true,
                    children:[
                        { text: "None", iconCls: '', leaf: true },
                        child('Blue-Sencha.jpg'),
                        child('Dark-Sencha.jpg'),
                        child('Wood-Sencha.jpg'),
                        child('blue.jpg'),
                        child('desk.jpg'),
                        child('desktop.jpg'),
                        child('desktop2.jpg'),
                        child('sky.jpg')
                    ]
                }
            })
        });

        return tree;
    },

    getTextOfWallpaper: function (path) {
        var text = path, slash = path.lastIndexOf('/');
        if (slash >= 0) {
            text = text.substring(slash+1);
        }
        var dot = text.lastIndexOf('.');
        text = Ext.String.capitalize(text.substring(0, dot));
        text = text.replace(/[-]/g, ' ');
        return text;
    },

    onOK: function () {
        var me = this;
        if (me.selected) {
            me.desktop.setWallpaper(me.selected, me.stretch);
        }
        me.destroy();
    },

    onSelect: function (tree, record) {
        var me = this;

        if (record.data.img) {
            me.selected = 'wallpapers/' + record.data.img;
        } else {
            me.selected = Ext.BLANK_IMAGE_URL;
        }

        me.preview.setWallpaper(me.selected);
    },

    setInitialSelection: function () {
        var s = this.desktop.getWallpaper();
        if (s) {
            var path = '/Wallpaper/' + this.getTextOfWallpaper(s);
            this.tree.selectPath(path, 'text');
        }
    }
});
/*!
 * Ext JS Library 4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

/**
 * @class Ext.ux.desktop.ShortcutModel
 * @extends Ext.data.Model This model defines the minimal set of fields for desktop shortcuts.
 */
Ext.define('WJM.ShortcutModel', {
	extend : 'Ext.data.Model', fields : [ {
		name : 'name'
	}, {
		name : 'iconCls'
	}, {
		name : 'module'
	}, {
		name : 'powerId'
	} ]
});
/**
 * @class Ext.ux.grid.Printer
 * @author Ed Spencer (edward@domine.co.uk) Helper class to easily print the
 *         contents of a grid. Will open a new window with a table where the
 *         first row contains the headings from your column model, and with a
 *         row for each item in your grid's store. When formatted with
 *         appropriate CSS it should look very similar to a default grid. If
 *         renderers are specified in your column model, they will be used in
 *         creating the table. Override headerTpl and bodyTpl to change how the
 *         markup is generated
 * 
 * Usage:
 * 
 * 1 - Add Ext.Require Before the Grid code Ext.require([
 * 'Ext.ux.grid.GridPrinter', ]);
 * 
 * 2 - Declare the Grid var grid = Ext.create('Ext.grid.Panel', { columns:
 * //some column model, store : //some store });
 * 
 * 3 - Print! Ext.ux.grid.Printer.mainTitle = 'Your Title here'; //optional
 * Ext.ux.grid.Printer.print(grid);
 * 
 * Original url: http://edspencer.net/2009/07/printing-grids-with-ext-js.html
 * 
 * Modified by Loiane Groner (me@loiane.com) - September 2011 - Ported to Ext JS
 * 4 http://loianegroner.com (English) http://loiane.com (Portuguese)
 * 
 * Modified by Paulo Goncalves - March 2012
 * 
 * Modified by Beto Lima - March 2012
 * 
 * Modified by Beto Lima - April 2012
 * 
 * Modified by Paulo Goncalves - May 2012
 * 
 * Modified by Nielsen Teixeira - 2012-05-02
 * 
 * Modified by Joshua Bradley - 2012-06-01
 * 
 */
Ext.define("Ext.ux.grid.Printer", {

  requires : 'Ext.XTemplate',

  statics : {
	/**
	 * Prints the passed grid. Reflects on the grid's column model to build a
	 * table, and fills it using the store
	 * 
	 * @param {Ext.grid.Panel}
	 *            grid The grid to print
	 */
	print : function(grid) {
	  // We generate an XTemplate here by using 2 intermediary XTemplates - one
	  // to create the header,
	  // the other to create the body (see the escaped {} below)
	  var columns = [];
	  // account for grouped columns
	  Ext.each(grid.columns, function(c) {
		if (c.items.length > 0) {
		  columns = columns.concat(c.items.items);
		} else {
		  columns.push(c);
		}
	  });

	  // build a useable array of store data for the XTemplate
	  var data = [];
	  grid.store.data.each(function(item, row) {
		var convertedData = {};

		// apply renderers from column model
		for ( var key in item.data) {
		  var value = item.data[key];

		  Ext.each(columns, function(column, col) {
			if (column.dataIndex == key) {
			  /*
			   * TODO: add the meta to template
			   */
			  var meta = {
				item : '', tdAttr : '', style : ''
			  };
			  value = column.renderer ? column.renderer.call(grid, value, meta, item, row, col, grid.store, grid.view) : value;
			}
		  }, this);
		  convertedData[key] = value;
		}

		data.push(convertedData);
	  });

	  // remove columns that do not contains dataIndex or dataIndex is empty.
	  // for example: columns filter or columns button
	  var clearColumns = [];
	  Ext.each(columns, function(column) {
		if (!Ext.isEmpty(column.dataIndex) && !column.hidden) {
		  clearColumns.push(column);
		}
	  });
	  columns = clearColumns;

	  // get Styles file relative location, if not supplied
	  if (this.stylesheetPath === null) {
		var scriptPath = Ext.Loader.getPath('Ext.ux.grid.Printer');
		this.stylesheetPath = scriptPath.substring(0, scriptPath.indexOf('Printer.js')) + 'gridPrinterCss/print.css';
	  }

	  // use the headerTpl and bodyTpl markups to create the main XTemplate
	  // below
	  var headings = Ext.create('Ext.XTemplate', this.headerTpl).apply(columns);
	  var body = Ext.create('Ext.XTemplate', this.bodyTpl).apply(columns);
	  var pluginsBody = '', pluginsBodyMarkup = [];

	  // add relevant plugins
	  Ext.each(grid.plugins, function(p) {
		if (p.ptype == 'rowexpander') {
		  pluginsBody += p.rowBodyTpl.join('');
		}
	  });

	  if (pluginsBody != '') {
		pluginsBodyMarkup = [ '<tr class="{[xindex % 2 === 0 ? "even" : "odd"]}"><td colspan="' + columns.length + '">', pluginsBody,
			'</td></tr>' ];
	  }

	  // Here because inline styles using CSS, the browser did not show the
	  // correct formatting of the data the first time that loaded
	  var htmlMarkup = [
		  '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">',
		  '<html class="' + Ext.baseCSSPrefix + 'ux-grid-printer">',
		  '<head>',
		  '<meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />',
		  '<link href="' + this.stylesheetPath + '" rel="stylesheet" type="text/css" />',
		  '<title>' + grid.title + '</title>',
		  '</head>',
		  '<body class="' + Ext.baseCSSPrefix + 'ux-grid-printer-body">',
		  '<div class="' + Ext.baseCSSPrefix + 'ux-grid-printer-noprint ' + Ext.baseCSSPrefix + 'ux-grid-printer-links">',
		  '<a class="' + Ext.baseCSSPrefix + 'ux-grid-printer-linkprint" href="javascript:void(0);" onclick="window.print();">'
			  + this.printLinkText + '</a>',
		  '<a class="' + Ext.baseCSSPrefix + 'ux-grid-printer-linkclose" href="javascript:void(0);" onclick="window.close();">'
			  + this.closeLinkText + '</a>', '</div>', '<h1>' + this.mainTitle + '</h1>', '<table>', '<tr>', headings, '</tr>',
		  '<tpl for=".">', '<tr class="{[xindex % 2 === 0 ? "even" : "odd"]}">', body, '</tr>', pluginsBodyMarkup.join(''), '</tpl>',
		  '</table>', '</body>', '</html>' ];

	  var html = Ext.create('Ext.XTemplate', htmlMarkup).apply(data);

	  // open up a new printing window, write to it, print it and close
	  var win = window.open('', 'printgrid');

	  // document must be open and closed
	  win.document.open();
	  win.document.write(html);
	  win.document.close();

	  // An attempt to correct the print command to the IE browser
	  if (this.printAutomatically) {
		if (Ext.isIE) {
		  window.print();
		} else {
		  win.print();
		}
	  }

	  // Another way to set the closing of the main
	  if (this.closeAutomaticallyAfterPrint) {
		if (Ext.isIE) {
		  window.close();
		} else {
		  win.close();
		}
	  }
	},

	/**
	 * @property stylesheetPath
	 * @type String The path at which the print stylesheet can be found
	 *       (defaults to 'ux/grid/gridPrinterCss/print.css')
	 */
	stylesheetPath : null,

	/**
	 * @property printAutomatically
	 * @type Boolean True to open the print dialog automatically and close the
	 *       window after printing. False to simply open the print version of
	 *       the grid (defaults to false)
	 */
	printAutomatically : false,

	/**
	 * @property closeAutomaticallyAfterPrint
	 * @type Boolean True to close the window automatically after printing.
	 *       (defaults to false)
	 */
	closeAutomaticallyAfterPrint : false,

	/**
	 * @property mainTitle
	 * @type String Title to be used on top of the table (defaults to empty)
	 */
	mainTitle : '',

	/**
	 * Text show on print link
	 * 
	 * @type String
	 */
	printLinkText : 'Print',

	/**
	 * Text show on close link
	 * 
	 * @type String
	 */
	closeLinkText : 'Close',

	/**
	 * @property headerTpl
	 * @type {Object/Array} values The markup used to create the headings row.
	 *       By default this just uses
	 *       <th> elements, override to provide your own
	 */
	headerTpl : [ '<tpl for=".">', '<th>{text}</th>', '</tpl>' ],

	/**
	 * @property bodyTpl
	 * @type {Object/Array} values The XTemplate used to create each row. This
	 *       is used inside the 'print' function to build another XTemplate, to
	 *       which the data are then applied (see the escaped dataIndex
	 *       attribute here - this ends up as "{dataIndex}")
	 */
	bodyTpl : [ '<tpl for=".">', '<td>\{{dataIndex}\}</td>', '</tpl>' ]
  }
});
Ext.define('Ext.ux.form.field.AdNumberField', {
	extend : 'Ext.form.field.Number',

	alias : [ 'widget.adnumberfield' ],

	format : '0.00',

	valueToRaw : function(value) {
		var me = this, decimalSeparator = me.decimalSeparator;
		value = me.parseValue(value);
		value = me.fixPrecision(value);
		value = Ext.isNumber(value) ? value : parseFloat(String(value).replace(decimalSeparator, '.'));
		if (this.format) {
			value = Ext.util.Format.number(value, this.format);
		}
		value = isNaN(value) ? '' : String(value).replace('.', decimalSeparator);
		return value;
	}

});
/**
 * @class Ext.ux.CheckColumn
 * @extends Ext.grid.column.Column
 * A Header subclass which renders a checkbox in each column cell which toggles the truthiness of the associated data field on click.
 *
 * Example usage:
 * 
 *    // create the grid
 *    var grid = Ext.create('Ext.grid.Panel', {
 *        ...
 *        columns: [{
 *           text: 'Foo',
 *           ...
 *        },{
 *           xtype: 'checkcolumn',
 *           text: 'Indoor?',
 *           dataIndex: 'indoor',
 *           width: 55
 *        }]
 *        ...
 *    });
 *
 * In addition to toggling a Boolean value within the record data, this
 * class adds or removes a css class <tt>'x-grid-checked'</tt> on the td
 * based on whether or not it is checked to alter the background image used
 * for a column.
 */
Ext.define('Ext.ux.CheckColumn', {
    extend: 'Ext.grid.column.Column',
    alias: 'widget.checkcolumn',

    /**
     * @cfg {Boolean} [stopSelection=true]
     * Prevent grid selection upon mousedown.
     */
    stopSelection: true,

    tdCls: Ext.baseCSSPrefix + 'grid-cell-checkcolumn',

    constructor: function() {
        this.addEvents(
            /**
             * @event beforecheckchange
             * Fires when before checked state of a row changes.
             * The change may be vetoed by returning `false` from a listener.
             * @param {Ext.ux.CheckColumn} this CheckColumn
             * @param {Number} rowIndex The row index
             * @param {Boolean} checked True if the box is to be checked
             */
            'beforecheckchange',
            /**
             * @event checkchange
             * Fires when the checked state of a row changes
             * @param {Ext.ux.CheckColumn} this CheckColumn
             * @param {Number} rowIndex The row index
             * @param {Boolean} checked True if the box is now checked
             */
            'checkchange'
        );
        this.callParent(arguments);
    },

    /**
     * @private
     * Process and refire events routed from the GridView's processEvent method.
     */
    processEvent: function(type, view, cell, recordIndex, cellIndex, e) {
        var me = this,
            key = type === 'keydown' && e.getKey(),
            mousedown = type == 'mousedown';

        if (mousedown || (key == e.ENTER || key == e.SPACE)) {
            var record = view.panel.store.getAt(recordIndex),
                dataIndex = me.dataIndex,
                checked = !record.get(dataIndex);

            // Allow apps to hook beforecheckchange
            if (me.fireEvent('beforecheckchange', me, recordIndex, checked) !== false) {
                record.set(dataIndex, checked);
                me.fireEvent('checkchange', me, recordIndex, checked);

                // Mousedown on the now nonexistent cell causes the view to blur, so stop it continuing.
                if (mousedown) {
                    e.stopEvent();
                }

                // Selection will not proceed after this because of the DOM update caused by the record modification
                // Invoke the SelectionModel unless configured not to do so
                if (!me.stopSelection) {
                    view.selModel.selectByPosition({
                        row: recordIndex,
                        column: cellIndex
                    });
                }

                // Prevent the view from propagating the event to the selection model - we have done that job.
                return false;
            } else {
                // Prevent the view from propagating the event to the selection model if configured to do so.
                return !me.stopSelection;
            }
        } else {
            return me.callParent(arguments);
        }
    },

    // Note: class names are not placed on the prototype bc renderer scope
    // is not in the header.
    renderer : function(value){
        var cssPrefix = Ext.baseCSSPrefix,
            cls = [cssPrefix + 'grid-checkheader'];

        if (value) {
            cls.push(cssPrefix + 'grid-checkheader-checked');
        }
        return '<div class="' + cls.join(' ') + '">&#160;</div>';
    }
});
Ext.define('WJM.model.TCompany', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'company_name'
	}, {
		name : 'company_address'
	}, {
		name : 'company_tel'
	}, {
		name : 'company_fax'
	}, {
		name : 'company_name_pic_logo'
	}, {
		name : 'company_logo_pic_logo'
	}, {
		name : 'invoiceTax'
	} ],

	proxy : {
		batchActions : true,
		type : 'ajax',
		pageParam : 'currpage',
		limitParam : 'pagesize',
		api : {
			create : location.context + '/setting.do?action=saveCompany', read : location.context + '/setting.do?action=getCompany',
			update : location.context + '/company.do?action=update', destroy : location.context + '/company.do?action=del'
		},

		writer : Ext.create('WJM.FormWriter'),

		actionMethods : {
			create : "POST", read : "POST", update : "POST", destroy : "POST"
		},

		reader : {
			root : 'listData', totalProperty : 'total', messageProperty : 'msg'
		},

		listeners : {
			exception : function(proxy, response, operation) {
				Ext.MessageBox.show({
					title : '操作失败', msg : operation.getError() || '操作失败', icon : Ext.MessageBox.ERROR, buttons : Ext.Msg.OK
				});
			}
		}
	}
});
Ext.define('WJM.model.TCreditWarning', {
  extend : 'Ext.data.Model',

  fields : [ {
	name : 'amount'
  }, {
	name : 'buyer_code'
  }, {
	name : 'invoice'
  }, {
	name : 'last_cash_time'
  }, {
	name : 'oper_name'
  } ,{
	  name:'sale_id'
  }]

});

Ext.create('Ext.data.Store', {
  autoLoad : false, autoSync : true, model : 'WJM.model.TCreditWarning', storeId : 'CreditWarningStore', proxy : {
	batchActions : true, type : 'ajax', api : {
	  create : '', read : location.context + '/sale.do?action=credit_warn', update : '', destroy : ''
	},

	writer : Ext.create('WJM.FormWriter'),

	actionMethods : {
	  create : "POST", read : "POST", update : "POST", destroy : "POST"
	},

	reader : {
	  root : 'listData', totalProperty : 'total', messageProperty : 'msg'
	},

	listeners : {
	  exception : function(proxy, response, operation) {
		Ext.MessageBox.show({
		  title : '操作失败', msg : operation.getError() || '操作失败', icon : Ext.MessageBox.ERROR, buttons : Ext.Msg.OK
		});
	  }
	}
  }
});
Ext.define('WJM.model.TCustomer', {
	extend : 'Ext.data.Model', idProperty : 'id',

	fields : [ {
		name : 'id'
	}, {
		name : 'type'
	}, {
		name : 'code'
	}, {
		name : 'shortName'
	}, {
		name : 'allName'
	}, {
		name : 'address'
	}, {
		name : 'postCode'
	}, {
		name : 'tel1'
	}, {
		name : 'tel2'
	}, {
		name : 'tel3'
	}, {
		name : 'mobile'
	}, {
		name : 'FAX'
	}, {
		name : 'EMail'
	}, {
		name : 'http'
	}, {
		name : 'accounts'
	}, {
		name : 'taxCode'
	}, {
		name : 'linkMan'
	}, {
		name : 'companyType'
	}, {
		name : 'helpName'
	}, {
		name : 'recDate'
	}, {
		name : 'myMemo'
	}, {
		name : 'state'
	}, {
		name : 'city'
	}, {
		name : 'leav_money'
	}, {
		name : 'credit_Line'
	}, {
		name : 'balance'
	}, {
		name : 'bank_Name'
	}, {
		name : 'bank_Acount'
	}, {
		name : 'credit_Acount'
	}, {
		name : 'passwd'
	}, {
		name : 'acc_type'
	}, {
		name : 'acc_type_cn', convert : function(v, record) {
			
			if(record.data.acc_type == 1){
				return "批发";
			}else if(record.data.acc_type == 2){
				return "工程公司";
			}else
				return "零售";
			
		}
	}, {
		name : 'total'
	}, {
		name : 'acc_balance', convert : function(v, record) {
			return record.data.leav_money - record.data.balance;
		}
	}, {
		name : 'show_leav_money', convert : function(v, record) {
			return -record.data.leav_money;
		}
	} ],

	validations : [ {
		type : 'length', field : 'shortName', min : 1
	} ]
});

Ext.define('WJM.model.CustomerBaseStore', {
	extend : 'Ext.data.Store',
	autoLoad : false,
	autoSync : true,
	model : 'WJM.model.TCustomer',
	pageSize : 25,
	storeId : 'CustomerStore',
	proxy : {
		batchActions : true,
		type : 'ajax',
		pageParam : 'currpage',
		limitParam : 'pagesize',
		api : {
			create : location.context + '/buyer.do?action=save', read : location.context + '/buyer.do?action=list',
			update : location.context + '/buyer.do?action=update', destroy : location.context + '/buyer.do?action=del'
		},

		writer : Ext.create('WJM.FormWriter'),

		reader : {
			root : 'listData', totalProperty : 'total', messageProperty : 'msg'
		},

		actionMethods : {
			create : "POST", read : "POST", update : "POST", destroy : "POST"
		},

		listeners : {
			exception : function(proxy, response, operation) {
				switch (operation.action) {
				case "create":
				case "update":
					Ext.MessageBox.alert('提示', '保存失败，请稍后重试');
					break;
				case "destroy":
					Ext.MessageBox.alert('提示', '删除失败，请稍后重试');
					break;
				default:
					break;
				}
			}
		}
	}
});
Ext.create('Ext.data.Store', {
	fields : [ 'value', 'name' ], storeId : 'CustomerTypeStore', data : [ {
		"value" : 0, "name" : "零售"
	}, {
		"value" : 1, "name" : "批发"
	}, {
		"value" : 2, "name" : "工程公司"
	} ]
});
Ext.create('WJM.model.CustomerBaseStore', {
	storeId : 'CustomerSearchStore'
});

Ext.create('WJM.model.CustomerBaseStore', {
	storeId : 'CustomerQuickStore', proxy : {
		batchActions : true, type : 'ajax', pageParam : 'currpage', limitParam : 'pagesize', api : {
			create : '', read : location.context + '/buyer.do?action=quicklist', update : '', destroy : ''
		},

		writer : Ext.create('WJM.FormWriter'),

		reader : {
			root : 'listData', totalProperty : 'total', messageProperty : 'msg'
		},

		actionMethods : {
			create : "POST", read : "POST", update : "POST", destroy : "POST"
		},

		listeners : {
			exception : function(proxy, response, operation) {
				switch (operation.action) {
				case "create":
				case "update":
					Ext.MessageBox.alert('提示', '保存失败，请稍后重试');
					break;
				case "destroy":
					Ext.MessageBox.alert('提示', '删除失败，请稍后重试');
					break;
				default:
					break;
				}
			}
		}
	}
});
/**
 * 损害报表
 */
Ext.define('WJM.model.TDamageReport', {
	extend : 'Ext.data.Model', idProperty : 'product_name',

	fields : [ {
		name : 'product_name'
	}, {
		name : 'all_price'
	}, {
		name : 'rma_num'
	} ]

});

Ext.create('Ext.data.Store', {
	autoLoad : false, autoSync : true, model : 'WJM.model.TDamageReport', storeId : 'DamageReportStore', proxy : {
		batchActions : true, type : 'ajax', api : {
			create : '', read : location.context + '/sale.do?action=damageRepor', update : '', destroy : ''
		},

		writer : Ext.create('WJM.FormWriter'),

		actionMethods : {
			create : "POST", read : "POST", update : "POST", destroy : "POST"
		},

		reader : {
			root : 'listData', totalProperty : 'total', messageProperty : 'msg'
		},

		listeners : {
			exception : function(proxy, response, operation) {
				Ext.MessageBox.show({
					title : '操作失败', msg : operation.getError() || '操作失败', icon : Ext.MessageBox.ERROR, buttons : Ext.Msg.OK
				});
			}
		}
	}
});
Ext.define('WJM.model.TEmployee', {
	extend : 'Ext.data.Model', idProperty : 'id',

	fields : [ {
		name : 'id', type : 'float'
	}, {
		name : 'name'
	}, {
		name : 'code'
	}, {
		name : 'sex'
	}, {
		name : 'birthDay'
	}, {
		name : 'iDCard'
	}, {
		name : 'tel'
	}, {
		name : 'mobile'
	}, {
		name : 'address'
	}, {
		name : 'department'
	}, {
		name : 'headShip'
	}, {
		name : 'popedom'
	}, {
		name : 'password1'
	}, {
		name : 'is_manager'
	} ],

	validations : [ {
		type : 'length', field : 'code', min : 1
	}, {
		type : 'length', field : 'password1', min : 1
	}, {
		type : 'length', field : 'name', min : 1
	} ]
});

Ext.create('Ext.data.Store', {
	autoLoad : false,
	autoSync : true,
	model : 'WJM.model.TEmployee',
	pageSize : 25,
	storeId : 'EmployeeStore',
	proxy : {
		batchActions : true,
		type : 'ajax',
		pageParam : 'currpage',
		limitParam : 'pagesize',
		api : {
			create : location.context + '/employee.do?action=save', read : location.context + '/employee.do?action=list',
			update : location.context + '/employee.do?action=update', destroy : location.context + '/employee.do?action=del'
		},

		writer : Ext.create('WJM.FormWriter'),

		reader : {
			root : 'listData', totalProperty : 'total', messageProperty : 'msg'
		},

		actionMethods : {
			create : "POST", read : "POST", update : "POST", destroy : "POST"
		},

		listeners : {
			exception : function(proxy, response, operation) {
				var msgObj=eval("("+response.responseText+")");
				switch (operation.action) {
				case "create":
				case "update":
					Ext.MessageBox.alert('提示',Ext.util.Format.trim(msgObj.msg));
					break;
				case "destroy":
					Ext.MessageBox.alert('提示', '删除失败，请稍后重试');
					break;
				default:
					break;
				}
			}
		}
	},

	listeners : {
		add : function(store, records, index, operation) {
			Ext.data.StoreManager.lookup('EmployeeAllStore').load();
		}, update : function(store, records, index, operation) {
			Ext.data.StoreManager.lookup('EmployeeAllStore').load();
		}, remove : function(store, records, index, operation) {
			Ext.data.StoreManager.lookup('EmployeeAllStore').load();
		}
	}
});

Ext.create('Ext.data.Store', {
	autoLoad : true,
	autoSync : true,
	model : 'WJM.model.TEmployee',
	storeId : 'EmployeeAllStore',
	pageSize : 1000,
	proxy : {
		batchActions : true,
		pageParam : 'currpage',
		limitParam : 'pagesize',
		type : 'ajax',
		api : {
			create : location.context + '/employee.do?action=save', read : location.context + '/employee.do?action=list',
			update : location.context + '/employee.do?action=update', destroy : location.context + '/employee.do?action=del'
		},

		writer : Ext.create('WJM.FormWriter'),

		reader : {
			root : 'listData', totalProperty : 'total', messageProperty : 'msg'
		},

		actionMethods : {
			create : "POST", read : "POST", update : "POST", destroy : "POST"
		},

		listeners : {
			success:function(){
				alert(123);
			},
			exception : function(proxy, response, operation) {
				var msgObj=eval("("+response.responseText+")");
				switch (operation.action) {
				case "create":
				case "update":
					Ext.MessageBox.alert('提示', Ext.util.Format.trim(msgObj.msg));
					break;
				case "destroy":
					Ext.MessageBox.alert('提示', '删除失败，请稍后重试');
					break;
				default:
					break;
				}
			}
		}
	}
});
Ext.define('WJM.model.TPower', {
	extend : 'Ext.data.Model', idProperty : 'id',

	fields : [ {
		name : 'id', type : 'float'
	}, {
		name : 'power_name'
	} ],

	validations : [ {
		type : 'length', field : 'power_name', min : 1
	} ],

	hasMany : {
		model : 'WJM.model.TPowerOperation', name : 'operations'
	},

	proxy : {
		batchActions : true, type : 'ajax',

		url : location.context + '/power.do?action=get',

		reader : {
			root : 'listData', totalProperty : 'total', messageProperty : 'msg'
		},

		listeners : {
			exception : function(proxy, response, operation) {
				Ext.MessageBox.show({
					title : '操作失败', msg : operation.getError() || '操作失败', icon : Ext.MessageBox.ERROR, buttons : Ext.Msg.OK
				});
			}
		}
	}
});

Ext.create('Ext.data.Store', {
	autoLoad : true,
	autoSync : true,
	model : 'WJM.model.TPower',
	pageSize : 200,
	storeId : 'PowerStore',
	proxy : {
		batchActions : true,
		type : 'ajax',
		pageParam : 'currpage',
		limitParam : 'pagesize',
		api : {
			create : location.context + '/power.do?action=save', read : location.context + '/power.do?action=list',
			update : location.context + '/power.do?action=update', destroy : location.context + '/power.do?action=del'
		},

		writer : Ext.create('WJM.FormWriter'),

		actionMethods : {
			create : "POST", read : "POST", update : "POST", destroy : "POST"
		},
		
		reader : {
			root : 'listData', totalProperty : 'total', messageProperty : 'msg'
		},

		listeners : {
			exception : function(proxy, response, operation) {
				Ext.MessageBox.show({
					title : '操作失败', msg : operation.getError() || '操作失败', icon : Ext.MessageBox.ERROR, buttons : Ext.Msg.OK
				});
			}
		}
	}
});
Ext.define('WJM.model.TPowerOperation', {
	extend : 'Ext.data.Model', idProperty : 'id',

	fields : [ {
		name : 'id', type : 'float'
	}, {
		name : 'popedomCode'
	}, {
		name : 'operationCode'
	} ],

	validations : [ {
		type : 'length', field : 'power_name', min : 1
	} ],

	belongsTo : 'WJM.model.TPower'
});

Ext.create('Ext.data.Store', {
	autoLoad : false,
	autoSync : true,
	model : 'WJM.model.TPowerOperation',
	pageSize : 25,
	storeId : 'PowerOperationStore',
	proxy : {
		batchActions : true,
		type : 'ajax',
		pageParam : 'currpage',
		limitParam : 'pagesize',
		api : {
			create : location.context + '/power_opration.do?action=save', read : location.context + '/power_opration.do?action=list',
			update : location.context + '/power_opration.do?action=update', destroy : location.context + '/power_opration.do?action=del'
		},

		writer : Ext.create('WJM.FormWriter'),

		reader : {
			root : 'listData', totalProperty : 'total', messageProperty : 'msg'
		},

		actionMethods : {
			create : "POST", read : "POST", update : "POST", destroy : "POST"
		},
		
		listeners : {
			exception : function(proxy, response, operation) {
				Ext.MessageBox.show({
					title : '操作失败', msg : operation.getError() || '操作失败', icon : Ext.MessageBox.ERROR, buttons : Ext.Msg.OK
				});
			}
		}
	}
});
Ext.define('WJM.model.TProduct', {
	extend : 'Ext.data.Model', idProperty : 'id',

	fields : [ {
		name : 'id'
	}, {
		name : 'product_id'
	}, {
		name : 'code'
	}, {
		name : 'product_name'
	}, {
		name : 'spec'
	}, {
		name : 'unit'
	}, {
		name : 'size'
	}, {
		name : 'weight'
	}, {
		name : 'upLimit'
	}, {
		name : 'downLimit'
	}, {
		name : 'price_income'
	}, {
		name : 'price_simgle'
	}, {
		name : 'drawing'
	}, {
		name : 'helpName'
	}, {
		name : 'myMemo'
	}, {
		name : 'drawing2'
	}, {
		name : 'drawing3'
	}, {
		name : 'drawing4'
	}, {
		name : 'drawing5'
	}, {
		name : 'drawing6'
	}, {
		name : 'drawing7'
	}, {
		name : 'drawing8'
	}, {
		name : 'drawing9'
	}, {
		name : 'sreserve1'
	}, {
		name : 'sreserve2'
	}, {
		name : 'sreserve3'
	}, {
		name : 'freserve1'
	}, {
		name : 'freserve2'
	}, {
		name : 'freserve3'
	}, {
		name : 'product_type'
	}, {
		name : 'num'
	}, {
		name : 'product_name_cn'
	}, {
		name : 'vendortName'
	}, {
		name : 'provider_id'
	}, {
		name : 'price_wholesale'
	}, {
		name : 'product_name_full', convert : function(v, record) {
			return record.data.product_id + '--' + record.data.code + '--' + record.data.product_name + '--' + record.data.product_name_cn;
		}
	}, {
		name : 'agio'
	}, {
		name : 'agio_price'
	},{
		name:'price_company'
	}],

	validations : [ {
		type : 'length', field : 'product_name', min : 1
	} ]
});

Ext.define('WJM.model.ProductBaseStore', {
	extend : 'Ext.data.Store',
	autoLoad : false,
	autoSync : true,
	model : 'WJM.model.TProduct',
	storeId : 'ProductStore',
	pageSize : 25,
	proxy : {
		batchActions : true,
		pageParam : 'currpage',
		limitParam : 'pagesize',
		type : 'ajax',
		api : {
			create : location.context + '/product.do?action=save', read : location.context + '/product.do?action=list',
			update : location.context + '/product.do?action=update', destroy : location.context + '/product.do?action=deleteProducts'
		},

		writer : Ext.create('WJM.FormWriter'),

		reader : {
			root : 'listData', totalProperty : 'total', messageProperty : 'msg'
		},

		actionMethods : {
			create : "POST", read : "POST", update : "POST", destroy : "POST"
		},

		listeners : {
			exception : function(proxy, response, operation) {
				switch (operation.action) {
				case "create":
				case "update":
					Ext.MessageBox.alert('提示', '保存失败，请稍后重试');
					break;
				case "destroy":
					Ext.MessageBox.alert('提示', '删除失败，请稍后重试');
					break;
				default:
					break;
				}
			}
		}
	}
});

Ext.create('WJM.model.ProductBaseStore', {

});

Ext.create('WJM.model.ProductBaseStore', {
	storeId : 'ProductQuickStore',
	autoSync : false,
	proxy : {
		batchActions : true, pageParam : 'currpage', limitParam : 'pagesize', type : 'ajax', api : {
			create : '', read : location.context + '/product.do?action=quickSearch', update : '', destroy : ''
		},

		writer : Ext.create('WJM.FormWriter'),

		reader : {
			root : 'listData', totalProperty : 'total', messageProperty : 'msg'
		},

		actionMethods : {
			create : "POST", read : "POST", update : "POST", destroy : "POST"
		},

		listeners : {
			exception : function(proxy, response, operation) {
				switch (operation.action) {
				case "create":
				case "update":
					Ext.MessageBox.alert('提示', '保存失败，请稍后重试');
					break;
				case "destroy":
					Ext.MessageBox.alert('提示', '删除失败，请稍后重试');
					break;
				default:
					break;
				}
			}
		}
	}
});

Ext.create('WJM.model.ProductBaseStore', {
	storeId : 'ProductAlertStore',
	autoSync : false,
	proxy : {
		batchActions : true, pageParam : 'currpage', limitParam : 'pagesize', type : 'ajax', api : {
			create : '', read : location.context + '/product.do?action=listStoreAlert', update : '', destroy : ''
		},

		writer : Ext.create('WJM.FormWriter'),

		reader : {
			root : 'listData', totalProperty : 'total', messageProperty : 'msg'
		},

		actionMethods : {
			create : "POST", read : "POST", update : "POST", destroy : "POST"
		},

		listeners : {
			exception : function(proxy, response, operation) {
				switch (operation.action) {
				case "create":
				case "update":
					Ext.MessageBox.alert('提示', '保存失败，请稍后重试');
					break;
				case "destroy":
					Ext.MessageBox.alert('提示', '删除失败，请稍后重试');
					break;
				default:
					break;
				}
			}
		}
	}
});Ext.define('WJM.model.TProductCategory', {
	extend : 'Ext.data.Model', idProperty : 'id',

	fields : [ {
		name : 'id'
	}, {
		name : 'product_type_name'
	}, {
		name : 'product_type_name_cn'
	}, {
		name : 'code'
	}, {
		name : 'parent_id'
	}, {
		name : 'level'
	}, {
		name : 'parent_product_type_name'
	} ],

	validations : [ {
		type : 'length', field : 'product_type_name', min : 1
	} ]
});

Ext.define('WJM.model.ProductCategoryBaseStore', {
	extend : 'Ext.data.TreeStore',
	autoLoad : false,
	autoSync : true,
	model : 'WJM.model.TProductCategory',
	storeId : 'ProductCategoryStore',
	root : {
		product_type_name : "全部类别", level : 0, expanded : true, id : 0
	},
	proxy : {
		batchActions : true,
		type : 'ajax',
		api : {
			create : location.context + '/product_type.do?action=save', read : location.context + '/product_type.do?action=list',
			update : location.context + '/product_type.do?action=update', destroy : location.context + '/product_type.do?action=del'
		},

		writer : Ext.create('WJM.FormWriter'),

		reader : {
			root : 'listData', totalProperty : 'total', messageProperty : 'msg'
		},

		listeners : {
			exception : function(proxy, response, operation) {
				switch (operation.action) {
				case "create":
				case "update":
					Ext.MessageBox.alert('提示', '保存失败，请稍后重试');
					break;
				case "destroy":
					Ext.MessageBox.alert('提示', '删除失败，请稍后重试');
					break;
				default:
					break;
				}
			}
		}
	}
});
Ext.define('WJM.model.ProductCategoryAllStore', {
	extend : 'Ext.data.Store',
	autoLoad : true,
	autoSync : true,
	model : 'WJM.model.TProductCategory',
	storeId : 'ProductCategoryAllStore',
	proxy : {
		batchActions : true,
		type : 'ajax',
		api : {
			create : location.context + '/product_type.do?action=save', read : location.context + '/product_type.do?action=listall',
			update : location.context + '/product_type.do?action=update', destroy : location.context + '/product_type.do?action=del'
		},

		writer : Ext.create('WJM.FormWriter'),

		reader : {
			root : 'listData', totalProperty : 'total', messageProperty : 'msg'
		},

		actionMethods : {
			create : "POST", read : "POST", update : "POST", destroy : "POST"
		},

		listeners : {
			exception : function(proxy, response, operation) {
				switch (operation.action) {
				case "create":
				case "update":
					Ext.MessageBox.alert('提示', '保存失败，请稍后重试');
					break;
				case "destroy":
					Ext.MessageBox.alert('提示', '删除失败，请稍后重试');
					break;
				default:
					break;
				}
			}
		}
	}
});
Ext.create('WJM.model.ProductCategoryBaseStore', {

});
Ext.create('WJM.model.ProductCategoryAllStore', {

});
Ext.define('WJM.model.TProductVendor', {
	extend : 'Ext.data.Model', idProperty : 'id',

	fields : [ {
		name : 'id'
	}, {
		name : 'product_id'
	}, {
		name : 'vendor_id'
	}, {
		name : 'product_name'
	}, {
		name : 'vendor_name'
	}, {
		name : 'price'
	}, {
		name : 'useDefault'
	}, {
		name : 'useDefaultBoolean'
	} ],

	proxy : {
		batchActions : true, pageParam : 'currpage', limitParam : 'pagesize', type : 'ajax', api : {
			create : '', read : '', update : '', destroy : location.context + '/productVendor.do?action=del'
		},

		writer : Ext.create('WJM.FormWriter'),

		reader : {
			root : 'listData', totalProperty : 'total', messageProperty : 'msg'
		},

		actionMethods : {
			create : "POST", read : "POST", update : "POST", destroy : "POST"
		},

		listeners : {
			exception : function(proxy, response, operation) {
				switch (operation.action) {
				case "create":
				case "update":
					Ext.MessageBox.alert('提示', '保存失败，请稍后重试');
					break;
				case "destroy":
					Ext.MessageBox.alert('提示', '删除失败，请稍后重试');
					break;
				default:
					break;
				}
			}
		}
	}
});

Ext.define('WJM.model.ProductVendorBaseStore', {
	extend : 'Ext.data.Store', autoLoad : false, autoSync : false, model : 'WJM.model.TProductVendor', storeId : 'ProductVendorStore',
	proxy : {
		batchActions : true, pageParam : 'currpage', limitParam : 'pagesize', type : 'ajax', api : {
			create : '', read : location.context + '/productVendor.do?action=list', update : '', destroy : ''
		},

		writer : Ext.create('WJM.FormWriter'),

		reader : {
			root : 'listData', totalProperty : 'total', messageProperty : 'msg'
		},

		actionMethods : {
			create : "POST", read : "POST", update : "POST", destroy : "POST"
		},

		listeners : {
			exception : function(proxy, response, operation) {
				switch (operation.action) {
				case "create":
				case "update":
					Ext.MessageBox.alert('提示', '保存失败，请稍后重试');
					break;
				case "destroy":
					Ext.MessageBox.alert('提示', '删除失败，请稍后重试');
					break;
				default:
					break;
				}
			}
		}
	}
});

Ext.create('WJM.model.ProductVendorBaseStore', {

});
Ext.define('WJM.model.TPurchase', {
	extend : 'Ext.data.Model', idProperty : 'id',

	fields : [ {
		name : 'id', type : 'float'
	}, {
		name : 'if_stock'// 发货状态
	}, {
		name : 'if_stockStr', convert : function(v, record) {
			if (record.data.if_stock == 0) {
				return 'Non Received';
			} else if (record.data.if_stock == 1) {
				return 'Received';
			}
		}
	}, {
		name : 'oper_id'
	}, {
		name : 'oper_name'
	}, {
		name : 'oper_time'
	}, {
		name : 'cash_oper_id'
	}, {
		name : 'cash_oper_code'
	}, {
		name : 'cash_oper_name'
	}, {
		name : 'cash_time'
	}, {
		name : 'cash_station'
	}, {
		name : 'all_purchase_price'
	}, {
		name : 'all_paid_price'
	}, {
		name : 'purchase_bill_code'
	}, {
		name : 'provider_id'
	}, {
		name : 'provider_name'
	}, {
		name : 'if_stock'
	}, {
		name : 'po_number'
	}, {
		name : 'order_pic'
	}, {
		name : 'invoice_code'
	}, {
		name : 'invoice_pic'
	}, {
		name : 'paid'// 付款状态
	}, {
		name : 'paidStr', convert : function(v, record) {
			if (record.data.paid == 0) {
				return 'Non Paid';
			} else if (record.data.paid == 1) {
				return 'Paid';
			}
		}
	}, {
		name : 'remark'
	}, {
		name : 'remark2'
	}, {
		name : 'actual_received'
	}, {
		name : 'receiver'
	}, {
		name : 'balance', convert : function(v, record) {
			return record.data.all_paid_price - record.data.all_purchase_price;
		}
	}, {
		name : 'actual_received_amount'
	} ],

	hasMany : {
		model : 'WJM.model.TPurchaseProduct', name : 'products'
	},

	canDelete : function() {
		return !(this.get('if_stock') == 1 || this.get('paid') == 1 || (!!this.get('invoice_code') && this.get('invoice_code') != ''));
	},

	canEdit : function() {
		return !(this.get('if_stock') == 1 || this.get('paid') == 1 || (!!this.get('invoice_code') && this.get('invoice_code') != ''));
	}
});

Ext.define('WJM.model.PurchaseStore', {
	extend : 'Ext.data.Store',
	autoLoad : false,
	autoSync : true,
	model : 'WJM.model.TPurchase',
	pageSize : 25,
	storeId : 'PurchaseStore',
	proxy : {
		batchActions : true,
		type : 'ajax',
		pageParam : 'currpage',
		limitParam : 'pagesize',
		api : {
			create : location.context + '/purchase_order.do?action=save', read : location.context + '/purchase_order.do?action=list',
			update : location.context + '/purchase_order.do?action=receivePurchase', destroy : location.context + '/purchase_order.do?action=del'
		},

		writer : Ext.create('WJM.FormWriter'),

		actionMethods : {
			create : "POST", read : "POST", update : "POST", destroy : "POST"
		},

		reader : {
			root : 'listData', totalProperty : 'total', messageProperty : 'msg'
		},

		listeners : {
			exception : function(proxy, response, operation) {
				Ext.MessageBox.show({
					title : '操作失败', msg : operation.getError() || '操作失败', icon : Ext.MessageBox.ERROR, buttons : Ext.Msg.OK
				});
			}
		}
	}
});
Ext.create('WJM.model.PurchaseStore', {});
Ext.create('WJM.model.PurchaseStore', {
	storeId : 'PurchaseMyStore'
});
Ext.create('WJM.model.PurchaseStore', {
	pageSize : 10, storeId : 'PurchaseVendorCashStore'
});
Ext.create('Ext.data.Store', {
	fields : [ 'value', 'name' ], storeId : 'PurchasePaidStateStore', data : [ {
		"value" : "-1", "name" : "All"
	}, {
		"value" : "0", "name" : "Non Paid"
	}, {
		"value" : "1", "name" : "Paid"
	} ]
});

Ext.create('Ext.data.Store', {
	fields : [ 'value', 'name' ], storeId : 'PurchaseStockStateStore', data : [ {
		"value" : "-1", "name" : "All"
	}, {
		"value" : "0", "name" : "Non Received"
	}, {
		"value" : "1", "name" : "Received"
	} ]
});

Ext.create('Ext.data.Store', {
	fields : [ 'value', 'name' ], storeId : 'PurchaseCacheMethodStore', data : [ {
		"value" : "Cash", "name" : "Cash/现金"
	}, {
		"value" : "Check", "name" : "Check/支票"
	}, {
		"value" : "Account Balance", "name" : "Account Balance/账户余额"
	} ]
});Ext.define('WJM.model.TPurchaseCashHistory', {
	extend : 'Ext.data.Model', idProperty : 'id',

	fields : [ {
		name : 'id', type : 'float'
	}, {
		name : 'invoice_id'
	}, {
		name : 'amout'
	}, {
		name : 'payDate'
	}, {
		name : 'payment'
	}, {
		name : 'payDateForDB', convert : function(v, record) {
			return Ext.Date.format(new Date(v), 'Y-m-d');
		}
	}, {
		name : 'remark'
	} ]
});

Ext.create('Ext.data.Store', {
	autoLoad : false,
	autoSync : false,
	model : 'WJM.model.TPurchaseCashHistory',
	pageSize : 200,
	storeId : 'PurchaseCashHistoryStore',
	proxy : {
		batchActions : true,
		type : 'ajax',
		pageParam : 'currpage',
		limitParam : 'pagesize',
		api : {
			create : location.context + '/invoice.do?action=', read : location.context + '/invoice.do?action=detail',
			update : location.context + '/invoice.do?action=', destroy : location.context + '/invoice.do?action='
		},

		writer : Ext.create('WJM.FormWriter'),

		actionMethods : {
			create : "POST", read : "POST", update : "POST", destroy : "POST"
		},

		reader : {
			root : 'listData', totalProperty : 'total', messageProperty : 'msg'
		},

		listeners : {
			exception : function(proxy, response, operation) {
				Ext.MessageBox.show({
					title : '操作失败', msg : operation.getError() || '操作失败', icon : Ext.MessageBox.ERROR, buttons : Ext.Msg.OK
				});
			}
		}
	}
});
Ext.define('WJM.model.TPurchaseProduct', {
	extend : 'Ext.data.Model', idProperty : 'id',

	fields : [ {
		name : 'id', type : 'float'
	}, {
		name : 'purchase_id'
	}, {
		name : 'product_id'
	}, {
		name : 'product_code'
	}, {
		name : 'product_name'
	}, {
		name : 'product_price'
	}, {
		name : 'product_num'
	}, {
		name : 'purchase_time'
	}, {
		name : 'provider_id'
	}, {
		name : 'provider_name'
	}, {
		name : 'remark'
	}, {
		name : 'if_stock'
	}, {
		name : 'actual_received'
	}, {
		name : 'receiver'
	}, {
		name : 'receive_num'
	}, {
		name : 'sub_total', convert : function(v, record) {
			return record.data.product_price * record.data.product_num;
		}
	} ]
});

Ext.define('WJM.model.PurchaseProductStore', {
	extend : 'Ext.data.Store', autoLoad : false, autoSync : false, model : 'WJM.model.TPurchaseProduct', pageSize : 25,
	storeId : 'PurchaseProductStore', proxy : {
		batchActions : true, type : 'ajax', pageParam : 'currpage', limitParam : 'pagesize',

		api : {
			create : '', read : location.context + '/purchase_product.do?action=list', update : '', destroy : ''
		},

		writer : Ext.create('WJM.FormWriter'),

		actionMethods : {
			create : "POST", read : "POST", update : "POST", destroy : "POST"
		},

		reader : {
			root : 'listData', totalProperty : 'total', messageProperty : 'msg'
		},

		listeners : {
			exception : function(proxy, response, operation) {
				Ext.MessageBox.show({
					title : '操作失败', msg : operation.getError() || '操作失败', icon : Ext.MessageBox.ERROR, buttons : Ext.Msg.OK
				});
			}
		}
	}
});

Ext.create('WJM.model.PurchaseProductStore', {});

Ext.create('WJM.model.PurchaseProductStore', {
	storeId : 'PurchaseProductMyStore'
});

Ext.create('WJM.model.PurchaseProductStore', {
	storeId : 'PurchaseProductVendorCashStore'
});Ext.define('WJM.model.TSale', {
	extend : 'Ext.data.Model', idProperty : 'id',

	fields : [ {
		name : 'id', type : 'float'
	}, {
		name : 'oper_id'
	}, {
		name : 'sale_bill_code'
	}, {
		name : 'if_cashed'
	}, {
		name : 'if_cashedStr', convert : function(v, record) {
			if (record.data.if_cashed == 0) {
				return 'Processing(Non pay)';
			} else if (record.data.if_cashed == 1) {
				return 'Paid';
			} else if (record.data.if_cashed == 2) {
				return 'RMA';
			}else if (record.data.if_cashed == 3) {
				return 'VOID/废除';
			}
		}
	}, {
		name : 'oper_code'
	}, {
		name : 'oper_name'
	}, {
		name : 'oper_time'
	}, {
		name : 'cash_oper_id'
	}, {
		name : 'cash_oper_code'
	}, {
		name : 'cash_oper_name'
	}, {
		name : 'cash_time'
	}, {
		name : 'cash_station'
	}, {
		name : 'rma_id'
	}, {
		name : 'rma_time'
	}, {
		name : 'rma_code'
	}, {
		name : 'rma_name'
	}, {
		name : 'tax'
	}, {
		name : 'payment'
	}, {
		name : 'all_price'
	}, {
		name : 'sub_total'
	}, {
		name : 'discount'
	}, {
		name : 'discountpercent'
	}, {
		name : 'buyer_id'
	}, {
		name : 'buyer_type'
	}, {
		name : 'buyer_code'
	}, {
		name : 'buyer_name'
	}, {
		name : 'buyer_address'
	}, {
		name : 'buyer_state'
	}, {
		name : 'buyer_city'
	}, {
		name : 'buyer_mobile'
	}, {
		name : 'buyer_postCode'
	}, {
		name : 'confirm_code'
	}, {
		name : 'invoice'
	}, {
		name : 'remark'
	}, {
		name : 'paid_price'
	}, {
		name : 'send_type'
	}, {
		name : 'send_time'
	}, {
		name : 'send_operid'
	}, {
		name : 'send_opername'
	}, {
		name : 'balance', convert : function(v, record) {
			return record.data.paid_price - record.data.all_price;
		}
	}, {
		name : 'company_name'
	}, {
		name : 'company_address'
	}, {
		name : 'company_fax'
	}, {
		name : 'company_tel'
	}, {
		name : 'company_name_pic_logo'
	}, {
		name : 'company_logo_pic_logo'
	}, {
		name : 'invoiceTax'
	}  ],

	hasMany : {
		model : 'WJM.model.TSaleProduct', name : 'products'
	},

	canDelete : function() {
		if (this.get('if_cashed') == 0 || WJM.Config.user.userName == 'admin') {
			return true;
		} else {
			return false;
		}
	},
	
	canReject : function(){
		if (this.get('if_cashed') == 0) {
			return true;
		} else {
			return false;
		}
	},

	canEdit : function() {
		if (this.get('if_cashed') == 0 || WJM.Config.user.userName == 'admin') {
			return true;
		} else {
			return false;
		}
	},

	isRma : function() {
		if (this.get('if_cashed') == 2) {
			return true;
		} else {
			return false;
		}
	}
});

Ext.define('WJM.model.SaleStore', {
	extend : 'Ext.data.Store',
	autoLoad : false,
	autoSync : true,
	model : 'WJM.model.TSale',
	pageSize : 25,
	storeId : 'SaleStore',
	proxy : {
		batchActions : true,
		type : 'ajax',
		pageParam : 'currpage',
		limitParam : 'pagesize',
		extraParams : {
			type : 0
		},
		api : {
			create : location.context + '/sale.do?action=save', read : location.context + '/sale.do?action=list',
			update : location.context + '/sale.do?action=update', destroy : location.context + '/sale.do?action=del'
		},

		writer : Ext.create('WJM.FormWriter'),

		actionMethods : {
			create : "POST", read : "POST", update : "POST", destroy : "POST"
		},

		reader : {
			root : 'listData', totalProperty : 'total', messageProperty : 'msg'
		},

		listeners : {
			exception : function(proxy, response, operation) {
				Ext.MessageBox.show({
					title : '操作失败', msg : operation.getError() || '操作失败', icon : Ext.MessageBox.ERROR, buttons : Ext.Msg.OK
				});
			}
		}
	}
});

Ext.create('WJM.model.SaleStore', {});
Ext.create('WJM.model.SaleStore', {
	storeId : 'SaleRmaStore'
});

Ext.create('WJM.model.SaleStore', {
	storeId : 'SaleMyStore'
});

Ext.create('WJM.model.SaleStore', {
	storeId : 'SaleCustomerCashStore'
});

Ext.create('WJM.model.SaleStore', {
	storeId : 'SaleMyQuoteStore',
	proxy : {
		batchActions : true,
		type : 'ajax',
		pageParam : 'currpage',
		limitParam : 'pagesize',
		extraParams : {
			type : 1
		},
		api : {
			create : location.context + '/sale.do?action=save', read : location.context + '/sale.do?action=list',
			update : location.context + '/sale.do?action=update', destroy : location.context + '/sale.do?action=del'
		},

		writer : Ext.create('WJM.FormWriter'),

		actionMethods : {
			create : "POST", read : "POST", update : "POST", destroy : "POST"
		},

		reader : {
			root : 'listData', totalProperty : 'total', messageProperty : 'msg'
		},

		listeners : {
			exception : function(proxy, response, operation) {
				Ext.MessageBox.show({
					title : '操作失败', msg : operation.getError() || '操作失败', icon : Ext.MessageBox.ERROR, buttons : Ext.Msg.OK
				});
			}
		}
	}
});

Ext.create('Ext.data.Store', {
	fields : [ 'value', 'name' ], storeId : 'SaleCashStateStore', data : [ {
		"value" : "-1", "name" : "All"
	}, {
		"value" : "0", "name" : "Processing(Non pay)"
	}, {
		"value" : "1", "name" : "Paid"
	}, {
		"value" : "2", "name" : "RMA"
	}, {
		"value" : "3", "name" : "VOID/废除"
	}  ]
});

Ext.create('Ext.data.Store', {
	fields : [ 'value', 'name' ], storeId : 'SalePaymentMethodStore', data : [ {
		"value" : "Cash", "name" : "Cash/现金"
	}, {
		"value" : "Credit Card", "name" : "Credit Card/信用卡"
	}, {
		"value" : "Credit Account", "name" : "Credit Account/会员"
	} ]
});

Ext.create('Ext.data.Store', {
	fields : [ 'value', 'name' ], storeId : 'SaleCacheMethodStore', data : [ {
		"value" : "Cash", "name" : "Cash/现金"
	}, {
		"value" : "Check", "name" : "Check/支票"
	}, {
		"value" : "Deposit", "name" : "Deposit/预付款"
	} , {
		"value" : "Credit", "name" : "Credit/信用账户"
	}]
});

Ext.create('Ext.data.Store', {
	fields : [ 'value', 'name' ], storeId : 'SaleSendMethodStore', data : [ {
		"value" : "送货", "name" : "送货"
	}, {
		"value" : "邮寄", "name" : "邮寄"
	}, {
		"value" : "自取", "name" : "自取"
	} ]
});
Ext.define('WJM.model.TSaleCashHistory', {
	extend : 'Ext.data.Model', idProperty : 'id',

	fields : [ {
		name : 'id', type : 'float'
	}, {
		name : 'oper_id'
	}, {
		name : 'buyer_id'
	}, {
		name : 'cash_time'
	}, {
		name : 'amount'
	}, {
		name : 'sale_id'
	}, {
		name : 'sale_bill_code'
	}, {
		name : 'oper_name'
	}, {
		name : 'buyer_name'
	}, {
		name : 'remark'
	}, {
		name : 'payment'
	}, {
		name : 'payDate', convert : function(v, record) {
			return Ext.Date.format(new Date(record.data.cash_time), 'Y-m-d');
		}
	} ]
});

Ext.create('Ext.data.Store', {
	autoLoad : false,
	autoSync : false,
	model : 'WJM.model.TSaleCashHistory',
	pageSize : 200,
	storeId : 'SaleCashHistoryStore',
	proxy : {
		batchActions : true,
		type : 'ajax',
		pageParam : 'currpage',
		limitParam : 'pagesize',
		api : {
			create : location.context + '/invoice.do?action=', read : location.context + '/sale.do?action=listSaleCash',
			update : location.context + '/invoice.do?action=', destroy : location.context + '/invoice.do?action='
		},

		writer : Ext.create('WJM.FormWriter'),

		actionMethods : {
			create : "POST", read : "POST", update : "POST", destroy : "POST"
		},

		reader : {
			root : 'listData', totalProperty : 'total', messageProperty : 'msg'
		},

		listeners : {
			exception : function(proxy, response, operation) {
				Ext.MessageBox.show({
					title : '操作失败', msg : operation.getError() || '操作失败', icon : Ext.MessageBox.ERROR, buttons : Ext.Msg.OK
				});
			}
		}
	}
});
Ext.define('WJM.model.TSaleProduct', {
	extend : 'Ext.data.Model', idProperty : 'id',

	fields : [ {
		name : 'id', type : 'float'
	}, {
		name : 'sale_id'
	}, {
		name : 'product_id'//TProduct.id
	}, {
		name : 'productid'//TProduct.product_id
	}, {
		name : 'product_code'
	}, {
		name : 'code', convert : function(v, record) {
			return record.data.product_code;
		}
	}, {
		name : 'product_name'
	}, {
		name : 'product_price'
	}, {
		name : 'agio'
	}, {
		name : 'agio_price'
	}, {
		name : 'product_num'
	}, {
		name : 'sale_time'
	}, {
		name : 'rma_id'
	}, {
		name : 'rma_time'
	}, {
		name : 'rma_code'
	}, {
		name : 'rma_num'
	}, {
		name : 'if_rma'
	}, {
		name : 'if_back_order'
	}, {
		name : 'back_order_id'
	}, {
		name : 'back_order_time'
	}, {
		name : 'back_order_code'
	}, {
		name : 'credit_num'
	}, {
		name : 'damage_num'
	}, {
		name : 'return_credit_num'
	}, {
		name : 'return_damage_num'
	}, {
		name : 'sub_total', convert : function(v, record) {
			return record.data.product_price * record.data.product_num;
		}
	}, {
		name : 'sub_total2', convert : function(v, record) {
			return record.data.agio_price * record.data.product_num;
		}
	}  
	
	]
});

Ext.define('WJM.model.SaleProductStore', {
	extend : 'Ext.data.Store', autoLoad : false, autoSync : false, model : 'WJM.model.TSaleProduct', pageSize : 25,
	storeId : 'SaleProductStore', proxy : {
		batchActions : true, type : 'ajax', pageParam : 'currpage', limitParam : 'pagesize',

		api : {
			create : '', read : location.context + '/sale_product.do?action=list', update : '', destroy : ''
		},

		writer : Ext.create('WJM.FormWriter'),

		actionMethods : {
			create : "POST", read : "POST", update : "POST", destroy : "POST"
		},

		reader : {
			root : 'listData', totalProperty : 'total', messageProperty : 'msg'
		},

		listeners : {
			exception : function(proxy, response, operation) {
				Ext.MessageBox.show({
					title : '操作失败', msg : operation.getError() || '操作失败', icon : Ext.MessageBox.ERROR, buttons : Ext.Msg.OK
				});
			}
		}
	}
});
Ext.create('WJM.model.SaleProductStore', {});

Ext.create('WJM.model.SaleProductStore', {
	storeId : 'SaleProductRmaStore'
});

Ext.create('WJM.model.SaleProductStore', {
	storeId : 'SaleProductMyStore'
});

Ext.create('WJM.model.SaleProductStore', {
	storeId : 'SaleQuoteProductMyStore'
});Ext.define('WJM.model.TSaleTop', {
  extend : 'Ext.data.Model', idProperty : 'product_name',

  fields : [ {
	name : 'product_name'
  }, {
	name : 'all_price'
  }, {
	name : 'sale_times'
  } ]

});

Ext.create('Ext.data.Store', {
  autoLoad : false, autoSync : true, model : 'WJM.model.TSaleTop', storeId : 'SaleTopDayStore', proxy : {
	batchActions : true, type : 'ajax', api : {
	  create : '', read : location.context + '/sale.do?action=day_stat', update : '', destroy : ''
	},

	writer : Ext.create('WJM.FormWriter'),

	actionMethods : {
	  create : "POST", read : "POST", update : "POST", destroy : "POST"
	},

	reader : {
	  root : 'listData', totalProperty : 'total', messageProperty : 'msg'
	},

	listeners : {
	  exception : function(proxy, response, operation) {
		Ext.MessageBox.show({
		  title : '操作失败', msg : operation.getError() || '操作失败', icon : Ext.MessageBox.ERROR, buttons : Ext.Msg.OK
		});
	  }
	}
  }
});


Ext.create('Ext.data.Store', {
  autoLoad : false, autoSync : true, model : 'WJM.model.TSaleTop', storeId : 'SaleTopMonthStore', proxy : {
	batchActions : true, type : 'ajax', api : {
	  create : '', read : location.context + '/sale.do?action=month_stat', update : '', destroy : ''
	},

	writer : Ext.create('WJM.FormWriter'),

	actionMethods : {
	  create : "POST", read : "POST", update : "POST", destroy : "POST"
	},

	reader : {
	  root : 'listData', totalProperty : 'total', messageProperty : 'msg'
	},

	listeners : {
	  exception : function(proxy, response, operation) {
		Ext.MessageBox.show({
		  title : '操作失败', msg : operation.getError() || '操作失败', icon : Ext.MessageBox.ERROR, buttons : Ext.Msg.OK
		});
	  }
	}
  }
});

Ext.create('Ext.data.Store', {
  autoLoad : false, autoSync : true, model : 'WJM.model.TSaleTop', storeId : 'SaleTopBetweenStore', proxy : {
	batchActions : true, type : 'ajax', api : {
	  create : '', read : location.context + '/sale.do?action=between_stat', update : '', destroy : ''
	},

	writer : Ext.create('WJM.FormWriter'),

	actionMethods : {
	  create : "POST", read : "POST", update : "POST", destroy : "POST"
	},

	reader : {
	  root : 'listData', totalProperty : 'total', messageProperty : 'msg'
	},

	listeners : {
	  exception : function(proxy, response, operation) {
		Ext.MessageBox.show({
		  title : '操作失败', msg : operation.getError() || '操作失败', icon : Ext.MessageBox.ERROR, buttons : Ext.Msg.OK
		});
	  }
	}
  }
});Ext.define('WJM.model.TStock', {
	extend : 'Ext.data.Model', idProperty : 'id',

	fields : [ {
		name : 'id', type : 'float'
	}, {
		name : 'stock_bill_code'
	}, {
		name : 'oper_id'
	} , {
		name : 'oper_name'
	} , {
		name : 'oper_time'
	} , {
		name : 'all_stock_price'
	} , {
		name : 'provider_id'
	} , {
		name : 'provider_name'
	}  ],

	hasMany : {
		model : 'WJM.stock.TStockProduct', name : 'products'
	}
});

Ext.create('Ext.data.Store', {
	autoLoad : false,
	autoSync : true,
	model : 'WJM.model.TStock',
	pageSize : 25,
	storeId : 'StockStore',
	proxy : {
		batchActions : true,
		type : 'ajax',
		pageParam : 'currpage',
		limitParam : 'pagesize',
		api : {
			create : location.context + '/stock.do?action=save', read : location.context + '/stock.do?action=list',
			update : location.context + '/stock.do?action=update', destroy : location.context + '/stock.do?action=del'
		},

		writer : Ext.create('WJM.FormWriter'),

		actionMethods : {
			create : "POST", read : "POST", update : "POST", destroy : "POST"
		},
		
		reader : {
			root : 'listData', totalProperty : 'total', messageProperty : 'msg'
		},

		listeners : {
			exception : function(proxy, response, operation) {
				Ext.MessageBox.show({
					title : '操作失败', msg : operation.getError() || '操作失败', icon : Ext.MessageBox.ERROR, buttons : Ext.Msg.OK
				});
			}
		}
	}
});
Ext.define('WJM.model.TStockAndProduct', {
  extend : 'Ext.data.Model', idProperty : 'product_id', fields : [ {
	name : 'product_id'
  }, {
	name : 'product_type'
  }, {
	name : 'product_price'
  }, {
	name : 'product_name'
  }, {
	name : 'code'
  }, {
	name : 'stock_time', type : 'string'
  } ]
});

Ext.create('Ext.data.Store', {
  autoLoad : false, autoSync : true, model : 'WJM.model.TStockAndProduct', storeId : 'StockAndProductStore', proxy : {
	batchActions : true, type : 'ajax', pageParam : 'currpage', limitParam : 'pagesize',

	api : {
	  create : '', read : location.context + '/stock_and_product.do?action=query', update : '', destroy : ''
	},

	writer : Ext.create('WJM.FormWriter'),

	actionMethods : {
	  create : "POST", read : "POST", update : "POST", destroy : "POST"
	},

	reader : {
	  root : 'listData', totalProperty : 'total', messageProperty : 'msg'
	},

	listeners : {
	  exception : function(proxy, response, operation) {
		Ext.MessageBox.show({
		  title : '操作失败', msg : operation.getError() || '操作失败', icon : Ext.MessageBox.ERROR, buttons : Ext.Msg.OK
		});
	  }
	}
  }
});
Ext.define('WJM.model.TStockProduct', {
  extend : 'Ext.data.Model', idProperty : 'id',

  fields : [ {
	name : 'id', type : 'float'
  }, {
	name : 'stock_id'
  }, {
	name : 'product_id'
  }, {
	name : 'product_code'
  }, {
	name : 'product_name'
  }, {
	name : 'product_price'
  }, {
	name : 'product_num'
  }, {
	name : 'stock_time'
  }, {
	name : 'provider_id'
  }, {
	name : 'provider_name'
  } ]
});

Ext.create('Ext.data.Store', {
  autoLoad : false, autoSync : true, model : 'WJM.model.TStockProduct', pageSize : 25, storeId : 'StockProductStore', proxy : {
	batchActions : true, type : 'ajax', pageParam : 'currpage', limitParam : 'pagesize',

	api : {
	  create : '', read : location.context + '/stock_product.do?action=list', update : '', destroy : ''
	},

	writer : Ext.create('WJM.FormWriter'),

	actionMethods : {
	  create : "POST", read : "POST", update : "POST", destroy : "POST"
	},

	reader : {
	  root : 'listData', totalProperty : 'total', messageProperty : 'msg'
	},

	listeners : {
	  exception : function(proxy, response, operation) {
		Ext.MessageBox.show({
		  title : '操作失败', msg : operation.getError() || '操作失败', icon : Ext.MessageBox.ERROR, buttons : Ext.Msg.OK
		});
	  }
	}
  }
});
Ext.define('WJM.model.TVendor', {
	extend : 'Ext.data.Model', idProperty : 'id',

	fields : [ {
		name : 'id'
	}, {
		name : 'type'
	}, {
		name : 'code'
	}, {
		name : 'shortName'
	}, {
		name : 'allName'
	}, {
		name : 'address'
	}, {
		name : 'postCode'
	}, {
		name : 'tel1'
	}, {
		name : 'tel2'
	}, {
		name : 'tel3'
	}, {
		name : 'mobile'
	}, {
		name : 'FAX'
	}, {
		name : 'EMail'
	}, {
		name : 'http'
	}, {
		name : 'accounts'
	}, {
		name : 'taxCode'
	}, {
		name : 'linkMan'
	}, {
		name : 'companyType'
	}, {
		name : 'helpName'
	}, {
		name : 'recDate'
	}, {
		name : 'myMemo'
	}, {
		name : 'state'
	}, {
		name : 'city'
	}, {
		name : 'sreserve3'
	}, {
		name : 'freserve1'
	}, {
		name : 'freserve2'
	}, {
		name : 'freserve3'
	}, {
		name : 'balance'
	}, {
		name : 'invoice_total'
	}, {
		name : 'invoice_balance'
	}, {
		name : 'paid_total', convert : function(v, record) {
			return record.data.invoice_total - record.data.invoice_balance;
		}
	}, {
		name : 'acc_balance'
	} ],

	validations : [ {
		type : 'length', field : 'shortName', min : 1
	} ],

	proxy : {
		batchActions : true, type : 'ajax',

		url : location.context + '/power.do?action=get',

		reader : {
			root : 'listData', totalProperty : 'total', messageProperty : 'msg'
		},

		listeners : {
			exception : function(proxy, response, operation) {
				Ext.MessageBox.show({
					title : '操作失败', msg : operation.getError() || '操作失败', icon : Ext.MessageBox.ERROR, buttons : Ext.Msg.OK
				});
			}
		}
	}
});

Ext.define('WJM.model.VendorBaseStore', {
	extend : 'Ext.data.Store',
	autoLoad : false,
	autoSync : true,
	model : 'WJM.model.TVendor',
	pageSize : 25,
	storeId : 'VendorStore',
	proxy : {
		batchActions : true,
		type : 'ajax',
		pageParam : 'currpage',
		limitParam : 'pagesize',
		api : {
			create : location.context + '/provider.do?action=save', read : location.context + '/provider.do?action=list',
			update : location.context + '/provider.do?action=update', destroy : location.context + '/provider.do?action=del'
		},

		writer : Ext.create('WJM.FormWriter'),

		reader : {
			root : 'listData', totalProperty : 'total', messageProperty : 'msg'
		},

		actionMethods : {
			create : "POST", read : "POST", update : "POST", destroy : "POST"
		},

		listeners : {
			exception : function(proxy, response, operation) {
				switch (operation.action) {
				case "create":
				case "update":
					Ext.MessageBox.alert('提示', '保存失败，请稍后重试');
					break;
				case "destroy":
					Ext.MessageBox.alert('提示', '删除失败，请稍后重试');
					break;
				default:
					break;
				}
			}
		}
	}
});

Ext.create('WJM.model.VendorBaseStore', {
	storeId : 'VendorSearchStore'
});
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

});/**
 * 付款
 */
Ext.define('WJM.cash.CashierModel', {
	extend : 'Ext.ux.desktop.Module',

	requires : [ 'WJM.model.TSale', 'WJM.model.TSaleProduct' ],

	id : 'cash',

	init : function() {
		this.id = this.config.moduleId || 'cash';
		this.title = this.config.menuText || 'cashier/支付';
	},

	createWindow : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow(this.id);
		if (!win) {
			var grid = Ext.create('WJM.sale.SaleGrid', {
				title : 'sale', deleteAble : true, cashAble : true, reciveAble : true
			});
			var grid2 = Ext.create('WJM.purchase.PurchaseGrid', {
				title : 'purchase', deleteAble : true, cashAble : true
			});
			win = desktop.createWindow({
				id : this.id, title : this.title, width : 980, height : 600, iconCls : 'icon-grid', animCollapse : false, constrainHeader : true,
				layout : 'fit', items : {
					xtype : 'tabpanel', items : [ grid, grid2 ]
				}
			});
		}
		return win;
	}
});
/**
 * 付款表单
 */
Ext.define('WJM.cash.PurchaseCashForm', {
	extend : 'Ext.form.Panel',
	closeAction : 'destroy',
	record : null,
	bodyPadding : 10,

	initComponent : function() {
		var me = this;

		Ext.applyIf(me, {
			defaults : {
				xtype : 'textfield', anchor : '100%', labelWidth : 150
			},
			items : [
					{
						name : 'id', xtype : 'hiddenfield'
					},
					{
						name : 'invoice_code', xtype : 'hiddenfield'
					},
					{
						name : 'purchase_bill_code', fieldLabel : 'P.O. #/定单号', readOnly : true
					},
					{
						name : 'oper_name', fieldLabel : 'buyman/采购员', readOnly : true
					},
					{
						name : 'oper_time', fieldLabel : 'buy time/采购时间', readOnly : true
					},
					{
						name : 'code', fieldLabel : 'casher/收银员', value : window.user.userName, readOnly : true
					},
					{
						name : 'cash_time', fieldLabel : 'cash time/收银时间', value : Ext.Date.format(new Date(), 'Y-m-d H:i:s'), readOnly : true
					},
					{
						name : 'all_purchase_price', fieldLabel : 'total/合计', minValue : 0, xtype : 'adnumberfield', readOnly : true
					},
					{
						name : 'balance', fieldLabel : 'balance/余额', xtype : 'adnumberfield', readOnly : true
					},
					{
						name : 'paidAmount', fieldLabel : 'paid/金额', xtype : 'adnumberfield', listeners : {
							change : me.calculateBalance, scope : me
						}
					},
					{
						xtype : 'combobox', fieldLabel : 'Payment Method/支付方式', labelWidth : 170, name : 'paymentMethod', displayField : 'name',
						valueField : 'value', store : 'PurchaseCacheMethodStore', value : 'Cash', allowBlank : false
					}, {
						name : 'remark', fieldLabel : 'remark/备注', xtype : 'textareafield', allowBlank : true
					} ],

			dockedItems : [ {
				xtype : 'toolbar', dock : 'top', items : [ {
					xtype : 'button', iconCls : 'save', text : '确定付款', scope : this, handler : this.onSaveClick
				} ]
			} ]
		});
		me.callParent(arguments);
		if (this.record) {
			me.loadRecord(this.record);
			this.getForm().findField('paidAmount').setValue(-this.record.get('balance'));
			this.getForm().findField('cash_time').setValue(Ext.Date.format(new Date(), 'Y-m-d H:i:s'));
		}
		this.getForm().findField('paidAmount').focus();
	},

	/**
	 * 保存
	 */
	onSaveClick : function() {
		var form = this.getForm();
		var me = this;
		if (form.isValid()) {
			this.submit({
				url : 'invoice.do?action=payInvoice', success : function(form, action) {
					Ext.Msg.alert('提示', '保存成功');
					me.fireEvent('saveSuccess', me);
				}, failure : function(form, action) {
					Ext.Msg.alert('提示', action.result.msg || '保存失败，请稍候重试');
				}
			});
		}
	},
	/**
	 * 余额
	 */
	calculateBalance : function() {
		this.getForm().findField('balance').setValue(-this.record.get('balance') - this.getForm().findField('paidAmount').getValue());
	}
});/**
 * 付款表单
 */
Ext.define('WJM.cash.SaleCashForm', {
	extend : 'Ext.form.Panel',
	closeAction : 'destroy',
	record : null, bodyPadding : 10,

	initComponent : function() {
		var me = this;
		Ext.applyIf(me, {
			defaults : {
				xtype : 'textfield', anchor : '100%', labelWidth : 150
			}, items : [ {
				name : 'id', xtype : 'hiddenfield'
			}, {
				name : 'sale_bill_code', fieldLabel : 'receive #/销售单号', readOnly : true
			}, {
				name : 'oper_name', fieldLabel : 'saleman/销售员', readOnly : true
			}, {
				name : 'oper_time', fieldLabel : 'sale time/销售时间', readOnly : true
			}, {
				name : 'code', fieldLabel : 'casher/收银员', value : window.user.userName, readOnly : true
			}, {
				name : 'cash_time', fieldLabel : 'cash time/收银时间', value : Ext.Date.format(new Date(), 'Y-m-d H:i:s'), readOnly : true
			}, {
				name : 'all_price', fieldLabel : 'total/合计', minValue : 0, xtype : 'adnumberfield', readOnly : true
			}, {
				name : 'balance', fieldLabel : 'balance/余额', xtype : 'adnumberfield', readOnly : true
			}, {
				name : 'accept', fieldLabel : 'paid/金额', xtype : 'adnumberfield', listeners : {
					change : me.calculateBalance, scope : me
				}
			}, {
				name : 'remark', fieldLabel : 'remark/备注', xtype : 'textareafield', allowBlank : true
			} ],

			dockedItems : [ {
				xtype : 'toolbar', dock : 'top', items : [ {
					xtype : 'button', iconCls : 'save', text : '确定收款', scope : this, handler : this.onSaveClick
				} ]
			} ]
		});
		me.callParent(arguments);
		if (this.record) {
			me.loadRecord(this.record);
			this.getForm().findField('accept').setValue(-this.record.get('balance'));
			this.getForm().findField('cash_time').setValue(Ext.Date.format(new Date(), 'Y-m-d H:i:s'));
		}
		this.getForm().findField('accept').focus(true, true);
	},

	/**
	 * 保存
	 */
	onSaveClick : function() {
		var form = this.getForm();
		var me = this;
		if (form.isValid()) {
			this.submit({
				url : 'sale.do?action=cash_submit', success : function(form, action) {
					Ext.Msg.alert('提示', '保存成功');
					me.fireEvent('saveSuccess', me);
				}, failure : function(form, action) {
					Ext.Msg.alert('提示', action.result.msg || '保存失败，请稍候重试');
				}
			});
		}
	},
	/**
	 * 余额
	 */
	calculateBalance : function() {
		this.getForm().findField('balance').setValue(-this.record.get('balance') - this.getForm().findField('accept').getValue());
	}
});/**
 * 采购单付款组件
 */
Ext.define('WJM.cash.widget.PurchaseCashGrid', {
	extend : 'Ext.panel.Panel',
	requires : [ 'Ext.grid.Panel' ],
	layout : {
		type : 'border', padding : 5
	},
	defaults : {
		split : true
	},

	purchaseStore : 'PurchaseStore',

	cashStore : 'PurchaseCashHistoryStore',

	initComponent : function() {
		var _fileds = [
				{
					xtype : 'rownumberer'
				},
				{
					text : "P.O. #/定单号", dataIndex : 'purchase_bill_code', sortable : true
				},
				{
					text : "Work ID/操作员", dataIndex : 'oper_name', sortable : true
				},
				{
					text : "vendor name/供货商", dataIndex : 'provider_name', sortable : true
				},
				{
					text : "total/总计", dataIndex : 'all_purchase_price', sortable : true, xtype : 'numbercolumn', format : '$0.00'
				},
				{
					text : "actual received amount/完成货总额", dataIndex : 'actual_received_amount', sortable : true, xtype : 'numbercolumn',
					format : '$0.00'
				}, {
					text : "Invoice/账单", dataIndex : 'invoice_code', sortable : true
				}, {
					text : "P.O. balance/订单余额", dataIndex : 'balance', sortable : true, xtype : 'numbercolumn', format : '$0.00'
				}, {
					text : "received status/收货状态", dataIndex : 'if_stockStr', sortable : true
				}, {
					text : "payment status/付款状态", dataIndex : 'paidStr', sortable : true
				}, {
					text : "date/时间", dataIndex : 'oper_time', sortable : true
				} ];

		var _fileds2 = [ {
			xtype : 'rownumberer'
		}, {
			text : "amount/付款金额", dataIndex : 'amout', sortable : true
		}, {
			text : "date/时间", dataIndex : 'payDateForDB', sortable : true
		}, {
			text : "payment/支付方式", dataIndex : 'payment', sortable : true
		}, {
			text : "remark/备注", dataIndex : 'remark', sortable : true, width : 200
		} ];
		var defaultItems = [ {
			iconCls : 'search', text : '打印', scope : this, handler : this.onSalePrintClick
		} ];
		defaultItems.push({
			iconCls : 'edit', text : '添加账单', scope : this, handler : this.onAddInvoiceClick
		}, {
			iconCls : 'edit', text : '付款', scope : this, handler : this.onCashClick
		});
		this.editTopBar = Ext.create('Ext.toolbar.Toolbar', {
			items : defaultItems
		});

		Ext.apply(this, {
			autoScroll : true,
			dockedItems : [ this.editTopBar ],

			items : [
					{
						store : this.purchaseStore, split : true, disableSelection : false, loadMask : true, autoScroll : true, region : 'center',
						title : '采购单', xtype : 'gridpanel', columns : _fileds,

						viewConfig : {
							plugins : []
						},

						listeners : {
							selectionchange : function(selectionModel, selecteds, eOpts) {
								var recode = selectionModel.getSelection()[0];
								if (recode) {
									var store = Ext.data.StoreManager.lookup(this.cashStore);
									store.getProxy().setExtraParam('provider_id', recode.get('provider_id'));
									store.getProxy().setExtraParam('purchase_bill_code', recode.get('purchase_bill_code'));
									store.load();
								}
							}, scope : this
						},

						bbar : Ext.create('Ext.PagingToolbar', {
							store : this.purchaseStore, displayInfo : true, displayMsg : '显示采购单 {0} - {1} 总共 {2}', emptyMsg : "没有采购单数据"
						})
					},
					{
						store : this.cashStore, split : true, disableSelection : false, collapsible : true, split : true, loadMask : true,
						height : 150, autoScroll : true, region : 'south', multiSelect : true, title : '账单付款明细', xtype : 'gridpanel',
						columns : _fileds2, viewConfig : {
							plugins : []
						}, plugins : []
					} ]
		});
		this.callParent();
	},
	/**
	 * 付款
	 */
	onCashClick : function() {
		var selection = this.down('grid[title="采购单"]').getView().getSelectionModel().getSelection()[0];
		if (selection) {
			if (selection.get('paid') == 0) {
				if (selection.get('invoice_code') && selection.get('invoice_code') != '') {
					var des = myDesktopApp.getDesktop();
					var form = Ext.create('WJM.cash.PurchaseCashForm', {
						listeners : {
							saveSuccess : this.onSaveSuccess, scope : this
						}, record : selection
					});
					win = des.createWindow({
						title : "付款", iconCls : 'icon-grid', animCollapse : false, constrainHeader : true, layout : 'fit', items : [ form ]
					});
					win.show();
				} else {
					Ext.Msg.alert('提示', '请先为此订单添加账单');
				}
			} else {
				Ext.Msg.alert('提示', '此采购单已经付款');
			}
		} else {
			Ext.Msg.alert('提示', '请选择采购单');
		}
	},
	/**
	 * 添加账单
	 */
	onAddInvoiceClick : function() {
		var selection = this.down('grid[title="采购单"]').getView().getSelectionModel().getSelection()[0];
		if (selection) {
			if (!selection.get('invoice_code') || selection.get('invoice_code') == '') {
				var des = myDesktopApp.getDesktop();
				var form = Ext.create('WJM.purchase.PurchaseInvoiceForm', {
					listeners : {
						saveSuccess : this.onSaveSuccess, scope : this
					}, record : selection
				});
				win = des.createWindow({
					title : "添加账单", iconCls : 'icon-grid', animCollapse : false, constrainHeader : true, layout : 'fit', items : [ form ]
				});
				win.show();
			} else {
				Ext.Msg.alert('提示', '此订单已经添加了账单');
			}
		} else {
			Ext.Msg.alert('提示', '请选择采购单');
		}
	},
	/**
	 * 打印
	 */
	onSalePrintClick : function() {
		var selection = this.down('grid[title="采购单"]').getView().getSelectionModel().getSelection()[0];
		if (selection) {
			window.open(location.context + '/purchase_order.do?action=print_bill&id=' + selection.getId(), "_blank");
		} else {
			Ext.Msg.alert('提示', '请选择采购单');
		}
	},
	/**
	 * 保存成功回调
	 */
	onSaveSuccess : function(that) {
		var win = that.ownerCt;
		win.destroy();
		var store = Ext.data.StoreManager.lookup(this.purchaseStore);
		store.loadPage(1);
		this.show();
		this.fireEvent('saveSuccess');
	}
});/**
 * 销售单收款模块
 */
Ext.define('WJM.cash.widget.SaleCashGrid', {
	extend : 'Ext.panel.Panel',
	requires : [ 'Ext.grid.Panel', 'WJM.model.TSaleCashHistory' ],
	collapsedStatistics : false,
	layout : {
		type : 'border', padding : 5
	},
	defaults : {
		split : true
	},

	customer : null,

	saleStore : 'SaleStore',

	saleCashHistoryStore : 'SaleCashHistoryStore',

	initComponent : function() {
		var topbarbuttons = [ {
			iconCls : 'search', text : '打印订单', scope : this, handler : this.onSalePrintClick
		} ];

		topbarbuttons.push({
			iconCls : 'search', text : '打印出货单', scope : this, handler : this.onPackePrintClick
		});

		topbarbuttons.push(
		// {
		// iconCls : 'edit', text : '收款', scope : this, handler : this.onCashClick
		// }
		{
			iconCls : 'edit', text : '批量收款', scope : this, handler : this.onCashGridClick
		}, {
			text : '按住control键多选', xtype : 'label'
		});

		this.editTopBar = Ext.create('Ext.toolbar.Toolbar', {
			items : topbarbuttons
		});

		var _fileds = [ {
			xtype : 'rownumberer'
		}, {
			text : "receive #/销售单", dataIndex : 'sale_bill_code', sortable : true
		}, {
			text : "invoice #/invoice单号", dataIndex : 'invoice', sortable : true
		}, {
			text : "saleman/销售员", dataIndex : 'oper_name', sortable : true
		}, {
			text : "customer/客户", dataIndex : 'buyer_name', sortable : true
		}, {
			text : "total/合计", dataIndex : 'all_price', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "invoice balance/账单余额", dataIndex : 'balance', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "state/状态", dataIndex : 'if_cashedStr', sortable : true
		}, {
			text : "date/时间", dataIndex : 'oper_time', sortable : true
		}, {
			text : "tax/税", dataIndex : 'tax', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "payment/支付方式", dataIndex : 'payment', sortable : true
		}, {
			text : "sub total/小计", dataIndex : 'sub_total', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "discount/优惠", dataIndex : 'discount', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		} ];

		var _fileds2 = [ {
			xtype : 'rownumberer'
		}, {
			text : "amount/收款金额", dataIndex : 'amount', sortable : true
		}, {
			text : "date/时间", dataIndex : 'payDate', sortable : true
		}, {
			text : "payment/支付方式", dataIndex : 'payment', sortable : true
		}, {
			text : "remark/备注", dataIndex : 'remark', sortable : true, width : 200
		} ];

		Ext.apply(this, {
			autoScroll : true,
			dockedItems : [ this.editTopBar ],

			items : [
					{
						store : this.saleStore, split : true, disableSelection : false, loadMask : true, autoScroll : true, region : 'center',
						multiSelect : true, title : '订单', xtype : 'gridpanel', columns : _fileds,

						viewConfig : {
							plugins : []
						},

						listeners : {
							selectionchange : function(selectionModel, selecteds, eOpts) {
								var recode = selectionModel.getSelection()[0];
								if (recode) {
									var store = Ext.data.StoreManager.lookup(this.saleCashHistoryStore);
									store.getProxy().setExtraParam('id', recode.getId());
									store.load();
								}
							}, scope : this
						},

						bbar : Ext.create('Ext.PagingToolbar', {
							store : this.saleStore, displayInfo : true, displayMsg : '显示订单 {0} - {1} 总共 {2}', emptyMsg : "没有订单数据"
						})
					},
					{
						region : 'south', store : this.saleCashHistoryStore, split : true, disableSelection : false, collapsible : true, split : true,
						loadMask : true, height : 150, autoScroll : true, multiSelect : true, title : '收款明细', xtype : 'gridpanel', columns : _fileds2
					} ]
		});
		this.callParent();
	},

	/**
	 * 收款
	 */
	onCashClick : function() {
		var selection = this.down('grid[title="订单"]').getView().getSelectionModel().getSelection()[0];
		if (selection) {
			if (selection.get('if_cashed') == 0) {
				var des = myDesktopApp.getDesktop();
				var form = Ext.create('WJM.cash.SaleCashForm', {
					listeners : {
						saveSuccess : this.onSaveSuccess, scope : this
					}, record : selection
				});
				win = des.createWindow({
					title : "收款", iconCls : 'icon-grid', animCollapse : false, constrainHeader : true, layout : 'fit', items : [ form ]
				});
				win.show();
			} else {
				Ext.Msg.alert('提示', '此订单已经收款');
			}
		} else {
			Ext.Msg.alert('提示', '请选择订单');
		}
	},

	/**
	 * 批量收款
	 */
	onCashGridClick : function() {
		var selection = this.down('grid[title="订单"]').getView().getSelectionModel().getSelection();
		if (selection[0]) {
			var records = [];
			Ext.Array.each(selection, function(item) {
				if (item.get('if_cashed') == 0) {
					var tSaleCashHistory = Ext.create('WJM.model.TSale', item.getData());
					records.push(tSaleCashHistory);
				}
			});
			if (records.length > 0) {
				var des = myDesktopApp.getDesktop();
				var form = Ext.create('WJM.cash.widget.SaleCashGridForm', {
					listeners : {
						saveSuccess : this.onSaveSuccess, scope : this
					}, records : records, customer : this.customer
				});
				win = des.createWindow({
					title : "批量收款", iconCls : 'icon-grid', animCollapse : false, constrainHeader : true, layout : 'fit', items : [ form ]
				});
				win.show();
			} else {
				Ext.Msg.alert('提示', '没有未收款的订单！');
			}
		} else {
			Ext.Msg.alert('提示', '请选择订单');
		}
	},
	/**
	 * 保存成功回调
	 */
	onSaveSuccess : function(that) {
		var win = that.ownerCt;
		win.destroy();
		var store = Ext.data.StoreManager.lookup(this.saleStore);
		store.loadPage(1);
		this.show();
		this.fireEvent('saveSuccess');
	},

	/**
	 * 打印
	 */
	onSalePrintClick : function() {
		var selection = this.down('grid[title="订单"]').getView().getSelectionModel().getSelection()[0];
		if (selection) {
			window.open(location.context + '/sale.do?action=re_print&id=' + selection.getId(), "_blank");
		} else {
			Ext.Msg.alert('提示', '请选择订单');
		}
	},
	/**
	 * 打印
	 */
	onPackePrintClick : function() {
		var selection = this.down('grid[title="订单"]').getView().getSelectionModel().getSelection()[0];
		if (selection) {
			if (selection.get('if_cashed') == 0) {
				Ext.Msg.alert('提示', '此订单未完全收款，无法打印出货单');
			} else {
				window.open(location.context + '/sale.do?action=packing_print&id=' + selection.getId(), "_blank");
			}
		} else {
			Ext.Msg.alert('提示', '请选择订单');
		}
	},
	/**
	 * 设置客户
	 */
	setCustomer : function(recode) {
		this.customer = recode;
		var store = Ext.data.StoreManager.lookup(this.saleStore);
		store.getProxy().setExtraParam('buyer_id', recode.getId());
		store.load();
	}
});/**
 * 批量付款表单
 */
Ext.define('WJM.cash.widget.SaleCashGridForm', {
	extend : 'Ext.form.Panel',

	records : null,

	customer : null,

	bodyPadding : 10,
	
	closeAction : 'destroy',
	
	initComponent : function() {
		
		var me = this;
		var _fileds = [ {
			xtype : 'rownumberer'
		}, {
			dataIndex : 'sale_bill_code', text : 'receive #/销售单号'
		}, {
			dataIndex : 'oper_name', text : 'saleman/销售员'
		}, {
			dataIndex : 'cash_time', text : 'cash time/收银时间'
		}, {
			dataIndex : 'all_price', text : 'total/合计', minValue : 0, xtype : 'numbercolumn', format : '$0.00'
		}, {
			dataIndex : 'balance_old', text : 'invoice balance/订单余额', minValue : 0, xtype : 'numbercolumn', format : '$0.00'
		}, {
			dataIndex : 'balance', text : 'balance/余额', xtype : 'numbercolumn', format : '$0.00'
		}, {
			dataIndex : 'accept', text : 'paid/金额', xtype : 'numbercolumn', format : '$0.00', editor : {
				xtype : 'adnumberfield', allowBlank : false, minValue : 0
			}
		} ];
		me.allTotal = 0;
		Ext.Array.each(this.records, function(item) {
			item.set('paid_price_old', item.get('paid_price'));
			item.set('balance_old', item.get('balance'));
			me.allTotal += item.get('balance');
		});
		me.allTotal = -me.allTotal;
		this.recordStore = Ext.create('Ext.data.Store', {
			model : 'WJM.model.TSale'
		});

		this.recordStore.loadRecords(this.records);

		this.editor = Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit : 1, listeners : {
				edit : me.calculateTotal, scope : me
			}
		});

		Ext.applyIf(me, {
			defaults : {
				xtype : 'textfield', anchor : '100%', labelWidth : 150
			},
			items : [
					{
						xtype : 'container',
						layout : {
							columns : 2, type : 'table', tableAttrs : {
								style : {
									width : '100%'
								}
							}, tdAttrs : {
								style : {
									width : '50%'
								}
							}
						},
						items : [
								{
									name : 'totalbalance', fieldLabel : 'total invoice balance/总余额', xtype : 'adnumberfield', allowBlank : false,
									readOnly : true, value : this.allTotal
								},
								{
									name : 'allaccept', fieldLabel : 'paid/收款金额', xtype : 'adnumberfield', allowBlank : false, enableKeyEvents : true,
									minValue : 0, value : me.allTotal, listeners : {
										keyup : me.calculateBalance, scope : me
									}
								},
								{
									xtype : 'combobox', fieldLabel : 'Payment Method/支付方式', labelWidth : 170, name : 'payment', displayField : 'name',
									valueField : 'value', store : 'SaleCacheMethodStore', value : 'Cash', allowBlank : false, listeners : {
										select : me.onPayMentSelect, scope : me
									}
								},
								{
									name : 'allbalance', fieldLabel : 'balance/总余额', xtype : 'adnumberfield', allowBlank : false, readOnly : true
								},
								{
									width : '100%', rows : 2, name : 'remark', fieldLabel : 'remark/备注', xtype : 'textareafield', allowBlank : true,
									labelWidth : 110, anchor : '100%'
								} ]
					},
					{
						xtype : 'container', layout : {
							columns : 1, type : 'table', tableAttrs : {
								style : {
									width : '100%'
								}
							}, tdAttrs : {
								style : {
									width : '100%'
								}
							}
						}, items : []
					},

					{
						store : this.recordStore, disableSelection : false, loadMask : true, autoScroll : true, title : '收款订单列表', xtype : 'gridpanel',
						columns : _fileds, plugins : [ this.editor ]
					} ],

			dockedItems : [ {
				xtype : 'toolbar', dock : 'top', items : [ {
					xtype : 'button', iconCls : 'save', text : '确定收款', scope : this, handler : this.onSaveClick
				} ]
			} ]
		});
		me.callParent(arguments);
		me.calculateBalance();
	},

	/**
	 * 保存
	 */
	onSaveClick : function() {
		var form = this.getForm();
		var me = this;
		var datas = this.recordStore.data;
		var redod = [];
		datas.each(function(item) {
			redod.push(item.data);
		});
		if (form.isValid()) {

			this.submit({
				url : 'sale.do?action=cashs_submit', params : {
					saleCashs : Ext.JSON.encode(redod)
				}, success : function(form, action) {
					Ext.Msg.alert('提示', '保存成功');
					me.fireEvent('saveSuccess', me);
				}, failure : function(form, action) {
					Ext.Msg.alert('提示', action.result.msg || '保存失败，请稍候重试');
				}
			});
		}
	},
	/**
	 * 根据付款项重新计算余额
	 */
	calculateTotal : function() {
		var datas = this.recordStore.data;
		var total = 0;
		datas.each(function(item) {
			item.set('paid_price', (item.get('paid_price_old') + item.get('accept')));
			item.set('balance', 0);
			total += item.get('accept');
		});
		this.getForm().findField('allaccept').setValue(total);
		this.getForm().findField('allbalance').setValue(total - this.allTotal);
	},
	/**
	 * 
	 */
	calculateBalance : function() {
		var total = this.getForm().findField('allaccept').getValue();
		this.getForm().findField('allbalance').setValue(total - this.allTotal);
		var datas = this.recordStore.data;
		datas.each(function(item) {
			if (total > -item.get('balance_old')) {
				item.set('accept', -item.get('balance_old'));
				item.set('paid_price', (item.get('paid_price_old') + item.get('accept')));
				item.set('balance', 0);
				total -= item.get('accept');
			} else {
				item.set('accept', total);
				item.set('paid_price', (item.get('paid_price_old') + item.get('accept')));
				item.set('balance', 0);
				total -= item.get('accept');
			}
		});
	},
	/**
	 * 付款方式选择
	 * 
	 * @param combo
	 * @param records
	 * @param eOpts
	 */
	onPayMentSelect : function(combo, records, eOpts) {
		if (combo.getValue() == 'Deposit') {
			this.getForm().findField('allaccept').setValue(this.customer.get('leav_money'));
			this.calculateBalance();
		}
	}
});/**
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
				xtype : 'combobox', fieldLabel : '/Customer type/客户类型', labelWidth : 150, name : 'acc_type', displayField : 'name',
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

});/**
 * 客户列表
 */
Ext.define('WJM.customer.CustomerGrid', {
	extend : 'Ext.panel.Panel',
	requires : [ 'Ext.grid.Panel', 'WJM.model.TVendor', 'Ext.grid.plugin.RowEditing' ],
	/**
	 * 是否可以编辑
	 */
	editAble : false,
	/**
	 * 是否可以付款
	 */
	cashAble : false,
	height : 487,
	width : 569,
	layout : {
		type : 'border', padding : 5
	},
	defaults : {
		split : true
	},

	initComponent : function() {
		this.editTopBar = Ext.create('Ext.toolbar.Toolbar', {
			items : [ {
				iconCls : 'search', text : '搜索', scope : this, handler : this.onSearchClick
			}, {
				iconCls : 'add', text : '添加', scope : this, handler : this.onAddClick
			}, {
				iconCls : 'edit', text : '编辑', scope : this, handler : this.onEditClick
			}, {
				iconCls : 'remove', text : '删除', scope : this, handler : this.onDeleteClick
			} ]
		});

		var _fileds = [ {
			xtype : 'rownumberer'
		}, {
			text : "customer code/客户代码", dataIndex : 'code', sortable : true, width : 150
		}, {
			text : "customer name/客户名字", dataIndex : 'shortName', sortable : true, width : 100
		}, {
			text : "customer type/客户类型", dataIndex : 'acc_type_cn', sortable : true, width : 70
		}, {
			text : "deposit/预付金额", dataIndex : 'show_leav_money', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "Credit Line/信用金额", dataIndex : 'credit_Line', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "account balance/帐号余额", dataIndex : 'acc_balance', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "Outstanding Balance/未付金额", dataIndex : 'balance', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "total/总消费额", dataIndex : 'total', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "tax id/税号", dataIndex : 'taxCode', sortable : true, width : 100
		}, {
			text : "Contact Person/联系人", dataIndex : 'linkMan', sortable : true, width : 100
		}, {
			text : "phone/电话", dataIndex : 'mobile', sortable : true
		}, {
			text : "Address/地址", dataIndex : 'address', sortable : true
		}, {
			text : "remark/注释", dataIndex : 'myMemo', sortable : true, flex : 1
		} ];
		var items = [];
		items.push({
			anchor : '100%', height : 100, xtype : 'form', region : 'north', autoScroll : true, collapsible : true, title : '客户检索', layout : {
				columns : 2, type : 'table'
			}, bodyPadding : 10, items : [ {
				xtype : 'textfield', fieldLabel : 'customer name/客户名字', labelWidth : 150, name : 'shortName'
			}, {
				xtype : 'textfield', fieldLabel : 'contact person/联系人', labelWidth : 150, name : 'linkMan'
			}, {
				xtype : 'textfield', fieldLabel : 'phone/电话', labelWidth : 150, name : 'mobile'
			} ]
		}, {
			store : 'CustomerSearchStore', split : true, disableSelection : false, loadMask : true, autoScroll : true, region : 'center',
			xtype : 'gridpanel', columns : _fileds, viewConfig : {
				plugins : [ Ext.create('Ext.grid.plugin.DragDrop', {
					ptype : 'gridviewdragdrop', ddGroup : 'TCustomer', enableDrop : false
				}) ]
			}, bbar : Ext.create('Ext.PagingToolbar', {
				store : 'CustomerSearchStore', displayInfo : true, displayMsg : '显示 客户 {0} - {1} 总共 {2}', emptyMsg : "没有客户数据"
			}), listeners : {
				selectionchange : function(selectionModel, selecteds, eOpts) {
					if (this.cashGrid) {
						var recode = selectionModel.getSelection()[0];
						if (recode) {
							this.cashGrid.setCustomer(recode);
						}
					}
				}, scope : this
			}
		});
		if (this.cashAble) {
			this.cashGrid = Ext.create('WJM.cash.widget.SaleCashGrid', {
				region : 'south', title : '客户订单列表', height : 400, collapsed : false, collapsible : true, saleStore : 'SaleCustomerCashStore',
				saleCashHistoryStore : 'SaleCashHistoryStore'
			});
			this.cashGrid.on('saveSuccess', this.onSaveSuccess, this);
			items.push(this.cashGrid);
		}
		Ext.apply(this, {
			autoScroll : true, dockedItems : [ this.editTopBar ], items : items
		});
		var store = Ext.data.StoreManager.lookup('CustomerSearchStore');
		store.loadPage(1);
		this.callParent();
	},
	/**
	 * 删除
	 */
	onDeleteClick : function() {
		var selection = this.down('grid').getView().getSelectionModel().getSelection()[0];
		if (selection) {
			Ext.Msg.confirm('提示', '确定要删除此客户么？', function(btn, text) {
				if (btn == 'yes') {
					var store = Ext.data.StoreManager.lookup('CustomerSearchStore');
					store.remove(selection);
				}
			}, this);
		} else {
			Ext.Msg.alert('提示', '请选择客户');
		}
	},
	/**
	 * 添加
	 */
	onAddClick : function() {
		var des = myDesktopApp.getDesktop();
		win = des.createWindow({
			title : "新建客户", height : 680, width : 500, iconCls : 'icon-grid', animCollapse : false, constrainHeader : true, layout : 'fit',
			items : [ Ext.create('WJM.customer.CustomerForm', {
				listeners : {
					saveSuccess : this.onSaveSuccess, scope : this
				}
			}) ]
		});
		win.show();
	},
	/**
	 * 编辑
	 */
	onEditClick : function() {
		var selection = this.down('grid').getView().getSelectionModel().getSelection()[0];
		if (selection) {
			var des = myDesktopApp.getDesktop();
			var form = Ext.create('WJM.customer.CustomerForm', {
				listeners : {
					saveSuccess : this.onSaveSuccess, scope : this
				}
			});
			win = des.createWindow({
				title : "编辑客户", height : 680, width : 500, iconCls : 'icon-grid', animCollapse : false, constrainHeader : true, layout : 'fit',
				items : [ form ]
			});
			win.show();
			form.getForm().loadRecord(selection);
		} else {
			Ext.Msg.alert('提示', '请选择客户');
		}
	},
	/**
	 * 保存成功回调
	 */
	onSaveSuccess : function(that) {
		if (that) {
			var win = that.ownerCt;
			if (win) {
				win.destroy();
			}
		}
		var store = Ext.data.StoreManager.lookup('CustomerSearchStore');
		store.loadPage(1);
	},
	/**
	 * 搜索
	 */
	onSearchClick : function() {
		var data = this.down('form').getForm().getFieldValues();
		var store = Ext.data.StoreManager.lookup('CustomerSearchStore');
		Ext.Object.each(data, function(key, value) {
			store.getProxy().setExtraParam(key, value);
		});
		store.loadPage(1);
	}
});Ext.define('WJM.customer.CustomerManageModel', {
	extend : 'Ext.ux.desktop.Module',

	requires : [ 'WJM.model.TCustomer' ],

	id : 'customer',

	init : function() {
		this.id = this.config.moduleId || 'customer';
		this.title = this.config.menuText || 'customer/客户';
	},

	createWindow : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow(this.id);
		if (!win) {
			var grid = Ext.create('WJM.customer.CustomerGrid', {
				editAble : true, cashAble : true
			});
			win = desktop.createWindow({
				id : this.id, title : this.title, width : 900, height : 800, iconCls : 'icon-grid', animCollapse : false, constrainHeader : true,
				layout : 'fit', items : [ grid ]
			});
		}
		return win;
	}
});
/**
 * 产品快速检索
 */
Ext.define('WJM.customer.CustomerQuickSearchForm', {
    extend: 'Ext.form.Panel',
    requires: [ 'WJM.model.TCustomer' ],
    keyMapTarget: null,
    keyMap: null,
    initComponent: function () {
        var me = this;

        Ext.apply(this, {
            bodyPadding: 10,
            items: [
                {
                    store: 'CustomerQuickStore', xtype: 'combobox', fieldLabel: '客户智能检索(ctrl+alt+c)', labelWidth: 100, name: 'shortName',
                    displayField: 'shortName', valueField: 'id', queryParam: 'shortName', forceSelection: true, hideTrigger: true,
                    queryDelay: 500, enableKeyEvents: true, minChars: 1, mode: 'remote', anchor: '100%', listeners: {
                    select: me.onCustomerSelect, scope: me
                }
                }
            ]
        });
        this.callParent();
        me.on("afterrender", this.initKeyMap, me);
    },

    /**
     * 选择返回
     *
     * @param combo
     * @param records
     */
    onCustomerSelect: function (combo, records) {
        combo.setValue('');
        var results = [];
        Ext.Array.each(records, function (item) {
            results.push(Ext.create('WJM.model.TCustomer', item.getData()));
        });
        this.fireEvent('onProductLoad', {
            records: results
        });
    },

    /**
     * 设置用户框高亮
     */
    setFocusCustomerQuickSearch: function () {
        console.log("customer");
        this.down('combobox').focus();
    },

    beforeDestroy: function () {
        Ext.destroy(this.keyMap);
        this.callParent();
    },

    initKeyMap: function () {
        var me = this;
        this.keyMap = new Ext.util.KeyMap({
            target: 'bodycss',
            key: 'c',
            fn: me.setFocusCustomerQuickSearch,
            scope: me,
            alt: true,
            ctrl: true,
            shift: false,
            eventName: "keydown"
        });
        this.keyMap.enable();
    },

    beforehide: function () {
        this.keyMap.disable();
        this.callParent();
    }
});/**
 * 付款表单
 */
Ext.define('WJM.employee.ChangePasswordForm', {
	extend : 'Ext.form.Panel',

	bodyPadding : 10,
	closeAction : 'destroy',
	initComponent : function() {
		var me = this;
		Ext.applyIf(me, {
			defaults : {
				xtype : 'textfield', anchor : '100%', labelWidth : 200
			}, items : [ {
				name : 'password1', fieldLabel : 'old password/旧密码', xtype : 'textfield', allowBlank : false, inputType : 'password'
			}, {
				name : 'newpassword1', fieldLabel : 'new password/新密码', xtype : 'textfield', allowBlank : false, inputType : 'password'
			}, {
				name : 'newpassword2', fieldLabel : 'confirm password/确认密码', xtype : 'textfield', allowBlank : false, inputType : 'password'
			} ],

			dockedItems : [ {
				xtype : 'toolbar', dock : 'top', items : [ {
					xtype : 'button', iconCls : 'save', text : '保存', scope : this, handler : this.onSaveClick
				} ]
			} ]
		});
		me.callParent(arguments);
	},

	/**
	 * 保存
	 */
	onSaveClick : function() {
		var form = this.getForm();
		var me = this;
		if (form.isValid()) {
			this.submit({
				url : 'employee.do?action=change_password', success : function(form, action) {
					Ext.Msg.alert('提示', '保存成功');
					me.fireEvent('saveSuccess', me);
				}, failure : function(form, action) {
					Ext.Msg.alert('提示', action.result.msg || '保存失败，请稍候重试');
				}
			});
		}
	}
});Ext.define('WJM.employee.ChangePasswordModel', {
	extend : 'Ext.ux.desktop.Module',

	id : 'changepassword',

	init : function() {
		this.id = this.config.moduleId || 'changepassword';
		this.title = this.config.menuText || 'change password/修改密码';
	},

	createWindow : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow(this.id);
		if (!win) {
			var grid = Ext.create('WJM.employee.ChangePasswordForm', {
				listeners : {
					saveSuccess : function() {
						win.destroy();
						location.href = location.context + "/login.do?action=logout";
					}
				}
			});
			win = desktop.createWindow({
				id : this.id, title : this.title, width : 500, height : 200, iconCls : 'icon-grid', animCollapse : false, constrainHeader : true,
				layout : 'fit', items : [ grid ]
			});
		}
		return win;
	}
});
/**
 * 用户编辑列表
 */
Ext.define('WJM.employee.EmployeeGrid', {
	extend : 'Ext.grid.Panel',
	requires : [ 'Ext.grid.Panel', 'WJM.model.TEmployee', 'Ext.grid.plugin.RowEditing' ],
	/**
	 * 是否可以编辑
	 */
	editAble : false,

	initComponent : function() {
		this.editing = Ext.create('Ext.grid.plugin.RowEditing', {
			clicksToEdit : 2
		});

		this.editTopBar = Ext.create('Ext.toolbar.Toolbar', {
			items : [ {
				iconCls : 'add', text : '添加', scope : this, handler : this.onAddClick
			}, {
				iconCls : 'remove', text : '删除', scope : this, handler : this.onDeleteClick
			}, {
				iconCls : 'search', text : '打印优惠确认码', scope : this, handler : this.onPrintApproverClick
			}, {
				xtype : 'label', text : '双击列表项开始编辑'
			} ]
		});

		var _fileds = [ {
			xtype : 'rownumberer'
		}, {
			text : "code/工号", dataIndex : 'code', sortable : true, width : 100, editor : {
				xtype : 'textfield', name : 'code', allowBlank : false, inputType : 'text'
			}
		}, {
			text : "name/名字", dataIndex : 'name', sortable : true, width : 100, editor : {
				xtype : 'textfield', allowBlank : false, inputType : 'text'
			}
		}, {
			text : "department/部门", dataIndex : 'department', sortable : true, editor : {
				xtype : 'textfield'
			}
		}, {
			text : "position/职位", dataIndex : 'headShip', sortable : true, editor : {
				xtype : 'textfield'
			}
		}, {
			text : "tel/电话", dataIndex : 'tel', editor : {
				xtype : 'textfield'
			}
		}, {
			text : "cell phone/手机", dataIndex : 'mobile', editor : {
				xtype : 'textfield'
			}
		}, {
			text : "address/地址", dataIndex : 'address', editor : {
				xtype : 'textfield'
			}
		} ];

		Ext.apply(this, {
			store : 'EmployeeStore', disableSelection : false, loadMask : true,

			plugins : [],

			viewConfig : {
				plugins : [ Ext.create('Ext.grid.plugin.DragDrop', {
					ptype : 'gridviewdragdrop'
				}) ]
			},

			dockedItems : [],

			columns : _fileds,

			bbar : Ext.create('Ext.PagingToolbar', {
				store : 'EmployeeStore', displayInfo : true, displayMsg : '显示 用户 {0} - {1} 总共 {2}', emptyMsg : "没有用户数据"
			})
		});

		if (this.editAble) {
			_fileds.push({
				text : "password/密码", dataIndex : 'password1', field : {
					xtype : 'textfield', allowBlank : false
				}
			});
			_fileds.push({
				text : "approver code/优惠确认码", width : 150, xtype : 'templatecolumn',
				tpl : '<tpl if="password1.length &gt; 0"><img src="barcode?msg={password1}&type=code128&fmt=png&res=150"></img></tpl>'
			});
			_fileds.push({
				text : "权限", dataIndex : 'popedom', field : {
					xtype : 'combobox', allowBlank : false, displayField : 'power_name', valueField : 'id', store : 'PowerStore'
				},

				renderer : function(value) {
					var store = Ext.data.StoreManager.lookup('PowerStore');
					var record = store.getById(Number(value));
					if (record) {
						return record.get('power_name');
					}
				}
			});
			Ext.apply(this, {
				dockedItems : [ this.editTopBar ], plugins : [ this.editing ]
			});
		}
		this.callParent();
	},
	/**
	 * 删除
	 */
	onDeleteClick : function() {
		var selection = this.getView().getSelectionModel().getSelection()[0];
		if (selection) {
			Ext.Msg.confirm('提示', '确定要删除此用户么？', function(btn, text) {
				if (btn == 'yes') {
					this.store.remove(selection, WJM.Config.defaultOperation);
				}
			}, this);
		} else {
			Ext.Msg.alert('提示', '请选择用户');
		}
	},
	/**
	 * 添加
	 */
	onAddClick : function() {
		var rec = Ext.create('WJM.model.TEmployee'), edit = this.editing;
		edit.cancelEdit();
		this.store.insert(0, rec, WJM.Config.defaultOperation);
		edit.startEdit(0, 0);
	}

	,
	/**
	 * 添加
	 */
	onPrintApproverClick : function() {
		var selection = this.getView().getSelectionModel().getSelection()[0];
		if (selection) {
			window.open(location.context + '/back/print_barcode.jsp?code=' + selection.get('password1'), "_blank");
		} else {
			Ext.Msg.alert('提示', '请选择用户');
		}
	}
});Ext.define('WJM.employee.EmployeeManageModel', {
	extend : 'Ext.ux.desktop.Module',

	requires : [ 'WJM.model.TEmployee' ],

	id : 'employee',

	init : function() {
		this.id = this.config.moduleId || 'employee';
		this.title = this.config.menuText || 'employee/员工';
	},

	createWindow : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow(this.id);
		if (!win) {
			var grid = Ext.create('WJM.employee.EmployeeGrid', {
				editAble : true
			});
			win = desktop.createWindow({
				id : this.id, title : this.title, width : 740, height : 480, iconCls : 'icon-grid', animCollapse : false, constrainHeader : true, layout : 'fit',
				items : [ grid ]
			});
			grid.getStore().loadPage(1);
		}
		return win;
	}
});
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
});/**
 * 角色编辑
 */
Ext.define('WJM.power.PowerForm', {
	extend : 'Ext.form.Panel',
	requires : [ 'Ext.form.*', 'WJM.model.TPower', 'WJM.model.TPowerOperation' ],
	closeAction : 'destroy',
	powerRecord : null,

	initComponent : function() {
		var operationsFields = [];
		var formItems = [
				{
					fieldLabel : 'role name/角色', name : 'power_name', xtype : 'textfield', allowBlank : false,
					value : this.powerRecord ? this.powerRecord.get('power_name') : '', anchor : '100%'
				}, {
					xtype : 'hiddenfield', value : this.powerRecord ? this.powerRecord.get('id') : '0', name : "id", anchor : '100%'
				}, {
					xtype : 'fieldset', title : 'power/权限', items : operationsFields
				} ];

		Ext.Object.each(WJM.Config.powerOperationModule, function(key, value) {
			operationsFields.push(Ext.create('Ext.form.field.Checkbox', {
				boxLabel : value['menuText'], name : 'power_items', inputValue : key, anchor : '100%'
			}));
		});

		Ext.apply(this, {
			title : this.powerRecord ? this.powerRecord.get('power_name') : '新建角色', bodyPadding : 10, autoScroll : true,
			url : location.context + '/power.do?action=save', collapsed : false,

			items : formItems,

			// listeners : {
			// expand : this.initOprations, scope : this
			// },

			dockedItems : [ {
				xtype : 'toolbar', dock : 'bottom', items : [ {
					iconCls : 'save', text : '保存', scope : this, handler : this.onSaveClick
				}, {
					iconCls : 'remove', text : '删除', scope : this, handler : this.onDeleteClick
				} ]
			} ]
		});
		this.on("expand", this.initOprations, this);
		this.callParent(arguments);
	},
	/**
	 * 初始化选项
	 */
	initOprations : function() {
		if (this.powerRecord) {
			var id = this.powerRecord.getId();
			var p = Ext.ModelManager.getModel('WJM.model.TPower');
			var that = this;
			p.load(id, {
				success : function(power) {
					var ops = power.getAssociatedData()['operations'];
					Ext.Array.each(ops, function(item, index) {
						var fields = that.getForm().getFields();
						fields.each(function(field, index) {
							if (field.inputValue == item['operationCode']) {
								field.setValue(true);
							}
						});
					});
				}
			});
		}
	},

	/**
	 * 删除一个权限类型
	 */
	onDeleteClick : function() {
		Ext.Msg.confirm('提示', '确定要删除此角色么？', function(btn, text) {
			if (btn == 'yes') {
				var form = this.getForm();
				var me = this;
				form.submit({
					url : 'power.do?action=del',

					success : function(form, action) {
						var store = Ext.data.StoreManager.lookup('PowerStore');
						store.load();
						me.fireEvent('deleteSuccess', me);
						Ext.Msg.alert('提示', '删除成功');
					}, failure : function(form, action) {
						Ext.Msg.alert('错误', "删除失败，请稍后重试");
					}
				});
			}
		}, this);
	},
	/**
	 * 保存一个权限类型
	 */
	onSaveClick : function() {
		var form = this.getForm();
		var me = this;
		form.submit({
			url : 'power.do?action=save',

			success : function(form, action) {
				var store = Ext.data.StoreManager.lookup('PowerStore');
				store.load();
				var power_name = form.findField('power_name');
				me.setTitle(power_name.getValue());
				Ext.Msg.alert('提示', '保存成功');
			}, failure : function(form, action) {
				Ext.Msg.alert('错误', "保存失败，请稍后重试");
			}
		});
	}
});Ext.define('WJM.power.PowerManageModel', {
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
Ext.define('WJM.product.ProductAlert', {
	mixins : {
		observable : 'Ext.util.Observable'
	},
	requires : [ 'Ext.window.MessageBox', 'WJM.model.TProduct' ],

	singleton : true,

	constructor : function(config) {
		this.mixins.observable.constructor.call(this, config);
		this.callParent(arguments);
		this.store = Ext.data.StoreManager.lookup('ProductAlertStore');
		this.store.on('load', this.onProductListLoad, this);
	},

	checkProduct : function() {
		this.store.load();
	},

	onProductListLoad : function() {
		if (this.store.getCount() <= 0) {
			return;
		} else {
			var des = myDesktopApp.getDesktop();
			win = des.createWindow({
				title : "产品库存报警(按住ctrl多选，拖动产品到订货列表)", width : 500, height : 500, iconCls : 'icon-grid', animCollapse : false, constrainHeader : true, layout : 'fit',
				items : [ Ext.create('WJM.product.widget.ProductGrid', {
					productStore : 'ProductAlertStore'
				}) ]
			});
			win.show();
		}
	}
});/**
 * 产品类别表单
 */
Ext.define('WJM.product.ProductCategoryForm', {
	extend : 'Ext.form.Panel',

	record : null, bodyPadding : 10, closeAction : 'destroy', initComponent : function() {
		var me = this;

		Ext.applyIf(me, {
			defaults : {
				xtype : 'textfield', anchor : '100%', labelWidth : 100
			}, items : [ {
				name : 'id', xtype : 'hiddenfield'
			}, {
				name : 'parent_id', xtype : 'hiddenfield'
			}, {
				name : 'code', fieldLabel : 'code/类别编码', allowBlank : false
			}, {
				name : 'product_type_name', fieldLabel : 'name/类别名', allowBlank : false
			}, {
				fieldLabel : 'Upper Category/上一级类别', readOnly : true, name : 'parent_product_type_name', xtype : 'hiddenfield'
			}, {
				fieldLabel : 'level/级别', name : 'level', readOnly : true, xtype : 'hiddenfield'
			} ], dockedItems : [ {
				xtype : 'toolbar', dock : 'top', items : [ {
					xtype : 'button', iconCls : 'save', text : '保存', scope : this, handler : this.onSaveClick
				} ]
			} ]
		});
		me.callParent(arguments);
		if (this.record) {
			me.loadRecord(this.record);
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
				url : 'product_type.do?action=save', success : function(form, action) {
					Ext.Msg.alert('提示', '保存成功');
					me.fireEvent('saveSuccess', me);
				}, failure : function(form, action) {
					Ext.Msg.alert('提示', '保存失败，请稍候重试');
				}
			});
		}
	}

});Ext.define('WJM.product.ProductCategoryManageModel', {
	extend : 'Ext.ux.desktop.Module',

	requires : ['WJM.model.TProductCategory' ],

	id : 'productcategory',

	init : function() {
		this.id = this.config.moduleId || 'productcategory';
		this.title = this.config.menuText || 'product category/产品种类';
	},

	createWindow : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow(this.id);
		if (!win) {
			var tree = Ext.create('WJM.product.ProductCategoryTree', {
				editAble : true
			});
			win = desktop.createWindow({
				id : this.id, title : this.title, width : 400, height : 500, iconCls : 'icon-grid', animCollapse : false, constrainHeader : true, layout : 'fit',
				items : tree
			});
		}
		return win;
	}
});
/**
 * 产品类别编辑
 */
Ext.define('WJM.product.ProductCategoryTree', {
	extend : 'Ext.tree.Panel',
	requires : [ 'Ext.tree.Panel', 'WJM.model.TProductCategory' ],
	/**
	 * 是否可以编辑
	 */
	editAble : false,

	initComponent : function() {
		var me = this;
		this.editTopBar = Ext.create('Ext.toolbar.Toolbar', {
			dock : 'top', items : [ {
				iconCls : 'add', text : '添加根类别', scope : this, handler : this.onAddRootClick
			}, {
				iconCls : 'add', text : '添加子类别', scope : this, handler : this.onAddLeafClick
			}, {
				iconCls : 'edit', text : '编辑类别', scope : this, handler : this.onEditClick
			}, {
				iconCls : 'remove', text : '删除', scope : this, handler : this.onDeleteClick
			} ]
		});

		var _fileds = [ {
			xtype : 'treecolumn', text : 'name/类别', flex : 2, sortable : true, dataIndex : 'product_type_name'
		}, {
			text : 'code/类别编号', sortable : true, dataIndex : 'code', align : 'center'
		} ];

		Ext.apply(this, {
			store : 'ProductCategoryStore', loadMask : true, rootVisible : true, multiSelect : false, singleExpand : false,

			viewConfig : {
				plugins : [ {
					ptype : 'treeviewdragdrop', ddGroup : 'TProductCategory', enableDrop : false
				} ]
			}, columns : _fileds
		});

		if (this.editAble) {
			Ext.apply(this, {
				dockedItems : [], viewConfig : {
					plugins : [ {
						ptype : 'treeviewdragdrop', ddGroup : 'TProductCategory', enableDrop : true
					} ]
				}
			});
			_fileds.push({
				text : 'id/类别id', flex : 1, dataIndex : 'id', sortable : true
			});
			this.on("afterrender", this.initContextmenu, this);
		}
		this.callParent();
	},

	/**
	 * 右键初始化
	 */
	initContextmenu : function() {
		var me = this;
		var ret = {
			items : [ {
				text : '添加类别', handler : me.onAddClick, scope : me, minWindows : 1
			}, {
				text : '修改类别', handler : me.onEditClick, scope : me, minWindows : 1
			}, {
				text : '删除类别', handler : me.onDeleteClick, scope : me, minWindows : 1
			} ]
		};

		this.contextMenu = new Ext.menu.Menu(ret);
		this.getEl().on('contextmenu', function(e) {
			var me = this, menu = me.contextMenu;
			// this.getView().getSelectionModel().deselectAll();
			e.stopEvent();
			menu.showAt(e.getXY());
			menu.doConstrain();
		}, this);
	},
	/**
	 * 删除
	 */
	onDeleteClick : function() {
		var selection = this.getView().getSelectionModel().getSelection()[0];
		if (selection) {
			Ext.Msg.confirm('提示', '确定要删除此类别么？', function(btn, text) {
				if (btn == 'yes') {
					selection.remove(true);
				}
			}, this);
		} else {
			Ext.Msg.alert('提示', '请选择类别');
		}
	},
	/**
	 * 添加根类别
	 */
	onAddRootClick : function() {
		var des = myDesktopApp.getDesktop();
		win = des.createWindow({
			title : "新建类别", height : 150, width : 300, iconCls : 'icon-grid', animCollapse : false, constrainHeader : true, layout : 'fit',
			items : [ Ext.create('WJM.product.ProductCategoryForm', {
				record : Ext.create('WJM.model.TProductCategory', {
					level : 1, parent_id : 0, parent_product_type_name : '根节点'
				}), listeners : {
					saveSuccess : this.onSaveSuccess, scope : this
				}
			}) ]
		});
		win.show();
	},
	/**
	 * 添加叶子类别
	 */
	onAddLeafClick : function() {
		var selection = this.getSelectionModel().getSelection()[0];
		if (selection) {
			var des = myDesktopApp.getDesktop();
			win = des.createWindow({
				title : "新建类别",
				height : 150,
				width : 300,
				iconCls : 'icon-grid',
				animCollapse : false,
				constrainHeader : true,
				layout : 'fit',
				items : [ Ext.create('WJM.product.ProductCategoryForm', {
					record : Ext.create('WJM.model.TProductCategory', {
						level : selection.get('level') + 1, parent_id : selection.get('id'),
						parent_product_type_name : selection.get('product_type_name')
					}), listeners : {
						saveSuccess : this.onSaveSuccess, scope : this
					}
				}) ]
			});
			win.show();
		} else {
			Ext.Msg.alert('提示', '请选择类别');
		}
	},

	/**
	 * 添加类别
	 */
	onAddClick : function() {
		var selection = this.getSelectionModel().getSelection()[0];
		if (selection) {
			this.onAddLeafClick();
		} else {
			this.onAddRootClick();
		}
	},
	/**
	 * 保存成功
	 */
	onSaveSuccess : function(win) {
		var store = Ext.data.StoreManager.lookup('ProductCategoryStore');
		store.load();
		var store2 = Ext.data.StoreManager.lookup('ProductCategoryAllStore');
		store2.load();
		win.up('window').destroy();
	},
	/**
	 * 编辑类别
	 */
	onEditClick : function() {
		var selection = this.getSelectionModel().getSelection()[0];
		if (selection) {
			var store = Ext.data.StoreManager.lookup('ProductCategoryStore');
			var parent = store.getNodeById(selection.get('parent_id'));
			if (parent) {
				selection.set('parent_product_type_name', parent.get('product_type_name'));
			} else {
				selection.set('parent_product_type_name', '根节点');
			}
			var des = myDesktopApp.getDesktop();
			win = des.createWindow({
				title : selection.get('product_type_name'), height : 150, width : 300, iconCls : 'icon-grid', animCollapse : false,
				constrainHeader : true, layout : 'fit', items : [ Ext.create('WJM.product.ProductCategoryForm', {
					record : selection, listeners : {
						saveSuccess : this.onSaveSuccess, scope : this
					}
				}) ]
			});
			win.show();
		} else {
			Ext.Msg.alert('提示', '请选择类别');
		}
	}
});/**
 * 产品类别表单
 */
Ext.define('WJM.product.ProductForm', {
	extend : 'Ext.form.Panel',
	requires : [ 'WJM.model.TProductVendor', 'Ext.ux.CheckColumn' ],
	record : null,
	height : 600,
	width : 400,
	bodyPadding : 10,
	closeAction : 'destroy',

	initComponent : function() {
		var me = this;
		this.gridStoreId = Ext.Number.randomInt(1000000, 9999999).toString();
		Ext.create('Ext.data.Store', {
			storeId : this.gridStoreId, autoLoad : false, model : 'WJM.model.TVendor'
		});
		var _fileds = [ {
			xtype : 'rownumberer'
		}, {
			text : "vendor name/供货商", dataIndex : 'vendor_name', sortable : true, width : 150
		}, {
			text : "cost/供货价格", dataIndex : 'price', sortable : true, xtype : 'numbercolumn', format : '$0.00', width : 150, editor : {
				xtype : 'adnumberfield', allowBlank : false, minValue : 0
			}
		}, {
			xtype : 'checkcolumn', text : '定价', dataIndex : 'useDefaultBoolean', width : 90, stopSelection : true, editor : {
				xtype : 'checkbox', cls : 'x-grid-checkheader-editor'
			}, listeners : {
				checkchange : me.onCheckchange, scope : me
			}
		} ];
		Ext.applyIf(me, {
			defaults : {
				xtype : 'textfield', anchor : '100%', labelWidth : 150
			},
			items : [
					{
						name : 'id', xtype : 'hiddenfield'
					},
					{
						anchor : '100%', height : 100, disableSelection : false, loadMask : true, xtype : 'gridpanel', columns : _fileds,store : this.gridStoreId,
						plugins : [ Ext.create('Ext.grid.plugin.CellEditing', {
							clicksToEdit : 1, listeners : {
								edit : me.calculatePrice, scope : me
							}
						}) ],

						viewConfig : {
							plugins : [ Ext.create('Ext.grid.plugin.DragDrop', {
								ptype : 'gridviewdragdrop', ddGroup : 'TVendor', enableDrop : true, enableDrag : false
							}) ],

							listeners : {
								drop : function(node, data, overModel, dropPosition, eOpts) {
								},

								beforedrop : function(node, data, overModel, dropPosition, dropFunction, eOpts) {
									data.copy = true;
									var gridpanle = me.down('gridpanel');
									var store = gridpanle.getStore();
									data.records = Ext.Array.filter(data.records, function(item) {
										var data = store.findRecord('vendor_id', item.getId(), 0, false, false, true);
										if (data) {
											return false;
										} else {
											return true;
										}
									});
									data.records = this.recoverTVendor(data.records);
								}, scope : me
							}
						}
					},
					{
						title : '从任意的产品类别列表中拖动列表项到此区域',
						xtype : 'fieldset',
						layout : 'anchor',
						allowBlank : false,
						items : [
								{
									name : 'product_type', xtype : 'hiddenfield'
								},
								{
									fieldLabel : 'category code/类别code', name : 'product_type_code', readOnly : false, allowBlank : false,
									xtype : 'textfield', anchor : '100%', labelWidth : 150
								},
								{
									fieldLabel : 'category name/类别名称', name : 'product_type_name', allowBlank : false, readOnly : true, xtype : 'textfield',
									anchor : '100%', labelWidth : 150
								} ]
					},
					{
						name : 'code', fieldLabel : 'barcode #/条码', allowBlank : true
					},
					{
						name : 'product_id', fieldLabel : 'items id/助记符', allowBlank : true
					},
					{
						name : 'product_name', fieldLabel : 'description 1', allowBlank : true
					},
					{
						name : 'product_name_cn', fieldLabel : 'description 2', allowBlank : true
					},
					{
						name : 'size', fieldLabel : 'retail percentage/零售%', allowBlank : true, xtype : 'numberfield', enableKeyEvents : true,
						listeners : {
							keyup : this.calculatePrice, scope : me
						}
					},
					{
						name : 'price_simgle', fieldLabel : 'retail price/零售价格', minValue : 0, xtype : 'adnumberfield', enableKeyEvents : true,
						listeners : {
							keyup : this.calculatePercentage, scope : me
						}
					},
					{
						name : 'weight', fieldLabel : 'WHLS percentage/批发价%', xtype : 'numberfield', allowBlank : true, enableKeyEvents : true,
						listeners : {
							keyup : this.calculatePrice, scope : me
						}
					},
					{
						name : 'price_wholesale', fieldLabel : 'WHLS price/批发价', xtype : 'adnumberfield', allowBlank : true, enableKeyEvents : true,
						listeners : {
							keyup : this.calculatePercentage, scope : me
						}
					},
					{
						name : 'price_company', fieldLabel : 'company price/公司价格', minValue : 0, xtype : 'adnumberfield', enableKeyEvents : false
					},
					{
						name : 'num', fieldLabel : 'quantity/数量', minValue : 0, xtype : 'numberfield', allowDecimals : false
					},
					{
						name : 'downLimit', fieldLabel : 'min Stock/最小库存', allowBlank : true, xtype : 'numberfield', allowDecimals : false,
						minValue : 0
					}, {
						name : 'myMemo', fieldLabel : 'remark/备注', xtype : 'textareafield', allowBlank : true
					} ],

			dockedItems : [ {
				xtype : 'toolbar', dock : 'top', items : [ {
					xtype : 'button', iconCls : 'save', text : '保存', scope : this, handler : this.onSaveClick
				}, {
					xtype : 'button', iconCls : 'remove', text : '删除供货商', scope : this, handler : this.onDeleteVendor
				}, {
					xtype : 'button', iconCls : 'search', text : '搜索供货商', scope : this, handler : this.onVendorSearchClick
				}, {
					xtype : 'button', iconCls : 'search', text : '搜索产品类别', scope : this, handler : this.onCategorySearchClick
				} ]
			} ]
		});
		me.on("afterrender", this.initDragDorp, this);
		me.callParent(arguments);
		if (this.record) {
			me.loadRecord(this.record);
			var store = Ext.data.StoreManager.lookup('ProductVendorStore');
			store.getProxy().setExtraParam('product_id', this.record.getId());
			store.getProxy().setExtraParam('product_name', null);
			store.getProxy().setExtraParam('vendor_id', null);
			store.getProxy().setExtraParam('vendor_name', null);
			store.load({
				scope : this, callback : this.onProductVendorLoad
			});
			var store = Ext.data.StoreManager.lookup('ProductCategoryAllStore');
			var record = store.getById(Number(this.record.get('product_type')));
			if (record) {
				this.setProductType(record);
			}
		}
	},

	setProductType : function(record) {
		this.getForm().findField('product_type').setValue(record.getId());
		this.getForm().findField('product_type_code').setValue(record.get('code'));
		this.getForm().findField('product_type_name').setValue(record.get('product_type_name'));
	},
	/**
	 * 
	 */
	onProductVendorLoad : function(records, opt, successful) {
		if (successful) {
			this.down('grid').getStore().loadRecords(records);
		}
	},
	/**
	 * 
	 * @param records
	 */
	recoverTVendor : function(records) {
		var datas = [];
		Ext.Array.each(records, function(item) {
			var recode = Ext.create('WJM.model.TProductVendor');
			recode.set('vendor_id', item.getId());
			recode.set('vendor_name', item.get('shortName'));
			recode.set('price', 0);
			recode.set('useDefault', 0);
			recode.set('useDefaultBoolean', false);
			recode.set('id', new Date().getTime());
			datas.push(recode);
		});
		return datas;
	},
	/**
	 * 
	 */
	initDragDorp : function() {
		var me = this;
		this.dragDorp = Ext.create('Ext.dd.DropTarget', this.down('fieldset[title="从任意的产品类别列表中拖动列表项到此区域"]').getEl().dom, {
			ddGroup : 'TProductCategory', notifyEnter : function(ddSource, e, data) {
				me.stopAnimation();
				me.getEl().highlight();
			}, notifyDrop : function(ddSource, e, data) {
				var selectedRecord = ddSource.dragData.records[0];
				me.setProductType(selectedRecord);
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
		var datas = this.down('gridpanel').getStore().data;
		var redod = [];
		var validate = true;
		datas.each(function(item) {
			redod.push(item.getData());
			if (!item.get('price') || item.get('price') <= 0) {
				validate = false;
			}
		});
		if (redod.length <= 0) {
			Ext.Msg.alert('提示', '请添加供应商！');
			return;
		}
		if (!validate) {
			Ext.Msg.alert('提示', '列表中供货商供货价格不正确！');
			return;
		}
		var store = Ext.data.StoreManager.lookup('ProductCategoryAllStore');
		var code = this.getForm().findField('product_type_code').getValue();
		var type = store.findRecord('code', code, 0, false, false, true);
		if (type) {
			me.setProductType(type);
		} else {
			Ext.Msg.alert('提示', '根据code未找到对应的类别！');
			return;
		}
		if (form.isValid()) {
			if (redod.length == 0) {
				Ext.Msg.alert('提示', '请选择供应商');
				return;
			}
			this.submit({
				url : 'product.do?action=save2', params : {
					productProviderJson : Ext.JSON.encode(redod)
				}, success : function(form, action) {
					Ext.Msg.alert('提示', '保存成功');
					me.fireEvent('saveSuccess', me);
				}, failure : function(form, action) {
					Ext.Msg.alert('提示', action.result.msg || '保存失败，请稍候重试');
				}
			});
		}
	},

	/**
	 * 搜索供货商
	 */
	onVendorSearchClick : function() {
		var desktop = myDesktopApp.getDesktop();
		var win = desktop.getWindow('VendorSearchGrid');
		if (!win) {
			var grid = Ext.create('WJM.vendor.VendorGrid', {
				editAble : false
			});
			win = desktop.createWindow({
				id : 'VendorSearchGrid', title : "供货商检索", width : 600, height : 600, iconCls : 'icon-grid', animCollapse : false,
				constrainHeader : true, layout : 'fit', items : [ grid ]
			});
		}
		win.show();
	},
	/**
	 * 搜索供货商
	 */
	onCategorySearchClick : function() {
		var desktop = myDesktopApp.getDesktop();
		var win = desktop.getWindow('ProductCategorySearchGrid');
		if (!win) {
			var grid = Ext.create('WJM.product.ProductCategoryTree', {
				width : 200, editAble : false, collapsible : true, title : '类别检索'
			});
			win = desktop.createWindow({
				id : 'ProductCategorySearchGrid', title : "类别检索", width : 200, height : 400, iconCls : 'icon-grid', animCollapse : false,
				constrainHeader : true, layout : 'fit', items : [ grid ]
			});
		}
		win.show();
	},

	onDeleteVendor : function() {
		var selection = this.down('grid').getView().getSelectionModel().getSelection()[0];
		if (selection) {
			this.down('grid').getStore().remove(selection);
			Ext.Msg.alert('提示', '删除成功，请保存产品！');
		} else {
			Ext.Msg.alert('提示', '请选择供货商。');
		}
	},
	/**
	 * 计算价格
	 */
	calculatePrice : function() {
		var vendorPriceRecord = this.down('gridpanel').getStore().findRecord('useDefault', '1');
		if (vendorPriceRecord) {
			var price = vendorPriceRecord.get('price') + 0;
			var salePercentage = this.getForm().findField('size').getValue() + 0;
			var whlsPercentage = this.getForm().findField('weight').getValue() + 0;
			this.getForm().findField('price_simgle').setValue(price * (1 + salePercentage / 100));
			this.getForm().findField('price_wholesale').setValue(price * (1 + whlsPercentage / 100));
		}
	},
	/**
	 * 计算百分比
	 */
	calculatePercentage : function() {
		var vendorPriceRecord = this.down('gridpanel').getStore().findRecord('useDefault', '1');
		if (vendorPriceRecord) {
			var price = vendorPriceRecord.get('price') + 0;
			var salePrice = this.getForm().findField('price_simgle').getValue() + 0;
			var whlsPrice = this.getForm().findField('price_wholesale').getValue() + 0;
			if (price != 0) {
				this.getForm().findField('size').setValue((salePrice - price) / price * 100);
				this.getForm().findField('weight').setValue((whlsPrice - price) / price * 100);
			}
		}
	},

	beforeDestroy : function() {
		this.clearForm();
		Ext.data.StoreManager.unregister(this.gridStoreId);
		Ext.destroy(this.dragDorp);
		this.callParent();
	},
	/**
	 * 重置表单
	 */
	clearForm : function() {
		this.down('gridpanel').getStore().removeAll();
		this.record = null;
		var fields = this.getForm().getFields();
		fields.each(function(item) {
			item.setValue('');
		});
	},
	/**
	 * 
	 * @param checkColumn
	 * @param rowIndex
	 * @param checked
	 * @param eOpts
	 */
	onCheckchange : function(checkColumn, rowIndex, checked, eOpts) {
		if (checked) {
			var store = this.down('gridpanel').getStore();
			var total = store.count();
			for ( var i = 0; i < total; i++) {
				if (i != rowIndex) {
					store.getAt(i).set('useDefault', 0);
					store.getAt(i).set('useDefaultBoolean', false);
				} else {
					store.getAt(i).set('useDefault', 1);
					store.getAt(i).set('useDefaultBoolean', true);
				}
			}
		}
		this.calculatePrice();
	}
});/**
 * 产品列表
 */
Ext.define('WJM.product.ProductGrid', {
	extend : 'Ext.panel.Panel',
	requires : [ 'Ext.grid.Panel', 'WJM.product.ProductCategoryTree' ],
	/**
	 * 是否可以编辑
	 */
	editAble : false,
	/**
	 * 进货价格显示
	 */
	hasCost : true,

	layout : {
		type : 'border', padding : 2
	},
	defaults : {
		split : true
	},

	initComponent : function() {
		var _fileds = [];
		if (this.editAble) {
			this.editTopBar = Ext.create('Ext.toolbar.Toolbar', {
				items : [ {
					iconCls : 'search', text : '搜索', scope : this, handler : this.onSearchClick
				}, {
					iconCls : 'add', text : '添加', scope : this, handler : this.onAddClick
				}, {
					iconCls : 'edit', text : '编辑', scope : this, handler : this.onEditClick
				}, {
					iconCls : 'remove', text : '删除', scope : this, handler : this.onDeleteClick
				} ]
			});

		} else {
			this.editTopBar = Ext.create('Ext.toolbar.Toolbar', {
				items : [ {
					iconCls : 'search', text : '搜索', scope : this, handler : this.onSearchClick
				} ]
			});

		}
		if (this.hasCost) {
			_fileds = [ {
				xtype : 'rownumberer'
			}, {
				text : "items id/助记符", dataIndex : 'product_id', sortable : true, width : 100
			}, {
				text : "barcode #/条码", dataIndex : 'code', sortable : true, width : 100
			}, {
				text : "description 1", dataIndex : 'product_name', sortable : true, width : 200
			}, {
				text : "description 2", dataIndex : 'product_name_cn', sortable : true, width : 200
			}, {
				text : "category id/分类", dataIndex : 'product_type', sortable : true, width : 100, renderer : function(value) {
					var store = Ext.data.StoreManager.lookup('ProductCategoryAllStore');
					var record = store.getById(Number(value));
					if (record) {
						return record.get('product_type_name');
					}
				}
			}, {
				text : "cost/进货价", dataIndex : 'price_income', sortable : true, xtype : 'numbercolumn', format : '$0.00'
			}, {
				text : "sale price/销售价格", dataIndex : 'price_simgle', sortable : true, xtype : 'numbercolumn', format : '$0.00'
			}, {
				text : "WHLS price", dataIndex : 'price_wholesale', sortable : true, xtype : 'numbercolumn', format : '$0.00'
			}, {
				text : "company price", dataIndex : 'price_company', sortable : true, xtype : 'numbercolumn', format : '$0.00'
			}, {
				text : "quantity/数量", dataIndex : 'num', sortable : true
			}, {
				text : "vendor/供货商", dataIndex : 'vendortName', sortable : true
			} ];
		} else {
			_fileds = [ {
				xtype : 'rownumberer'
			}, {
				text : "items id/助记符", dataIndex : 'product_id', sortable : true, width : 100
			}, {
				text : "barcode #/条码", dataIndex : 'code', sortable : true, width : 100
			}, {
				text : "description 1", dataIndex : 'product_name', sortable : true, width : 200
			}, {
				text : "description 2", dataIndex : 'product_name_cn', sortable : true, width : 200
			}, {
				text : "category id/分类", dataIndex : 'product_type', sortable : true, width : 100, renderer : function(value) {
					var store = Ext.data.StoreManager.lookup('ProductCategoryAllStore');
					var record = store.getById(Number(value));
					if (record) {
						return record.get('product_type_name');
					}
				}
			}, {
				text : "sale price/销售价格", dataIndex : 'price_simgle', sortable : true, xtype : 'numbercolumn', format : '$0.00'
			}, {
				text : "WHLS price", dataIndex : 'price_wholesale', sortable : true, xtype : 'numbercolumn', format : '$0.00'
			}, {
				text : "quantity/数量", dataIndex : 'num', sortable : true
			}, {
				text : "vendor/供货商", dataIndex : 'vendortName', sortable : true
			} ];
		}
		Ext.apply(this, {
			autoScroll : true,
			dockedItems : [ this.editTopBar ],

			items : [
					{
						anchor : '100%', height : 100, xtype : 'form', region : 'north', autoScroll : true, collapsible : true, title : '名称检索',
						layout : {
							columns : 2, type : 'table'
						}, bodyPadding : 10, items : [ {
							xtype : 'textfield', fieldLabel : 'items id/助记符', labelWidth : 150, name : 'product_id', listeners : {
								change : this.onAutoSearch, scope : this
							}
						}, {
							xtype : 'textfield', fieldLabel : 'barcode #/条码', labelWidth : 150, name : 'code', listeners : {
								change : this.onAutoSearch, scope : this
							}
						}, {
							xtype : 'textfield', fieldLabel : 'description', labelWidth : 150, name : 'product_name', listeners : {
								change : this.onAutoSearch, scope : this
							}
						} ]
					},
					Ext.create('WJM.product.ProductCategoryTree', {
						region : 'west', width : 200, editAble : false, collapsible : true, title : '类别检索', editAble : this.editAble, listeners : {
							selectionchange : function(selectionModel, selecteds, eOpts) {
								var recode = selectionModel.getSelection()[0];
								if (recode) {
									this.clearExtraParam();
									var store = Ext.data.StoreManager.lookup('ProductStore');
									store.getProxy().setExtraParam('product_type', recode.getId());
									store.loadPage(1);
								}
							}, scope : this
						}
					}),
					{
						store : 'ProductStore', disableSelection : false, multiSelect : true, loadMask : true, region : 'center', xtype : 'gridpanel',
						columns : _fileds, viewConfig : {
							plugins : [ Ext.create('Ext.grid.plugin.DragDrop', {
								ptype : 'gridviewdragdrop', ddGroup : 'TProduct', enableDrop : false
							}) ]
						}, bbar : Ext.create('Ext.PagingToolbar', {
							store : 'ProductStore', displayInfo : true, displayMsg : '显示 产品 {0} - {1} 总共 {2}', emptyMsg : "没有产品数据"
						})
					} ]
		});
		var store = Ext.data.StoreManager.lookup('ProductStore');
		store.loadPage(1);
		this.callParent();
	},
	/**
	 * 自动搜索
	 */
	onAutoSearch : function(field, newValue, oldValue, eOpts) {
		if (newValue && newValue.length >= 3) {
			this.onSearchClick();
		}
	},
	/**
	 * 删除
	 */
	onDeleteClick : function() {
		var selection = this.down('grid').getView().getSelectionModel().getSelection()[0];
		if (selection) {
			Ext.Msg.confirm('提示', '确定要删除此产品么？', function(btn, text) {
				if (btn == 'yes') {
					var store = Ext.data.StoreManager.lookup('ProductStore');
					store.remove(selection);
				}
			}, this);
		} else {
			Ext.Msg.alert('提示', '请选择产品');
		}
	},
	/**
	 * 添加
	 */
	onAddClick : function() {
		var des = myDesktopApp.getDesktop();
		var win = des.getWindow('ProductForm');
		if (win) {
			win.destroy();
		}
		win = des.createWindow({
			title : "新建产品", iconCls : 'icon-grid', animCollapse : false, constrainHeader : true, layout : 'fit',
			items : [ Ext.create('WJM.product.ProductForm', {
				listeners : {
					saveSuccess : this.onSaveSuccess, scope : this
				}
			}) ]
		});
		win.show();
	},
	/**
	 * 编辑
	 */
	onEditClick : function() {
		var selection = this.down('grid').getView().getSelectionModel().getSelection()[0];
		if (selection) {
			var des = myDesktopApp.getDesktop();
			var form = Ext.create('WJM.product.ProductForm', {
				listeners : {
					saveSuccess : this.onSaveSuccess, scope : this
				}, record : selection
			});
			var win = des.getWindow('ProductForm');
			if (win) {
				win.destroy();
			}
			win = des.createWindow({
				title : "编辑产品", iconCls : 'icon-grid', animCollapse : false, constrainHeader : true, layout : 'fit', items : [ form ]
			});
			win.show();
			form.getForm().loadRecord(selection);
		} else {
			Ext.Msg.alert('提示', '请选择产品');
		}
	},
	/**
	 * 保存成功回调
	 */
	onSaveSuccess : function(that) {
		var win = that.ownerCt;
		win.destroy();
		var store = Ext.data.StoreManager.lookup('ProductStore');
		store.loadPage(1);
		this.show();
	},
	/**
	 * 搜索
	 */
	onSearchClick : function() {
		this.clearExtraParam();
		var data = this.down('form').getForm().getFieldValues();
		var store = Ext.data.StoreManager.lookup('ProductStore');
		Ext.Object.each(data, function(key, value) {
			store.getProxy().setExtraParam(key, value);
		});
		store.loadPage(1);
	},
	/**
	 * 清除store
	 */
	clearExtraParam : function() {
		var data = this.down('form').getForm().getFieldValues();
		var store = Ext.data.StoreManager.lookup('ProductStore');
		Ext.Object.each(data, function(key, value) {
			store.getProxy().setExtraParam(key, null);
		});
		store.getProxy().setExtraParam('product_type', null);
	}
});/**
 * 产品列表
 */
Ext.define('WJM.product.ProductGridNew', {
	extend : 'Ext.panel.Panel',
	requires : [ 'Ext.grid.Panel', 'WJM.product.ProductCategoryTree' ],
	/**
	 * 是否可以编辑
	 */
	editAble : false,
	/**
	 * 进货价格显示
	 */
	hasCost : true,

	layout : {
		type : 'border', padding : 2
	},
	defaults : {
		split : true
	},

	initComponent : function() {
		var _fileds = [];
		if (this.editAble) {
			this.editTopBar = Ext.create('Ext.toolbar.Toolbar', {
				items : [ {
					iconCls : 'search', text : '搜索', scope : this, handler : this.onSearchClick
				}, {
					iconCls : 'add', text : '添加', scope : this, handler : this.onAddClick
				}, {
					iconCls : 'edit', text : '编辑', scope : this, handler : this.onEditClick
				}, {
					iconCls : 'remove', text : '删除', scope : this, handler : this.onDeleteClick
				} ]
			});

		} else {
			this.editTopBar = Ext.create('Ext.toolbar.Toolbar', {
				items : [ {
					iconCls : 'search', text : '搜索', scope : this, handler : this.onSearchClick
				} ]
			});

		}
		if (this.hasCost) {
			_fileds = [ {
				xtype : 'rownumberer'
			}, {
				text : "items id/助记符", dataIndex : 'product_id', sortable : true, width : 100
			}, {
				text : "barcode #/条码", dataIndex : 'code', sortable : true, width : 100
			}, {
				text : "description 1", dataIndex : 'product_name', sortable : true, width : 200
			}, {
				text : "description 2", dataIndex : 'product_name_cn', sortable : true, width : 200
			}, {
				text : "category id/分类", dataIndex : 'product_type', sortable : true, width : 100, renderer : function(value) {
					var store = Ext.data.StoreManager.lookup('ProductCategoryAllStore');
					var record = store.getById(Number(value));
					if (record) {
						return record.get('product_type_name');
					}
				}
			}, {
				text : "cost/进货价", dataIndex : 'price_income', sortable : true, xtype : 'numbercolumn', format : '$0.00'
			}, {
				text : "sale price/销售价格", dataIndex : 'price_simgle', sortable : true, xtype : 'numbercolumn', format : '$0.00'
			}, {
				text : "WHLS price", dataIndex : 'price_wholesale', sortable : true, xtype : 'numbercolumn', format : '$0.00'
			}, {
				text : "quantity/数量", dataIndex : 'num', sortable : true
			} ];
		} else {
			_fileds = [ {
				xtype : 'rownumberer'
			}, {
				text : "items id/助记符", dataIndex : 'product_id', sortable : true, width : 100
			}, {
				text : "barcode #/条码", dataIndex : 'code', sortable : true, width : 100
			}, {
				text : "description 1", dataIndex : 'product_name', sortable : true, width : 200
			}, {
				text : "description 2", dataIndex : 'product_name_cn', sortable : true, width : 200
			}, {
				text : "category id/分类", dataIndex : 'product_type', sortable : true, width : 100, renderer : function(value) {
					var store = Ext.data.StoreManager.lookup('ProductCategoryAllStore');
					var record = store.getById(Number(value));
					if (record) {
						return record.get('product_type_name');
					}
				}
			}, {
				text : "sale price/销售价格", dataIndex : 'price_simgle', sortable : true, xtype : 'numbercolumn', format : '$0.00'
			}, {
				text : "WHLS price", dataIndex : 'price_wholesale', sortable : true, xtype : 'numbercolumn', format : '$0.00'
			}, {
				text : "quantity/数量", dataIndex : 'num', sortable : true
			} ];
		}
		Ext.apply(this, {
			autoScroll : true,
			dockedItems : [ this.editTopBar ],

			items : [
					{
						anchor : '100%', height : 100, xtype : 'form', region : 'north', autoScroll : true, collapsible : true, title : '名称检索',
						layout : {
							columns : 2, type : 'table'
						}, bodyPadding : 10, items : [ {
							xtype : 'textfield', fieldLabel : 'items id/助记符', labelWidth : 150, name : 'product_id', listeners : {
								change : this.onAutoSearch, scope : this
							}
						}, {
							xtype : 'textfield', fieldLabel : 'barcode #/条码', labelWidth : 150, name : 'code', listeners : {
								change : this.onAutoSearch, scope : this
							}
						}, {
							xtype : 'textfield', fieldLabel : 'description', labelWidth : 150, name : 'product_name', listeners : {
								change : this.onAutoSearch, scope : this
							}
						} ]
					},
					Ext.create('WJM.product.ProductCategoryTree', {
						region : 'west', width : 200, editAble : false, collapsible : true, title : '类别检索', editAble : this.editAble, listeners : {
							selectionchange : function(selectionModel, selecteds, eOpts) {
								var recode = selectionModel.getSelection()[0];
								if (recode) {
									this.clearExtraParam();
									var store = Ext.data.StoreManager.lookup('ProductStore');
									store.getProxy().setExtraParam('product_type', recode.getId());
									store.loadPage(1);
								}
							}, scope : this
						}
					}),
					{
						store : 'ProductStore', disableSelection : false, multiSelect : true, loadMask : true, region : 'center', xtype : 'gridpanel',
						columns : _fileds, viewConfig : {
							plugins : [ Ext.create('Ext.grid.plugin.DragDrop', {
								ptype : 'gridviewdragdrop', ddGroup : 'TProduct', enableDrop : false
							}) ]
						}, bbar : Ext.create('Ext.PagingToolbar', {
							store : 'ProductStore', displayInfo : true, displayMsg : '显示 产品 {0} - {1} 总共 {2}', emptyMsg : "没有产品数据"
						})
					} ]
		});
		var store = Ext.data.StoreManager.lookup('ProductStore');
		store.loadPage(1);
		this.callParent();
	},
	/**
	 * 自动搜索
	 */
	onAutoSearch : function(field, newValue, oldValue, eOpts) {
		if (newValue && newValue.length >= 3) {
			this.onSearchClick();
		}
	},
	/**
	 * 删除
	 */
	onDeleteClick : function() {
		var selection = this.down('grid').getView().getSelectionModel().getSelection()[0];
		if (selection) {
			Ext.Msg.confirm('提示', '确定要删除此产品么？', function(btn, text) {
				if (btn == 'yes') {
					var store = Ext.data.StoreManager.lookup('ProductStore');
					store.remove(selection);
				}
			}, this);
		} else {
			Ext.Msg.alert('提示', '请选择产品');
		}
	},
	/**
	 * 添加
	 */
	onAddClick : function() {
		var des = myDesktopApp.getDesktop();
		var win = des.getWindow('ProductForm');
		if (win) {
			win.destroy();
		}
		win = des.createWindow({
			title : "新建产品", iconCls : 'icon-grid', animCollapse : false, constrainHeader : true, layout : 'fit',
			items : [ Ext.create('WJM.product.ProductForm', {
				listeners : {
					saveSuccess : this.onSaveSuccess, scope : this
				}
			}) ]
		});
		win.show();
	},
	/**
	 * 编辑
	 */
	onEditClick : function() {
		var selection = this.down('grid').getView().getSelectionModel().getSelection()[0];
		if (selection) {
			var des = myDesktopApp.getDesktop();
			var form = Ext.create('WJM.product.ProductForm', {
				listeners : {
					saveSuccess : this.onSaveSuccess, scope : this
				}, record : selection
			});
			var win = des.getWindow('ProductForm');
			if (win) {
				win.destroy();
			}
			win = des.createWindow({
				title : "编辑产品", iconCls : 'icon-grid', animCollapse : false, constrainHeader : true, layout : 'fit', items : [ form ]
			});
			win.show();
			form.getForm().loadRecord(selection);
		} else {
			Ext.Msg.alert('提示', '请选择产品');
		}
	},
	/**
	 * 保存成功回调
	 */
	onSaveSuccess : function(that) {
		var win = that.ownerCt;
		win.destroy();
		var store = Ext.data.StoreManager.lookup('ProductStore');
		store.loadPage(1);
		this.show();
	},
	/**
	 * 搜索
	 */
	onSearchClick : function() {
		this.clearExtraParam();
		var data = this.down('form').getForm().getFieldValues();
		var store = Ext.data.StoreManager.lookup('ProductStore');
		Ext.Object.each(data, function(key, value) {
			store.getProxy().setExtraParam(key, value);
		});
		store.loadPage(1);
	},
	/**
	 * 清除store
	 */
	clearExtraParam : function() {
		var data = this.down('form').getForm().getFieldValues();
		var store = Ext.data.StoreManager.lookup('ProductStore');
		Ext.Object.each(data, function(key, value) {
			store.getProxy().setExtraParam(key, null);
		});
		store.getProxy().setExtraParam('product_type', null);
	}
});Ext.define('WJM.product.ProductManageModel', {
	extend : 'Ext.ux.desktop.Module',

	requires : [ 'WJM.model.TProduct' ],

	id : 'product',

	init : function() {
		this.id = this.config.moduleId || 'product';
		this.title = this.config.menuText || 'product/产品';
	},

	createWindow : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow(this.id);
		if (!win) {
			var grid = Ext.create('WJM.product.ProductGrid', {
				editAble : true, hasCost : true
			});
			win = desktop.createWindow({
				id : this.id, title : this.title, width : 800, height : 600, iconCls : 'icon-grid', animCollapse : false, constrainHeader : true,
				layout : 'fit', items : grid
			});
		}
		return win;
	}
});
/**
 * 产品快速检索
 */
Ext.define('WJM.product.ProductQuickSearchForm', {
    extend: 'Ext.form.Panel',
    requires: [ 'WJM.model.TProduct' ],
    keyMapTarget: null,
    keyMap: null,
    initComponent: function () {
        var me = this;
        Ext.apply(this, {
            bodyPadding: 10,
            items: [
                {
                    store: 'ProductQuickStore', xtype: 'combobox', fieldLabel: '产品智能检索(ctrl+alt+p)', labelWidth: 100, name: 'product_quick',
                    displayField: 'product_name_full', valueField: 'id', queryParam: 'product_quick', forceSelection: true, hideTrigger: true,
                    queryDelay: 500, enableKeyEvents: true, minChars: 1, mode: 'remote', anchor: '100%', listeners: {
                    select: me.onProductSelect, scope: me
                }
                }
            ]
        });
        this.callParent();
        me.on("afterrender", this.initKeyMap, me);
    },

    /**
     * 选择返回
     *
     * @param combo
     * @param records
     */
    onProductSelect: function (combo, records) {
        combo.setValue('');
        var results = [];
        Ext.Array.each(records, function (item) {
            results.push(Ext.create('WJM.model.TProduct', item.getData()));
        });
        this.fireEvent('onProductLoad', {
            records: results
        });
    },
    /**
     * 设置产品框高亮
     */
    setFocusProductQuickSearch: function () {
        console.log("customer");
        this.down('combobox').focus();
    },

    beforeDestroy: function () {
        Ext.destroy(this.keyMap);
        this.callParent();
    },

    initKeyMap: function () {
        var me = this;
        this.keyMap = new Ext.util.KeyMap({
            target: 'bodycss',
            key: 'p',
            fn: me.setFocusProductQuickSearch,
            scope: me,
            eventName: "keydown",
            alt: true,
            ctrl: true,
            shift: false
        });
        this.keyMap.enable();
    },
    beforehide: function () {
        this.keyMap.disable();
        this.callParent();
    }
})
;Ext.define('WJM.product.ProductSearchModel', {
	extend : 'Ext.ux.desktop.Module',

	requires : [ 'WJM.model.TProduct' ],

	id : 'productsearch',

	init : function() {
		this.id = this.config.moduleId || 'productsearch';
		this.title = this.config.menuText || 'search/产品搜索';
	},

	createWindow : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow(this.id);
		if (!win) {
			var grid = Ext.create('WJM.product.ProductGridNew', {
				editAble : false, hasCost : WJM.Config.hasProductManageRole()
			});
			win = desktop.createWindow({
				id : this.id, title : this.title, width : 800, height : 600, iconCls : 'icon-grid', animCollapse : false, constrainHeader : true,
				layout : 'fit', items : grid
			});
		}
		return win;
	}
});
/**
 * 产品列表
 */
Ext.define('WJM.product.widget.ProductGrid', {
	extend : 'Ext.panel.Panel',
	requires : [ 'Ext.grid.Panel' ],
	/**
	 * 是否可以编辑
	 */
	editAble : false,
	/**
	 * 进货价格显示
	 */
	hasCost : true,

	layout : {
		type : 'border', padding : 2
	},
	defaults : {
		split : true
	},

	productStore : 'ProductStore',

	initComponent : function() {
		var _fileds = [];
		if (this.editAble) {
			this.editTopBar = Ext.create('Ext.toolbar.Toolbar', {
				items : [ {
					iconCls : 'add', text : '添加', scope : this, handler : this.onAddClick
				}, {
					iconCls : 'edit', text : '编辑', scope : this, handler : this.onEditClick
				}, {
					iconCls : 'remove', text : '删除', scope : this, handler : this.onDeleteClick
				} ]
			});
		} else {
			this.editTopBar = null;
		}
		if (this.hasCost) {
			_fileds = [ {
				xtype : 'rownumberer'
			}, {
				text : "items id/助记符", dataIndex : 'product_id', sortable : true, width : 100
			}, {
				text : "barcode #/条码", dataIndex : 'code', sortable : true, width : 100
			}, {
				text : "description 1", dataIndex : 'product_name', sortable : true, width : 200
			}, {
				text : "description 2", dataIndex : 'product_name_cn', sortable : true, width : 200
			}, {
				text : "category id/分类", dataIndex : 'product_type', sortable : true, width : 100, renderer : function(value) {
					var store = Ext.data.StoreManager.lookup('ProductCategoryAllStore');
					var record = store.getById(Number(value));
					if (record) {
						return record.get('product_type_name');
					}
				}
			}, {
				text : "cost/进货价", dataIndex : 'price_income', sortable : true, xtype : 'numbercolumn', format : '$0.00'
			}, {
				text : "sale price/销售价格", dataIndex : 'price_simgle', sortable : true, xtype : 'numbercolumn', format : '$0.00'
			}, {
				text : "WHLS price", dataIndex : 'price_wholesale', sortable : true, xtype : 'numbercolumn', format : '$0.00'
			}, {
				text : "quantity/数量", dataIndex : 'num', sortable : true
			}, {
				text : "min Stock/最小库存", dataIndex : 'downLimit', sortable : true
			}, {
				text : "vendor/供货商", dataIndex : 'vendortName', sortable : true
			} ];
		} else {
			_fileds = [ {
				xtype : 'rownumberer'
			}, {
				text : "items id/助记符", dataIndex : 'product_id', sortable : true, width : 100
			}, {
				text : "barcode #/条码", dataIndex : 'code', sortable : true, width : 100
			}, {
				text : "description 1", dataIndex : 'product_name', sortable : true, width : 200
			}, {
				text : "description 2", dataIndex : 'product_name_cn', sortable : true, width : 200
			}, {
				text : "category id/分类", dataIndex : 'product_type', sortable : true, width : 100, renderer : function(value) {
					var store = Ext.data.StoreManager.lookup('ProductCategoryAllStore');
					var record = store.getById(Number(value));
					if (record) {
						return record.get('product_type_name');
					}
				}
			}, {
				text : "sale price/销售价格", dataIndex : 'price_simgle', sortable : true, xtype : 'numbercolumn'
			}, {
				text : "WHLS price", dataIndex : 'price_wholesale', sortable : true, xtype : 'numbercolumn'
			}, {
				text : "quantity/数量", dataIndex : 'num', sortable : true
			}, {
				text : "min Stock/最小库存", dataIndex : 'downLimit', sortable : true
			}, {
				text : "vendor/供货商", dataIndex : 'vendortName', sortable : true
			} ];
		}
		Ext.apply(this, {
			autoScroll : true,
			dockedItems : [ this.editTopBar ],

			items : [ {
				store : this.productStore, disableSelection : false, multiSelect : true, loadMask : true, region : 'center', xtype : 'gridpanel',
				columns : _fileds, viewConfig : {
					plugins : [ Ext.create('Ext.grid.plugin.DragDrop', {
						ptype : 'gridviewdragdrop', ddGroup : 'TProduct', enableDrop : false
					}) ]
				}, bbar : Ext.create('Ext.PagingToolbar', {
					store : this.productStore, displayInfo : true, displayMsg : '显示 产品 {0} - {1} 总共 {2}', emptyMsg : "没有产品数据"
				})
			} ]
		});
		this.callParent();
	},
	/**
	 * 删除
	 */
	onDeleteClick : function() {
		var selection = this.down('grid').getView().getSelectionModel().getSelection()[0];
		if (selection) {
			Ext.Msg.confirm('提示', '确定要删除此产品么？', function(btn, text) {
				if (btn == 'yes') {
					var store = Ext.data.StoreManager.lookup('ProductStore');
					store.remove(selection);
				}
			}, this);
		} else {
			Ext.Msg.alert('提示', '请选择产品');
		}
	},
	/**
	 * 添加
	 */
	onAddClick : function() {
		var des = myDesktopApp.getDesktop();
		win = des.createWindow({
			title : "新建产品", iconCls : 'icon-grid', animCollapse : false, constrainHeader : true, layout : 'fit',
			items : [ Ext.create('WJM.product.ProductForm', {
				listeners : {
					saveSuccess : this.onSaveSuccess, scope : this
				}
			}) ]
		});
		win.show();
	},
	/**
	 * 编辑
	 */
	onEditClick : function() {
		var selection = this.down('grid').getView().getSelectionModel().getSelection()[0];
		if (selection) {
			var des = myDesktopApp.getDesktop();
			var form = Ext.create('WJM.product.ProductForm', {
				listeners : {
					saveSuccess : this.onSaveSuccess, scope : this
				}, record : selection
			});
			win = des.createWindow({
				title : "编辑产品", iconCls : 'icon-grid', animCollapse : false, constrainHeader : true, layout : 'fit', items : [ form ]
			});
			win.show();
			form.getForm().loadRecord(selection);
		} else {
			Ext.Msg.alert('提示', '请选择产品');
		}
	},
	/**
	 * 保存成功回调
	 */
	onSaveSuccess : function(that) {
		var win = that.ownerCt;
		win.destroy();
		var store = Ext.data.StoreManager.lookup('ProductStore');
		store.loadPage(1);
		this.show();
	}
});/**
 * 我的销售单
 */
Ext.define('WJM.purchase.MyPurchaseModel', {
	extend : 'Ext.ux.desktop.Module',

	requires : [ 'WJM.model.TPurchase', 'WJM.model.TPurchaseProduct' ],

	id : 'mypurchase',

	init : function() {
		this.id = this.config.moduleId || 'mypurchase';
		this.title = this.config.menuText || 'my P.O./我的订货';
	},

	createWindow : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow(this.id);
		if (!win) {
			var grid = Ext.create('WJM.purchase.PurchaseGrid', {
				editAble : true, receiveAble : false, cashAble : false, deleteAble : true, purchaseStore : 'PurchaseMyStore',
				purchaseProductStore : 'PurchaseProductMyStore', onlyMy : true
			});
			win = desktop.createWindow({
				id : this.id, title : this.title, width : 980, height : 600, iconCls : 'icon-grid', animCollapse : false, constrainHeader : true,
				layout : 'fit', items : grid
			});
		}
		return win;
	}
});
/**
 * 订单表单
 */
Ext.define('WJM.purchase.PurchaseForm', {
	extend : 'Ext.form.Panel',
	requires : [ 'WJM.model.TPurchase', 'WJM.model.TProductVendor', 'WJM.model.TProduct' ],
	bodyPadding : 10,

	// closeAction : 'destroy',
	record : null,

	initComponent : function() {
		var me = this;
		this.gridStoreId = Ext.Number.randomInt(1000000, 9999999).toString();
		Ext.create('Ext.data.Store', {
			storeId : this.gridStoreId, autoLoad : false, model : 'WJM.model.TProduct'
		});
		var _fileds = [
				{
					xtype : 'rownumberer'
				},
				{
					text : "barcode #/条码", dataIndex : 'code', sortable : true, width : 100
				},
				{
					text : "description 1", dataIndex : 'product_name', sortable : true, width : 200
				},
				{
					text : "unit price/单价", dataIndex : 'price_income', sortable : true, xtype : 'numbercolumn', format : '$0.00', editor : {
						xtype : 'adnumberfield', allowBlank : false, minValue : 0
					}
				},
				{
					text : "vendor/供应商",
					dataIndex : 'vendortName',
					sortable : true,
					editor : {
						xtype : 'combobox', name : 'provider_id', displayField : 'vendor_name', valueField : 'vendor_name',
						store : 'ProductVendorStore', allowBlank : false, listeners : {
							select : me.onVendorSelect, scope : me
						}
					}
				}, {
					text : "quantity/数量", dataIndex : 'num', sortable : true, xtype : 'numbercolumn', format : '0,000', editor : {
						xtype : 'numberfield', allowBlank : false, allowDecimals : false, minValue : 0
					}
				}, {
					text : "sub total/小计", dataIndex : 'total', sortable : true, xtype : 'numbercolumn', format : '$0.00'
				} ];

		this.editor = Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit : 1, listeners : {
				edit : me.calculateTotal, scope : me, beforeedit : me.onGridBeforeEdit
			}
		});
		Ext.applyIf(me, {
			defaults : {
				xtype : 'textfield', anchor : '100%', labelWidth : 150
			},
			items : [
					{
						name : 'id', xtype : 'hiddenfield'
					},
					Ext.create('WJM.product.ProductQuickSearchForm', {
						anchor : '100%', height : 50, listeners : {
							onProductLoad : me.onProductLoad, scope : me
						}
					}),
					{
						anchor : '100% -150', disableSelection : false, loadMask : true, xtype : 'gridpanel', columns : _fileds,
						plugins : [ this.editor ], store : this.gridStoreId,

						viewConfig : {
							plugins : [ Ext.create('Ext.grid.plugin.DragDrop', {
								ddGroup : 'TProduct', enableDrop : true, enableDrag : false
							}) ],

							listeners : {
								drop : function(node, data, overModel, dropPosition, eOpts) {
									for ( var i = 0; i < data.records.length; i++) {
										var array_element = data.records[i];
										//array_element.set("num", 1);
										if (array_element.modelName == 'WJM.model.TSaleProduct') {
											array_element.set('id', array_element.get('product_id'));
											array_element.set('price_income', '-1');
										}
										array_element.set("num",0);
									}
									this.calculateTotal();
								},

								beforedrop : function(node, data, overModel, dropPosition, dropFunction, eOpts) {
									data.copy = true;
									var gridpanle = me.down('gridpanel');
									var store = gridpanle.getStore();
									data.records = Ext.Array.filter(data.records, function(item) {
										if (item.isModel) {
											if (item.modelName == 'WJM.model.TSaleProduct') {
												var data = store.getById(item.get('product_id'));
												if (data) {
													//data.set("num", data.get("num") + 1);
													return false;
												} else {
													return true;
												}
											} else if (item.modelName == 'WJM.model.TProduct') {
												var data = store.getById(item.getId());
												if (data) {
													//data.set("num", data.get("num") + 1);
													return false;
												} else {
													return true;
												}
											} else {
												return false;
											}
										} else {
											return false;
										}
									});
									this.calculateTotal();
								}, scope : me
							}
						}
					},
					{
						xtype : 'container',
						padding : '10 0 0 0',
						layout : {
							columns : 2, type : 'table', tableAttrs : {
								style : {
									width : '100%'
								}
							}, tdAttrs : {
								style : {
									width : '50%'
								}
							}
						},
						items : [
								{
									xtype : 'textfield', name : 'oper_name', labelWidth : 110, width : '90%', fieldLabel : 'Worker ID/操作员',
									allowBlank : false, readOnly : true, value : window.user.userName
								},
								{
									xtype : 'textfield', name : 'oper_time', fieldLabel : 'date/时间', width : '90%', labelWidth : 110, allowBlank : false,
									readOnly : true, value : Ext.Date.format(new Date(), 'Y-m-d H:i:s')
								} ]
					},
					{
						name : 'all_purchase_price', fieldLabel : 'Total/总计', allowBlank : false, readOnly : true, xtype : 'adnumberfield',
						minValue : 0
					} ],

			dockedItems : [ {
				xtype : 'toolbar', dock : 'top', items : [ {
					xtype : 'button', iconCls : 'save', text : '保存', scope : this, handler : this.onSaveClick
				}, {
					xtype : 'button', iconCls : 'search', text : '搜索产品', scope : this, handler : this.onProductSearchClick
				}, {
					xtype : 'button', iconCls : 'search', text : '从订单选择产品', scope : this, handler : this.onSearchSaleClick
				}, {
					xtype : 'button', iconCls : 'search', text : '清空', scope : this, handler : this.clearForm
				}, {
					xtype : 'button', iconCls : 'remove', text : '删除产品', scope : this, handler : this.onRemoveProductClick
				} ]
			} ]
		});
		me.callParent(arguments);
		if (this.record) {
			me.loadRecord(this.record);
			var store = Ext.data.StoreManager.lookup('PurchaseProductStore');
			store.getProxy().setExtraParam('purchase_id', this.record.getId());
			store.load({
				scope : this, callback : this.onPurchaseProductLoad
			});
		}
	},

	/**
	 * 保存
	 */
	onSaveClick : function() {
		var form = this.getForm();
		var me = this;
		var datas = this.down('gridpanel').getStore().data;
		var redod = [];
		var flag = true,
			num_flag = true;
		datas.each(function(item) {
			if (!item.get('provider_id') || item.get('provider_id') == 0) {
				flag = false;
			}
			
			redod.push(item.getData());
		});
		if (!flag) {
			Ext.Msg.alert('提示', '请选择产品的供应商！');
			return;
		}
		this.calculateTotal();
		if (form.isValid()) {
			if (redod.length == 0) {
				Ext.Msg.alert('提示', '请选择产品');
				return;
			}
			this.submit({
				url : 'purchase_order.do?action=stock_submit_old', params : {
					purchaseProducts : Ext.JSON.encode(redod)
				},

				success : function(form, action) {
					Ext.Msg.alert('提示', '保存成功');
					me.clearForm();
					var result = action.result;
					if (result.purchase_id) {
						Ext.Array.each(result.purchase_id, function(id) {
							window.open(location.context + '/purchase_order.do?action=print_bill&id=' + id, "_blank");
						});
					}
					me.fireEvent('saveSuccess', me);
				},

				failure : function(form, action) {
					Ext.Msg.alert('提示', action.result.msg || '保存失败，请稍候重试');
				}
			});
		}
	},

	/**
	 * 搜索产品
	 */
	onProductSearchClick : function() {
		var desktop = myDesktopApp.getDesktop();
		var win = desktop.getWindow('productsearch');
		if (!win) {
			var grid = Ext.create('WJM.product.ProductGrid', {
				editAble : false
			});
			win = desktop.createWindow({
				id : 'productsearch', title : "search/产品搜索", width : 600, height : 600, iconCls : 'icon-grid', animCollapse : false,
				constrainHeader : true, layout : 'fit', items : [ grid ]
			});
		}
		win.show();
	},

	/**
	 * 搜索供应商
	 */
	onVendorSearchClick : function() {
		var desktop = myDesktopApp.getDesktop();
		var win = desktop.getWindow('VendorSearchGrid');
		if (!win) {
			var grid = Ext.create('WJM.vendor.VendorGrid', {
				editAble : false
			});
			win = desktop.createWindow({
				id : 'VendorSearchGrid', title : "供货商检索", width : 600, height : 600, iconCls : 'icon-grid', animCollapse : false,
				constrainHeader : true, layout : 'fit', items : [ grid ]
			});
		}
		win.show();
	},
	/**
	 * 搜索订单
	 */
	onSearchSaleClick : function() {
		var desktop = myDesktopApp.getDesktop();
		var win = desktop.getWindow('SaleSearchGrid');
		if (!win) {
			var grid = Ext.create('WJM.sale.SaleGrid', {
				editAble : false, collapsedStatistics : true
			});
			win = desktop.createWindow({
				id : 'SaleSearchGrid', title : "订单检索(拖动订单详细产品到产品列表区域)", width : 800, height : 600, iconCls : 'icon-grid', animCollapse : false,
				constrainHeader : true, layout : 'fit', items : [ grid ]
			});
		}
		win.show();
	},
	/**
	 * 计算总数
	 */
	calculateTotal : function() {
		var total = 0;
		var datas = this.down('gridpanel').getStore().data;
		datas.each(function(item) {
			item.set('total', item.get('num') * item.get('price_income'));
			total += item.get('num') * item.get('price_income');
		});
		this.getForm().findField('all_purchase_price').setValue(total);
	},
	/**
	 * 重置表单
	 */
	clearForm : function() {
		this.down('gridpanel').getStore().removeAll();
		var fields = this.getForm().getFields();
		fields.each(function(item) {
			item.setValue('');
		});
		this.getForm().findField('oper_time').setValue(Ext.Date.format(new Date(), 'Y-m-d H:i:s'));
		this.getForm().findField('oper_name').setValue(window.user.userName);
		this.calculateTotal();
	},
	/**
	 * 列表编辑前初始化下拉选项
	 */
	onGridBeforeEdit : function(editor, e, eOpts) {
		if (e.field == 'vendortName') {
			var store = Ext.data.StoreManager.lookup('ProductVendorStore');
			store.getProxy().setExtraParam('product_id', e.record.getId());
			store.getProxy().setExtraParam('product_name', null);
			store.getProxy().setExtraParam('vendor_id', null);
			store.getProxy().setExtraParam('vendor_name', null);
			store.load();
		}
	},
	/**
	 * 用户选择了一个供应商，修改单价和名字
	 */
	onVendorSelect : function(combo, records, eOpts) {
		var product = this.down('gridpanel').getView().getSelectionModel().getSelection()[0];
		if (product) {
			product.set('provider_id', records[0].get('vendor_id'));
			product.set('vendortName', records[0].get('vendor_name'));
			product.set('price_income', records[0].get('price'));
		}
	},

	onPurchaseProductLoad : function(records, opt, successful) {
		if (successful) {
			var products = [];
			var me = this;
			Ext.Array.each(records, function(item) {
				var product = Ext.create('WJM.model.TProduct');
				product.setId(item.get('product_id'));
				product.set('code', item.get('product_code'));
				product.set('product_name', item.get('product_name'));
				product.set('vendortName', me.record.get('provider_name'));
				product.set('provider_id', me.record.get('provider_id'));
				product.set('price_income', item.get('product_price'));
				product.set('num', item.get('product_num'));
				products.push(product);
			});
			this.down('gridpanel').getStore().loadRecords(products);
			this.calculateTotal();
		}
	},

	/**
	 * 查询返回
	 * 
	 * @param records
	 * @param opt
	 * @param successful
	 */
	onProductLoad : function(opt) {
		var me = this;
		var gridpanle = me.down('gridpanel');
		var store = gridpanle.getStore();
		Ext.Array.each(opt.records, function(item) {
			var data = store.getById(item.getId());
			if (data) {
				//data.set("num", data.get("num") + 1);
			} else {
				//item.set("num", 1);
				store.add(item);
			}
		});
		me.calculateTotal();
		this.editor.startEdit(opt.records[0], 5);
	},
	/**
	 * 删除产品
	 */
	onRemoveProductClick : function() {
		var me = this;
		var gridpanle = me.down('gridpanel');
		var selection = gridpanle.getView().getSelectionModel().getSelection()[0];
		if (selection) {
			gridpanle.getStore().remove(selection);
			me.calculateTotal();
		} else {
			Ext.Msg.alert('提示', '请选择产品');
		}
	},

	beforeDestroy : function() {
		Ext.data.StoreManager.unregister(this.gridStoreId);
		this.callParent();
	}

});/**
 * 订单模块
 */
Ext.define('WJM.purchase.PurchaseFormModel', {
	extend : 'Ext.ux.desktop.Module',

	requires : [ 'WJM.model.TPurchase', 'WJM.model.TPurchaseProduct' ],

	id : 'purchase',

	init : function() {
		this.id = this.config.moduleId || 'purchase';
		this.title = this.config.menuText || 'P.O.(General)/订货';
	},

	createWindow : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow(this.id);
		if (!win) {
			var grid = Ext.create('WJM.purchase.PurchaseForm');
			win = desktop.createWindow({
				id : this.id, title : this.title, width : 800, height : 500, iconCls : 'icon-grid', animCollapse : false, constrainHeader : true,
				layout : 'fit', items : grid
			});
			win.down('form').clearForm();
		} else {
			win.down('form').clearForm();
		}
		return win;
	}
});
/**
 * 采购单查询
 */
Ext.define('WJM.purchase.PurchaseGrid', {
	extend : 'Ext.panel.Panel',
	requires : [ 'Ext.grid.Panel' ],
	collapsedStatistics : false,
	layout : {
		type : 'border', padding : 5
	},
	defaults : {
		split : true
	},
	/**
	 * 是否可以删除
	 */
	deleteAble : false,
	/**
	 * 是否可以编辑
	 */
	editAble : false,
	/**
	 * 可以付款
	 */
	cashAble : false,
	/**
	 * 可以收货
	 */
	receiveAble : false,

	receiveEditing : null,

	purchaseStore : 'PurchaseStore',

	purchaseProductStore : 'PurchaseProductStore',
	/**
	 * 只显示我的
	 */
	onlyMy : false,

	initComponent : function() {
		var _fileds = [
				{
					xtype : 'rownumberer'
				},
				{
					text : "P.O. #/定单号", dataIndex : 'purchase_bill_code', sortable : true
				},
				{
					text : "Work ID/操作员", dataIndex : 'oper_name', sortable : true
				},
				{
					text : "vendor name/供货商", dataIndex : 'provider_name', sortable : true
				},
				{
					text : "total/总计", dataIndex : 'all_purchase_price', sortable : true, xtype : 'numbercolumn', format : '$0.00'
				},
				{
					text : "actual received amount/完成货总额", dataIndex : 'actual_received_amount', sortable : true, xtype : 'numbercolumn',
					format : '$0.00'
				}, {
					text : "Invoice/账单", dataIndex : 'invoice_code', sortable : true
				}, {
					text : "P.O. balance/订单余额", dataIndex : 'balance', sortable : true, xtype : 'numbercolumn', format : '$0.00'
				}, {
					text : "received status/收货状态", dataIndex : 'if_stockStr', sortable : true
				}, {
					text : "payment status/付款状态", dataIndex : 'paidStr', sortable : true
				}, {
					text : "date/时间", dataIndex : 'oper_time', sortable : true
				} ];

		var _fileds2 = [ {
			xtype : 'rownumberer'
		}, {
			text : "barcode #/条码", dataIndex : 'product_code', sortable : true
		}, {
			text : "item name/名称", dataIndex : 'product_name', sortable : true
		}, {
			text : "unit price/单价", dataIndex : 'product_price', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "quantity/数量", dataIndex : 'product_num', sortable : true
		}, {
			text : "sub total/小计", dataIndex : 'sub_total', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "Actual received/已经收到", dataIndex : 'actual_received', sortable : true, xtype : 'numbercolumn'
		} ];
		var defaultItems = [ {
			iconCls : 'search', text : '搜索', scope : this, handler : this.onSearchClick
		}, {
			iconCls : 'search', text : '打印', scope : this, handler : this.onSalePrintClick
		}, {
			iconCls : 'search', text : '清空', scope : this, handler : this.clearSearch
		} ];
		if (this.cashAble) {
			defaultItems.push({
				iconCls : 'edit', text : '添加账单', scope : this, handler : this.onAddInvoiceClick
			}, {
				iconCls : 'edit', text : '付款', scope : this, handler : this.onCashClick
			});
		}
		if (this.receiveAble) {
			defaultItems.push({
				iconCls : 'edit', text : '全部收货', scope : this, handler : this.onReceiveClick
			});
			_fileds2.push({
				text : "received num/收到个数", dataIndex : 'receive_num', sortable : true, width : 150, xtype : 'numbercolumn', editor : {
					xtype : 'numberfield', allowBlank : false, allowDecimals : false, minValue : 1
				}
			}, {
				xtype : 'actioncolumn',
				text : "receive/收货",
				align : 'center',
				width : 100,
				items : [ {
					width : 66,
					height : 24,
					iconCls : 'shouhuo-button',
					html : '<span>receive/收货</span>',
					tooltip : 'receive/收货',
					handler : function(grid, rowIndex, colIndex) {
						var recod = grid.getStore().getAt(rowIndex);
						if (recod) {
							if (recod.get("if_stock") == 1) {
								Ext.Msg.alert('提示', '此货物已经完全收获');
							} else {
								if (!recod.get("receive_num") || recod.get("receive_num") <= 0
										|| recod.get("product_num") - recod.get("receive_num") - recod.get("actual_received") < 0) {
									Ext.Msg.alert('提示', '请填写正确的收货数量');
								} else {
									this.receivePrdouct([ recod ]);
								}
							}
						}
					}, scope : this
				} ]
			});
			this.receiveEditing = Ext.create('Ext.grid.plugin.CellEditing', {
				clicksToEdit : 1
			});
		}
		if (this.deleteAble) {
			defaultItems.push({
				iconCls : 'remove', text : '删除', scope : this, handler : this.onDeleteClick
			});
		}
		if (this.editAble) {
			defaultItems.push({
				iconCls : 'edit', text : '编辑', scope : this, handler : this.onEditClick
			});
		}

		this.editTopBar = Ext.create('Ext.toolbar.Toolbar', {
			items : defaultItems
		});

		var searchField = [];

		if (this.onlyMy) {
			searchField.push({
				xtype : 'datefield', fieldLabel : 'start date/开始时间', labelWidth : 150, name : 'oper_time_start', format : 'Y-m-d'
			}, {
				xtype : 'datefield', fieldLabel : 'end date/结束时间', labelWidth : 150, name : 'oper_time_end', format : 'Y-m-d'
			}, {
				xtype : 'combobox', fieldLabel : 'paid/付款', labelWidth : 150, name : 'paid', displayField : 'name', valueField : 'value',
				store : 'PurchasePaidStateStore', value : '-1'
			}, {
				xtype : 'combobox', fieldLabel : 'check/确认到货', labelWidth : 150, name : 'if_stock', displayField : 'name', valueField : 'value',
				store : 'PurchaseStockStateStore', value : '-1'
			}, {
				xtype : 'textfield', fieldLabel : 'P.O. #/定单号', labelWidth : 150, allowBlank : true, name : 'purchase_bill_code'
			}, {
				name : 'oper_id', value : window.user.userId, xtype : 'hiddenfield'
			});
		} else {
			searchField.push({
				xtype : 'datefield', fieldLabel : 'start date/开始时间', labelWidth : 150, name : 'oper_time_start', format : 'Y-m-d'
			}, {
				xtype : 'datefield', fieldLabel : 'end date/结束时间', labelWidth : 150, name : 'oper_time_end', format : 'Y-m-d'
			}, {
				xtype : 'combobox', fieldLabel : 'paid/付款', labelWidth : 150, name : 'paid', displayField : 'name', valueField : 'value',
				store : 'PurchasePaidStateStore', value : '-1'
			}, {
				xtype : 'combobox', fieldLabel : 'check/确认到货', labelWidth : 150, name : 'if_stock', displayField : 'name', valueField : 'value',
				store : 'PurchaseStockStateStore', value : '-1'
			}, {
				xtype : 'combobox', fieldLabel : 'Work ID/操作员', labelWidth : 150, allowBlank : true, name : 'oper_id', displayField : 'name',
				valueField : 'id', store : 'EmployeeAllStore'
			}, {
				xtype : 'textfield', fieldLabel : 'P.O. #/定单号', labelWidth : 150, allowBlank : true, name : 'purchase_bill_code'
			});
		}

		Ext.apply(this, {
			autoScroll : true,
			dockedItems : [ this.editTopBar ],

			items : [
					{
						name : 'id', xtype : 'hiddenfield'
					},
					{
						anchor : '100%', height : 100, xtype : 'form', region : 'north', autoScroll : true, collapsible : true, title : '采购单检索',
						layout : {
							columns : 3, type : 'table', tableAttrs : {
								style : {
									width : '100%'
								}
							}
						}, bodyPadding : 10, items : searchField
					},
					{
						store : this.purchaseStore, split : true, disableSelection : false, loadMask : true, autoScroll : true, region : 'center',
						title : '采购单', xtype : 'gridpanel', columns : _fileds,

						viewConfig : {
							plugins : []
						},

						listeners : {
							selectionchange : function(selectionModel, selecteds, eOpts) {
								var recode = selectionModel.getSelection()[0];
								if (recode) {
									var store = Ext.data.StoreManager.lookup(this.purchaseProductStore);
									store.getProxy().setExtraParam('purchase_id', recode.getId());
									store.load();
								}
							}, scope : this
						},

						bbar : Ext.create('Ext.PagingToolbar', {
							store : this.purchaseStore, displayInfo : true, displayMsg : '显示采购单 {0} - {1} 总共 {2}', emptyMsg : "没有采购单数据"
						})
					},
					{
						store : this.purchaseProductStore, split : true, disableSelection : false, collapsible : true, split : true, loadMask : true,
						height : 150, autoScroll : true, region : 'south', multiSelect : true, title : '采购单明细', xtype : 'gridpanel',
						columns : _fileds2, viewConfig : {
							plugins : [ Ext.create('Ext.grid.plugin.DragDrop', {
								ddGroup : 'TProduct', enableDrop : false, enableDrag : true
							}) ]
						}, plugins : this.receiveAble ? [ this.receiveEditing ] : []
					} ]
		});
		this.callParent();
		this.onSearchClick();
	},
	/**
	 * 搜索
	 */
	onSearchClick : function() {
		var data = this.down('form[title="采购单检索"]').getForm().getFieldValues();
		var store = Ext.data.StoreManager.lookup(this.purchaseStore);
		var purchaseProductStore = Ext.data.StoreManager.lookup(this.purchaseProductStore);
		purchaseProductStore.removeAll();
		Ext.Object.each(data, function(key, value) {
			store.getProxy().setExtraParam(key, value);
		});
		store.loadPage(1);
	},
	/**
	 * 清空
	 */
	clearSearch : function() {
		var fields = this.down('form[title="采购单检索"]').getForm().getFields();
		fields.each(function(field) {
			if (field.getName() == 'if_stock' || field.getName() == 'paid') {
				field.setValue('-1');
			} else {
				field.setValue('');
			}
		});

	},
	/**
	 * 付款
	 */
	onCashClick : function() {
		var selection = this.down('grid[title="采购单"]').getView().getSelectionModel().getSelection()[0];
		if (selection) {
			if (selection.get('paid') == 0) {
				if (selection.get('invoice_code') && selection.get('invoice_code') != '') {
					var des = myDesktopApp.getDesktop();
					var form = Ext.create('WJM.cash.PurchaseCashForm', {
						listeners : {
							saveSuccess : this.onSaveSuccess, scope : this
						}, record : selection
					});
					win = des.createWindow({
						title : "付款", iconCls : 'icon-grid', animCollapse : false, constrainHeader : true, layout : 'fit', items : [ form ]
					});
					win.show();
				} else {
					Ext.Msg.alert('提示', '请先为此订单添加账单');
				}
			} else {
				Ext.Msg.alert('提示', '此采购单已经付款');
			}
		} else {
			Ext.Msg.alert('提示', '请选择采购单');
		}
	},
	/**
	 * 添加账单
	 */
	onAddInvoiceClick : function() {
		var selection = this.down('grid[title="采购单"]').getView().getSelectionModel().getSelection()[0];
		if (selection) {
			if (!selection.get('invoice_code') || selection.get('invoice_code') == '') {
				var des = myDesktopApp.getDesktop();
				var form = Ext.create('WJM.purchase.PurchaseInvoiceForm', {
					listeners : {
						saveSuccess : this.onSaveSuccess, scope : this
					}, record : selection
				});
				win = des.createWindow({
					title : "添加账单", iconCls : 'icon-grid', animCollapse : false, constrainHeader : true, layout : 'fit', items : [ form ]
				});
				win.show();
			} else {
				Ext.Msg.alert('提示', '此订单已经添加了账单');
			}
		} else {
			Ext.Msg.alert('提示', '请选择采购单');
		}
	},
	/**
	 * 收货
	 */
	onReceiveClick : function() {
		var selection = this.down('grid[title="采购单"]').getView().getSelectionModel().getSelection()[0];
		var me = this;
		if (selection) {
			if (selection.get('if_stock') == 0) {
				Ext.Msg.confirm('提示', '确定此采购单' + selection.get('purchase_bill_code') + '收货么？', function(btn, text) {
					if (btn == 'yes') {
						var proxy = new Ext.data.proxy.Ajax({
							model : 'WJM.model.TPurchase', url : 'purchase_order.do?action=receivePurchase',

							reader : new Ext.data.reader.Json({
								type : 'json', messageProperty : 'msg'
							}),

							writer : Ext.create('WJM.FormWriter')
						});
						proxy.setExtraParam('id', selection.getId());
						var op = new Ext.data.Operation({
							action : 'update'
						});
						proxy.read(op, function() {
							if (op.wasSuccessful()) {
								Ext.Msg.alert('提示', '收货成功');
								var store = Ext.data.StoreManager.lookup(this.purchaseStore);
								store.loadPage(1);
							} else {
								Ext.Msg.alert('提示', '收货失败，请稍候再试');
							}
						}, me);
					}
				}, this);
			} else {
				Ext.Msg.alert('提示', '此采购单已经收货');
			}
		} else {
			Ext.Msg.alert('提示', '请选择采购单');
		}
	},
	/**
	 * 自定义收获
	 * 
	 * @param records
	 */
	receivePrdouct : function(records) {
		var datas = [], me = this;
		Ext.Array.each(records, function(record) {
			if (record.get('if_stock') != 1) {
				datas.push(record.getData());
			}
		});
		var selection = this.down('grid[title="采购单"]').getView().getSelectionModel().getSelection()[0];
		if (datas.length > 0 && selection) {
			var proxy = new Ext.data.proxy.Ajax({
				model : 'WJM.model.TPurchase', url : 'purchase_order.do?action=checkPurchase',

				reader : new Ext.data.reader.Json({
					type : 'json', messageProperty : 'msg'
				}),

				writer : Ext.create('WJM.FormWriter')
			});
			proxy.setExtraParam('purchaseProducts', Ext.JSON.encode(datas));
			proxy.setExtraParam('id', selection.getId());
			var op = new Ext.data.Operation({
				action : 'update'
			});
			proxy.read(op, function() {
				if (op.wasSuccessful()) {
					Ext.Msg.alert('提示', '收货成功');
					var store = Ext.data.StoreManager.lookup(this.purchaseProductStore);
					store.getProxy().setExtraParam('purchase_id', selection.getId());
					store.load();
					var store2 = Ext.data.StoreManager.lookup(this.purchaseStore);
					store2.load();
				} else {
					Ext.Msg.alert('提示', '收货失败，请稍候再试');
				}
			}, me);
		}
	},
	/**
	 * 保存成功回调
	 */
	onSaveSuccess : function(that) {
		if (that) {
			var win = that.ownerCt;
			win.destroy();
		}
		var store = Ext.data.StoreManager.lookup(this.purchaseStore);
		store.loadPage(1);
		this.show();
	},
	/**
	 * 删除
	 */
	onDeleteClick : function() {
		var selection = this.down('grid[title="采购单"]').getView().getSelectionModel().getSelection()[0];
		if (selection) {
			if (!selection.canDelete()) {
				Ext.Msg.alert('提示', '此采购单已经收货或者已经付款、或者已经绑定账单，无法删除！');
			} else {
				Ext.Msg.confirm('提示', '确定要删除此采购单么？', function(btn, text) {
					if (btn == 'yes') {
						var store = Ext.data.StoreManager.lookup(this.purchaseStore);
						store.remove(selection);
					}
				}, this);
			}
		} else {
			Ext.Msg.alert('提示', '请选择产品');
		}
	},
	/**
	 * 打印
	 */
	onSalePrintClick : function() {
		var selection = this.down('grid[title="采购单"]').getView().getSelectionModel().getSelection()[0];
		if (selection) {
			window.open(location.context + '/purchase_order.do?action=print_bill&id=' + selection.getId(), "_blank");
		} else {
			Ext.Msg.alert('提示', '请选择产品');
		}
	},
	onEditClick : function() {
		var selection = this.down('grid[title="采购单"]').getView().getSelectionModel().getSelection()[0];
		if (selection) {
			if (selection.canEdit()) {
				var des = myDesktopApp.getDesktop();
				var form = Ext.create('WJM.purchase.PurchaseForm', {
					listeners : {
						saveSuccess : this.onSaveSuccess, scope : this
					}, record : selection
				});
				win = des.createWindow({
					title : "编辑采购单", iconCls : 'icon-grid', animCollapse : false, width : 800, height : 500, constrainHeader : true, layout : 'fit',
					items : [ form ]
				});
				win.show();
			} else {
				Ext.Msg.alert('提示', '此采购不可以编辑。');
			}
		} else {
			Ext.Msg.alert('提示', '请选择采购');
		}
	}
});/**
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
});/**
 * 销售单查询
 */
Ext.define('WJM.purchase.PurchaseReportModel', {
	extend : 'Ext.ux.desktop.Module',

	requires : [ 'WJM.model.TPurchase', 'WJM.model.TPurchaseProduct'],

	id : 'purchasedetail',

	init : function() {
		this.id = this.config.moduleId || 'purchasedetail';
		this.title = this.config.menuText || 'purchase detail/购买报表';
	},

	createWindow : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow(this.id);
		if (!win) {
			var grid = Ext.create('WJM.purchase.PurchaseGrid', {
				editAble : false, receiveAble : false, cashAble : false, deleteAble : false
			});
			win = desktop.createWindow({
				id : this.id, title : this.title, width : 980, height : 600, iconCls : 'icon-grid', animCollapse : false, constrainHeader : true,
				layout : 'fit', items : grid
			});
		}
		return win;
	}
});
/**
 * 超期未付款查询预警
 */
Ext.define('WJM.sale.CreditWarningGrid', {
	extend : 'Ext.panel.Panel',
	requires : [ 'Ext.grid.Panel' ],
	layout : {
		type : 'border', padding : 5
	},
	closeAction : 'destroy',
	defaults : {
		split : true
	},
	initComponent : function() {
		this.editTopBar = Ext.create('Ext.toolbar.Toolbar', {
			items : [ {
				iconCls : 'search', text : '搜索', scope : this, handler : this.onSearchClick
			}, {
				iconCls : 'search', text : '清空', scope : this, handler : this.clearSearch
			}, {
				iconCls : 'search', text : '结清欠款', scope : this, handler : this.clearDue
			} ]
		});

		var _fileds = [ {
			xtype : 'rownumberer'
		}, {
			text : "customer/客户", dataIndex : 'buyer_code', sortable : true
		}, {
			text : "due balance/欠款额", dataIndex : 'amount', sortable : true, xtype : 'numbercolumn', format : '$0.00',width:150
		}, {
			text : "invoice/订单号", dataIndex : 'invoice', sortable : true
		}, {
			text : "saleman/销售员", dataIndex : 'oper_name', sortable : true
		} ];

		var formFileds = [];
		formFileds.push({
			xtype : 'datefield', fieldLabel : 'end date/截止日期', labelWidth : 150, name : 'date', format : 'Y-m-d', allowBlank : true
		});
		this.storeId = 'CreditWarningStore';
		
		
		var item=[
					{
						anchor : '100%', height : 100, xtype : 'form', region : 'north', autoScroll : true, collapsible : true, title : '搜索信息',
						layout : {
							columns : 3, type : 'table', tableAttrs : {
								style : {
									width : '100%'
								}
							}
						},bodyPadding : 10, items : formFileds
					},{store : this.storeId, split : true,
						disableSelection : false, loadMask : true, autoScroll : true, region : 'center',
						title : '超期未付款报表', xtype : 'gridpanel', columns : _fileds,height : 200,width : 400,
					    collapsible: true,  
					    animCollapse: false, 
						} ]
		;
			
		Ext.apply(this, {
			autoScroll : true,
			dockedItems : [ this.editTopBar ],

			items : item

		});
		this.callParent();
		this.onSearchClick();
	},
	/**
	 * 搜索
	 */
	onSearchClick : function() {
		var fields = this.down('form').getForm().getFields();
		fields.each(function(field) {
			if(!field.getValue()){
				field.setValue(Ext.Date.format(new Date(),'Y-m-d'));
			}
		});
		var data = this.down('form').getForm().getFieldValues();
		var store = Ext.data.StoreManager.lookup(this.storeId);
		Ext.Object.each(data, function(key, value) {
			store.getProxy().setExtraParam(key, value);
		});
		store.load();
	},
	/**
	 * 清空
	 */
	clearSearch : function() {
		var fields = this.down('form').getForm().getFields();
		fields.each(function(field) {
			field.setValue('');
		});
	},
	//结清欠款
	clearDue:function(){
		var that = this;
		var selection = this.down('grid[title="超期未付款报表"]').getView().getSelectionModel().getSelection()[0];
		if (selection) {
			Ext.Msg.confirm('提示', '确定要结清此订单【'+selection.get("invoice")+'】吗？', function(btn, text) {
				if (btn == 'yes') {
	            	Ext.Ajax.request({
	            	    url: location.context + '/sale.do?action=credit_warn_clear',
	            	    params: {
	            	    	sale_id: selection.get("sale_id")
	            	    },
	            	    reader: {
	            	        type : 'json'
	            	    },
	            	    success: function(response,a,b){
	            	    	Ext.Msg.alert('提示', '操作成功' );
	            	    	that.onSearchClick();
	            	    }
	            	});
	            	
	            
				}
			}, this);
			
		} else {
			Ext.Msg.alert('提示', '请选择订单');
		}
	
		
	}
});/**
 * 超期未付款报表
 */
Ext.define('WJM.sale.CreditWarningModel', {
	extend : 'Ext.ux.desktop.Module',

	requires : [ 'WJM.model.TCreditWarning' ],

	id : 'pastDueReport',

	init : function() {
		this.id = this.config.moduleId || 'pastDueReport';
		this.title = this.config.menuText || 'past due report/超时付款报表';
	},

	createWindow : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow(this.id);
		if (!win) {
			var grid = Ext.create('WJM.sale.CreditWarningGrid', {
			});
			win = desktop.createWindow({
				id : this.id, title : this.title, width : 500, height : 500, iconCls : 'icon-grid', animCollapse : false, constrainHeader : true,
				layout : 'fit', items : grid
			});
		}
		return win;
	}
});
/**
 * 报价单查询
 */
Ext.define('WJM.sale.MyQuoteModel', {
	extend : 'Ext.ux.desktop.Module',

	requires : [ 'WJM.model.TSale', 'WJM.model.TSaleProduct' ],

	id : 'myquote',

	init : function() {
		this.id = this.config.moduleId || 'myquote';
		this.title = this.config.menuText || 'my quote/我的报价';
	},

	createWindow : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow(this.id);
		if (!win) {
			var grid2 = Ext.create('WJM.sale.SaleQuoteGrid', {
				deleteAble : true, editAble : true, onlyMy : false, title : '报价单'
			});
			win = desktop.createWindow({
				id : this.id, title : this.title, width : 980, height : 600, iconCls : 'icon-grid', animCollapse : false, constrainHeader : true,
				layout : 'fit', items : [ grid2 ]
			});
		}
		return win;
	}
});
/**
 * 销售单查询
 */
Ext.define('WJM.sale.MySaleModel', {
	extend : 'Ext.ux.desktop.Module',

	requires : [ 'WJM.model.TSale', 'WJM.model.TSaleProduct' ],

	id : 'mysale',

	init : function() {
		this.id = this.config.moduleId || 'mysale';
		this.title = this.config.menuText || 'my sale/我的销售';
	},

	createWindow : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow(this.id);
		if (!win) {
			var grid = Ext.create('WJM.sale.SaleGrid', {
				deleteAble : true, editAble : true, onlyMy : false, saleStore : 'SaleMyStore', saleProductStore : 'SaleProductMyStore',
				reciveAble : true, title : '销售订单'
			});
			win = desktop.createWindow({
				id : this.id, title : this.title, width : 980, height : 600, iconCls : 'icon-grid', animCollapse : false, constrainHeader : true,
				layout : 'fit', items : [ grid ]
			});
		}
		return win;
	}
});
/**
 * 销售月报表
 */
Ext.define('WJM.sale.SaleBetweenReportModel', {
	extend : 'Ext.ux.desktop.Module',

	requires : [ 'WJM.model.TSaleTop' ],

	id : 'reportbetween',

	init : function() {
		this.id = this.config.moduleId || 'reportbetween';
		this.title = this.config.menuText || 'Sales Report Between/自选销售报表';
	},

	createWindow : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow(this.id);
		if (!win) {
			var grid = Ext.create('WJM.sale.SaleTopGrid', {
				reportType : 'bettenSaleReport'
			});
			win = desktop.createWindow({
				id : this.id, title : this.title, width : 500, height : 500, iconCls : 'icon-grid', animCollapse : false, constrainHeader : true,
				layout : 'fit', items : grid
			});
		}
		return win;
	}
});
/**
 * 销售天报表
 */
Ext.define('WJM.sale.SaleDailyReportModel', {
	extend : 'Ext.ux.desktop.Module',

	requires : [ 'WJM.model.TSaleTop' ],

	id : 'dailyreport',

	init : function() {
		this.id = this.config.moduleId || 'dailyreport';
		this.title = this.config.menuText || 'sale detail/销售报表';
	},

	createWindow : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow(this.id);
		if (!win) {
			var grid = Ext.create('WJM.sale.SaleTopGrid', {
				reportType : 'daySaleReport'
			});
			win = desktop.createWindow({
				id : this.id, title : this.title,width : 980, height : 600,iconCls : 'icon-grid', animCollapse : false, constrainHeader : true,
				layout : 'fit', items : grid
			});
		}
		return win;
	}
});
/**
 * 订单表单
 */
Ext.define('WJM.sale.SaleForm', {
    extend: 'Ext.form.Panel',
    requires: [ 'WJM.model.TSale', 'WJM.model.TProduct' ],
    bodyPadding: 10,
    autoScroll: true,
    // closeAction : 'destroy',

    record: null,
    initComponent: function () {
        var me = this;
        this.gridStoreId = Ext.Number.randomInt(1000000, 9999999).toString();
        Ext.create('Ext.data.Store', {
            storeId: this.gridStoreId, autoLoad: false, model: 'WJM.model.TProduct'
        });
        var _fileds = [
            {
                xtype: 'rownumberer'
            },
            {
                text: "barcode #/条码", dataIndex: 'code', sortable: true, width: 100
            },
            {
                text: "items id/助记符", dataIndex: 'product_id', sortable: true, width: 100
            },
            {
                text: "description 1", dataIndex: 'product_name', sortable: true, width: 200, editor: {
                xtype: 'textfield', allowBlank: false
            }
            },
            {
                text: "quantity/数量", dataIndex: 'num', sortable: true, xtype: 'numbercolumn', format: '0,000', editor: {
                xtype: 'numberfield', allowBlank: false, allowDecimals: false
            }
            },
            {
                text: "unit price/单价", dataIndex: 'price_simgle', sortable: true, xtype: 'numbercolumn', format: '$0.00', editor: {
                xtype: 'adnumberfield', allowBlank: false
            }
            },
            {
                text: "discount price/折扣价", dataIndex: 'agio_price', sortable: true, xtype: 'numbercolumn', format: '$0.00'
            },
            {
                text: "discount percent/折扣百分比", dataIndex: 'agio', sortable: true, xtype: 'numbercolumn', format: '0.0%', editor: {
                xtype: 'adnumberfield', allowBlank: false
            }
            },
            {
                text: "sub total/小计", dataIndex: 'total', sortable: true, xtype: 'numbercolumn', format: '$0.00'
            }
        ];

       // if (!this.record) {
            _fileds.push({
                xtype: 'actioncolumn',
                text: "使用批发价",
                align: 'center',
                width: 194,
                items: [
                    {
                        width: 66, height: 24, iconCls: 'pifa-button', html: '<span>使用批发价</span>', tooltip: '使用批发价',
                        handler: function (grid, rowIndex, colIndex) {
                        	
                            var recod = grid.getStore().getAt(rowIndex);
                            if (!recod.get('old_wholesale')) {
                                recod.set('old_wholesale', recod.get('price_wholesale'));
                                recod.set('old_simgle', recod.get('price_simgle'));
                                recod.set('old_price_company', recod.get('price_company'));
                            }
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
                                            recod.set('agio_price', recod.get('old_wholesale'));
                                            recod.set('agio_price_old', recod.get('old_wholesale'));
                                           // recod.set('agio', (1-Ext.util.Format.number(recod.get('agio_price')/recod.get("price_simgle"),"0.000"))*100);
                                            this.getForm().findField('confirm_code').setValue(text);
                                        } else {
                                            Ext.Msg.alert('提示', records.error);
                                        }
                                        this.calculateTotal(null,recod);
                                    }, me);
                                }
                            });
                            // 将弹出框hack 为 密码弹框
                            Ext.dom.Element.get(messageBox.down('textfield').getInputId()).dom.type = 'password';
                            //this.calculateTotal();
                        }, scope: this
                    },
                    {
                        width: 24, height: 66, iconCls: 'linshou-button', html: '<span>使用零售价</span>', tooltip: '使用零售价',
                        handler: function (grid, rowIndex, colIndex) {
                            var recod = grid.getStore().getAt(rowIndex);
                            if (!recod.get('old_wholesale')) {
                                recod.set('old_wholesale', recod.get('price_wholesale'));
                                recod.set('old_simgle', recod.get('price_simgle'));
                                recod.set('old_price_company', recod.get('price_company'));
                            }
                            recod.set('agio_price', recod.get('old_simgle'));
                            recod.set('agio_price_old', recod.get('old_simgle'));
                            recod.set('agio',0);
                            this.getForm().findField('confirm_code').setValue("");
                            this.calculateTotal(null,recod);
                        }, scope: this
                    },
                    {
                        width: 66, height: 24, iconCls: 'pifa-button', html: '<span>使用公司价</span>', tooltip: '使用公司价',
                        handler: function (grid, rowIndex, colIndex) {
                        	
                            var recod = grid.getStore().getAt(rowIndex);
                            if(recod.get("price_company")){
                            	if (!recod.get('old_price_company')) {
                            		recod.set('old_wholesale', recod.get('price_wholesale'));
                            		recod.set('old_simgle', recod.get('price_simgle'));
                            		recod.set('old_price_company', recod.get('price_company'));
                            	}
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
                            					recod.set('agio_price', recod.get('old_price_company'));
                            					recod.set('agio_price_old', recod.get('old_price_company'));
                            					this.getForm().findField('confirm_code').setValue(text);
                            				} else {
                            					Ext.Msg.alert('提示', records.error);
                            				}
                            				this.calculateTotal(null,recod);
                            			}, me);
                            		}
                            	});
                            	// 将弹出框hack 为 密码弹框
                            	Ext.dom.Element.get(messageBox.down('textfield').getInputId()).dom.type = 'password';
                            	//this.calculateTotal();
                            	
                            }else{
                            	Ext.Msg.alert('提示',"请先设置公司价！");
                            }
                        }, scope: this
                    }
                ]
            });
        //}
        this.editor = Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1, listeners: {
                edit: me.cellEditor, scope: me, beforeedit: me.onBeforeEdit
            }
        });
        Ext.applyIf(me, {
            defaults: {
                xtype: 'textfield', anchor: '98%', labelWidth: 150
            },
            items: [
                {
                    name: 'id', xtype: 'hiddenfield'
                },
                {
                    name: 'type', xtype: 'hiddenfield'
                },
                {
                    xtype: 'container', layout: {
                    columns: 2, type: 'table', tableAttrs: {
                        style: {
                            width: '100%'
                        }
                    }, tdAttrs: {
                        style: {
                            width: '50%'
                        }
                    }
                }, items: [ Ext.create('WJM.product.ProductQuickSearchForm', {
                    anchor: '100%', height: 50, listeners: {
                        onProductLoad: me.onProductLoad, scope: me
                    }
                }), Ext.create('WJM.customer.CustomerQuickSearchForm', {
                    anchor: '100%', height: 50, listeners: {
                        onProductLoad: me.onCustomerLoad, scope: me
                    }
                }) ]
                },
                {//selType: "checkboxmodel",
                	title:"订单商品",multiSelect : true,anchor: '98% -560', minHeight: 300, disableSelection: false, loadMask: true, xtype: 'gridpanel', columns: _fileds,
                    plugins: [ this.editor ], store: this.gridStoreId,

                    viewConfig: {
                        plugins: [ Ext.create('Ext.grid.plugin.DragDrop', {
                            ptype: 'gridviewdragdrop', ddGroup: 'TProduct', enableDrop: true, enableDrag: false
                        }) ],

                        listeners: {
                            drop: function (node, data, overModel, dropPosition, eOpts) {
                                for (var i = 0; i < data.records.length; i++) {
                                    var array_element = data.records[i];
                                    array_element.set("num", null);
                                    array_element.set('agio', 0);
                                }
                                this.calculateTotal(true);
                            },

                            beforedrop: function (node, data, overModel, dropPosition, dropFunction, eOpts) {
                                data.copy = true;
                                var gridpanle = me.down('gridpanel');
                                var store = gridpanle.getStore();
                                data.records = Ext.Array.filter(data.records, function (item) {
                                    var data = store.getById(item.getId());
                                    if (data) {
                                        data.set("num", data.get("num") + 1);
                                        return false;
                                    } else {
                                        return true;
                                    }
                                });
                                this.calculateTotal(true);
                            }, scope: me
                        }
                    }
                },
                {
                    title: 'customer/客户', xtype: 'fieldset', collapsible: true, collapsed: false, layout: {
                    columns: 2, type: 'table', tableAttrs: {
                        style: {
                            width: '100%'
                        }
                    }, tdAttrs: {
                        style: {
                            width: '50%'
                        }
                    }
                }, defaults: {
                    allowBlank: true, xtype: 'textfield', width: '90%', labelWidth: 120
                }, items: [
                    {
                        fieldLabel: 'Phone/电话', name: 'buyer_mobile'
                    },
                    {
                        fieldLabel: 'name/客户名称', name: 'buyer_name'
                    },
                    {
                        fieldLabel: 'address/客户地址', name: 'buyer_address'
                    },
                    {
                        fieldLabel: 'City/城市', name: 'buyer_city'
                    },
                    {
                        fieldLabel: 'State/州', name: 'buyer_state'
                    },
                    {
                        fieldLabel: 'Zip Code/邮编', name: 'buyer_postCode'
                    },
                    {
                        name: 'buyer_id', allowBlank: false, xtype: 'hidden'
                    },
                    {
                        name: 'buyer_code', allowBlank: false, xtype: 'hidden'
                    },
                    {
                        name: 'buyer_type', allowBlank: false, xtype: 'hidden'
                    }
                ]
                },
                {
                    name: 'discount', allowBlank: true, xtype: 'hiddenfield', anchor: '100%'
                },
                {
                    title: 'Discount/优惠',
                    xtype: 'fieldset',
                    collapsible: true,
                    collapsed: false,
                    layout: {
                        columns: 4, type: 'table', tableAttrs: {
                            style: {
                                width: '100%'
                            }
                        }
                    },
                    items: [
                        {
                            fieldLabel: 'Discount Percent/优惠百分比', name: 'discountpercent', allowBlank: true, xtype: 'adnumberfield',
                            anchor: '100%', labelWidth: 150, readOnly: false, minValue: 0, value: 0, colspan: 2, format: '0.0000',
                            decimalPrecision: 4,

                            listeners: {
                                blur: me.discountPercentChange, scope: me
                            }
                        },
                        {
                            fieldLabel: 'approver id/优惠确认人', name: 'confirm_code', allowBlank: true, xtype: 'textfield', anchor: '100%',
                            labelWidth: 150, readOnly: false, colspan: 2, inputType: 'password'
                        },
                        {
                            xtype: 'button', anchor: '100%', text: 'No discount(With All Tax)/不优惠(含所有税)', listeners: {
                            click: function () {
                                this.getForm().findField('discount').setValue(0);
                                this.getForm().findField('discountpercent').setValue(0);
                                me.discountPercentChange();
                            }, scope: me
                        }
                        },
                        {
                            xtype: 'button', anchor: '100%', text: 'No tax/不交税', listeners: {
                            click: function () {
                                var tax = this.getForm().findField('tax').getValue();
                                var sub_total = this.getForm().findField('sub_total').getValue();
                                this.getForm().findField('discount').setValue(tax);
                                this.getForm().findField('discountpercent').setValue(tax / sub_total * 100);
                                me.discountPercentChange();
                            }, scope: me
                        }
                        },
                        {
                            xtype: 'button', anchor: '100%', text: '5% Discount Percent/优惠5%', listeners: {
                            click: function () {
                                this.getForm().findField('discount').setValue(this.getForm().findField('sub_total').getValue() * 0.05);
                                this.getForm().findField('discountpercent').setValue(5);
                                me.discountPercentChange();
                            }, scope: me
                        }
                        }
                    ]
                },
                {
                    title: 'Payment Delivery/支付与送货',
                    xtype: 'fieldset',
                    layout: {
                        columns: 2, type: 'table', tableAttrs: {
                            style: {
                                width: '100%'
                            }
                        }, tdAttrs: {
                            style: {
                                width: '50%'
                            }
                        }
                    },
                    allowBlank: false,
                    items: [
                        {
                            xtype: 'combobox', fieldLabel: 'Payment Method/支付方式', labelWidth: 170, name: 'payment', displayField: 'name',
                            valueField: 'value', store: 'SalePaymentMethodStore', value: 'Cash', allowBlank: false
                        },
                        {
                            xtype: 'combobox', fieldLabel: 'Delivery Method/送货方式', labelWidth: 170, name: 'send_type', displayField: 'name',
                            valueField: 'value', store: 'SaleSendMethodStore', value: '自取', allowBlank: false
                        }
                    ]
                },
                {
                    xtype: 'container',
                    padding: '10 0 0 0',
                    layout: {
                        columns: 2, type: 'table', tableAttrs: {
                            style: {
                                width: '100%'
                            }
                        }, tdAttrs: {
                            style: {
                                width: '50%'
                            }
                        }
                    },
                    items: [
                        {
                            xtype: 'textfield', name: 'oper_name', labelWidth: 110, width: '90%', fieldLabel: 'Worker ID/操作员',
                            allowBlank: false, readOnly: true, value: window.user.userName
                        },
                        {
                            xtype: 'textfield', name: 'oper_time', fieldLabel: 'date/时间', width: '90%', labelWidth: 110, allowBlank: false,
                            readOnly: true, value: Ext.Date.format(new Date(), 'Y-m-d H:i:s')
                        },
                        {
                            name: 'sub_total', fieldLabel: 'sub total/合计', allowBlank: false, labelWidth: 110, width: '90%', readOnly: true,
                            xtype: 'adnumberfield'
                        },
                        {
                            name: 'tax', fieldLabel: 'Tax/税(' + (window.invoiceTax * 100).toFixed(3) + '%)', allowBlank: false, labelWidth: 110,
                            width: '90%', readOnly: true, xtype: 'adnumberfield'
                        },
                        {
                            name: 'all_price', fieldLabel: 'Total/总计', allowBlank: false, labelWidth: 110, width: '90%', readOnly: true,
                            xtype: 'adnumberfield'
                        }
                    ]
                },
                {
                    name: 'remark', fieldLabel: 'Remark/备注', allowBlank: true, xtype: 'textareafield', rows: 2, labelWidth: 110
                }
            ],

            dockedItems: [
                {
                    xtype: 'toolbar', dock: 'top', items: [
                    {
                        xtype: 'button', iconCls: 'save', text: '保存订单', scope: this, handler: this.onSaveClick
                    },
                    {
                        xtype: 'button', iconCls: 'save', text: '保存报价单', scope: this, handler: this.onSaveQuoteClick
                    },
                    {
                        xtype: 'button', iconCls: 'search', text: '搜索产品', scope: this, handler: this.onProductSearchClick
                    },
                    {
                        xtype: 'button', iconCls: 'search', text: '搜索客户', scope: this, handler: this.onCustomerSearchClick
                    },
                    {
                        xtype: 'button', iconCls: 'search', text: '清空', scope: this, handler: this.clearForm
                    },
                    {
                        xtype: 'button', iconCls: 'remove', text: '删除产品', scope: this, handler: this.onRemoveProductClick
                    },
                    {
                        xtype: 'button', iconCls: 'add', text: '添加临时产品', scope: this, handler: this.onAddProductClick
                    },
                    {
                        xtype: 'button', iconCls: 'add', text: '使用批发价', scope: this, handler: this.onUseCheap
                    },
                    {
                        xtype: 'button', iconCls: 'add', text: '使用零售价', scope: this, handler: this.onUseExpensive
                    },
                    {
                        xtype: 'button', iconCls: 'add', text: '使用公司价格', scope: this, handler: this.onUseCompany
                    }
                ]
                }
            ]
        });
        me.callParent(arguments);
        me.on("afterrender", this.initDragDorp, me);
        if (this.record) {
            me.loadRecord(this.record);
            var store = Ext.data.StoreManager.lookup('SaleProductStore');
            store.getProxy().setExtraParam('sale_id', this.record.getId());
            store.load({
                scope: this, callback: this.onSaleProductLoad
            });
        }
    },
    /**
     *
     */
    initDragDorp: function () {
        var me = this;
        this.dragDorp = Ext.create('Ext.dd.DropTarget', this.down('fieldset[title="customer/客户"]').getEl().dom, {
            ddGroup: 'TCustomer', notifyEnter: function (ddSource, e, data) {
                me.stopAnimation();
                me.getEl().highlight();
            }, notifyDrop: function (ddSource, e, data) {
                var selectedRecord = ddSource.dragData.records[0];
                me.setCustomer(selectedRecord);
                return true;
            }
        });
    },
    /**
     * 设置客户
     *
     * @param customer
     */
    setCustomer: function (customer) {
        this.customer = customer;
        this.getForm().findField('buyer_name').setValue(customer.get('shortName'));
        this.getForm().findField('buyer_address').setValue(customer.get('address'));
        this.getForm().findField('buyer_state').setValue(customer.get('state'));
        this.getForm().findField('buyer_city').setValue(customer.get('city'));
        this.getForm().findField('buyer_postCode').setValue(customer.get('postCode'));
        this.getForm().findField('buyer_mobile').setValue(customer.get('mobile'));
        this.getForm().findField('buyer_code').setValue(customer.get('code'));
        this.getForm().findField('buyer_id').setValue(customer.getId());
        this.getForm().findField('payment').setValue('Credit Account');
        this.getForm().findField('buyer_type').setValue(customer.get('acc_type'));
    },
    /**
     * 保存
     */
    onSaveClick: function () {
        this.getForm().findField('type').setValue(0);
        // 检查信用
        if (this.customer) {
            if (this.customer.get('credit_Line') > 0) {
                if (this.customer.get('credit_Line') + this.customer.get('leav_money') - this.customer.get('balance')
                    - this.getForm().findField('all_price').getValue() < 0) {
                    Ext.Msg.alert('提示', '此用户预付款：' + this.customer.get('leav_money') + ' 已经欠款' + this.customer.get('balance') + ' 信用额度：'
                        + this.customer.get('credit_Line') + " 应付款：" + this.getForm().findField('all_price').getValue());
                    return;
                }
            }
        }
        this.saveForm();
    },

    /**
     * 保存
     */
    onSaveQuoteClick: function () {
        this.getForm().findField('type').setValue(1);
        this.saveForm();
    },

    saveForm: function () {
        var form = this.getForm();
        var me = this;
        var datas = this.down('gridpanel').getStore().data;
        var redod = [];
        //this.calculateTotal();
        var productHasGood = true;
        datas.each(function (item) {
            if (!item.get('num')) {
                productHasGood = false;
            }
            redod.push(item.getData());
        });
        if (form.isValid()) {
            if (redod.length == 0) {
                Ext.Msg.alert('提示', '请选择产品');
                return;
            }
            if (!productHasGood) {
                Ext.Msg.alert('提示', '产品个数未填！');
                return;
            }
            this.submit({
                url: 'sale.do?action=sale_submit', params: {
                    saleProducts: Ext.JSON.encode(redod)
                },

                success: function (form, action) {
                    var result = action.result;
                    var aletMsg = '';
                    Ext.Array.each(result.listData, function (data) {
                        aletMsg += '<span style="color:#ff0000;">,' + data.product_name + '可能库存不足</span>';
                    });
                    Ext.Msg.alert('提示', '保存成功' + aletMsg);
                    me.clearForm(true);
                    window.open(location.context + '/sale.do?action=re_print&id=' + result.saleId, "_blank");
                    me.fireEvent('saveSuccess', me);
                },

                failure: function (form, action) {
                    Ext.Msg.alert('提示', action.result.msg || '保存失败，请稍候重试');
                }
            });
        }
    },

    /**
     * 搜索产品
     */
    onProductSearchClick: function () {
        var desktop = myDesktopApp.getDesktop();
        var win = desktop.getWindow('productsearch');
        if (!win) {
            var grid = Ext.create('WJM.product.ProductGrid', {
                editAble: false
            });
            win = desktop.createWindow({
                id: 'productsearch', title: "search/产品搜索", width: 600, height: 600, iconCls: 'icon-grid', animCollapse: false,
                constrainHeader: true, layout: 'fit', items: [ grid ]
            });
        }
        win.show();
    },

    /**
     * 搜索用户
     */
    onCustomerSearchClick: function () {
        var desktop = myDesktopApp.getDesktop();
        var win = desktop.getWindow('customersearch');
        if (!win) {
            var grid = Ext.create('WJM.customer.CustomerGrid', {
                editAble: true
            });
            win = desktop.createWindow({
                id: 'customersearch', title: "search/客户搜索", width: 600, height: 800, iconCls: 'icon-grid', animCollapse: false,
                constrainHeader: true, layout: 'fit', items: [ grid ]
            });
        }
        win.show();
    },
    
    discountPercentChange:function(c,n,o){
    	var that = this;
    	this.adminConfirm(function(text){
    		that.calculateTotal(true);

    		that.getForm().findField('confirm_code').setValue(text);
    		
    	},function(){
    		that.getForm().findField('discountpercent').setValue(0);
    		that.calculateTotal(true);
    	},function(){
    		that.getForm().findField('discountpercent').setValue(0);
    		that.calculateTotal(true);
    	});
    },

    cellEditor:function(){
    	var data = arguments[1];
    	var id = arguments[1].record;
    	var that = this;
    	if(arguments[1].field == 'agio'){
        	this.adminConfirm(function(){
        		that.calculateTotal(null,id);
        	},function(){
        		data.record.set("agio",bfAgio);
        		that.calculateTotal(null,id);
        	},function(){
        		data.record.set("agio",bfAgio);
        		that.calculateTotal(null,id);
        	});
    	}else{
    		that.calculateTotal(true,id);
    	}
    },
    /**
     * 计算总数
     */
    calculateTotal: function (flag,single) {
    	var that=this;
        var total = 0;
        var datas = this.down('gridpanel').getStore().data;
        datas.each(function (item) {
        	if(single){
        		if(item == single){
        			if(!item.get("agio_price") || item.get("product_id")=='999999'){
                		var agio_price = Ext.util.Format.number(item.get('price_simgle') * (1 - item.get('agio') / 100), '0.00');
                		if(!item.get("agio_price")){item.set('agio_price_old', agio_price);}
                        item.set('agio_price', agio_price);
                	}else{
                		if(!flag){
                			if(item.get('agio_price_old')){
                				var agio_price = Ext.util.Format.number(item.get('agio_price_old') * (1 - item.get('agio') / 100), '0.00');
                				item.set('agio_price', agio_price);	
                			}else{
                				var price=item.get('agio_price')/(1-item.get("agio")/100);
                				if(Math.abs(item.get("price_simgle")-price)<1)
                					item.set('agio_price_old',item.get("price_simgle") );
                				else
                					item.set('agio_price_old',item.get("price_wholesale") );
                			}
                		}
                	}
        		}
        	}else{
        		if(!flag){
        			if(!item.get("agio_price") || item.get("product_id")=='999999'){
                		var agio_price = Ext.util.Format.number(item.get('price_simgle') * (1 - item.get('agio') / 100), '0.00');
                		if(!item.get("agio_price")){item.set('agio_price_old', agio_price);}
                        item.set('agio_price', agio_price);
                	}else{
                		
                			if(item.get('agio_price_old')){
                				var agio_price = Ext.util.Format.number(item.get('agio_price_old') * (1 - item.get('agio') / 100), '0.00');
                				item.set('agio_price', agio_price);	
                			}else{
                				var price=item.get('agio_price')/(1-item.get("agio")/100);
                				if(Math.abs(item.get("price_simgle")-price)<1)
                					item.set('agio_price_old',item.get("price_simgle") );
                				else
                					item.set('agio_price_old',item.get("price_wholesale") );
                			}
                		
                	}
        		}
        		
        	}
        	
            item.set('total', item.get('num') * item.get("agio_price"));
            total += item.get('total');
        });
        var discountpercent = Number(this.getForm().findField('discountpercent').getValue()) / 100;
        this.getForm().findField('tax').setValue(total * window.invoiceTax);
        this.getForm().findField('sub_total').setValue(total - total * discountpercent);
        this.getForm().findField('discount').setValue(total * discountpercent);
        this.getForm().findField('all_price').setValue(
            total * (1 + window.invoiceTax - discountpercent));
    },
    /**
     * 重置表单
     */
    clearForm: function (flag) {
    	var that=this;
    	if(flag==true){
    		doClearForm();
    	}else{
    		Ext.Msg.confirm('approver', '您确定要清空吗？:', function (btn, text){
    			if(btn == "yes"){
            		doClearForm();
    			}else{

    			}
        	},this);
    	}
    	
    	
    	function doClearForm(){
    		that.down('gridpanel').getStore().removeAll();
    		that.customer = null;
            var fields = that.getForm().getFields();
            fields.each(function (item) {
                item.setValue('');
            });
            that.getForm().findField('oper_time').setValue(Ext.Date.format(new Date(), 'Y-m-d H:i:s'));
            that.getForm().findField('oper_name').setValue(window.user.userName);
            that.getForm().findField('payment').setValue(Ext.data.StoreManager.lookup('SalePaymentMethodStore').getAt(0).get('value'));
            that.getForm().findField('send_type').setValue(Ext.data.StoreManager.lookup('SaleSendMethodStore').getAt(2).get('value'));
            that.calculateTotal(); 
    	}
    },
    /**
     *
     */
    onSaleProductLoad: function (records, opt, successful) {
    	var that=this;
    	
        if (successful) {
            var products = [];
            Ext.Array.each(records, function (item) {
                var product = Ext.create('WJM.model.TProduct');
                product.setId(item.get('product_id'));
                product.set('code', item.get('product_code'));
                product.set('product_name', item.get('product_name'));
                product.set('agio_price', item.get('agio_price'));
                product.set('agio_price_old', item.get('agio_price'));
                product.set('agio', item.get('agio'));
                product.set('product_id', item.get('productid'));
                product.set('price_simgle', item.get('product_price'));
                product.set('num', item.get('product_num'));
                products.push(product);
            });
            
            Ext.Array.each(products, function (item) {
            	Ext.Ajax.request({
            	    url: location.context + '/product.do?action=list',
            	    params: {
            	    	id: item.get("id"),
            	    	product_id_all:"true"
            	    },
            	    reader: {
            	        type : 'json'
            	    },
            	    success: function(response,a,b){
            	    	if(JSON.parse(response.responseText).listData!=[]){
            	    		item.set("price_wholesale",JSON.parse(response.responseText).listData[0].price_wholesale);
                	    	item.set("price_simgle",JSON.parse(response.responseText).listData[0].price_simgle);
                	    	 //that.calculateTotal();
            	    	}
            	    	

            	    }
            	});
            	
            });
            this.down('gridpanel').getStore().loadRecords(products);
            this.calculateTotal(true);
            
            
        }
    },


    /**
     * 查询返回
     *
     */
    onProductLoad: function (opt) {
        var me = this;
        var gridpanle = me.down('gridpanel');
        var store = gridpanle.getStore();
        Ext.Array.each(opt.records, function (item) {
            var data = store.getById(item.getId());
            if (data) {
                data.set("num", data.get("num") + 1);
            } else {
            	debugger;
                item.set("num", null);
                item.set('agio', 0);
                var accType = me.getForm().findField('buyer_type').getValue();
                if(accType){
                	switch (accType) {
					case "0":
						item.set('agio_price', item.get("price_simgle"));
						break;
					case "1":
						item.set('agio_price', item.get("price_wholesale"));
						break;
					case "2":
						if(item.get("price_company"))
							item.set('agio_price', item.get("price_company"));
						else
							item.set('agio_price', item.get("price_wholesale"));
						break;						
					default:
						break;
					}
                }
                store.add(item);
            }
        });
        
        if (opt.records.length > 0) {
            me.editor.startEdit(opt.records[0], 4);
        }
        me.calculateTotal(true);
    },
    /**
     * 删除产品
     */
    onRemoveProductClick: function () {
        var me = this;
        var gridpanle = me.down('gridpanel');
        var selection = gridpanle.getView().getSelectionModel().getSelection()[0];
        if (selection) {
            gridpanle.getStore().remove(selection);
            me.calculateTotal(true);
        } else {
            Ext.Msg.alert('提示', '请选择产品');
        }
    },
    
    //批量使用批发价
    onUseCheap:function(){
    	var that=this;
    	var selection = this.down('grid[title="订单商品"]').getView().getSelectionModel().getSelection();
    	if(selection.length==0){
    		Ext.MessageBox.show({
				title : '提示', msg : '请至少选择一个商品', buttons : Ext.Msg.OK
			});
    		return false;
    	};
    	
    	

        var messageBox = Ext.Msg.prompt('approver', '请输入优惠确认人code:', function (btn, text) {
            if (btn == 'ok') {
            	Ext.Array.each(selection,function(recod){
            		if (!recod.get('old_wholesale')) {
                        recod.set('old_wholesale', recod.get('price_wholesale'));
                        recod.set('old_simgle', recod.get('price_simgle'));
                    }
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
                        	recod.set('agio_price', recod.get('old_wholesale'));
                        	recod.set('agio_price_old', recod.get('old_wholesale'));
                        	 // recod.set('agio', (1-Ext.util.Format.number(recod.get('agio_price')/recod.get("price_simgle"),"0.000"))*100);
                              

                        } else {
                            Ext.Msg.alert('提示', records.error);
                        }
                        that.calculateTotal(null,recod);
                    });            
                    that.getForm().findField('confirm_code').setValue(text);
            	});
            	

            }
        });
        // 将弹出框hack 为 密码弹框
        Ext.dom.Element.get(messageBox.down('textfield').getInputId()).dom.type = 'password';
        
     //   this.calculateTotal();  
        

    	
        

        
        
    },
    
    //使用公司价格
    onUseCompany:function(){
    	var selection = this.down('grid[title="订单商品"]').getView().getSelectionModel().getSelection();
    	if(selection.length==0){
    		Ext.MessageBox.show({
				title : '提示', msg : '请至少选择一个商品', buttons : Ext.Msg.OK
			});
    		return false;
    	};   
    	
    	
        var messageBox = Ext.Msg.prompt('approver', '请输入优惠确认人code:', function (btn, text) {
            if (btn == 'ok') {
            	Ext.Array.each(selection,function(recod){
                    if (!recod.get('old_price_company')) {
                    	recod.set('old_wholesale', recod.get('price_wholesale'));
                		recod.set('old_simgle', recod.get('price_simgle'));
                		recod.set('old_price_company', recod.get('price_company'));
                    }
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
                        	recod.set('agio_price', recod.get('old_price_company'));  
                            recod.set('agio_price_old', recod.get('old_price_company'));	
                        	 // recod.set('agio', (1-Ext.util.Format.number(recod.get('agio_price')/recod.get("price_simgle"),"0.000"))*100);
                              

                        } else {
                            Ext.Msg.alert('提示', records.error);
                        }
                        that.calculateTotal(null,recod);
                    });            
                    that.getForm().findField('confirm_code').setValue(text);
            	});
            	

            }
        });
        // 将弹出框hack 为 密码弹框
        Ext.dom.Element.get(messageBox.down('textfield').getInputId()).dom.type = 'password';
        
        
    },
    
    //批量使用零售价
    onUseExpensive:function(){
    	var selection = this.down('grid[title="订单商品"]').getView().getSelectionModel().getSelection();
    	if(selection.length==0){
    		Ext.MessageBox.show({
				title : '提示', msg : '请至少选择一个商品', buttons : Ext.Msg.OK
			});
    		return false;
    	};

    	Ext.Array.each(selection,function(recod){
            if (!recod.get('old_wholesale')) {
                recod.set('old_wholesale', recod.get('price_wholesale'));
                recod.set('old_simgle', recod.get('price_simgle'));
            }
            recod.set('agio_price', recod.get('old_simgle'));  
            recod.set('agio_price_old', recod.get('old_simgle'));	
            recod.set('agio',0);
           

    	});
    	 this.getForm().findField('confirm_code').setValue("");
        this.calculateTotal(true);
    },
    
    adminConfirm:function(callback,errorCallback,cancelFn){
    	var messageBox = Ext.Msg.prompt('approver', '请输入管理员确认码', function (btn, text) {
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
                    	callback(text);
                    } else {
                    	if(errorCallback)errorCallback(text);
                        Ext.Msg.alert('提示', records.error);
                    }
                });   
                
                
            }
            else if(btn == 'cancel'){
            	if(cancelFn)cancelFn();
            }
        });
    	Ext.dom.Element.get(messageBox.down('textfield').getInputId()).dom.type = 'password';
    },
    
    /**
     * 添加临时产品
     */
    onAddProductClick: function () {
    	var that = this;
    	var messageBox = Ext.Msg.prompt('approver', '请输入管理员确认码', function (btn, text) {
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
                    	var gridpanle = that.down('gridpanel');
                        var product = Ext.create('WJM.model.TProduct');
                        product.setId(-1);
                        product.set('num', null);
                        product.set('code', '999999');
                        product.set('product_id', '999999');
                        product.set('product_name', '');
                        product.set('price_simgle', null);
                        product.set('agio', 0);
                        gridpanle.getStore().add(product);
                        that.calculateTotal(true);
                        that.editor.startEdit(product, 3);
                    } else {
                        Ext.Msg.alert('提示', records.error);
                    }
                });   
                
            }
        });
    	Ext.dom.Element.get(messageBox.down('textfield').getInputId()).dom.type = 'password';

    },
    
    
    /**
     * 选择客户时
     *
     * @param opt
     */
    onCustomerLoad: function (opt) {
        var me = this;
        Ext.Array.each(opt.records, function (item) {
            me.setCustomer(item);
        });
    },
    /**
     * 列表进行编辑时，取消编辑
     */
    onBeforeEdit: function (editor, data, eOpts) {
    	if(arguments[1].field == 'agio'){
        	bfAgio = data.record.data.agio;
    		return doEdit();
    	}else{
    		return doEdit();
    	}
    	function doEdit(){
    		if(data.field == 'product_name' || data.field == 'price_simgle') {
	            if (data.record.getId() == -1) {
	                return true;
	            } else {
	                return false;
	            }
	        } else {
	            return true;
	        }
    	}
       
    },

    beforeDestroy: function () {
        Ext.destroy(this.dragDorp);
        Ext.data.StoreManager.unregister(this.gridStoreId);
        this.callParent();
    }

});/**
 * 订单模块
 */
Ext.define('WJM.sale.SaleFormModel', {
	extend : 'Ext.ux.desktop.Module',

	requires : [ 'WJM.model.TSale', 'WJM.model.TSaleProduct' ],

	id : 'sale',

	init : function() {
		this.id = this.config.moduleId || 'sale';
		this.title = this.config.menuText || 'sale/销售';
	},

	createWindow : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow(this.id);
		if (!win) {
			var grid = Ext.create('WJM.sale.SaleForm');
			win = desktop.createWindow({
				id : this.id, title : this.title, width : 900, height : 750, iconCls : 'icon-grid', animCollapse : false, constrainHeader : true,
				layout : 'fit', items : grid
			});
			win.down('form').clearForm(true);
		} else {
			win.down('form').clearForm(true);
		}
		return win;
	}
});
/**
 * 销售单查询
 */
Ext.define('WJM.sale.SaleGrid', {
	extend : 'Ext.panel.Panel',
	requires : [ 'Ext.grid.Panel' ],
	collapsedStatistics : false,
	layout : {
		type : 'border', padding : 5
	},
	defaults : {
		split : true
	},
	closeAction : 'destroy',

	saleStore : 'SaleStore',

	saleProductStore : 'SaleProductStore',
	/**
	 * 是否可以删除
	 */
	deleteAble : false,
	/**
	 * 是否可以编辑
	 */
	editAble : false,
	/**
	 * 收钱
	 */
	cashAble : false,
	/**
	 * 出库单打印
	 */
	reciveAble : false,
	/**
	 * 只显示我的
	 */
	onlyMy : false,
	/**
	 * rma单据打印
	 */
	rmaAble : false,

	initComponent : function() {
		var topbarbuttons = [ {
			iconCls : 'search', text : '搜索', scope : this, handler : this.onSearchClick
		}, {
			iconCls : 'search', text : '打印订单', scope : this, handler : this.onSalePrintClick
		}, {
			iconCls : 'search', text : '清空', scope : this, handler : this.clearSearch
		} ];

		if (this.deleteAble) {
			topbarbuttons.push({
				iconCls : 'remove', text : '删除', scope : this, handler : this.onDeleteClick
			});
		}
		if (this.editAble) {
			topbarbuttons.push({
				iconCls : 'edit', text : '编辑', scope : this, handler : this.onEditClick
			});
		}
		if (this.reciveAble) {
			topbarbuttons.push({
				iconCls : 'search', text : '打印出货单', scope : this, handler : this.onPackePrintClick
			});
		}

		//if (this.cashAble) {
			topbarbuttons.push({
				iconCls : 'edit', text : '收款', scope : this, handler : this.onCashClick
			});
		//}
		if (this.rmaAble) {
			topbarbuttons.push({
				iconCls : 'search', text : '打印退货单', scope : this, handler : this.onRmaPrintClick
			});
		}
		
		topbarbuttons.push({
			iconCls : 'search', text : '订单报废', scope : this, handler : this.onRejectClick
		});
		

		var searchFields = [];
		if (this.onlyMy) {
			searchFields.push({
				xtype : 'datefield', fieldLabel : 'start date/开始时间', labelWidth : 150, name : 'oper_time_start', format : 'Y-m-d'
			}, {
				xtype : 'datefield', fieldLabel : 'end date/结束时间', labelWidth : 150, name : 'oper_time_end', format : 'Y-m-d'
			}, {
				xtype : 'combobox', fieldLabel : 'sate/订单状态', labelWidth : 150, name : 'if_cashed', displayField : 'name', valueField : 'value',
				store : 'SaleCashStateStore', value : '-1'
			}, {
				xtype : 'textfield', fieldLabel : 'receive #/销售单号', labelWidth : 150, allowBlank : true, name : 'sale_bill_code'
			}, {
				xtype : 'textfield', fieldLabel : 'invoice #/invoice单号', labelWidth : 150, allowBlank : true, name : 'invoicecode'
			}, {
				name : 'oper_id', value : window.user.userId, xtype : 'hiddenfield'
			});
		} else {
			searchFields.push({
				xtype : 'datefield', fieldLabel : 'start date/开始时间', labelWidth : 150, name : 'oper_time_start', format : 'Y-m-d'
			}, {
				xtype : 'datefield', fieldLabel : 'end date/结束时间', labelWidth : 150, name : 'oper_time_end', format : 'Y-m-d'
			}, {
				xtype : 'combobox', fieldLabel : 'sate/订单状态', labelWidth : 150, name : 'if_cashed', displayField : 'name', valueField : 'value',
				store : 'SaleCashStateStore', value : '-1'
			}, {
				xtype : 'combobox', fieldLabel : 'Work ID/操作员', labelWidth : 150, allowBlank : true, name : 'oper_id', displayField : 'name',
				valueField : 'id', store : 'EmployeeAllStore'
			}, {
				xtype : 'textfield', fieldLabel : 'invoice #/invoice单号', labelWidth : 150, allowBlank : true, name : 'invoicecode'
			}, {
				xtype : 'textfield', fieldLabel : 'name/客户名称', labelWidth : 150, allowBlank : true, name : 'buyer_name'
			}, {
				xtype : 'textfield', fieldLabel : 'address/客户地址', labelWidth : 150, allowBlank : true, name : 'buyer_address'
			}, {
				xtype : 'textfield', fieldLabel : 'Phone/电话', labelWidth : 150, allowBlank : true, name : 'buyer_mobile'
			}, {
				xtype : 'textfield', fieldLabel : '产品名称', labelWidth : 150, allowBlank : true, name : 'product_name'
			});
		}

		this.editTopBar = Ext.create('Ext.toolbar.Toolbar', {
			items : topbarbuttons
		});

		var _fileds = [ {
			xtype : 'rownumberer'
		}, {
			text : "saleman/销售员", dataIndex : 'oper_name', sortable : true
		}, {
			text : "invoice #/invoice单号", dataIndex : 'invoice', sortable : true
		}, {
			text : "phone/电话", dataIndex : 'buyer_mobile', sortable : true
		}, {
			text : "customer/客户", dataIndex : 'buyer_name', sortable : true
		}, {
			text : "address/客户地址", dataIndex : 'buyer_address', sortable : true
		}, {
			text : "sub total/小计", dataIndex : 'sub_total', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "tax/税", dataIndex : 'tax', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "total/合计", dataIndex : 'all_price', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "state/状态", dataIndex : 'if_cashedStr', sortable : true
		}, {
			text : "discount/优惠", dataIndex : 'discount', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "balance/余额", dataIndex : 'balance', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "date/时间", dataIndex : 'oper_time', sortable : true
		}, {
			text : "payment/支付方式", dataIndex : 'payment', sortable : true
		}];

		var _fileds2 = [ {
			xtype : 'rownumberer'
		}, {
			text : "barcode #/条码", dataIndex : 'product_code', sortable : true
		}, {
			text : "item name/名称", dataIndex : 'product_name', sortable : true
		}, {
			text : "unit price/单价", dataIndex : 'agio_price', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "quantity/数量", dataIndex : 'product_num', sortable : true
		}, {
			text : "sub total/小计", dataIndex : 'sub_total2', sortable : true, xtype : 'numbercolumn'
		}, {
			text : "RMAed credit quantity/已退货无损数量", dataIndex : 'credit_num', sortable : true, xtype : 'numbercolumn'
		}, {
			text : "RMAed damage quantity/已退货损坏数量", dataIndex : 'damage_num', sortable : true, xtype : 'numbercolumn'
		} ];

		Ext.apply(this, {
			autoScroll : true,
			dockedItems : [ this.editTopBar ],

			items : [
					{
						anchor : '100%', height : 130, xtype : 'form', region : 'north', autoScroll : true, collapsible : true, title : '订单检索',
						layout : {
							columns : 3, type : 'table', tableAttrs : {
								style : {
									width : '100%'
								}
							}
						}, bodyPadding : 10, items : searchFields
					},
					{
						store : this.saleStore, split : true, disableSelection : false, loadMask : true, autoScroll : true, region : 'center',
						title : '订单', xtype : 'gridpanel', columns : _fileds,

						viewConfig : {
							plugins : []
						},

						listeners : {
							selectionchange : function(selectionModel, selecteds, eOpts) {
								var recode = selectionModel.getSelection()[0];
								if (recode) {
									var store = Ext.data.StoreManager.lookup(this.saleProductStore);
									store.getProxy().setExtraParam('sale_id', recode.getId());
									store.load();
								}
							}, scope : this
						},

						bbar : Ext.create('Ext.PagingToolbar', {
							store : this.saleStore, displayInfo : true, displayMsg : '显示订单 {0} - {1} 总共 {2}', emptyMsg : "没有订单数据"
						})
					},
					{
						region : 'south',
						split : true,
						height : 150,
						layout : {
							type : 'border', padding : 5
						},
						items : [
								{
									store : this.saleProductStore, split : true, disableSelection : false, collapsible : true, split : true, loadMask : true,
									height : 150, autoScroll : true, region : 'center', multiSelect : true, title : '订单明细', xtype : 'gridpanel',
									columns : _fileds2, viewConfig : {
										plugins : [ Ext.create('Ext.grid.plugin.DragDrop', {
											ddGroup : 'TProduct', enableDrop : false, enableDrag : true
										}) ]
									}
								},
								{
									xtype : 'form', title : '销售统计', region : 'east', width : 250, collapsible : true, split : true,
									collapsed : this.collapsedStatistics, defaults : {
										xtype : 'textfield', anchor : '100%', labelWidth : 100, bodyPadding : 10
									}, items : [ {
										fieldLabel : 'total sales/次数', name : 'total_sales', readOnly : true
									}, {
										fieldLabel : 'amount/总计', name : 'amount', readOnly : true, xtype : 'adnumberfield'
									} ]
								} ]
					} ]
		});
		var store = Ext.data.StoreManager.lookup(this.saleStore);
		store.on('load', this.onDataRefresh, this);
		// store.loadPage(1);
		this.callParent();
		this.onSearchClick();
	},
	/**
	 * 搜索
	 */
	onSearchClick : function() {
		var data = this.down('form[title="订单检索"]').getForm().getFieldValues();
		var store = Ext.data.StoreManager.lookup(this.saleStore);
		var saleProductStore = Ext.data.StoreManager.lookup(this.saleProductStore);
		saleProductStore.removeAll();
		Ext.Object.each(data, function(key, value) {
			store.getProxy().setExtraParam(key, value);
		});
		if(WJM.Config.user.userName != "admin"){
			store.getProxy().setExtraParam("oper_name",WJM.Config.user.userName);
		}
		
		store.loadPage(1);
	},
	/**
	 * 清空
	 */
	clearSearch : function() {
		var fields = this.down('form[title="订单检索"]').getForm().getFields();
		fields.each(function(field) {
			if (field.getName() == 'if_cashed') {
				field.setValue('-1');
			} else {
				field.setValue('');
			}
		});

	},
	/**
	 * 
	 */
	onDataRefresh : function() {
		var store = Ext.data.StoreManager.lookup(this.saleStore);
		var formPanel = this.down('form[title="销售统计"]');
		if (formPanel) {
			var form = formPanel.getForm();
			var count = 0;var allPrice = 0;
			store.each(function(record){
				if(record.data.if_cashed != 3){
					count ++ ;
					allPrice +=record.data.all_price;
				}
				
			});
			form.findField('total_sales').setValue(count);
			form.findField('amount').setValue(allPrice);
		}
	},
	/**
	 * 
	 */
	onCashClick : function() {
		var selection = this.down('grid[title="订单"]').getView().getSelectionModel().getSelection()[0];
		if (selection) {
			if (selection.get('if_cashed') == 0) {
				if (selection.get('payment') != 'Credit Account') {
					var des = myDesktopApp.getDesktop();
					var form = Ext.create('WJM.cash.SaleCashForm', {
						listeners : {
							saveSuccess : this.onSaveSuccess, scope : this
						}, record : selection
					});
					win = des.createWindow({
						title : "收款", iconCls : 'icon-grid', animCollapse : false, constrainHeader : true, layout : 'fit', items : [ form ]
					});
					win.show();
				} else {
					Ext.Msg.alert('提示', '此订单为会员订单，请到客户管理模块收款');
				}
			} else {
				Ext.Msg.alert('提示', '此订单已经收款');
			}
		} else {
			Ext.Msg.alert('提示', '请选择订单');
		}
	},
	/**
	 * 保存成功回调
	 */
	onSaveSuccess : function(that) {
		var win = that.ownerCt;
		win.destroy();
		var store = Ext.data.StoreManager.lookup(this.saleStore);
		store.loadPage(1);
		this.show();
	},
	
    adminConfirm:function(callback,errorCallback,cancelFn){
    	var messageBox = Ext.Msg.prompt('approver', '请输入管理员确认码', function (btn, text) {
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
                    	callback();
                    } else {
                    	if(errorCallback)errorCallback();
                        Ext.Msg.alert('提示', records.error);
                    }
                });   
                
                
            }
            else if(btn == 'cancel'){
            	if(cancelFn)cancelFn();
            }
        });
    	Ext.dom.Element.get(messageBox.down('textfield').getInputId()).dom.type = 'password';
    },
    
	/**
	 * 删除
	 */
	onDeleteClick : function() {
		var me = this;
		this.adminConfirm(function(){
			var selection = me.down('grid[title="订单"]').getView().getSelectionModel().getSelection()[0];
			if (selection) {
				if (selection.canDelete()) {
					Ext.Msg.confirm('提示', '确定要删除此订单么？', function(btn, text) {
						if (btn == 'yes') {
							var store = Ext.data.StoreManager.lookup(me.saleStore);
							store.remove(selection);
						}
					}, this);
				} else {
					Ext.Msg.alert('提示', '此订单不可以删除！');
				}
			} else {
				Ext.Msg.alert('提示', '请选择订单');
			}
		},function(){
			
		},function(){
			
		});

	},
	
	/**
	 * 报废
	 */
	onRejectClick : function(){
		var me = this;
		this.adminConfirm(function(){
			var selection = me.down('grid[title="订单"]').getView().getSelectionModel().getSelection()[0];
			if (selection) {
				Ext.Msg.confirm('提示', '确定要报废此订单么？', function(btn, text) {
					if (btn == 'yes') {
						
						var store = Ext.data.StoreManager.lookup(me.saleStore);
						var proxy = new Ext.data.proxy.Ajax({
							model: 'WJM.model.TEmployee', url: 'sale.do?action=doReject',
							
							reader: new Ext.data.reader.Json({
								type: 'json', messageProperty: 'msg'
							}),
							
							extraParams: {
								id: selection.getId()
							},
							
							writer: Ext.create('WJM.FormWriter')
						});
						proxy.read(new Ext.data.Operation({}), function (records, operation) {
							if (records.success) {
								store.loadPage(1);
								Ext.Msg.alert('提示',"报废成功!");
							} else {
								Ext.Msg.alert('提示', records.error);
							}
						});
						
						
						
					}
				}, this);
//				if (selection.canReject()) {
//				} else {
//					Ext.Msg.alert('提示', '此订单不可以报废！');
//				}
			} else {
				Ext.Msg.alert('提示', '请选择产品');
			}
		});

	
	},
	/**
	 * 打印
	 */
	onRmaPrintClick : function() {
		var selection = this.down('grid[title="订单"]').getView().getSelectionModel().getSelection()[0];
		if (selection && selection.isRma()) {
			window.open(location.context + '/sale.do?action=rma_print&id=' + selection.getId(), "_blank");
		} else {
			Ext.Msg.alert('提示', '请选择RMA的订单');
		}
	},
	/**
	 * 打印
	 */
	onSalePrintClick : function() {
		var selection = this.down('grid[title="订单"]').getView().getSelectionModel().getSelection()[0];
		if (selection) {
			window.open(location.context + '/sale.do?action=re_print&id=' + selection.getId(), "_blank");
		} else {
			Ext.Msg.alert('提示', '请选择订单');
		}
	},
	/**
	 * 打印
	 */
	onPackePrintClick : function() {
		var selection = this.down('grid[title="订单"]').getView().getSelectionModel().getSelection()[0];
		if (selection) {
			if (selection.get('if_cashed') == 0) {
				Ext.Msg.alert('提示', '此订单未完全收款，无法打印出货单');
			} else {
				window.open(location.context + '/sale.do?action=packing_print&id=' + selection.getId(), "_blank");
			}
		} else {
			Ext.Msg.alert('提示', '请选择订单');
		}
	},
	/**
	 * 
	 */
	onEditClick : function() {
		var selection = this.down('grid[title="订单"]').getView().getSelectionModel().getSelection()[0];
		if (selection) {
			if (selection.canEdit()) {
				var des = myDesktopApp.getDesktop();
				var form = Ext.create('WJM.sale.SaleForm', {
					listeners : {
						saveSuccess : this.onSaveSuccess, scope : this
					}, record : selection
				});
				win = des.createWindow({
					title : "编辑订单", iconCls : 'icon-grid', animCollapse : false, width : 800, height : 750, constrainHeader : true, layout : 'fit',
					items : [ form ]
				});
				win.show();
			} else {
				Ext.Msg.alert('提示', '此订单不可以编辑。');
			}
		} else {
			Ext.Msg.alert('提示', '请选择订单');
		}
	}
});/**
 * 销售月报表
 */
Ext.define('WJM.sale.SaleMonthlyReportModel', {
	extend : 'Ext.ux.desktop.Module',

	requires : [ 'WJM.model.TSaleTop' ],

	id : 'monthlyreport',

	init : function() {
		this.id = this.config.moduleId || 'monthlyreport';
		this.title = this.config.menuText || 'monthly report/每月报表';
	},

	createWindow : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow(this.id);
		if (!win) {
			var grid = Ext.create('WJM.sale.SaleTopGrid', {
				reportType : 'monthlySaleReport'
			});
			win = desktop.createWindow({
				id : this.id, title : this.title, width : 500, height : 500, iconCls : 'icon-grid', animCollapse : false, constrainHeader : true,
				layout : 'fit', items : grid
			});
		}
		return win;
	}
});
/**
 * 销售单查询
 */
Ext.define('WJM.sale.SaleQuoteGrid', {
	extend : 'Ext.panel.Panel',
	requires : [ 'Ext.grid.Panel' ],
	collapsedStatistics : false,
	layout : {
		type : 'border', padding : 5
	},
	defaults : {
		split : true
	},

	saleStore : 'SaleMyQuoteStore',

	saleProductStore : 'SaleQuoteProductMyStore',
	/**
	 * 是否可以删除
	 */
	deleteAble : false,
	/**
	 * 是否可以编辑
	 */
	editAble : false,
	/**
	 * 只显示我的
	 */
	onlyMy : false,

	initComponent : function() {
		var topbarbuttons = [ {
			iconCls : 'search', text : '搜索', scope : this, handler : this.onSearchClick
		}, {
			iconCls : 'search', text : '打印报价单', scope : this, handler : this.onSalePrintClick
		}, {
			iconCls : 'search', text : '清空', scope : this, handler : this.clearSearch
		} ];

		if (this.deleteAble) {
			topbarbuttons.push({
				iconCls : 'remove', text : '删除', scope : this, handler : this.onDeleteClick
			});
		}
		if (this.editAble) {
			topbarbuttons.push({
				iconCls : 'edit', text : '编辑', scope : this, handler : this.onEditClick
			});
		}
		topbarbuttons.push({
			iconCls : 'search', text : '打印出货单', scope : this, handler : this.onPackePrintClick
		});
		topbarbuttons.push({
			iconCls : 'search', text : '转销售订单', scope : this, handler : this.onTranferInvoiceOrder
		});
		var searchFields = [];
		if (this.onlyMy) {
//			searchFields.push({
//				xtype : 'datefield', fieldLabel : 'start date/开始时间', labelWidth : 150, name : 'oper_time_start', format : 'Y-m-d'
//			}, {
//				xtype : 'datefield', fieldLabel : 'end date/结束时间', labelWidth : 150, name : 'oper_time_end', format : 'Y-m-d'
//			}, {
//				xtype : 'textfield', fieldLabel : 'receive #/销售单号', labelWidth : 150, allowBlank : true, name : 'sale_bill_code'
//			}, {
//				xtype : 'textfield', fieldLabel : 'invoice #/invoice单号', labelWidth : 150, allowBlank : true, name : 'invoicecode'
//			}, {
//				name : 'oper_id', value : window.user.userId, xtype : 'hiddenfield'
//			});
			searchFields.push({
				xtype : 'datefield', fieldLabel : 'start date/开始时间', labelWidth : 150, name : 'oper_time_start', format : 'Y-m-d'
			}, {
				xtype : 'datefield', fieldLabel : 'end date/结束时间', labelWidth : 150, name : 'oper_time_end', format : 'Y-m-d'
			}, {
				xtype : 'combobox', fieldLabel : 'sate/订单状态', labelWidth : 150, name : 'if_cashed', displayField : 'name', valueField : 'value',
				store : 'SaleCashStateStore', value : '-1'
			}, {
				xtype : 'textfield', fieldLabel : 'receive #/销售单号', labelWidth : 150, allowBlank : true, name : 'sale_bill_code'
			}, {
				xtype : 'textfield', fieldLabel : 'invoice #/invoice单号', labelWidth : 150, allowBlank : true, name : 'invoicecode'
			}, {
				name : 'oper_id', value : window.user.userId, xtype : 'hiddenfield'
			});
		} else {
//			searchFields.push({
//				xtype : 'datefield', fieldLabel : 'start date/开始时间', labelWidth : 150, name : 'oper_time_start', format : 'Y-m-d'
//			}, {
//				xtype : 'datefield', fieldLabel : 'end date/结束时间', labelWidth : 150, name : 'oper_time_end', format : 'Y-m-d'
//			}, {
//				xtype : 'combobox', fieldLabel : 'Work ID/操作员', labelWidth : 150, allowBlank : true, name : 'oper_id', displayField : 'name',
//				valueField : 'id', store : 'EmployeeAllStore'
//			}, {
//				xtype : 'textfield', fieldLabel : 'receive #/销售单号', labelWidth : 150, allowBlank : true, name : 'sale_bill_code'
//			}, {
//				xtype : 'textfield', fieldLabel : 'invoice #/invoice单号', labelWidth : 150, allowBlank : true, name : 'invoicecode'
//			});
			searchFields.push({
				xtype : 'datefield', fieldLabel : 'start date/开始时间', labelWidth : 150, name : 'oper_time_start', format : 'Y-m-d'
			}, {
				xtype : 'datefield', fieldLabel : 'end date/结束时间', labelWidth : 150, name : 'oper_time_end', format : 'Y-m-d'
			}, {
				xtype : 'combobox', fieldLabel : 'sate/订单状态', labelWidth : 150, name : 'if_cashed', displayField : 'name', valueField : 'value',
				store : 'SaleCashStateStore', value : '-1'
			}, {
				xtype : 'combobox', fieldLabel : 'Work ID/操作员', labelWidth : 150, allowBlank : true, name : 'oper_id', displayField : 'name',
				valueField : 'id', store : 'EmployeeAllStore'
			}, {
				xtype : 'textfield', fieldLabel : 'invoice #/invoice单号', labelWidth : 150, allowBlank : true, name : 'invoicecode'
			}, {
				xtype : 'textfield', fieldLabel : 'name/客户名称', labelWidth : 150, allowBlank : true, name : 'buyer_name'
			}, {
				xtype : 'textfield', fieldLabel : 'address/客户地址', labelWidth : 150, allowBlank : true, name : 'buyer_address'
			}, {
				xtype : 'textfield', fieldLabel : 'Phone/电话', labelWidth : 150, allowBlank : true, name : 'buyer_mobile'
			}, {
				xtype : 'textfield', fieldLabel : '产品名称', labelWidth : 150, allowBlank : true, name : 'product_name'
			});
		}

		this.editTopBar = Ext.create('Ext.toolbar.Toolbar', {
			items : topbarbuttons
		});

//		var _fileds = [ {
//			xtype : 'rownumberer'
//		}, {
//			text : "receive #/销售单", dataIndex : 'sale_bill_code', sortable : true
//		}, {
//			text : "saleman/销售员", dataIndex : 'oper_name', sortable : true
//		}, {
//			text : "customer/客户", dataIndex : 'buyer_code', sortable : true
//		},  {
//			text : "customer tel/客户电话", dataIndex : 'buyer_mobile', width : 150,sortable : true
//		},{
//			text : "sub total/小计", dataIndex : 'sub_total', sortable : true, xtype : 'numbercolumn', format : '$0.00'
//		}, {
//			text : "tax/税", dataIndex : 'tax', sortable : true, xtype : 'numbercolumn', format : '$0.00'
//		}, {
//			text : "total/合计", dataIndex : 'all_price', sortable : true, xtype : 'numbercolumn', format : '$0.00'
//		}, {
//			text : "date/时间", dataIndex : 'oper_time', sortable : true
//		} ];

//		var _fileds2 = [ {
//			xtype : 'rownumberer'
//		}, {
//			text : "barcode #/条码", dataIndex : 'product_code', sortable : true
//		}, {
//			text : "item name/名称", dataIndex : 'product_name', sortable : true
//		}, {
//			text : "unit price/单价", dataIndex : 'product_price', sortable : true, xtype : 'numbercolumn', format : '$0.00'
//		}, {
//			text : "quantity/数量", dataIndex : 'product_num', sortable : true
//		}, {
//			text : "sub total/小计", dataIndex : 'sub_total', sortable : true, xtype : 'numbercolumn', format : '$0.00'
//		} ];

		var _fileds = [ {
			xtype : 'rownumberer'
		}, {
			text : "saleman/销售员", dataIndex : 'oper_name', sortable : true
		}, {
			text : "invoice #/invoice单号", dataIndex : 'invoice', sortable : true
		}, {
			text : "phone/电话", dataIndex : 'buyer_mobile', sortable : true
		}, {
			text : "customer/客户", dataIndex : 'buyer_name', sortable : true
		}, {
			text : "address/客户地址", dataIndex : 'buyer_address', sortable : true
		}, {
			text : "sub total/小计", dataIndex : 'sub_total', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "tax/税", dataIndex : 'tax', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "total/合计", dataIndex : 'all_price', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "state/状态", dataIndex : 'if_cashedStr', sortable : true
		}, {
			text : "discount/优惠", dataIndex : 'discount', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "balance/余额", dataIndex : 'balance', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "date/时间", dataIndex : 'oper_time', sortable : true
		}, {
			text : "payment/支付方式", dataIndex : 'payment', sortable : true
		}];

		var _fileds2 = [ {
			xtype : 'rownumberer'
		}, {
			text : "barcode #/条码", dataIndex : 'product_code', sortable : true
		}, {
			text : "item name/名称", dataIndex : 'product_name', sortable : true
		}, {
			text : "unit price/单价", dataIndex : 'agio_price', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "quantity/数量", dataIndex : 'product_num', sortable : true
		}, {
			text : "sub total/小计", dataIndex : 'sub_total2', sortable : true, xtype : 'numbercolumn'
		}, {
			text : "RMAed credit quantity/已退货无损数量", dataIndex : 'credit_num', sortable : true, xtype : 'numbercolumn'
		}, {
			text : "RMAed damage quantity/已退货损坏数量", dataIndex : 'damage_num', sortable : true, xtype : 'numbercolumn'
		} ];

		Ext.apply(this, {
			autoScroll : true,
			dockedItems : [ this.editTopBar ],

			items : [
					{
						anchor : '100%', height : 100, xtype : 'form', region : 'north', autoScroll : true, collapsible : true, title : '报价单检索',
						layout : {
							columns : 3, type : 'table', tableAttrs : {
								style : {
									width : '100%'
								}
							}
						}, bodyPadding : 10, items : searchFields
					},
					{
						store : this.saleStore, split : true, disableSelection : false, loadMask : true, autoScroll : true, region : 'center',
						title : '报价单', xtype : 'gridpanel', columns : _fileds,

						viewConfig : {
							plugins : []
						},

						listeners : {
							selectionchange : function(selectionModel, selecteds, eOpts) {
								var recode = selectionModel.getSelection()[0];
								if (recode) {
									var store = Ext.data.StoreManager.lookup(this.saleProductStore);
									store.getProxy().setExtraParam('sale_id', recode.getId());
									store.load();
								}
							}, scope : this
						},

						bbar : Ext.create('Ext.PagingToolbar', {
							store : this.saleStore, displayInfo : true, displayMsg : '显示报价单 {0} - {1} 总共 {2}', emptyMsg : "没有报价单数据"
						})
					},
					{
						region : 'south',
						split : true,
						height : 150,
						layout : {
							type : 'border', padding : 5
						},
						items : [
								
								{
									store : this.saleProductStore, split : true, disableSelection : false, collapsible : true, split : true, loadMask : true,
									height : 150, autoScroll : true, region : 'center', multiSelect : true, title : '报价单明细', xtype : 'gridpanel',
									columns : _fileds2, viewConfig : {
										plugins : [ Ext.create('Ext.grid.plugin.DragDrop', {
											ddGroup : 'TProduct', enableDrop : false, enableDrag : true
										}) ]
									}
								},
								{
									xtype : 'form', title : '报价统计', region : 'east', width : 250, collapsible : true, split : true,
									collapsed : this.collapsedStatistics, defaults : {
										xtype : 'textfield', anchor : '100%', labelWidth : 100, bodyPadding : 10
									}, items : [ {
										fieldLabel : 'total sales/次数', name : 'total_sales', readOnly : true
									}, {
										fieldLabel : 'amount/总计', name : 'amount', readOnly : true, xtype : 'adnumberfield'
									} ]
								} ]
					} ]
		});
		var store = Ext.data.StoreManager.lookup(this.saleStore);
		store.on('load', this.onDataRefresh, this);
		this.callParent();
		this.onSearchClick();
	},
	
	onDataRefresh : function() {
		var store = Ext.data.StoreManager.lookup(this.saleStore);
		var formPanel = this.down('form[title="报价统计"]');
		if (formPanel) {
			var form = formPanel.getForm();
			var count = 0;var allPrice = 0;
			store.each(function(record){
				if(record.data.if_cashed != 3){
					count ++ ;
					allPrice +=record.data.all_price;
				}
				
			});
			form.findField('total_sales').setValue(count);
			form.findField('amount').setValue(allPrice);
		}
	},
	/**
	 * 搜索
	 */
	onSearchClick : function() {
		var data = this.down('form[title="报价单检索"]').getForm().getFieldValues();
		var store = Ext.data.StoreManager.lookup(this.saleStore);
		var saleProductStore = Ext.data.StoreManager.lookup(this.saleProductStore);
		saleProductStore.removeAll();
		Ext.Object.each(data, function(key, value) {
			store.getProxy().setExtraParam(key, value);
		});
		store.loadPage(1);
	},
	/**
	 * 清空
	 */
	clearSearch : function() {
		var fields = this.down('form[title="报价单检索"]').getForm().getFields();
		fields.each(function(field) {
			if (field.getName() == 'if_cashed') {
				field.setValue('-1');
			} else {
				field.setValue('');
			}
		});
	},

	/**
	 * 删除
	 */
	onDeleteClick : function() {
		var selection = this.down('grid[title="报价单"]').getView().getSelectionModel().getSelection()[0];
		if (selection) {
			if (selection.canDelete()) {
				Ext.Msg.confirm('提示', '确定要删除此报价单么？', function(btn, text) {
					if (btn == 'yes') {
						var store = Ext.data.StoreManager.lookup(this.saleStore);
						store.remove(selection);
					}
				}, this);
			} else {
				Ext.Msg.alert('提示', '此报价单不可以删除！');
			}
		} else {
			Ext.Msg.alert('提示', '请选择产品');
		}
	},
	/**
	 * 打印
	 */
	onSalePrintClick : function() {
		var selection = this.down('grid[title="报价单"]').getView().getSelectionModel().getSelection()[0];
		if (selection) {
			window.open(location.context + '/sale.do?action=re_print&id=' + selection.getId(), "_blank");
		} else {
			Ext.Msg.alert('提示', '请选择产品');
		}
	},
	
	
	onTranferInvoiceOrder:function(){
		var selection = this.down('grid[title="报价单"]').getView().getSelectionModel().getSelection()[0];
		if (selection) {
			Ext.Msg.confirm('confirm', '您确定要转为销售订单吗？', function (btn, text) {
				if(btn == "yes"){

	            	Ext.Ajax.request({
	            	    url: location.context + '/sale.do?action=packeTransferToInvoiceOrder',
	            	    params: {
	            	    	id: selection.getId()
	            	    },
	            	    reader: {
	            	        type : 'json'
	            	    },
	            	    success: function(response,a,b){
	            	    	Ext.Msg.alert('提示', '生成销售订单成功! '+response.responseText);
	            	    }
	            	});
	            	
	            
				}
			});
		} else {
			Ext.Msg.alert('提示', '请选择订单');
		}
	},
	
	
	/**
	 * 打印出货单
	 */
	onPackePrintClick : function() {
		var selection = this.down('grid[title="报价单"]').getView().getSelectionModel().getSelection()[0];
		if (selection) {
				window.open(location.context + '/sale.do?action=packing_print&notNeedPaid=1&id=' + selection.getId(), "_blank");
		} else {
			Ext.Msg.alert('提示', '请选择订单');
		}
	},
	
	/**
	 * 
	 */
	onEditClick : function() {
		var selection = this.down('grid[title="报价单"]').getView().getSelectionModel().getSelection()[0];
		if (selection) {
			if (selection.canEdit()) {
				var des = myDesktopApp.getDesktop();
				var form = Ext.create('WJM.sale.SaleForm', {
					listeners : {
						saveSuccess : this.onSaveSuccess, scope : this
					}, record : selection
				});
				win = des.createWindow({
					title : "编辑报价单", iconCls : 'icon-grid', animCollapse : false, width : 800, height : 750, constrainHeader : true, layout : 'fit',
					items : [ form ]
				});
				win.show();
			} else {
				Ext.Msg.alert('提示', '此报价单不可以编辑。');
			}
		} else {
			Ext.Msg.alert('提示', '请选择报价单');
		}
	},
	/**
	 * 保存成功回调
	 */
	onSaveSuccess : function(that) {
		var win = that.ownerCt;
		win.destroy();
		var store = Ext.data.StoreManager.lookup(this.saleStore);
		store.loadPage(1);
		this.show();
	}
});/**
 * 销售单查询
 */
Ext.define('WJM.sale.SaleReportModel', {
	extend : 'Ext.ux.desktop.Module',

	requires : [ 'WJM.model.TSale', 'WJM.model.TSaleProduct' ],

	id : 'saledetail',

	init : function() {
		this.id = this.config.moduleId || 'saledetail';
		this.title = this.config.menuText || 'daily report/日常报表';
	},

	createWindow : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow(this.id);
		if (!win) {
			var grid = Ext.create('WJM.sale.SaleGrid', {
				rmaAble : true
			});
			win = desktop.createWindow({
				id : this.id, title : this.title, width : 980, height : 600, iconCls : 'icon-grid', animCollapse : false, constrainHeader : true,
				layout : 'fit', items : grid
			});
		}
		return win;
	}
});
/**
 * 销售单查询
 */
Ext.define('WJM.sale.SaleTopGrid', {
	extend : 'Ext.panel.Panel',
	requires : [ 'Ext.grid.Panel' ],
	layout : {
		type : 'border', padding : 5
	},
	saleStore : 'SaleStore',
	reportType : 'daySaleReport',
	saleProductStore : 'SaleProductStore',
	closeAction : 'destroy',
	defaults : {
		split : true
	},
	initComponent : function() {

		this.editTopBar = Ext.create('Ext.toolbar.Toolbar', {
			items : [ {
				iconCls : 'search', text : '搜索', scope : this, handler : this.onSearchClick
			}, {
				iconCls : 'search', text : '清空', scope : this, handler : this.clearSearch
			}, {
				iconCls : 'search', text : '打印列表', scope : this, handler : this.printGrid
			} ]
		});

		var _fileds = [ {
			xtype : 'rownumberer'
		}, {
			text : "item name/产品名称", dataIndex : 'product_name', sortable : true
		}, {
			text : "total price/总价", dataIndex : 'all_price', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "item number/产品数量", dataIndex : 'sale_times', sortable : true
		} ];

		var formFileds = [];
		switch (this.reportType) {
		case 'daySaleReport':
			formFileds.push({
				xtype : 'datefield', fieldLabel : 'start date/开始时间', labelWidth : 150, name : 'oper_time_start', format : 'Y-m-d'
			}, {
				xtype : 'datefield', fieldLabel : 'end date/结束时间', labelWidth : 150, name : 'oper_time_end', format : 'Y-m-d'
			}, {
				xtype : 'combobox', fieldLabel : 'sate/订单状态', labelWidth : 150, name : 'if_cashed', displayField : 'name', valueField : 'value',
				store : 'SaleCashStateStore', value : '-1'
			}, {
				xtype : 'combobox', fieldLabel : 'Work ID/操作员', labelWidth : 150, allowBlank : true, name : 'oper_id', displayField : 'name',
				valueField : 'id', store : 'EmployeeAllStore'
			}, {
				xtype : 'textfield', fieldLabel : 'invoice #/invoice单号', labelWidth : 150, allowBlank : true, name : 'invoicecode'
			}, {
				xtype : 'textfield', fieldLabel : 'name/客户名称', labelWidth : 150, allowBlank : true, name : 'buyer_name'
			}, {
				xtype : 'textfield', fieldLabel : 'address/客户地址', labelWidth : 150, allowBlank : true, name : 'buyer_address'
			}, {
				xtype : 'textfield', fieldLabel : 'Phone/电话', labelWidth : 150, allowBlank : true, name : 'buyer_mobile'
			});
//			formFileds.push({
//				xtype : 'datefield', fieldLabel : 'sale date/销售日期', labelWidth : 150, name : 'date', format : 'Y-m-d', allowBlank : false
//			});
			this.storeId = 'SaleTopDayStore';
			break;
		case 'monthlySaleReport':
			formFileds.push({
				xtype : 'datefield', fieldLabel : 'sale date/销售日期', labelWidth : 150, name : 'date', format : 'Y-m', allowBlank : false
			});
			this.storeId = 'SaleTopMonthStore';
			break;
		case 'bettenSaleReport':
			formFileds.push({
				xtype : 'datefield', fieldLabel : 'start date/开始时间', labelWidth : 150, name : 'begin', format : 'Y-m-d', allowBlank : false
			});
			formFileds.push({
				xtype : 'datefield', fieldLabel : 'end date/结束时间', labelWidth : 150, name : 'end', format : 'Y-m-d', allowBlank : false
			});
			this.storeId = 'SaleTopBetweenStore';
			break;
		default:
			break;
		}
		
		var _fileds1 = [ {
			xtype : 'rownumberer'
		}, {
			text : "saleman/销售员", dataIndex : 'oper_name', sortable : true
		}, {
			text : "invoice #/invoice单号", dataIndex : 'invoice', sortable : true
		}, {
			text : "phone/电话", dataIndex : 'buyer_mobile', sortable : true
		}, {
			text : "customer/客户", dataIndex : 'buyer_name', sortable : true
		}, {
			text : "address/客户地址", dataIndex : 'buyer_address', sortable : true
		}, {
			text : "sub total/小计", dataIndex : 'sub_total', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "tax/税", dataIndex : 'tax', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "total/合计", dataIndex : 'all_price', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "state/状态", dataIndex : 'if_cashedStr', sortable : true
		}, {
			text : "discount/优惠", dataIndex : 'discount', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "balance/余额", dataIndex : 'balance', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "date/时间", dataIndex : 'oper_time', sortable : true
		}, {
			text : "payment/支付方式", dataIndex : 'payment', sortable : true
		}];

		var _fileds2 = [ {
			xtype : 'rownumberer'
		}, {
			text : "barcode #/条码", dataIndex : 'product_code', sortable : true
		}, {
			text : "item name/名称", dataIndex : 'product_name', sortable : true
		}, {
			text : "unit price/单价", dataIndex : 'agio_price', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "quantity/数量", dataIndex : 'product_num', sortable : true
		}, {
			text : "sub total/小计", dataIndex : 'sub_total2', sortable : true, xtype : 'numbercolumn'
		}, {
			text : "RMAed credit quantity/已退货无损数量", dataIndex : 'credit_num', sortable : true, xtype : 'numbercolumn'
		}, {
			text : "RMAed damage quantity/已退货损坏数量", dataIndex : 'damage_num', sortable : true, xtype : 'numbercolumn'
		} ];
		
		var item=[
					{
						anchor : '100%', height : 130, xtype : 'form', region : 'north', autoScroll : true, collapsible : true, title : '搜索信息',
						layout : {
							columns : 3, type : 'table', tableAttrs : {
								style : {
									width : '100%'
								}
							}
						},bodyPadding : 10, items : formFileds
					},{store : this.storeId, split : true,
						disableSelection : false, loadMask : true, autoScroll : true, region : 'center',
						title : '日销售产品报表', xtype : 'gridpanel', columns : _fileds,height : 200,width : 400,
					    collapsible: true,  
					    animCollapse: false, 
						},
					{
						region : 'south',
						split : true,
						height : 200,
						layout : {
							type : 'border', padding : 5
						},
						items : [{
							store : this.saleStore, split : true, disableSelection : false, loadMask : true, autoScroll : true, region : 'west',
							title : '订单', xtype : 'gridpanel', columns : _fileds1,height : 200,width : 350,
							collapsible: true,  
						    animCollapse: false, 
							listeners : {
								selectionchange : function(selectionModel, selecteds, eOpts) {
									var recode = selectionModel.getSelection()[0];
									if (recode) {
										var store = Ext.data.StoreManager.lookup(this.saleProductStore);
										store.getProxy().setExtraParam('sale_id', recode.getId());
										store.load();
									}
								}, scope : this
							},

							bbar : Ext.create('Ext.PagingToolbar', {
								store : this.saleStore, displayInfo : true, displayMsg : '显示订单 {0} - {1} 总共 {2}', emptyMsg : "没有订单数据"
							})
						},
								{
									store : this.saleProductStore, split : true, disableSelection : false, collapsible : true, split : true, loadMask : true,
									height : 150, autoScroll : true, region : 'center', multiSelect : true, title : '订单明细', xtype : 'gridpanel',
									columns : _fileds2, viewConfig : {
										plugins : [ Ext.create('Ext.grid.plugin.DragDrop', {
											ddGroup : 'TProduct', enableDrop : false, enableDrag : true
										}) ]
									}
								},
								{
									xtype : 'form', title : '销售统计', region : 'east', width : 250, collapsible : true, split : true,
									collapsed : this.collapsedStatistics, defaults : {
										xtype : 'textfield', anchor : '100%', labelWidth : 100, bodyPadding : 10
									}, items : [ {
										fieldLabel : 'total sales/次数', name : 'total_sales', readOnly : true
									}, {
										fieldLabel : 'amount/总计', name : 'amount', readOnly : true, xtype : 'adnumberfield'
									} ]
								} ]
					}  ]
		;
			
		Ext.apply(this, {
			autoScroll : true,
			dockedItems : [ this.editTopBar ],

			items : item

		});
		var store = Ext.data.StoreManager.lookup(this.saleStore);
		store.on('load', this.onDataRefresh, this);
		this.callParent();
	},
	/**
	 * 搜索
	 */
	onSearchClick : function() {
		if (this.down('form').getForm().isValid()) {
			var data = this.down('form').getForm().getFieldValues();
			var store = Ext.data.StoreManager.lookup(this.storeId);
			Ext.Object.each(data, function(key, value) {
				store.getProxy().setExtraParam(key, value);
			});
			store.load();
			
			var store = Ext.data.StoreManager.lookup(this.saleStore);
			var saleProductStore = Ext.data.StoreManager.lookup(this.saleProductStore);
			saleProductStore.removeAll();
			Ext.Object.each(data, function(key, value) {
				store.getProxy().setExtraParam(key, value);
			});
			store.loadPage(1);
		}
	},
	/**
	 * 清空
	 */
	clearSearch : function() {
		var fields = this.down('form').getForm().getFields();
		fields.each(function(field) {
			field.setValue('');
		});
	},
	onDataRefresh : function() {
		var store = Ext.data.StoreManager.lookup(this.saleStore);
		var formPanel = this.down('form[title="销售统计"]');
		if (formPanel) {
			var form = formPanel.getForm();
			form.findField('total_sales').setValue(store.getCount());
			form.findField('amount').setValue(store.sum('all_price'));
		}
	},
	/**
	 * 
	 */
	printGrid : function() {
		Ext.ux.grid.Printer.print(this.down('grid'));
	}
});/**
 * 价格查询
 */
Ext.define('WJM.stock.PriceSearchModel', {
  extend : 'Ext.ux.desktop.Module',

  requires : [ 'WJM.model.TStock', 'WJM.model.TStockAndProduct' ],

  id : 'pricesearch',

  init : function() {
	this.id = this.config.moduleId || 'pricesearch';
	this.title = this.config.menuText || 'price search/价格搜索';
  },

  createWindow : function() {
	var desktop = this.app.getDesktop();
	var win = desktop.getWindow(this.id);
	if (!win) {
	  var grid = Ext.create('WJM.stock.StockAndProductGrid');
	  win = desktop.createWindow({
		id : this.id, title : this.title, width : 800, height : 600, iconCls : 'icon-grid', animCollapse : false, constrainHeader : true,
		layout : 'fit', items : grid
	  });
	}
	return win;
  }
});
/**
 * 库存价格查询
 */
Ext.define('WJM.stock.StockAndProductGrid', {
	extend : 'Ext.panel.Panel',
	requires : [ 'Ext.grid.Panel', 'WJM.model.TStockAndProduct' ],
	layout : {
		type : 'border', padding : 5
	},
	defaults : {
		split : true
	},

	initComponent : function() {
		this.editTopBar = Ext.create('Ext.toolbar.Toolbar', {
			items : [ {
				iconCls : 'search', text : '搜索', scope : this, handler : this.onSearchClick
			} ]
		});

		var _fileds = [ {
			xtype : 'rownumberer'
		}, {
			text : "item id/助记符", dataIndex : 'product_id', sortable : true, width : 100
		}, {
			text : "description 1", dataIndex : 'product_name', sortable : true, width : 200
		}, {
			text : "price/价格", dataIndex : 'product_price', sortable : true, width : 150, xtype : 'numbercolumn'
		}, {
			text : "stock date/进货日期", dataIndex : 'stock_time', sortable : true, width : 150
		} ];

		Ext.apply(this, {
			autoScroll : true,
			dockedItems : [ this.editTopBar ],

			items : [
					{
						anchor : '100%', height : 100, xtype : 'form', region : 'north', autoScroll : true, collapsible : true, title : '产品检索',
						layout : {
							columns : 2, type : 'table'
						}, bodyPadding : 10, items : [ {
							xtype : 'textfield', fieldLabel : 'item id/助记符', labelWidth : 150, name : 'product_id'
						}, {
							xtype : 'textfield', fieldLabel : 'description', labelWidth : 150, name : 'product_name'
						} ]
					},
					{
						store : 'StockAndProductStore', split : true, disableSelection : false, loadMask : true, autoScroll : true, region : 'center',
						xtype : 'gridpanel', columns : _fileds, viewConfig : {
							plugins : []
						}
					} ]
		});
		this.callParent();
	},
	/**
	 * 搜索
	 */
	onSearchClick : function() {
		var data = this.down('form').getForm().getFieldValues();
		var store = Ext.data.StoreManager.lookup('StockAndProductStore');
		Ext.Object.each(data, function(key, value) {
			store.getProxy().setExtraParam(key, value);
		});
		store.load();
	}
});/**
 * 库存表单 废弃
 */
Ext.define('WJM.stock.StockForm', {
	extend : 'Ext.form.Panel',
	requires : [ 'WJM.model.TStock' ],
	height : 680,
	width : 400,
	bodyPadding : 10,

	initComponent : function() {
		var me = this;
		var _fileds = [ {
			xtype : 'rownumberer'
		}, {
			text : "items id/助记符", dataIndex : 'product_id', sortable : true, width : 100
		}, {
			text : "barcode #/条码", dataIndex : 'code', sortable : true, width : 100
		}, {
			text : "description 1", dataIndex : 'product_name', sortable : true, width : 200
		}, {
			text : "description 2", dataIndex : 'product_name_cn', sortable : true, width : 200
		}, {
			text : "cost/进货价", dataIndex : 'price_income', sortable : true, xtype : 'numbercolumn', editor : {
				xtype : 'adnumberfield', allowBlank : false, minValue : 0
			}
		}, {
			text : "quantity/数量", dataIndex : 'num', sortable : true, xtype : 'numbercolumn', editor : {
				xtype : 'numberfield', allowBlank : false, allowDecimals : false, minValue : 1
			}
		}, {
			text : "vendor/供货商", dataIndex : 'vendortName', sortable : true
		} ];

		Ext.applyIf(me, {
			defaults : {
				xtype : 'textfield', anchor : '100%', labelWidth : 150
			},
			items : [
					{
						anchor : '100% -100', disableSelection : false, loadMask : true, xtype : 'gridpanel', columns : _fileds,
						plugins : [ Ext.create('Ext.grid.plugin.CellEditing', {
							clicksToEdit : 1, listeners : {
								edit : me.calculateTotal, scope : me
							}
						}) ],

						viewConfig : {
							plugins : [ Ext.create('Ext.grid.plugin.DragDrop', {
								ptype : 'gridviewdragdrop', ddGroup : 'TProduct', enableDrop : true, enableDrag : false
							}) ],

							listeners : {
								drop : function(node, data, overModel, dropPosition, eOpts) {
									for ( var i = 0; i < data.records.length; i++) {
										var array_element = data.records[i];
										array_element.set("num", 1);
									}
								},

								beforedrop : function(node, data, overModel, dropPosition, dropFunction, eOpts) {
									data.copy = true;
									var gridpanle = me.down('gridpanel');
									var store = gridpanle.getStore();
									data.records = Ext.Array.filter(data.records, function(item) {
										var data = store.getById(item.getId());
										if (data) {
											data.set("num", data.get("num") + 1);
											return false;
										} else {
											return true;
										}
									});
								}
							}
						}
					},
					{
						name : 'id', xtype : 'hiddenfield'
					},
					{
						name : 'oper_id', xtype : 'hiddenfield', value : window.user.userId
					},
					{
						name : 'stock_bill_code', xtype : 'hiddenfield'
					},
					{
						name : 'all_stock_price', fieldLabel : 'total/总金额', allowBlank : false, readOnly : true
					},
					{
						name : 'oper_name', fieldLabel : 'Worker ID/操作员', allowBlank : false, readOnly : true, value : window.user.userName
					},
					{
						name : 'oper_time', fieldLabel : 'date/时间', allowBlank : false, readOnly : true,
						value : Ext.Date.format(new Date(), 'Y-m-d H:i:s')
					} ],

			dockedItems : [ {
				xtype : 'toolbar', dock : 'top', items : [ {
					xtype : 'button', iconCls : 'save', text : '保存', scope : this, handler : this.onSaveClick
				}, {
					xtype : 'button', iconCls : 'search', text : '搜索产品', scope : this, handler : this.onProductSearchClick
				}, {
					xtype : 'label', text : '从任意产品列表拖动产品项到此产品列表区域'
				} ]
			} ]
		});
		me.callParent(arguments);
	},

	/**
	 * 保存
	 */
	onSaveClick : function() {
		var form = this.getForm();
		var me = this;
		var datas = this.down('gridpanel').getStore().data;
		var redod = [];
		datas.each(function(item) {
			redod.push(item.getData());
		});
		this.calculateTotal();
		if (form.isValid()) {
			this.submit({
				url : 'stock.do?action=stock_submit', params : {
					productJsonList : Ext.JSON.encode(redod)
				},

				success : function(form, action) {
					Ext.Msg.alert('提示', '保存成功');
					me.clearForm();
					me.fireEvent('saveSuccess', me);
				},

				failure : function(form, action) {
					Ext.Msg.alert('提示', action.result.msg || '保存失败，请稍候重试');
				}
			});
		}
	},

	/**
	 * 搜索产品
	 */
	onProductSearchClick : function() {
		var desktop = myDesktopApp.getDesktop();
		var win = desktop.getWindow('productsearch');
		if (!win) {
			var grid = Ext.create('WJM.product.ProductGrid', {
				editAble : false
			});
			win = desktop.createWindow({
				id : 'productsearch', title : "search/产品搜索", width : 600, height : 600, iconCls : 'icon-grid', animCollapse : false,
				constrainHeader : true, layout : 'fit', items : [ grid ]
			});
		}
		win.show();
	},

	/**
	 * 计算总数
	 */
	calculateTotal : function() {
		var total = 0;
		var datas = this.down('gridpanel').getStore().data;
		datas.each(function(item) {
			total += item.get('num') * item.get('price_income');
		});
		this.getForm().findField('all_stock_price').setValue(total);
	},
	/**
	 * 重置表单
	 */
	clearForm : function() {
		this.down('gridpanel').getStore().removeAll();
		this.getForm().findField('all_stock_price').setValue(0);
		this.getForm().findField('oper_time').setValue(Ext.Date.format(new Date(), 'Y-m-d H:i:s'));
	}
});/**
 * 库存表单模块 po 收货
 */
Ext.define('WJM.stock.StockFormModel', {
	extend : 'Ext.ux.desktop.Module',

	requires : [ 'WJM.model.TStock', 'WJM.model.TStockProduct', 'WJM.model.TPurchase','WJM.purchase.PurchaseGrid' ],

	id : 'stock',

	init : function() {
		this.id = this.config.moduleId || 'stock';
		this.title = this.config.menuText || 'Inventory/收货';
	},

	createWindow : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow(this.id);
		if (!win) {
			var grid = Ext.create('WJM.purchase.PurchaseGrid', {
				editAble : false, receiveAble : true, cashAble : false
			});
			win = desktop.createWindow({
				id : this.id, title : this.title, width : 980, height : 600, iconCls : 'icon-grid', animCollapse : false, constrainHeader : true,
				layout : 'fit', items : grid
			});
		} else {
			win.down('form').clearForm();
		}
		return win;
	}
});
/**
 * 库存报表
 */
Ext.define('WJM.stock.StockGrid', {
  extend : 'Ext.panel.Panel',
  requires : [ 'Ext.grid.Panel' ],
  layout : {
	type : 'border', padding : 5
  },
  defaults : {
	split : true
  },

  initComponent : function() {
	this.editTopBar = Ext.create('Ext.toolbar.Toolbar', {
	  items : [ {
		iconCls : 'search', text : '搜索', scope : this, handler : this.onSearchClick
	  }, {
		iconCls : 'search', text : '清空', scope : this, handler : this.clearSearch
	  } ]
	});

	var _fileds = [ {
	  xtype : 'rownumberer'
	}, {
	  text : "Packing list #/进货单", dataIndex : 'stock_bill_code', sortable : true, width : 150
	}, {
	  text : "Work ID/操作员", dataIndex : 'oper_name', sortable : true, width : 100
	}, {
	  text : "total/合计", dataIndex : 'all_stock_price', sortable : true, width : 100
	}, {
	  text : "date/时间", dataIndex : 'oper_time', sortable : true, width : 200
	} ];

	var _fileds2 = [ {
	  xtype : 'rownumberer'
	}, {
	  text : "barcode #/条码", dataIndex : 'product_code', sortable : true, width : 100
	}, {
	  text : "product name/名称", dataIndex : 'product_name', sortable : true, width : 200
	}, {
	  text : "vendor/供应商", dataIndex : 'provider_name', sortable : true, width : 200
	}, {
	  text : "quantity/数量", dataIndex : 'product_num', sortable : true, width : 100
	}, {
	  text : "price/价格", dataIndex : 'product_price', sortable : true, width : 100
	}, {
	  text : "sub total/小计", dataIndex : 'product_price', sortable : true
	} ];

	Ext.apply(this, {
	  autoScroll : true,
	  dockedItems : [ this.editTopBar ],

	  items : [
		  {
			anchor : '100%',
			height : 100,
			xtype : 'form',
			region : 'north',
			autoScroll : true,
			collapsible : true,
			title : '库存检索',
			layout : {
			  columns : 2, type : 'table', tableAttrs : {
				style : {
				  width : '100%'
				}
			  }
			},
			bodyPadding : 10,
			items : [
				{
				  xtype : 'datefield', fieldLabel : 'start date/开始时间', labelWidth : 150, name : 'oper_time_start', format : 'Y-m-d'
				},
				{
				  xtype : 'datefield', fieldLabel : 'end date/结束时间', labelWidth : 150, name : 'oper_time_end', format : 'Y-m-d'
				},
				{
				  xtype : 'combobox', fieldLabel : 'Work ID/操作员', labelWidth : 150, allowBlank : true, name : 'oper_id',
				  displayField : 'name', valueField : 'id', store : 'EmployeeAllStore'
				}
			// {
			// title : '从任意的供货商列表中拖动列表项此区域',
			// xtype : 'fieldset',
			// layout : {
			// columns : 2, type : 'table', tableAttrs : {
			// style : {
			// width : '100%'
			// }
			// }
			// },
			// allowBlank : false,
			// colspan : 2,
			// items : [
			// {
			// fieldLabel : 'vendor name/供货商', name : 'provider_name',
			// allowBlank : false, xtype : 'textfield', anchor : '100%',
			// labelWidth : 150
			// },
			// {
			// fieldLabel : 'vendor code/供货商', name : 'provider_id', allowBlank
			// : false, xtype : 'textfield', anchor : '100%',
			// labelWidth : 150
			// } ]
			// }
			]
		  },
		  {
			store : 'StockStore', split : true, disableSelection : false, loadMask : true, autoScroll : true, region : 'center',
			title : '进货单', xtype : 'gridpanel', columns : _fileds,

			viewConfig : {
			  plugins : []
			},

			listeners : {
			  selectionchange : function(selectionModel, selecteds, eOpts) {
				var recode = selectionModel.getSelection()[0];
				if (recode) {
				  var store = Ext.data.StoreManager.lookup('StockProductStore');
				  store.getProxy().setExtraParam('stock_id', recode.getId());
				  store.load();
				}
			  }, scope : this
			},

			bbar : Ext.create('Ext.PagingToolbar', {
			  store : 'StockStore', displayInfo : true, displayMsg : '显示库存 {0} - {1} 总共 {2}', emptyMsg : "没有库存数据"
			})
		  },
		  {
			store : 'StockProductStore', split : true, disableSelection : false, loadMask : true, height : 150, autoScroll : true,
			region : 'south', title : '进货单明细', xtype : 'gridpanel', columns : _fileds2, viewConfig : {
			  plugins : []
			}
		  } ]
	});
	var store = Ext.data.StoreManager.lookup('StockStore');
	store.loadPage(1);
	this.callParent();
  },
  /**
   * 搜索
   */
  onSearchClick : function() {
	var data = this.down('form').getForm().getFieldValues();
	var store = Ext.data.StoreManager.lookup('StockStore');
	var stockProductStore = Ext.data.StoreManager.lookup('StockProductStore');
	stockProductStore.removeAll();
	Ext.Object.each(data, function(key, value) {
	  store.getProxy().setExtraParam(key, value);
	});
	store.loadPage(1);
  },
  /**
   * 清空
   */
  clearSearch : function() {
	var fields = this.down('form').getForm().getFields();
	fields.each(function(field) {
	  field.setValue('');
	});
  }
});/**
 * 价格查询
 */
Ext.define('WJM.stock.StockReportModel', {
  extend : 'Ext.ux.desktop.Module',

  requires : [ 'WJM.model.TStock', 'WJM.model.TStockAndProduct', 'WJM.model.TStockProduct' ],

  id : 'stockdetail',

  init : function() {
	this.id = this.config.moduleId || 'stockdetail';
	this.title = this.config.menuText || 'stock detail/库存报表';
  },

  createWindow : function() {
	var desktop = this.app.getDesktop();
	var win = desktop.getWindow(this.id);
	if (!win) {
	  var grid = Ext.create('WJM.stock.StockGrid');
	  win = desktop.createWindow({
		id : this.id, title : this.title, width : 800, height : 600, iconCls : 'icon-grid', animCollapse : false, constrainHeader : true,
		layout : 'fit', items : grid
	  });
	}
	return win;
  }
});
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
});/**
 * 供货商编辑列表
 */
Ext.define('WJM.vendor.VendorGrid', {
	extend : 'Ext.panel.Panel',
	requires : [ 'Ext.grid.Panel', 'WJM.model.TVendor', 'Ext.grid.plugin.RowEditing', 'WJM.model.TPurchaseCashHistory' ],
	/**
	 * 是否可以编辑
	 */
	editAble : false,
	height : 487,
	width : 569,
	layout : {
		type : 'border', padding : 5
	},
	defaults : {
		split : true
	},

	initComponent : function() {

		if (this.editAble) {
			this.editTopBar = Ext.create('Ext.toolbar.Toolbar', {
				items : [ {
					iconCls : 'search', text : '搜索', scope : this, handler : this.onSearchClick
				}, {
					iconCls : 'add', text : '添加', scope : this, handler : this.onAddClick
				}, {
					iconCls : 'edit', text : '编辑', scope : this, handler : this.onEditClick
				}, {
					iconCls : 'remove', text : '删除', scope : this, handler : this.onDeleteClick
				} ]
			});
		} else {
			this.editTopBar = Ext.create('Ext.toolbar.Toolbar', {
				items : [ {
					iconCls : 'search', text : '搜索', scope : this, handler : this.onSearchClick
				} ]
			});
		}

		var _fileds = [ {
			xtype : 'rownumberer'
		}, {
			text : "company code/公司编号", dataIndex : 'code', sortable : true, width : 150
		}, {
			text : "name/名字", dataIndex : 'shortName', sortable : true, width : 100
		}, {
			text : "Company Address/地址", dataIndex : 'address', sortable : true, width : 100
		}, {
			text : "Contact Person/联系人", dataIndex : 'linkMan', sortable : true, width : 100
		}, {
			text : "phone/电话", dataIndex : 'mobile', sortable : true
		}, {
			text : "paid amount/已付金额", dataIndex : 'paid_total', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "account balance/账户余额", dataIndex : 'acc_balance', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "outstanding balance/未付余额", dataIndex : 'invoice_balance', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "P.O. total/定单总额", dataIndex : 'invoice_total', xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "remark/备注", dataIndex : 'myMemo'
		} ];

		var items = [
				{
					anchor : '100%', height : 100, xtype : 'form', autoScroll : true, title : '商家检索', region : 'north', collapsible : true,
					layout : {
						columns : 2, type : 'table'
					}, bodyPadding : 10, items : [ {
						xtype : 'textfield', fieldLabel : 'company name/名称', labelWidth : 150, name : 'shortName'
					}, {
						xtype : 'textfield', fieldLabel : 'company code/编号', labelWidth : 150, name : 'code'
					}, {
						xtype : 'textfield', fieldLabel : 'contact person/联系人', labelWidth : 150, name : 'linkMan'
					}, {
						xtype : 'textfield', fieldLabel : 'phone/电话', labelWidth : 150, name : 'mobile'
					} ]
				},
				{
					store : 'VendorSearchStore', split : true, disableSelection : false, loadMask : true, autoScroll : true, region : 'center',
					xtype : 'gridpanel', columns : _fileds, minHeight : 200, viewConfig : {
						plugins : [ Ext.create('Ext.grid.plugin.DragDrop', {
							ptype : 'gridviewdragdrop', ddGroup : 'TVendor'
						})

						]
					}, bbar : Ext.create('Ext.PagingToolbar', {
						store : 'VendorSearchStore', displayInfo : true, displayMsg : '显示 供货商 {0} - {1} 总共 {2}', emptyMsg : "没有供货商数据"
					}), listeners : {
						selectionchange : function(selectionModel, selecteds, eOpts) {
							var recode = selectionModel.getSelection()[0];
							if (recode) {
								var store = Ext.data.StoreManager.lookup('PurchaseVendorCashStore');
								store.getProxy().setExtraParam('provider_id', recode.getId());
								store.load();
							}
						}, scope : this
					}
				} ];
		if (this.editAble) {
			var cashGrid = Ext.create('WJM.cash.widget.PurchaseCashGrid', {
				region : 'south', title : '供货商采购单列表', height : 400, collapsed : false, collapsible : true,
				purchaseStore : 'PurchaseVendorCashStore', purchaseProductStore : 'PurchaseProductVendorCashStore',
				cashStore : 'PurchaseCashHistoryStore'
			});
			cashGrid.on('saveSuccess', this.onSaveSuccess, this);
			items.push(cashGrid);
		}

		Ext.apply(this, {
			autoScroll : true, dockedItems : [ this.editTopBar ], items : items
		});
		var store = Ext.data.StoreManager.lookup('VendorSearchStore');
		store.loadPage(1);
		this.callParent();
	},
	/**
	 * 删除
	 */
	onDeleteClick : function() {
		var selection = this.down('grid').getView().getSelectionModel().getSelection()[0];
		if (selection) {
			Ext.Msg.confirm('提示', '确定要删除此供货商么？', function(btn, text) {
				if (btn == 'yes') {
					var store = Ext.data.StoreManager.lookup('VendorSearchStore');
					store.remove(selection);
				}
			}, this);
		} else {
			Ext.Msg.alert('提示', '请选择供应商');
		}
	},
	/**
	 * 添加
	 */
	onAddClick : function() {
		var des = myDesktopApp.getDesktop();
		win = des.createWindow({
			title : "新建供应商", height : 380, width : 500, iconCls : 'icon-grid', animCollapse : false, constrainHeader : true, layout : 'fit',
			items : [ Ext.create('WJM.vendor.VendorForm', {
				listeners : {
					saveSuccess : this.onSaveSuccess, scope : this
				}
			}) ]
		});
		win.show();
	},
	/**
	 * 编辑
	 */
	onEditClick : function() {
		var selection = this.down('grid').getView().getSelectionModel().getSelection()[0];
		if (selection) {
			var des = myDesktopApp.getDesktop();
			var form = Ext.create('WJM.vendor.VendorForm', {
				listeners : {
					saveSuccess : this.onSaveSuccess, scope : this
				}
			});
			win = des.createWindow({
				title : "编辑供应商", height : 380, width : 500, iconCls : 'icon-grid', animCollapse : false, constrainHeader : true, layout : 'fit',
				items : [ form ]
			});
			win.show();
			form.getForm().loadRecord(selection);
		} else {
			Ext.Msg.alert('提示', '请选择供应商');
		}
	},
	/**
	 * 保存成功回调
	 */
	onSaveSuccess : function(that) {
		if (that.ownerCt) {
			var win = that.ownerCt;
			win.destroy();
		}
		var store = Ext.data.StoreManager.lookup('VendorSearchStore');
		store.load();
	},
	/**
	 * 搜索
	 */
	onSearchClick : function() {
		var data = this.down('form').getForm().getFieldValues();
		var store = Ext.data.StoreManager.lookup('VendorSearchStore');
		Ext.Object.each(data, function(key, value) {
			store.getProxy().setExtraParam(key, value);
		});
		store.loadPage(1);
	}
});Ext.define('WJM.vendor.VendorManageModel', {
	extend : 'Ext.ux.desktop.Module',

	requires : [ 'WJM.model.TVendor' ],

	id : 'vendor',

	init : function() {
		this.id = this.config.moduleId || 'vendor';
		this.title = this.config.menuText || 'vendor/商家';
	},

	createWindow : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow(this.id);
		if (!win) {
			var grid = Ext.create('WJM.vendor.VendorGrid', {
				editAble : true
			});
			win = desktop.createWindow({
				id : this.id, title : this.title, width : 900, height : 800, iconCls : 'icon-grid', animCollapse : false, constrainHeader : true, layout : 'fit',
				items : [ grid ]
			});
		}
		return win;
	}
});
/**
 * 损害报表
 */
Ext.define('WJM.rma.DamageReportGrid', {
	extend : 'Ext.panel.Panel',
	requires : [ 'Ext.grid.Panel' ],
	layout : {
		type : 'border', padding : 5
	},

	defaults : {
		split : true
	},
	initComponent : function() {

		this.editTopBar = Ext.create('Ext.toolbar.Toolbar', {
			items : [ {
				iconCls : 'search', text : '搜索', scope : this, handler : this.onSearchClick
			}, {
				iconCls : 'search', text : '清空', scope : this, handler : this.clearSearch
			}, {
				iconCls : 'search', text : '打印列表', scope : this, handler : this.printGrid
			} ]
		});

		var _fileds = [ {
			xtype : 'rownumberer'
		}, {
			text : "item name/名称", dataIndex : 'product_name', sortable : true
		}, {
			text : "total price/总价", dataIndex : 'all_price', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "total number/总损坏个数", dataIndex : 'rma_num', sortable : true
		} ];

		var formFileds = [];

		formFileds.push({
			xtype : 'datefield', fieldLabel : 'start date/开始时间', labelWidth : 150, name : 'begin', format : 'Y-m-d', allowBlank : false
		});
		formFileds.push({
			xtype : 'datefield', fieldLabel : 'end date/结束时间', labelWidth : 150, name : 'end', format : 'Y-m-d', allowBlank : false
		});
		this.storeId = 'DamageReportStore';

		Ext.apply(this, {
			autoScroll : true,
			dockedItems : [ this.editTopBar ],

			items : [
					{
						anchor : '100%', height : 100, xtype : 'form', region : 'north', autoScroll : true, collapsible : true, title : '退货日期',
						bodyPadding : 10, items : formFileds
					},
					{
						store : this.storeId, split : true, disableSelection : false, loadMask : true, autoScroll : true, region : 'center',
						title : '损害报表', xtype : 'gridpanel', columns : _fileds,

						viewConfig : {
							plugins : []
						}
					} ]
		});
		this.callParent();
	},
	/**
	 * 搜索
	 */
	onSearchClick : function() {
		if (this.down('form').getForm().isValid()) {
			var data = this.down('form').getForm().getFieldValues();
			var store = Ext.data.StoreManager.lookup(this.storeId);
			Ext.Object.each(data, function(key, value) {
				store.getProxy().setExtraParam(key, value);
			});
			store.load();
		}
	},
	/**
	 * 清空
	 */
	clearSearch : function() {
		var fields = this.down('form').getForm().getFields();
		fields.each(function(field) {
			field.setValue('');
		});
	},
	/**
	 * 
	 */
	printGrid : function() {
		Ext.ux.grid.Printer.print(this.down('grid'));
	}
});/**
 * 损害报表
 */
Ext.define('WJM.rma.DamageReportModel', {
	extend : 'Ext.ux.desktop.Module',

	requires : [ 'WJM.model.TDamageReport' ],

	id : 'damagereport',

	init : function() {
		this.id = this.config.moduleId || 'damagereport';
		this.title = this.config.menuText || 'damage report/损坏报表';
	},

	createWindow : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow(this.id);
		if (!win) {
			var grid = Ext.create('WJM.rma.DamageReportGrid', {});
			win = desktop.createWindow({
				id : this.id, title : this.title, width : 500, height : 400, iconCls : 'icon-grid', animCollapse : false, constrainHeader : true,
				layout : 'fit', items : grid
			});
		}
		return win;
	}
});
/**
 * rma表单
 */
Ext.define('WJM.rma.RmaForm', {
	extend : 'Ext.panel.Panel',
	requires : [ 'WJM.model.TSale' ],
	autoScroll : true,
	selectForm : undefined,
	initComponent : function() {
		var me = this;
		var _fileds1 = [ {
			xtype : 'rownumberer'
		}, {
			text : "invoice #/invoice单号", dataIndex : 'invoice', sortable : true
		}, {
			text : "Worker ID/操作员", dataIndex : 'oper_name', sortable : true
		}, {
			text : "name/客户名称", dataIndex : 'buyer_name', sortable : true
		}, {
			text : "address/客户地址", dataIndex : 'buyer_address', sortable : true
		}, {
			text : "Phone/电话", dataIndex : 'buyer_mobile', sortable : true 
		}, {
			text : "State/州", dataIndex : 'buyer_state', sortable : true 
		}, {
			text : "City/城市", dataIndex : 'buyer_city', sortable : true
		}, {
			text : "Zip Code/邮编", dataIndex : 'buyer_postCode', sortable : true 
		}, {
			text : "Discount/优惠", dataIndex : 'discount', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "date/时间", dataIndex : 'oper_time', sortable : true 
		}, {
			text : "sub total/合计", dataIndex : 'sub_total', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "Tax/税(8.375%)", dataIndex : 'tax', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "Total/总计", dataIndex : 'all_price', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "Payment Method/支付方式", dataIndex : 'payment', sortable : true 
		}, {
			text : "Delivery Method/送货方式", dataIndex : 'send_type', sortable : true 
		}, {
			text : "Remark/备注", dataIndex : 'remark', sortable : true 
		} ];
		
		var _fileds2 = [ {
			xtype : 'rownumberer'
		}, {
			text : "barcode #/条码", dataIndex : 'product_code', sortable : true
		}, {
			text : "item name/名称", dataIndex : 'product_name', sortable : true
		}, {
			text : "unit price/单价", dataIndex : 'product_price', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "quantity/数量", dataIndex : 'product_num', sortable : true, xtype : 'numbercolumn', format : '0,000'
		}, {
			text : "sub total/小计", dataIndex : 'sub_total', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "RMAed credit quantity/已退货无损数量", dataIndex : 'credit_num', sortable : true, xtype : 'numbercolumn', format : '0,000'
		}, {
			text : "RMAed damage quantity/已退货损坏数量", dataIndex : 'damage_num', sortable : true, xtype : 'numbercolumn', format : '0,000'
		}, {
			text : "credit quantity/无损数量", dataIndex : 'return_credit_num', sortable : true, xtype : 'numbercolumn', format : '0,000', editor : {
				xtype : 'numberfield', name : 'return_credit_num', allowDecimals : false, minValue : 0, allowBlank : false, value : 0
			}
		}, {
			text : "damage quantity/有损数量", dataIndex : 'return_damage_num', sortable : true, xtype : 'numbercolumn', format : '0,000', editor : {
				xtype : 'numberfield', name : 'return_damage_num', allowDecimals : false, minValue : 0, allowBlank : false, value : 0
			}
		} ];

		Ext.applyIf(me, {
			layout : {
				type : 'border'
			},
			defaults : {
				split : false
			},
			items : [
					{
						anchor : '100%', height : 110, xtype : 'form', region : 'north', autoScroll : true, title : '订单检索', bodyPadding : 10, layout : {
							columns : 2, type : 'table', tableAttrs : {
								style : {
									width : '100%'
								}, tdAttrs : {
									align : 'center', valign : 'middle'
								}
							}
						}, items : [ {
							xtype : 'textfield', fieldLabel : 'name/客户名称', labelWidth : 150, allowBlank : true, name : 'buyer_name'
						}, {
							xtype : 'textfield', fieldLabel : 'address/客户地址', labelWidth : 150, allowBlank : true, name : 'buyer_address'
						}, {
							xtype : 'textfield', fieldLabel : 'invoice #/invoice单号', labelWidth : 150, allowBlank : true, name : 'invoicecode'
						}, {
							xtype : 'textfield', fieldLabel : 'customer mobile/电话', labelWidth : 150, allowBlank : true, name : 'buyer_mobile'
						} ]
					},
					{
						xtype : 'form',
						title : '订单',
						region : 'center',
						layout : 'anchor',
						items : [ {
									name : 'id', xtype : 'hiddenfield'
								},{
									name : 'oper_name', xtype : 'hiddenfield'
								},{
									name : 'oper_time', xtype : 'hiddenfield'
								},{
									name : 'sub_total', xtype : 'hiddenfield'
								},{
									name : 'tax', xtype : 'hiddenfield'
								},{
									name : 'all_price', xtype : 'hiddenfield'
								},{
									name : 'buyer_name', xtype : 'hiddenfield'
								},{
									name : 'buyer_address', xtype : 'hiddenfield'
								},{
									name : 'buyer_state', xtype : 'hiddenfield'
								},{
									name : 'buyer_city', xtype : 'hiddenfield'
								},{
									name : 'buyer_postCode', xtype : 'hiddenfield'
								},{
									name : 'buyer_mobile', xtype : 'hiddenfield'
								},{
									name : 'discount', xtype : 'hiddenfield'
								},{
									name : 'payment', xtype : 'hiddenfield'
								},{
									name : 'send_type', xtype : 'hiddenfield'
								},{
									name : 'remark', xtype : 'hiddenfield'
								},{
									name : 'if_cashed', xtype : 'hiddenfield'
								},
								{
									store : 'SaleRmaStore', anchor : '100% -170', minHeight : 100, region : 'south', disableSelection : false,
									loadMask : true, xtype : 'gridpanel', columns : _fileds1, bbar : Ext.create('Ext.PagingToolbar', {
										store : 'SaleRmaStore', displayInfo : true, displayMsg : '显示 订单 {0} - {1} 总共 {2}', emptyMsg : "没有订单数据"
									}), listeners : {
										selectionchange : function(selectionModel, selecteds, eOpts) {
											var saleProductRmaStore = Ext.data.StoreManager.lookup('SaleProductRmaStore'),
												selected = selecteds[0];
											if(selected != undefined){
												saleProductRmaStore.getProxy().setExtraParam('sale_id', selected.get('id'));
												saleProductRmaStore.load();
												this.selectForm = this.down('form[title="订单"]').getForm();
												this.selectForm.findField('id').setValue(selected.get('id'));
												this.selectForm.findField('oper_name').setValue(selected.get('oper_name'));
												this.selectForm.findField('oper_time').setValue(selected.get('oper_time'));
												this.selectForm.findField('sub_total').setValue(selected.get('sub_total'));
												this.selectForm.findField('tax').setValue(selected.get('tax'));
												this.selectForm.findField('all_price').setValue(selected.get('all_price'));
												this.selectForm.findField('buyer_name').setValue(selected.get('buyer_name'));
												this.selectForm.findField('buyer_address').setValue(selected.get('buyer_address'));
												this.selectForm.findField('buyer_state').setValue(selected.get('buyer_state'));
												this.selectForm.findField('buyer_city').setValue(selected.get('buyer_city'));
												this.selectForm.findField('buyer_postCode').setValue(selected.get('buyer_postCode'));
												this.selectForm.findField('buyer_mobile').setValue(selected.get('buyer_mobile'));
												this.selectForm.findField('discount').setValue(selected.get('discount'));
												this.selectForm.findField('payment').setValue(selected.get('payment'));
												this.selectForm.findField('send_type').setValue(selected.get('send_type'));
												this.selectForm.findField('remark').setValue(selected.get('remark'));
												this.selectForm.findField('if_cashed').setValue(selected.get('if_cashed'));
											}else{
												this.selectForm = undefined;
											}
										}, scope : this
									}
								},
								{
									store : 'SaleProductRmaStore', anchor : '100% -170', minHeight : 100, region : 'south', disableSelection : false,
									loadMask : true, xtype : 'gridpanel', columns : _fileds2, plugins : [ Ext.create('Ext.grid.plugin.CellEditing', {
										clicksToEdit : 1
									}) ]
								} ]
					} ],

			dockedItems : [ {
				xtype : 'toolbar', dock : 'top', items : [ {
					xtype : 'button', iconCls : 'save', text : '保存', scope : this, handler : this.onSaveClick
				}, {
					xtype : 'button', iconCls : 'search', text : '搜索订单', scope : this, handler : this.onSearchClick
				} ]
			} ]
		});
		me.callParent(arguments);
	},
	/**
	 * 搜索
	 */
	onSearchClick : function() {
		var searchForm = this.down('form[title="订单检索"]').getForm();
		var data = searchForm.getFieldValues();
		var SaleRmaStore = Ext.data.StoreManager.lookup('SaleRmaStore');
		SaleRmaStore.removeAll();
		Ext.data.StoreManager.lookup('SaleProductRmaStore').removeAll();
		if (searchForm.isValid()) {
			Ext.Object.each(data, function(key, value) {
				SaleRmaStore.getProxy().setExtraParam(key, value);
			});
			SaleRmaStore.load({
				scope : this, callback : function(records, operation, success) {
					if (!success || records.length == 0) {
						Ext.Msg.alert('提示', '未找到相关订单');
					}
				}
			});
		}
	},
	/**
	 * 保存
	 */
	onSaveClick : function() {
		var me = this;
		if (me.selectForm == undefined) {
			Ext.Msg.alert('提示', '请先选择订单。');
			return;
		}
		if (me.selectForm.findField('if_cashed').getValue() <= 0) {
			Ext.Msg.alert('提示', '已经付款的订单才能退货！选中订单未完成付款。');
			return;
		}
		if(WJM.Config.user.userName != 'admin'){
			var messageBox = Ext.Msg.prompt('confirm', '请输入管理员密码:', function (btn, text) {
	            if (btn == 'ok') {
	                var proxy = new Ext.data.proxy.Ajax({
	                    model: 'WJM.model.TEmployee', url: 'sale.do?action=checkApprover',

	                    reader: new Ext.data.reader.Json({
	                        type: 'json', messageProperty: 'msg'
	                    }),

	                    extraParams: {
	                        confirm_code: text,
	                        errorMsg:"管理员密码输入错误,请重新输入"
	                    },

	                    writer: Ext.create('WJM.FormWriter')
	                });
	                proxy.read(new Ext.data.Operation({}), function (records, operation) {
	                    if (records.success) {
	                    	doSubmit();
	                    } else {
	                        Ext.Msg.alert('提示', records.error);
	                    }
	                }, me);
	            }
	        });
	        // 将弹出框hack 为 密码弹框
	        Ext.dom.Element.get(messageBox.down('textfield').getInputId()).dom.type = 'password';
		}else{
			doSubmit();
		}
		
		
		function doSubmit(){
			var datas = Ext.data.StoreManager.lookup('SaleProductRmaStore').data,
			redod = [],
			validate = false;
			datas.each(function(item) {
				if (item.get('product_num') - item.get('rma_num') - item.get('return_credit_num') - item.get('return_damage_num') < 0) {
					validate = true;
				}
				redod.push(item.getData());
			});
			if (validate) {
				Ext.Msg.alert('提示', '退货数量超过购买数量');
				return;
			}
			
			var form = me.down('form[title="订单"]');
			form.submit({
				url : 'sale.do?action=rma_submit', params : {
					saleProducts : Ext.JSON.encode(redod)
				},
				
				success : function(form, action) {
					Ext.Msg.alert('提示', '保存成功');
					me.clearForm();
					var result = action.result;
					window.open(location.context + '/sale.do?action=rma_print&id=' + result.saleId, "_blank");
					me.fireEvent('saveSuccess', me);
				},
				
				failure : function(form, action) {
					Ext.Msg.alert('提示', action.result.msg || '保存失败，请稍候重试');
				}
			});
		}
	},
	/**
	 * 清空
	 */
	clearForm : function() {
		Ext.data.StoreManager.lookup('SaleRmaStore').removeAll();
		Ext.data.StoreManager.lookup('SaleProductRmaStore').removeAll();
		var fields = this.down('form[title="订单"]').getForm().getFields();
		fields.each(function(item) {
			item.setValue('');
		});
		fields = this.down('form[title="订单检索"]').getForm().getFields();
		fields.each(function(item) {
			item.setValue('');
		});
	}
});/**
 * 销售月报表
 */
Ext.define('WJM.rma.RmaModel', {
	extend : 'Ext.ux.desktop.Module',

	requires : [ 'WJM.model.TSaleTop' ],

	id : 'RMA',

	init : function() {
		this.id = this.config.moduleId || 'RMA';
		this.title = this.config.menuText || 'RMA/退货';
	},

	createWindow : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow(this.id);
		if (!win) {
			var grid = Ext.create('WJM.rma.RmaForm', {});
			win = desktop.createWindow({
				id : this.id, title : this.title, width : 900, height : 600, iconCls : 'icon-grid', animCollapse : false, constrainHeader : true,
				layout : 'fit', items : grid
			});
		} else {
		}
		return win;
	}
});
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
