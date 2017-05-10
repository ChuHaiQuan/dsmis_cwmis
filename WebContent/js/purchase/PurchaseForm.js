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

});