/**
 * rma表单
 */
Ext.define('WJM.rma.RmaForm', {
	extend : 'Ext.panel.Panel',
	requires : [ 'WJM.model.TSale','WJM.model.TPurchase' ],
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
			text : "Refund method/退款方式", dataIndex : 'refundMethod',width:150, sortable : true, xtype : 'gridcolumn', editor:{
				xtype : 'combobox', text : 'Refund method/退款方式', labelWidth : 170, dataIndex : 'refundMethod', displayField : 'name',
				valueField : 'value', store : 'SaleCacheMethodStore'
			}
		}
		, {
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
						anchor : '100%', height : 130, xtype : 'form', region : 'north', autoScroll : true, title : '订单检索', bodyPadding : 10, layout : {
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
						}, {
							xtype : 'combobox', fieldLabel : 'payment status/付款状态', labelWidth : 150, allowBlank : true, name : 'payment_status',
							displayField : 'name',valueField : 'value', store : 'SalePayStatusType',
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
});