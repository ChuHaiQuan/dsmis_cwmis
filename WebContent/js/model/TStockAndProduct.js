Ext.define('WJM.model.TStockAndProduct', {
  extend : 'Ext.data.Model', idProperty : 'product_id', fields : [ {
	name : 'product_id'
  }, {
	name : 'product_type'
  }, {
	name : 'product_price'
  }, {
	name : 'product_name'
  }, {
	name : 'code'
  }, {
	name : 'stock_time', type : 'string'
  } ]
});

Ext.create('Ext.data.Store', {
  autoLoad : false, autoSync : true, model : 'WJM.model.TStockAndProduct', storeId : 'StockAndProductStore', proxy : {
	batchActions : true, type : 'ajax', pageParam : 'currpage', limitParam : 'pagesize',

	api : {
	  create : '', read : location.context + '/stock_and_product.do?action=query', update : '', destroy : ''
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
