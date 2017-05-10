/**
 * 损害报表
 */
Ext.define('WJM.model.TDamageReport', {
	extend : 'Ext.data.Model', idProperty : 'product_name',

	fields : [ {
		name : 'product_name'
	}, {
		name : 'all_price'
	}, {
		name : 'rma_num'
	} ]

});

Ext.create('Ext.data.Store', {
	autoLoad : false, autoSync : true, model : 'WJM.model.TDamageReport', storeId : 'DamageReportStore', proxy : {
		batchActions : true, type : 'ajax', api : {
			create : '', read : location.context + '/sale.do?action=damageRepor', update : '', destroy : ''
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
