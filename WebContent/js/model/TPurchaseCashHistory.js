Ext.define('WJM.model.TPurchaseCashHistory', {
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
