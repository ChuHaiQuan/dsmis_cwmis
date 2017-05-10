/**
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
});