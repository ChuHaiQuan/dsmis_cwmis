Ext.define('WJM.model.TEmployee', {
	extend : 'Ext.data.Model', idProperty : 'id',

	fields : [ {
		name : 'id', type : 'float'
	}, {
		name : 'name'
	}, {
		name : 'code'
	}, {
		name : 'sex'
	}, {
		name : 'birthDay'
	}, {
		name : 'iDCard'
	}, {
		name : 'tel'
	}, {
		name : 'mobile'
	}, {
		name : 'address'
	}, {
		name : 'department'
	}, {
		name : 'headShip'
	}, {
		name : 'popedom'
	}, {
		name : 'password1'
	}, {
		name : 'is_manager'
	} ],

	validations : [ {
		type : 'length', field : 'code', min : 1
	}, {
		type : 'length', field : 'password1', min : 1
	}, {
		type : 'length', field : 'name', min : 1
	} ]
});

Ext.create('Ext.data.Store', {
	autoLoad : false,
	autoSync : true,
	model : 'WJM.model.TEmployee',
	pageSize : 25,
	storeId : 'EmployeeStore',
	proxy : {
		batchActions : true,
		type : 'ajax',
		pageParam : 'currpage',
		limitParam : 'pagesize',
		api : {
			create : location.context + '/employee.do?action=save', read : location.context + '/employee.do?action=list',
			update : location.context + '/employee.do?action=update', destroy : location.context + '/employee.do?action=del'
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
				var msgObj=eval("("+response.responseText+")");
				switch (operation.action) {
				case "create":
				case "update":
					Ext.MessageBox.alert('提示',Ext.util.Format.trim(msgObj.msg));
					break;
				case "destroy":
					Ext.MessageBox.alert('提示', '删除失败，请稍后重试');
					break;
				default:
					break;
				}
			}
		}
	},

	listeners : {
		add : function(store, records, index, operation) {
			Ext.data.StoreManager.lookup('EmployeeAllStore').load();
		}, update : function(store, records, index, operation) {
			Ext.data.StoreManager.lookup('EmployeeAllStore').load();
		}, remove : function(store, records, index, operation) {
			Ext.data.StoreManager.lookup('EmployeeAllStore').load();
		}
	}
});

Ext.create('Ext.data.Store', {
	autoLoad : true,
	autoSync : true,
	model : 'WJM.model.TEmployee',
	storeId : 'EmployeeAllStore',
	pageSize : 1000,
	proxy : {
		batchActions : true,
		pageParam : 'currpage',
		limitParam : 'pagesize',
		type : 'ajax',
		api : {
			create : location.context + '/employee.do?action=save', read : location.context + '/employee.do?action=list',
			update : location.context + '/employee.do?action=update', destroy : location.context + '/employee.do?action=del'
		},

		writer : Ext.create('WJM.FormWriter'),

		reader : {
			root : 'listData', totalProperty : 'total', messageProperty : 'msg'
		},

		actionMethods : {
			create : "POST", read : "POST", update : "POST", destroy : "POST"
		},

		listeners : {
			success:function(){
				alert(123);
			},
			exception : function(proxy, response, operation) {
				var msgObj=eval("("+response.responseText+")");
				switch (operation.action) {
				case "create":
				case "update":
					Ext.MessageBox.alert('提示', Ext.util.Format.trim(msgObj.msg));
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
