Ext.define('WJM.model.TVendor', {
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
		name : 'sreserve3'
	}, {
		name : 'freserve1'
	}, {
		name : 'freserve2'
	}, {
		name : 'freserve3'
	}, {
		name : 'balance'
	}, {
		name : 'invoice_total'
	}, {
		name : 'invoice_balance'
	}, {
		name : 'paid_total', convert : function(v, record) {
			return record.data.invoice_total - record.data.invoice_balance;
		}
	}, {
		name : 'acc_balance'
	} ],

	validations : [ {
		type : 'length', field : 'shortName', min : 1
	} ],

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

Ext.define('WJM.model.VendorBaseStore', {
	extend : 'Ext.data.Store',
	autoLoad : false,
	autoSync : true,
	model : 'WJM.model.TVendor',
	pageSize : 25,
	storeId : 'VendorStore',
	proxy : {
		batchActions : true,
		type : 'ajax',
		pageParam : 'currpage',
		limitParam : 'pagesize',
		api : {
			create : location.context + '/provider.do?action=save', read : location.context + '/provider.do?action=list',
			update : location.context + '/provider.do?action=update', destroy : location.context + '/provider.do?action=del'
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

Ext.create('WJM.model.VendorBaseStore', {
	storeId : 'VendorSearchStore'
});
