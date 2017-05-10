Ext.define('WJM.model.TCreditWarning', {
  extend : 'Ext.data.Model',

  fields : [ {
	name : 'amount'
  }, {
	name : 'buyer_code'
  }, {
	name : 'invoice'
  }, {
	name : 'last_cash_time'
  }, {
	name : 'oper_name'
  } ,{
	  name:'sale_id'
  }]

});

Ext.create('Ext.data.Store', {
  autoLoad : false, autoSync : true, model : 'WJM.model.TCreditWarning', storeId : 'CreditWarningStore', proxy : {
	batchActions : true, type : 'ajax', api : {
	  create : '', read : location.context + '/sale.do?action=credit_warn', update : '', destroy : ''
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
