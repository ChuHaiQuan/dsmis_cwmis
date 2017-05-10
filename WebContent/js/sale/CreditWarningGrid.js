/**
 * 超期未付款查询预警
 */
Ext.define('WJM.sale.CreditWarningGrid', {
	extend : 'Ext.panel.Panel',
	requires : [ 'Ext.grid.Panel' ],
	layout : {
		type : 'border', padding : 5
	},
	closeAction : 'destroy',
	defaults : {
		split : true
	},
	initComponent : function() {
		this.editTopBar = Ext.create('Ext.toolbar.Toolbar', {
			items : [ {
				iconCls : 'search', text : '搜索', scope : this, handler : this.onSearchClick
			}, {
				iconCls : 'search', text : '清空', scope : this, handler : this.clearSearch
			}, {
				iconCls : 'search', text : '结清欠款', scope : this, handler : this.clearDue
			} ]
		});

		var _fileds = [ {
			xtype : 'rownumberer'
		}, {
			text : "customer/客户", dataIndex : 'buyer_code', sortable : true
		}, {
			text : "due balance/欠款额", dataIndex : 'amount', sortable : true, xtype : 'numbercolumn', format : '$0.00',width:150
		}, {
			text : "invoice/订单号", dataIndex : 'invoice', sortable : true
		}, {
			text : "saleman/销售员", dataIndex : 'oper_name', sortable : true
		} ];

		var formFileds = [];
		formFileds.push({
			xtype : 'datefield', fieldLabel : 'end date/截止日期', labelWidth : 150, name : 'date', format : 'Y-m-d', allowBlank : true
		});
		this.storeId = 'CreditWarningStore';
		
		
		var item=[
					{
						anchor : '100%', height : 100, xtype : 'form', region : 'north', autoScroll : true, collapsible : true, title : '搜索信息',
						layout : {
							columns : 3, type : 'table', tableAttrs : {
								style : {
									width : '100%'
								}
							}
						},bodyPadding : 10, items : formFileds
					},{store : this.storeId, split : true,
						disableSelection : false, loadMask : true, autoScroll : true, region : 'center',
						title : '超期未付款报表', xtype : 'gridpanel', columns : _fileds,height : 200,width : 400,
					    collapsible: true,  
					    animCollapse: false, 
						} ]
		;
			
		Ext.apply(this, {
			autoScroll : true,
			dockedItems : [ this.editTopBar ],

			items : item

		});
		this.callParent();
		this.onSearchClick();
	},
	/**
	 * 搜索
	 */
	onSearchClick : function() {
		var fields = this.down('form').getForm().getFields();
		fields.each(function(field) {
			if(!field.getValue()){
				field.setValue(Ext.Date.format(new Date(),'Y-m-d'));
			}
		});
		var data = this.down('form').getForm().getFieldValues();
		var store = Ext.data.StoreManager.lookup(this.storeId);
		Ext.Object.each(data, function(key, value) {
			store.getProxy().setExtraParam(key, value);
		});
		store.load();
	},
	/**
	 * 清空
	 */
	clearSearch : function() {
		var fields = this.down('form').getForm().getFields();
		fields.each(function(field) {
			field.setValue('');
		});
	},
	//结清欠款
	clearDue:function(){
		var that = this;
		var selection = this.down('grid[title="超期未付款报表"]').getView().getSelectionModel().getSelection()[0];
		if (selection) {
			Ext.Msg.confirm('提示', '确定要结清此订单【'+selection.get("invoice")+'】吗？', function(btn, text) {
				if (btn == 'yes') {
	            	Ext.Ajax.request({
	            	    url: location.context + '/sale.do?action=credit_warn_clear',
	            	    params: {
	            	    	sale_id: selection.get("sale_id")
	            	    },
	            	    reader: {
	            	        type : 'json'
	            	    },
	            	    success: function(response,a,b){
	            	    	Ext.Msg.alert('提示', '操作成功' );
	            	    	that.onSearchClick();
	            	    }
	            	});
	            	
	            
				}
			}, this);
			
		} else {
			Ext.Msg.alert('提示', '请选择订单');
		}
	
		
	}
});