Ext.define('WJM.model.TSaleTop', {
  extend : 'Ext.data.Model', idProperty : 'product_name',

  fields : [ {
	name : 'product_name'
  }, {
	name : 'all_price'
  }, {
	name : 'sale_times'
  } ]

});

Ext.create('Ext.data.Store', {
  autoLoad : false, autoSync : true, model : 'WJM.model.TSaleTop', storeId : 'SaleTopDayStore', proxy : {
	batchActions : true, type : 'ajax', api : {
	  create : '', read : location.context + '/sale.do?action=day_stat', update : '', destroy : ''
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
  autoLoad : false, autoSync : true, model : 'WJM.model.TSaleTop', storeId : 'SaleTopMonthStore', proxy : {
	batchActions : true, type : 'ajax', api : {
	  create : '', read : location.context + '/sale.do?action=month_stat', update : '', destroy : ''
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
  autoLoad : false, autoSync : true, model : 'WJM.model.TSaleTop', storeId : 'SaleTopBetweenStore', proxy : {
	batchActions : true, type : 'ajax', api : {
	  create : '', read : location.context + '/sale.do?action=between_stat', update : '', destroy : ''
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