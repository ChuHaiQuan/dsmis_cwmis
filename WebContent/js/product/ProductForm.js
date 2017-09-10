/**
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
						name : 'num', fieldLabel : 'quantity/数量', minValue : 0, xtype : 'numberfield', allowDecimals : true,decimalPrecision:2
					},
					{
						name : 'downLimit', fieldLabel : 'min Stock/最小库存', allowBlank : true, xtype : 'numberfield', allowDecimals :true,decimalPrecision:2,
						minValue : 0
					}, {
						name : 'tracking_id', fieldLabel : 'tracking id/库存位置', xtype : 'textareafield', allowBlank : true
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
});