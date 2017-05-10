Ext.define('WJM.model.TPower', {
	extend : 'Ext.data.Model', idProperty : 'id',

	fields : [ {
		name : 'id', type : 'float'
	}, {
		name : 'power_name'
	} ],

	validations : [ {
		type : 'length', field : 'power_name', min : 1
	} ],

	hasMany : {
		model : 'WJM.model.TPowerOperation', name : 'operations'
	},

	proxy : {
		batchActions : true, type : 'ajax',

		url : location.context + '/power.do?action=get',

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
	autoLoad : true,
	autoSync : true,
	model : 'WJM.model.TPower',
	pageSize : 200,
	storeId : 'PowerStore',
	proxy : {
		batchActions : true,
		type : 'ajax',
		pageParam : 'currpage',
		limitParam : 'pagesize',
		api : {
			create : location.context + '/power.do?action=save', read : location.context + '/power.do?action=list',
			update : location.context + '/power.do?action=update', destroy : location.context + '/power.do?action=del'
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
