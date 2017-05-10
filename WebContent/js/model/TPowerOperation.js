Ext.define('WJM.model.TPowerOperation', {
	extend : 'Ext.data.Model', idProperty : 'id',

	fields : [ {
		name : 'id', type : 'float'
	}, {
		name : 'popedomCode'
	}, {
		name : 'operationCode'
	} ],

	validations : [ {
		type : 'length', field : 'power_name', min : 1
	} ],

	belongsTo : 'WJM.model.TPower'
});

Ext.create('Ext.data.Store', {
	autoLoad : false,
	autoSync : true,
	model : 'WJM.model.TPowerOperation',
	pageSize : 25,
	storeId : 'PowerOperationStore',
	proxy : {
		batchActions : true,
		type : 'ajax',
		pageParam : 'currpage',
		limitParam : 'pagesize',
		api : {
			create : location.context + '/power_opration.do?action=save', read : location.context + '/power_opration.do?action=list',
			update : location.context + '/power_opration.do?action=update', destroy : location.context + '/power_opration.do?action=del'
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
				Ext.MessageBox.show({
					title : '操作失败', msg : operation.getError() || '操作失败', icon : Ext.MessageBox.ERROR, buttons : Ext.Msg.OK
				});
			}
		}
	}
});
