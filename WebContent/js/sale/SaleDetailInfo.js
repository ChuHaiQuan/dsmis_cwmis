/**
 * 订单明细查看
 */
Ext.define('WJM.sale.SaleDetailInfo', {
	extend : 'Ext.form.Panel',
	requires : [ 'Ext.grid.Panel', 'WJM.model.TSale', 'WJM.model.TProduct' ,'WJM.model.TCustomer' ],
	collapsedStatistics : false,
	layout : {
		type : 'border', padding : 5
	},
	defaults : {
		split : true
	},
	closeAction : 'destroy',

	saleStore : 'SaleStore',

	saleProductStore : 'SaleProductStore',
	buyerStore:'BuyerStore',
	
	record:null,

	initComponent : function() {
		debugger;
		var me = this;
		var _fileds = [ {
			xtype : 'rownumberer'
		}, {
			text : "Item Id/编号", dataIndex : 'productid', sortable : true
		}, {
			text : "Product Name/产品名称", dataIndex : 'product_name', sortable : true,width:200
		}, {
			text : "QTY./数量", dataIndex : 'product_num', sortable : true, xtype : 'numbercolumn', format : '$0.00'
		}, {
			text : "UNIT PRICE/单价", dataIndex : 'agio_price', sortable : true
		}, {
			text : "AMOUNT/总价", dataIndex : 'sub_total2', sortable : true, xtype : 'numbercolumn'
		}/*, {
			text : "RMAed credit quantity/已退货无损数量", dataIndex : 'credit_num', sortable : true, xtype : 'numbercolumn'
		}, {
			text : "RMAed damage quantity/已退货损坏数量", dataIndex : 'damage_num', sortable : true, xtype : 'numbercolumn'
		} */];

		Ext.apply(this, {
			autoScroll : true,
			

			items : [
					,
					{
						region : 'center',
						split : true,
						height : '40%',
						layout : {
							type : 'border', padding : 5
						},
						items : [
								{
									xtype : 'form', title : 'BILL TO', region : 'center', width : "50%", collapsible : true, split : true,
									collapsed : this.collapsedStatistics, defaults : {
										xtype : 'textfield', anchor : '100%', labelWidth : 100, bodyPadding : 10,width:200
									}, items : [ {
										fieldLabel : 'buyer_mobile', name : 'buyer_mobile', readOnly : true
									}, {
										fieldLabel : 'buyer_name', name : 'buyer_name', readOnly : true
									}, {
										fieldLabel : 'buyer_address', name : 'buyer_address', readOnly : true
									} ]
								},
								{
									xtype : 'form', title : 'SHIP TO', region : 'east', width : "50%", collapsible : true, split : true,
									collapsed : this.collapsedStatistics, defaults : {
										xtype : 'textfield', anchor : '100%', labelWidth : 100, bodyPadding : 10
									}, items : [{
										fieldLabel : 'buyer_address', name : 'buyer_mobile', readOnly : true
									}, {
										fieldLabel : 'buyer_city', name : 'buyer_name', readOnly : true
									}, {
										fieldLabel : 'buyer_state', name : 'buyer_state', readOnly : true
									}, {
										fieldLabel : 'buyer_postCode', name : 'buyer_postCode', readOnly : true
									}, {
										fieldLabel : 'buyer_mobile', name : 'buyer_address', readOnly : true
									} ]
								} ]
					},
					{
						region : 'south',
						split : true,
						height : '60%',
						layout : {
							type : 'border', padding : 5
						},
						items : [
								{
									store : this.saleProductStore, split : true, disableSelection : false, collapsible : true, split : true, loadMask : true,
									height : 150, autoScroll : true, region : 'center', multiSelect : true, title : '订单商品', xtype : 'gridpanel',
									columns : _fileds, viewConfig : {
										plugins : [ Ext.create('Ext.grid.plugin.DragDrop', {
											ddGroup : 'TProduct', enableDrop : false, enableDrag : true
										}) ]
									}
								},
								{
									xtype : 'form', title : '合计信息', region : 'east', width : 250, collapsible : true, split : true,
									collapsed : this.collapsedStatistics, defaults : {
										xtype : 'textfield', anchor : '100%', labelWidth : 120, bodyPadding : 10
									}, items : [ {
										fieldLabel : 'Sub Total/总计:', name : 'sub_total', readOnly : true
									}, {
										fieldLabel : 'Tax/税:', name : 'tax', readOnly : true
									}, {
										fieldLabel : 'Total/总价:', name : 'total', readOnly : true
									}, {
										fieldLabel : 'Discount/优惠:', name : 'discount', readOnly : true
									}, {
										fieldLabel : 'Balance/差额:', name : 'balance', readOnly : true
									}, {
										fieldLabel : 'Account Balance/帐号余额:', name : 'buyer_balance', readOnly : true
									}  ]
								} ]
					} ]
		});
		
		this.callParent(arguments);
		if (this.record) {
			me.loadRecord(this.record);
            var store = Ext.data.StoreManager.lookup('SaleProductStore');
            store.getProxy().setExtraParam('sale_id', this.record.getId());
            store.load();
            Ext.Ajax.request({
        	    url: location.context + '/buyer.do?action=list',
        	    params: {
        	    	id: this.record.get("buyer_id")
        	    },
        	    reader: {
        	        type : 'json'
        	    },
        	    success: function(response,a,b){
        	    	if(JSON.parse(response.responseText).listData!=[]){
        	    		var data = JSON.parse(response.responseText).listData[0];
        	    		me.getForm().findField('buyer_balance').setValue(Ext.util.Format.number(data.balance-data.leav_money,'0.00'));
        	    	}
        	    	
        	    }
        	});
            
        }
	}

});