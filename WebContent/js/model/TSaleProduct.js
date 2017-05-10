Ext.define('WJM.model.TSaleProduct', {
	extend : 'Ext.data.Model', idProperty : 'id',

	fields : [ {
		name : 'id', type : 'float'
	}, {
		name : 'sale_id'
	}, {
		name : 'product_id'//TProduct.id
	}, {
		name : 'productid'//TProduct.product_id
	}, {
		name : 'product_code'
	}, {
		name : 'code', convert : function(v, record) {
			return record.data.product_code;
		}
	}, {
		name : 'product_name'
	}, {
		name : 'product_price'
	}, {
		name : 'agio'
	}, {
		name : 'agio_price'
	}, {
		name : 'product_num'
	}, {
		name : 'sale_time'
	}, {
		name : 'rma_id'
	}, {
		name : 'rma_time'
	}, {
		name : 'rma_code'
	}, {
		name : 'rma_num'
	}, {
		name : 'if_rma'
	}, {
		name : 'if_back_order'
	}, {
		name : 'back_order_id'
	}, {
		name : 'back_order_time'
	}, {
		name : 'back_order_code'
	}, {
		name : 'credit_num'
	}, {
		name : 'damage_num'
	}, {
		name : 'return_credit_num'
	}, {
		name : 'return_damage_num'
	}, {
		name : 'sub_total', convert : function(v, record) {
			return record.data.product_price * record.data.product_num;
		}
	}, {
		name : 'sub_total2', convert : function(v, record) {
			return record.data.agio_price * record.data.product_num;
		}
	}  
	
	]
});

Ext.define('WJM.model.SaleProductStore', {
	extend : 'Ext.data.Store', autoLoad : false, autoSync : false, model : 'WJM.model.TSaleProduct', pageSize : 25,
	storeId : 'SaleProductStore', proxy : {
		batchActions : true, type : 'ajax', pageParam : 'currpage', limitParam : 'pagesize',

		api : {
			create : '', read : location.context + '/sale_product.do?action=list', update : '', destroy : ''
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
Ext.create('WJM.model.SaleProductStore', {});

Ext.create('WJM.model.SaleProductStore', {
	storeId : 'SaleProductRmaStore'
});

Ext.create('WJM.model.SaleProductStore', {
	storeId : 'SaleProductMyStore'
});

Ext.create('WJM.model.SaleProductStore', {
	storeId : 'SaleQuoteProductMyStore'
});