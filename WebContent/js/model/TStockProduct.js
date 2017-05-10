Ext.define('WJM.model.TStockProduct', {
  extend : 'Ext.data.Model', idProperty : 'id',

  fields : [ {
	name : 'id', type : 'float'
  }, {
	name : 'stock_id'
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
	name : 'stock_time'
  }, {
	name : 'provider_id'
  }, {
	name : 'provider_name'
  } ]
});

Ext.create('Ext.data.Store', {
  autoLoad : false, autoSync : true, model : 'WJM.model.TStockProduct', pageSize : 25, storeId : 'StockProductStore', proxy : {
	batchActions : true, type : 'ajax', pageParam : 'currpage', limitParam : 'pagesize',

	api : {
	  create : '', read : location.context + '/stock_product.do?action=list', update : '', destroy : ''
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
