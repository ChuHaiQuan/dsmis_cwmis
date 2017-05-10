Ext.define('WJM.model.TPurchaseProduct', {
	extend : 'Ext.data.Model', idProperty : 'id',

	fields : [ {
		name : 'id', type : 'float'
	}, {
		name : 'purchase_id'
	}, {
		name : 'product_id'
	}, {
		name : 'product_code'
	}, {
		name : 'product_name'
	}, {
		name : 'product_price'
	}, {
		name : 'product_num'
	}, {
		name : 'purchase_time'
	}, {
		name : 'provider_id'
	}, {
		name : 'provider_name'
	}, {
		name : 'remark'
	}, {
		name : 'if_stock'
	}, {
		name : 'actual_received'
	}, {
		name : 'receiver'
	}, {
		name : 'receive_num'
	}, {
		name : 'sub_total', convert : function(v, record) {
			return record.data.product_price * record.data.product_num;
		}
	} ]
});

Ext.define('WJM.model.PurchaseProductStore', {
	extend : 'Ext.data.Store', autoLoad : false, autoSync : false, model : 'WJM.model.TPurchaseProduct', pageSize : 25,
	storeId : 'PurchaseProductStore', proxy : {
		batchActions : true, type : 'ajax', pageParam : 'currpage', limitParam : 'pagesize',

		api : {
			create : '', read : location.context + '/purchase_product.do?action=list', update : '', destroy : ''
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

Ext.create('WJM.model.PurchaseProductStore', {});

Ext.create('WJM.model.PurchaseProductStore', {
	storeId : 'PurchaseProductMyStore'
});

Ext.create('WJM.model.PurchaseProductStore', {
	storeId : 'PurchaseProductVendorCashStore'
});