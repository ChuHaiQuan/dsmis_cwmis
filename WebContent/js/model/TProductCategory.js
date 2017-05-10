Ext.define('WJM.model.TProductCategory', {
	extend : 'Ext.data.Model', idProperty : 'id',

	fields : [ {
		name : 'id'
	}, {
		name : 'product_type_name'
	}, {
		name : 'product_type_name_cn'
	}, {
		name : 'code'
	}, {
		name : 'parent_id'
	}, {
		name : 'level'
	}, {
		name : 'parent_product_type_name'
	} ],

	validations : [ {
		type : 'length', field : 'product_type_name', min : 1
	} ]
});

Ext.define('WJM.model.ProductCategoryBaseStore', {
	extend : 'Ext.data.TreeStore',
	autoLoad : false,
	autoSync : true,
	model : 'WJM.model.TProductCategory',
	storeId : 'ProductCategoryStore',
	root : {
		product_type_name : "全部类别", level : 0, expanded : true, id : 0
	},
	proxy : {
		batchActions : true,
		type : 'ajax',
		api : {
			create : location.context + '/product_type.do?action=save', read : location.context + '/product_type.do?action=list',
			update : location.context + '/product_type.do?action=update', destroy : location.context + '/product_type.do?action=del'
		},

		writer : Ext.create('WJM.FormWriter'),

		reader : {
			root : 'listData', totalProperty : 'total', messageProperty : 'msg'
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
Ext.define('WJM.model.ProductCategoryAllStore', {
	extend : 'Ext.data.Store',
	autoLoad : true,
	autoSync : true,
	model : 'WJM.model.TProductCategory',
	storeId : 'ProductCategoryAllStore',
	proxy : {
		batchActions : true,
		type : 'ajax',
		api : {
			create : location.context + '/product_type.do?action=save', read : location.context + '/product_type.do?action=listall',
			update : location.context + '/product_type.do?action=update', destroy : location.context + '/product_type.do?action=del'
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
Ext.create('WJM.model.ProductCategoryBaseStore', {

});
Ext.create('WJM.model.ProductCategoryAllStore', {

});
