Ext.define('WJM.model.TSale', {
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
