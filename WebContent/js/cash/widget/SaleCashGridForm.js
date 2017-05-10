/**
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
});