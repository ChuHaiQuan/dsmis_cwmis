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
