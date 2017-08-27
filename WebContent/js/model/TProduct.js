Ext.define('WJM.model.TProduct', {
	extend : 'Ext.data.Model', idProperty : 'id',

	fields : [ {
		name : 'id'
	}, {
		name : 'product_id'
	}, {
		name : 'code'
	}, {
		name : 'product_name'
	}, {
		name : 'spec'
	}, {
		name : 'unit'
	}, {
		name : 'size'
	}, {
		name : 'weight'
	}, {
		name : 'upLimit'
	}, {
		name : 'downLimit'
	}, {
		name : 'price_income'
	}, {
		name : 'price_simgle'
	}, {
		name : 'drawing'
	}, {
		name : 'helpName'
	}, {
		name : 'myMemo'
	}, {
		name : 'drawing2'
	}, {
		name : 'drawing3'
	}, {
		name : 'drawing4'
	}, {
		name : 'drawing5'
	}, {
		name : 'drawing6'
	}, {
		name : 'drawing7'
	}, {
		name : 'drawing8'
	}, {
		name : 'drawing9'
	}, {
		name : 'sreserve1'
	}, {
		name : 'sreserve2'
	}, {
		name : 'sreserve3'
	}, {
		name : 'freserve1'
	}, {
		name : 'freserve2'
	}, {
		name : 'freserve3'
	}, {
		name : 'product_type'
	}, {
		name : 'num'
	}, {
		name : 'product_name_cn'
	}, {
		name : 'vendortName'
	}, {
		name : 'provider_id'
	}, {
		name : 'price_wholesale'
	}, {
		name : 'product_name_full', convert : function(v, record) {
			return record.data.product_id + '--' + record.data.code + '--' + record.data.product_name + '--' + record.data.product_name_cn;
		}
	}, {
		name : 'agio'
	}, {
		name : 'agio_price'
	},{
		name:'price_company'
	},{
		name:'tracking_id'
	}],

	validations : [ {
		type : 'length', field : 'product_name', min : 1
	} ]
});

Ext.define('WJM.model.ProductBaseStore', {
	extend : 'Ext.data.Store',
	autoLoad : false,
	autoSync : true,
	model : 'WJM.model.TProduct',
	storeId : 'ProductStore',
	pageSize : 25,
	proxy : {
		batchActions : true,
		pageParam : 'currpage',
		limitParam : 'pagesize',
		type : 'ajax',
		api : {
			create : location.context + '/product.do?action=save', read : location.context + '/product.do?action=list',
			update : location.context + '/product.do?action=update', destroy : location.context + '/product.do?action=deleteProducts'
		},

		writer : Ext.create('WJM.FormWriter'),

		reader : {
			root : 'listData', totalProperty : 'total', messageProperty : 'msg'
		},

		actionMethods : {
			create : "POST", read : "POST", update : "POST", destroy : "POST"
		},

		listeners : {
			exception : function(proxy, response, operation) {
				switch (operation.action) {
				case "create":
				case "update":
					Ext.MessageBox.alert('提示', '保存失败，请稍后重试');
					break;
				case "destroy":
					Ext.MessageBox.alert('提示', '删除失败，请稍后重试');
					break;
				default:
					break;
				}
			}
		}
	}
});

Ext.create('WJM.model.ProductBaseStore', {

});

Ext.create('WJM.model.ProductBaseStore', {
	storeId : 'ProductQuickStore',
	autoSync : false,
	proxy : {
		batchActions : true, pageParam : 'currpage', limitParam : 'pagesize', type : 'ajax', api : {
			create : '', read : location.context + '/product.do?action=quickSearch', update : '', destroy : ''
		},

		writer : Ext.create('WJM.FormWriter'),

		reader : {
			root : 'listData', totalProperty : 'total', messageProperty : 'msg'
		},

		actionMethods : {
			create : "POST", read : "POST", update : "POST", destroy : "POST"
		},

		listeners : {
			exception : function(proxy, response, operation) {
				switch (operation.action) {
				case "create":
				case "update":
					Ext.MessageBox.alert('提示', '保存失败，请稍后重试');
					break;
				case "destroy":
					Ext.MessageBox.alert('提示', '删除失败，请稍后重试');
					break;
				default:
					break;
				}
			}
		}
	}
});

Ext.create('WJM.model.ProductBaseStore', {
	storeId : 'ProductAlertStore',
	autoSync : false,
	proxy : {
		batchActions : true, pageParam : 'currpage', limitParam : 'pagesize', type : 'ajax', api : {
			create : '', read : location.context + '/product.do?action=listStoreAlert', update : '', destroy : ''
		},

		writer : Ext.create('WJM.FormWriter'),

		reader : {
			root : 'listData', totalProperty : 'total', messageProperty : 'msg'
		},

		actionMethods : {
			create : "POST", read : "POST", update : "POST", destroy : "POST"
		},

		listeners : {
			exception : function(proxy, response, operation) {
				switch (operation.action) {
				case "create":
				case "update":
					Ext.MessageBox.alert('提示', '保存失败，请稍后重试');
					break;
				case "destroy":
					Ext.MessageBox.alert('提示', '删除失败，请稍后重试');
					break;
				default:
					break;
				}
			}
		}
	}
});