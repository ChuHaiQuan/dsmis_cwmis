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
			iconCls : 'search', text : '查看订单', scope : this, handler : this.onSaleDetailClick
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
					}/*,
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
					} */]
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
	
	onSaleDetailClick: function() {
		var selection = this.down('grid[title="订单"]').getView().getSelectionModel().getSelection()[0];
		if (selection) {
			var des = myDesktopApp.getDesktop();
			selection.data.buyer_address_1=selection.data.buyer_address=selection.data.buyer_address+","+selection.data.buyer_city+" "+selection.data.buyer_state+" "+selection.data.buyer_postCode;
			selection.data.buyer_mobile_1 = selection.data.buyer_mobile;
			var form = Ext.create('WJM.sale.SaleDetailInfo', {
				record : selection
			});
			win = des.createWindow({
				title : "查看订单商品", iconCls : 'icon-grid', animCollapse : false, width : 800, height : 550, constrainHeader : true, layout : 'fit',
				items : [ form ]
			});
			win.show();
			
		} else {
			Ext.Msg.alert('提示', '请选择订单');
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
//			if (selection.get('if_cashed') == 0) {
//				Ext.Msg.alert('提示', '此订单未完全收款，无法打印出货单');
//			} else {
				window.open(location.context + '/sale.do?action=packing_print&id=' + selection.getId(), "_blank");
//			}
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
});