Ext.define('WJM.model.TCompany', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'company_name'
	}, {
		name : 'company_address'
	}, {
		name : 'company_tel'
	}, {
		name : 'company_fax'
	}, {
		name : 'company_name_pic_logo'
	}, {
		name : 'company_logo_pic_logo'
	}, {
		name : 'invoiceTax'
	} ],

	proxy : {
		batchActions : true,
		type : 'ajax',
		pageParam : 'currpage',
		limitParam : 'pagesize',
		api : {
			create : location.context + '/setting.do?action=saveCompany', read : location.context + '/setting.do?action=getCompany',
			update : location.context + '/company.do?action=update', destroy : location.context + '/company.do?action=del'
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
