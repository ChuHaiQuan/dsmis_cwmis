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
});