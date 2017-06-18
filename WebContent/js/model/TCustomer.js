Ext.define('WJM.model.TCustomer', {
	extend : 'Ext.data.Model', idProperty : 'id',

	fields : [ {
		name : 'id'
	}, {
		name : 'type'
	}, {
		name : 'code'
	}, {
		name : 'shortName'
	}, {
		name : 'allName'
	}, {
		name : 'address'
	}, {
		name : 'postCode'
	}, {
		name : 'tel1'
	}, {
		name : 'tel2'
	}, {
		name : 'tel3'
	}, {
		name : 'mobile'
	}, {
		name : 'FAX'
	}, {
		name : 'EMail'
	}, {
		name : 'http'
	}, {
		name : 'accounts'
	}, {
		name : 'taxCode'
	}, {
		name : 'linkMan'
	}, {
		name : 'companyType'
	}, {
		name : 'helpName'
	}, {
		name : 'recDate'
	}, {
		name : 'myMemo'
	}, {
		name : 'state'
	}, {
		name : 'city'
	}, {
		name : 'leav_money'
	}, {
		name : 'credit_Line'
	}, {
		name : 'balance'
	}, {
		name : 'bank_Name'
	}, {
		name : 'bank_Acount'
	}, {
		name : 'credit_Acount'
	}, {
		name : 'passwd'
	}, {
		name : 'taxable'
	}, {
		name : 'taxable_cn', convert : function(v, record) {
			
			if(record.data.taxable == 0){
				return "交税";
			}else if(record.data.taxable == 1){
				return "不交税";
			}else
				return "";
			
		}
	},{
		name : 'acc_type'
	}, {
		name : 'acc_type_cn', convert : function(v, record) {
			
			if(record.data.acc_type == 1){
				return "批发";
			}else if(record.data.acc_type == 2){
				return "工程公司";
			}else
				return "零售";
			
		}
	}, {
		name : 'total'
	}, {
		name : 'acc_balance', convert : function(v, record) {
			return record.data.leav_money - record.data.balance;
		}
	}, {
		name : 'show_leav_money', convert : function(v, record) {
			return -record.data.leav_money;
		}
	} ],

	validations : [ {
		type : 'length', field : 'shortName', min : 1
	} ]
});

Ext.define('WJM.model.CustomerBaseStore', {
	extend : 'Ext.data.Store',
	autoLoad : false,
	autoSync : true,
	model : 'WJM.model.TCustomer',
	pageSize : 25,
	storeId : 'CustomerStore',
	proxy : {
		batchActions : true,
		type : 'ajax',
		pageParam : 'currpage',
		limitParam : 'pagesize',
		api : {
			create : location.context + '/buyer.do?action=save', read : location.context + '/buyer.do?action=list',
			update : location.context + '/buyer.do?action=update', destroy : location.context + '/buyer.do?action=del'
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
Ext.create('Ext.data.Store', {
	fields : [ 'value', 'name' ], storeId : 'CustomerTypeStore', data : [ {
		"value" : 0, "name" : "零售"
	}, {
		"value" : 1, "name" : "批发"
	}, {
		"value" : 2, "name" : "工程公司"
	} ]
});

Ext.create('Ext.data.Store', {
	fields : [ 'value', 'name' ], storeId : 'CustomerTaxableStore', data : [ {
		"value" : 0, "name" : "交税"
	}, {
		"value" : 1, "name" : "不交税"
	} ]
});


Ext.create('WJM.model.CustomerBaseStore', {
	storeId : 'CustomerSearchStore'
});

Ext.create('WJM.model.CustomerBaseStore', {
	storeId : 'CustomerQuickStore', proxy : {
		batchActions : true, type : 'ajax', pageParam : 'currpage', limitParam : 'pagesize', api : {
			create : '', read : location.context + '/buyer.do?action=quicklist', update : '', destroy : ''
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
