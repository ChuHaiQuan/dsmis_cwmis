Ext.define('WJM.model.TProductVendor', {
	extend : 'Ext.data.Model', idProperty : 'id',

	fields : [ {
		name : 'id'
	}, {
		name : 'product_id'
	}, {
		name : 'vendor_id'
	}, {
		name : 'product_name'
	}, {
		name : 'vendor_name'
	}, {
		name : 'price'
	}, {
		name : 'useDefault'
	}, {
		name : 'useDefaultBoolean'
	} ],

	proxy : {
		batchActions : true, pageParam : 'currpage', limitParam : 'pagesize', type : 'ajax', api : {
			create : '', read : '', update : '', destroy : location.context + '/productVendor.do?action=del'
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

Ext.define('WJM.model.ProductVendorBaseStore', {
	extend : 'Ext.data.Store', autoLoad : false, autoSync : false, model : 'WJM.model.TProductVendor', storeId : 'ProductVendorStore',
	proxy : {
		batchActions : true, pageParam : 'currpage', limitParam : 'pagesize', type : 'ajax', api : {
			create : '', read : location.context + '/productVendor.do?action=list', update : '', destroy : ''
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

Ext.create('WJM.model.ProductVendorBaseStore', {

});
