Ext.define('WJM.model.TStock', {
	extend : 'Ext.data.Model', idProperty : 'id',

	fields : [ {
		name : 'id', type : 'float'
	}, {
		name : 'stock_bill_code'
	}, {
		name : 'oper_id'
	} , {
		name : 'oper_name'
	} , {
		name : 'oper_time'
	} , {
		name : 'all_stock_price'
	} , {
		name : 'provider_id'
	} , {
		name : 'provider_name'
	}  ],

	hasMany : {
		model : 'WJM.stock.TStockProduct', name : 'products'
	}
});

Ext.create('Ext.data.Store', {
	autoLoad : false,
	autoSync : true,
	model : 'WJM.model.TStock',
	pageSize : 25,
	storeId : 'StockStore',
	proxy : {
		batchActions : true,
		type : 'ajax',
		pageParam : 'currpage',
		limitParam : 'pagesize',
		api : {
			create : location.context + '/stock.do?action=save', read : location.context + '/stock.do?action=list',
			update : location.context + '/stock.do?action=update', destroy : location.context + '/stock.do?action=del'
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
