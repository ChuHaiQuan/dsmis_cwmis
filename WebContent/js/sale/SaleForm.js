/**
 * 订单表单
 */
Ext.define('WJM.sale.SaleForm', {
    extend: 'Ext.form.Panel',
    requires: [ 'WJM.model.TSale', 'WJM.model.TProduct' ],
    bodyPadding: 10,
    autoScroll: true,
    // closeAction : 'destroy',

    record: null,
    initComponent: function () {
        var me = this;
        this.gridStoreId = Ext.Number.randomInt(1000000, 9999999).toString();
        Ext.create('Ext.data.Store', {
            storeId: this.gridStoreId, autoLoad: false, model: 'WJM.model.TProduct'
        });
        var _fileds = [
            {
                xtype: 'rownumberer'
            },
            {
                text: "barcode #/条码", dataIndex: 'code', sortable: true, width: 100
            },
            {
                text: "items id/助记符", dataIndex: 'product_id', sortable: true, width: 100
            },
            {
                text: "description 1", dataIndex: 'product_name', sortable: true, width: 200, editor: {
                xtype: 'textfield', allowBlank: false
            }
            },
            {
                text: "quantity/数量", dataIndex: 'num', sortable: true, xtype: 'numbercolumn', format: '0,000', editor: {
                xtype: 'numberfield', allowBlank: false, allowDecimals: false
            }
            },
            {
                text: "unit price/单价", dataIndex: 'price_simgle', sortable: true, xtype: 'numbercolumn', format: '$0.00', editor: {
                xtype: 'adnumberfield', allowBlank: false
            }
            },
            {
                text: "discount price/折扣价", dataIndex: 'agio_price', sortable: true, xtype: 'numbercolumn', format: '$0.00'
            },
            {
                text: "discount percent/折扣百分比", dataIndex: 'agio', sortable: true, xtype: 'numbercolumn', format: '0.0%', editor: {
                xtype: 'adnumberfield', allowBlank: false
            }
            },
            {
                text: "sub total/小计", dataIndex: 'total', sortable: true, xtype: 'numbercolumn', format: '$0.00'
            }
        ];

       // if (!this.record) {
            _fileds.push({
                xtype: 'actioncolumn',
                text: "使用批发价",
                align: 'center',
                width: 174,
                items: [
                    {
                        width: 66, height: 24, iconCls: 'pifa-button', html: '<span>使用批发价</span>', tooltip: '使用批发价',
                        handler: function (grid, rowIndex, colIndex) {
                        	
                            var recod = grid.getStore().getAt(rowIndex);
                            if (!recod.get('old_wholesale')) {
                                recod.set('old_wholesale', recod.get('price_wholesale'));
                                recod.set('old_simgle', recod.get('price_simgle'));
                            }
                            var messageBox = Ext.Msg.prompt('approver', '请输入优惠确认人code:', function (btn, text) {
                                if (btn == 'ok') {
                                    var proxy = new Ext.data.proxy.Ajax({
                                        model: 'WJM.model.TEmployee', url: 'sale.do?action=checkApprover',

                                        reader: new Ext.data.reader.Json({
                                            type: 'json', messageProperty: 'msg'
                                        }),

                                        extraParams: {
                                            confirm_code: text
                                        },

                                        writer: Ext.create('WJM.FormWriter')
                                    });
                                    proxy.read(new Ext.data.Operation({}), function (records, operation) {
                                        if (records.success) {
                                            recod.set('agio_price', recod.get('old_wholesale'));
                                            recod.set('agio_price_old', recod.get('old_wholesale'));
                                           // recod.set('agio', (1-Ext.util.Format.number(recod.get('agio_price')/recod.get("price_simgle"),"0.000"))*100);
                                            this.getForm().findField('confirm_code').setValue(text);
                                        } else {
                                            Ext.Msg.alert('提示', records.error);
                                        }
                                        this.calculateTotal(null,recod);
                                    }, me);
                                }
                            });
                            // 将弹出框hack 为 密码弹框
                            Ext.dom.Element.get(messageBox.down('textfield').getInputId()).dom.type = 'password';
                            //this.calculateTotal();
                        }, scope: this
                    },
                    {
                        width: 24, height: 66, iconCls: 'linshou-button', html: '<span>使用零售价</span>', tooltip: '使用零售价',
                        handler: function (grid, rowIndex, colIndex) {
                            var recod = grid.getStore().getAt(rowIndex);
                            if (!recod.get('old_wholesale')) {
                                recod.set('old_wholesale', recod.get('price_wholesale'));
                                recod.set('old_simgle', recod.get('price_simgle'));
                            }
                            recod.set('agio_price', recod.get('old_simgle'));
                            recod.set('agio_price_old', recod.get('old_simgle'));
                            recod.set('agio',0);
                            this.getForm().findField('confirm_code').setValue("");
                            this.calculateTotal(null,recod);
                        }, scope: this
                    }
                ]
            });
        //}
        this.editor = Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1, listeners: {
                edit: me.cellEditor, scope: me, beforeedit: me.onBeforeEdit
            }
        });
        Ext.applyIf(me, {
            defaults: {
                xtype: 'textfield', anchor: '98%', labelWidth: 150
            },
            items: [
                {
                    name: 'id', xtype: 'hiddenfield'
                },
                {
                    name: 'type', xtype: 'hiddenfield'
                },
                {
                    xtype: 'container', layout: {
                    columns: 2, type: 'table', tableAttrs: {
                        style: {
                            width: '100%'
                        }
                    }, tdAttrs: {
                        style: {
                            width: '50%'
                        }
                    }
                }, items: [ Ext.create('WJM.product.ProductQuickSearchForm', {
                    anchor: '100%', height: 50, listeners: {
                        onProductLoad: me.onProductLoad, scope: me
                    }
                }), Ext.create('WJM.customer.CustomerQuickSearchForm', {
                    anchor: '100%', height: 50, listeners: {
                        onProductLoad: me.onCustomerLoad, scope: me
                    }
                }) ]
                },
                {//selType: "checkboxmodel",
                	title:"订单商品",multiSelect : true,anchor: '98% -560', minHeight: 300, disableSelection: false, loadMask: true, xtype: 'gridpanel', columns: _fileds,
                    plugins: [ this.editor ], store: this.gridStoreId,

                    viewConfig: {
                        plugins: [ Ext.create('Ext.grid.plugin.DragDrop', {
                            ptype: 'gridviewdragdrop', ddGroup: 'TProduct', enableDrop: true, enableDrag: false
                        }) ],

                        listeners: {
                            drop: function (node, data, overModel, dropPosition, eOpts) {
                                for (var i = 0; i < data.records.length; i++) {
                                    var array_element = data.records[i];
                                    array_element.set("num", null);
                                    array_element.set('agio', 0);
                                }
                                this.calculateTotal(true);
                            },

                            beforedrop: function (node, data, overModel, dropPosition, dropFunction, eOpts) {
                                data.copy = true;
                                var gridpanle = me.down('gridpanel');
                                var store = gridpanle.getStore();
                                data.records = Ext.Array.filter(data.records, function (item) {
                                    var data = store.getById(item.getId());
                                    if (data) {
                                        data.set("num", data.get("num") + 1);
                                        return false;
                                    } else {
                                        return true;
                                    }
                                });
                                this.calculateTotal(true);
                            }, scope: me
                        }
                    }
                },
                {
                    title: 'customer/客户', xtype: 'fieldset', collapsible: true, collapsed: false, layout: {
                    columns: 2, type: 'table', tableAttrs: {
                        style: {
                            width: '100%'
                        }
                    }, tdAttrs: {
                        style: {
                            width: '50%'
                        }
                    }
                }, defaults: {
                    allowBlank: true, xtype: 'textfield', width: '90%', labelWidth: 120
                }, items: [
                    {
                        fieldLabel: 'Phone/电话', name: 'buyer_mobile'
                    },
                    {
                        fieldLabel: 'name/客户名称', name: 'buyer_name'
                    },
                    {
                        fieldLabel: 'address/客户地址', name: 'buyer_address'
                    },
                    {
                        fieldLabel: 'City/城市', name: 'buyer_city'
                    },
                    {
                        fieldLabel: 'State/州', name: 'buyer_state'
                    },
                    {
                        fieldLabel: 'Zip Code/邮编', name: 'buyer_postCode'
                    },
                    {
                        name: 'buyer_id', allowBlank: false, xtype: 'hidden'
                    },
                    {
                        name: 'buyer_code', allowBlank: false, xtype: 'hidden'
                    }
                ]
                },
                {
                    name: 'discount', allowBlank: true, xtype: 'hiddenfield', anchor: '100%'
                },
                {
                    title: 'Discount/优惠',
                    xtype: 'fieldset',
                    collapsible: true,
                    collapsed: false,
                    layout: {
                        columns: 4, type: 'table', tableAttrs: {
                            style: {
                                width: '100%'
                            }
                        }
                    },
                    items: [
                        {
                            fieldLabel: 'Discount Percent/优惠百分比', name: 'discountpercent', allowBlank: true, xtype: 'adnumberfield',
                            anchor: '100%', labelWidth: 150, readOnly: false, minValue: 0, value: 0, colspan: 2, format: '0.0000',
                            decimalPrecision: 4,

                            listeners: {
                                blur: me.discountPercentChange, scope: me
                            }
                        },
                        {
                            fieldLabel: 'approver id/优惠确认人', name: 'confirm_code', allowBlank: true, xtype: 'textfield', anchor: '100%',
                            labelWidth: 150, readOnly: false, colspan: 2, inputType: 'password'
                        },
                        {
                            xtype: 'button', anchor: '100%', text: 'No discount(With All Tax)/不优惠(含所有税)', listeners: {
                            click: function () {
                                this.getForm().findField('discount').setValue(0);
                                this.getForm().findField('discountpercent').setValue(0);
                                me.discountPercentChange();
                            }, scope: me
                        }
                        },
                        {
                            xtype: 'button', anchor: '100%', text: 'No tax/不交税', listeners: {
                            click: function () {
                                var tax = this.getForm().findField('tax').getValue();
                                var sub_total = this.getForm().findField('sub_total').getValue();
                                this.getForm().findField('discount').setValue(tax);
                                this.getForm().findField('discountpercent').setValue(tax / sub_total * 100);
                                me.discountPercentChange();
                            }, scope: me
                        }
                        },
                        {
                            xtype: 'button', anchor: '100%', text: '5% Discount Percent/优惠5%', listeners: {
                            click: function () {
                                this.getForm().findField('discount').setValue(this.getForm().findField('sub_total').getValue() * 0.05);
                                this.getForm().findField('discountpercent').setValue(5);
                                me.discountPercentChange();
                            }, scope: me
                        }
                        }
                    ]
                },
                {
                    title: 'Payment Delivery/支付与送货',
                    xtype: 'fieldset',
                    layout: {
                        columns: 2, type: 'table', tableAttrs: {
                            style: {
                                width: '100%'
                            }
                        }, tdAttrs: {
                            style: {
                                width: '50%'
                            }
                        }
                    },
                    allowBlank: false,
                    items: [
                        {
                            xtype: 'combobox', fieldLabel: 'Payment Method/支付方式', labelWidth: 170, name: 'payment', displayField: 'name',
                            valueField: 'value', store: 'SalePaymentMethodStore', value: 'Cash', allowBlank: false
                        },
                        {
                            xtype: 'combobox', fieldLabel: 'Delivery Method/送货方式', labelWidth: 170, name: 'send_type', displayField: 'name',
                            valueField: 'value', store: 'SaleSendMethodStore', value: '自取', allowBlank: false
                        }
                    ]
                },
                {
                    xtype: 'container',
                    padding: '10 0 0 0',
                    layout: {
                        columns: 2, type: 'table', tableAttrs: {
                            style: {
                                width: '100%'
                            }
                        }, tdAttrs: {
                            style: {
                                width: '50%'
                            }
                        }
                    },
                    items: [
                        {
                            xtype: 'textfield', name: 'oper_name', labelWidth: 110, width: '90%', fieldLabel: 'Worker ID/操作员',
                            allowBlank: false, readOnly: true, value: window.user.userName
                        },
                        {
                            xtype: 'textfield', name: 'oper_time', fieldLabel: 'date/时间', width: '90%', labelWidth: 110, allowBlank: false,
                            readOnly: true, value: Ext.Date.format(new Date(), 'Y-m-d H:i:s')
                        },
                        {
                            name: 'sub_total', fieldLabel: 'sub total/合计', allowBlank: false, labelWidth: 110, width: '90%', readOnly: true,
                            xtype: 'adnumberfield'
                        },
                        {
                            name: 'tax', fieldLabel: 'Tax/税(' + (window.invoiceTax * 100).toFixed(3) + '%)', allowBlank: false, labelWidth: 110,
                            width: '90%', readOnly: true, xtype: 'adnumberfield'
                        },
                        {
                            name: 'all_price', fieldLabel: 'Total/总计', allowBlank: false, labelWidth: 110, width: '90%', readOnly: true,
                            xtype: 'adnumberfield'
                        }
                    ]
                },
                {
                    name: 'remark', fieldLabel: 'Remark/备注', allowBlank: true, xtype: 'textareafield', rows: 2, labelWidth: 110
                }
            ],

            dockedItems: [
                {
                    xtype: 'toolbar', dock: 'top', items: [
                    {
                        xtype: 'button', iconCls: 'save', text: '保存订单', scope: this, handler: this.onSaveClick
                    },
                    {
                        xtype: 'button', iconCls: 'save', text: '保存报价单', scope: this, handler: this.onSaveQuoteClick
                    },
                    {
                        xtype: 'button', iconCls: 'search', text: '搜索产品', scope: this, handler: this.onProductSearchClick
                    },
                    {
                        xtype: 'button', iconCls: 'search', text: '搜索客户', scope: this, handler: this.onCustomerSearchClick
                    },
                    {
                        xtype: 'button', iconCls: 'search', text: '清空', scope: this, handler: this.clearForm
                    },
                    {
                        xtype: 'button', iconCls: 'remove', text: '删除产品', scope: this, handler: this.onRemoveProductClick
                    },
                    {
                        xtype: 'button', iconCls: 'add', text: '添加临时产品', scope: this, handler: this.onAddProductClick
                    },
                    {
                        xtype: 'button', iconCls: 'add', text: '使用批发价', scope: this, handler: this.onUseCheap
                    },
                    {
                        xtype: 'button', iconCls: 'add', text: '使用零售价', scope: this, handler: this.onUseExpensive
                    }
                ]
                }
            ]
        });
        me.callParent(arguments);
        me.on("afterrender", this.initDragDorp, me);
        if (this.record) {
            me.loadRecord(this.record);
            var store = Ext.data.StoreManager.lookup('SaleProductStore');
            store.getProxy().setExtraParam('sale_id', this.record.getId());
            store.load({
                scope: this, callback: this.onSaleProductLoad
            });
        }
    },
    /**
     *
     */
    initDragDorp: function () {
        var me = this;
        this.dragDorp = Ext.create('Ext.dd.DropTarget', this.down('fieldset[title="customer/客户"]').getEl().dom, {
            ddGroup: 'TCustomer', notifyEnter: function (ddSource, e, data) {
                me.stopAnimation();
                me.getEl().highlight();
            }, notifyDrop: function (ddSource, e, data) {
                var selectedRecord = ddSource.dragData.records[0];
                me.setCustomer(selectedRecord);
                return true;
            }
        });
    },
    /**
     * 设置客户
     *
     * @param customer
     */
    setCustomer: function (customer) {
        this.customer = customer;
        this.getForm().findField('buyer_name').setValue(customer.get('shortName'));
        this.getForm().findField('buyer_address').setValue(customer.get('address'));
        this.getForm().findField('buyer_state').setValue(customer.get('state'));
        this.getForm().findField('buyer_city').setValue(customer.get('city'));
        this.getForm().findField('buyer_postCode').setValue(customer.get('postCode'));
        this.getForm().findField('buyer_mobile').setValue(customer.get('mobile'));
        this.getForm().findField('buyer_code').setValue(customer.get('code'));
        this.getForm().findField('buyer_id').setValue(customer.getId());
        this.getForm().findField('payment').setValue('Credit Account');
    },
    /**
     * 保存
     */
    onSaveClick: function () {
        this.getForm().findField('type').setValue(0);
        // 检查信用
        if (this.customer) {
            if (this.customer.get('credit_Line') > 0) {
                if (this.customer.get('credit_Line') + this.customer.get('leav_money') - this.customer.get('balance')
                    - this.getForm().findField('all_price').getValue() < 0) {
                    Ext.Msg.alert('提示', '此用户预付款：' + this.customer.get('leav_money') + ' 已经欠款' + this.customer.get('balance') + ' 信用额度：'
                        + this.customer.get('credit_Line') + " 应付款：" + this.getForm().findField('all_price').getValue());
                    return;
                }
            }
        }
        this.saveForm();
    },

    /**
     * 保存
     */
    onSaveQuoteClick: function () {
        this.getForm().findField('type').setValue(1);
        this.saveForm();
    },

    saveForm: function () {
        var form = this.getForm();
        var me = this;
        var datas = this.down('gridpanel').getStore().data;
        var redod = [];
        //this.calculateTotal();
        var productHasGood = true;
        datas.each(function (item) {
            if (!item.get('num')) {
                productHasGood = false;
            }
            redod.push(item.getData());
        });
        if (form.isValid()) {
            if (redod.length == 0) {
                Ext.Msg.alert('提示', '请选择产品');
                return;
            }
            if (!productHasGood) {
                Ext.Msg.alert('提示', '产品个数未填！');
                return;
            }
            this.submit({
                url: 'sale.do?action=sale_submit', params: {
                    saleProducts: Ext.JSON.encode(redod)
                },

                success: function (form, action) {
                    var result = action.result;
                    var aletMsg = '';
                    Ext.Array.each(result.listData, function (data) {
                        aletMsg += '<span style="color:#ff0000;">,' + data.product_name + '可能库存不足</span>';
                    });
                    Ext.Msg.alert('提示', '保存成功' + aletMsg);
                    me.clearForm(true);
                    window.open(location.context + '/sale.do?action=re_print&id=' + result.saleId, "_blank");
                    me.fireEvent('saveSuccess', me);
                },

                failure: function (form, action) {
                    Ext.Msg.alert('提示', action.result.msg || '保存失败，请稍候重试');
                }
            });
        }
    },

    /**
     * 搜索产品
     */
    onProductSearchClick: function () {
        var desktop = myDesktopApp.getDesktop();
        var win = desktop.getWindow('productsearch');
        if (!win) {
            var grid = Ext.create('WJM.product.ProductGrid', {
                editAble: false
            });
            win = desktop.createWindow({
                id: 'productsearch', title: "search/产品搜索", width: 600, height: 600, iconCls: 'icon-grid', animCollapse: false,
                constrainHeader: true, layout: 'fit', items: [ grid ]
            });
        }
        win.show();
    },

    /**
     * 搜索用户
     */
    onCustomerSearchClick: function () {
        var desktop = myDesktopApp.getDesktop();
        var win = desktop.getWindow('customersearch');
        if (!win) {
            var grid = Ext.create('WJM.customer.CustomerGrid', {
                editAble: true
            });
            win = desktop.createWindow({
                id: 'customersearch', title: "search/客户搜索", width: 600, height: 800, iconCls: 'icon-grid', animCollapse: false,
                constrainHeader: true, layout: 'fit', items: [ grid ]
            });
        }
        win.show();
    },
    
    discountPercentChange:function(c,n,o){
    	var that = this;
    	this.adminConfirm(function(text){
    		that.calculateTotal(true);

    		that.getForm().findField('confirm_code').setValue(text);
    		
    	},function(){
    		that.getForm().findField('discountpercent').setValue(0);
    		that.calculateTotal(true);
    	},function(){
    		that.getForm().findField('discountpercent').setValue(0);
    		that.calculateTotal(true);
    	});
    },

    cellEditor:function(){
    	var data = arguments[1];
    	var id = arguments[1].record;
    	var that = this;
    	if(arguments[1].field == 'agio'){
        	this.adminConfirm(function(){
        		that.calculateTotal(null,id);
        	},function(){
        		data.record.set("agio",bfAgio);
        		that.calculateTotal(null,id);
        	},function(){
        		data.record.set("agio",bfAgio);
        		that.calculateTotal(null,id);
        	});
    	}else{
    		that.calculateTotal(true,id);
    	}
    },
    /**
     * 计算总数
     */
    calculateTotal: function (flag,single) {
    	var that=this;
        var total = 0;
        var datas = this.down('gridpanel').getStore().data;
        datas.each(function (item) {
        	if(single){
        		if(item == single){
        			if(!item.get("agio_price") || item.get("product_id")=='999999'){
                		var agio_price = Ext.util.Format.number(item.get('price_simgle') * (1 - item.get('agio') / 100), '0.00');
                		if(!item.get("agio_price")){item.set('agio_price_old', agio_price);}
                        item.set('agio_price', agio_price);
                	}else{
                		if(!flag){
                			if(item.get('agio_price_old')){
                				var agio_price = Ext.util.Format.number(item.get('agio_price_old') * (1 - item.get('agio') / 100), '0.00');
                				item.set('agio_price', agio_price);	
                			}else{
                				var price=item.get('agio_price')/(1-item.get("agio")/100);
                				if(Math.abs(item.get("price_simgle")-price)<1)
                					item.set('agio_price_old',item.get("price_simgle") );
                				else
                					item.set('agio_price_old',item.get("price_wholesale") );
                			}
                		}
                	}
        		}
        	}else{
        		if(!flag){
        			if(!item.get("agio_price") || item.get("product_id")=='999999'){
                		var agio_price = Ext.util.Format.number(item.get('price_simgle') * (1 - item.get('agio') / 100), '0.00');
                		if(!item.get("agio_price")){item.set('agio_price_old', agio_price);}
                        item.set('agio_price', agio_price);
                	}else{
                		
                			if(item.get('agio_price_old')){
                				var agio_price = Ext.util.Format.number(item.get('agio_price_old') * (1 - item.get('agio') / 100), '0.00');
                				item.set('agio_price', agio_price);	
                			}else{
                				var price=item.get('agio_price')/(1-item.get("agio")/100);
                				if(Math.abs(item.get("price_simgle")-price)<1)
                					item.set('agio_price_old',item.get("price_simgle") );
                				else
                					item.set('agio_price_old',item.get("price_wholesale") );
                			}
                		
                	}
        		}
        		
        	}
        	
            item.set('total', item.get('num') * item.get("agio_price"));
            total += item.get('total');
        });
        var discountpercent = Number(this.getForm().findField('discountpercent').getValue()) / 100;
        this.getForm().findField('tax').setValue(total * window.invoiceTax);
        this.getForm().findField('sub_total').setValue(total - total * discountpercent);
        this.getForm().findField('discount').setValue(total * discountpercent);
        this.getForm().findField('all_price').setValue(
            total * (1 + window.invoiceTax - discountpercent));
    },
    /**
     * 重置表单
     */
    clearForm: function (flag) {
    	var that=this;
    	if(flag==true){
    		doClearForm();
    	}else{
    		Ext.Msg.confirm('approver', '您确定要清空吗？:', function (btn, text){
    			if(btn == "yes"){
            		doClearForm();
    			}else{

    			}
        	},this);
    	}
    	
    	
    	function doClearForm(){
    		that.down('gridpanel').getStore().removeAll();
    		that.customer = null;
            var fields = that.getForm().getFields();
            fields.each(function (item) {
                item.setValue('');
            });
            that.getForm().findField('oper_time').setValue(Ext.Date.format(new Date(), 'Y-m-d H:i:s'));
            that.getForm().findField('oper_name').setValue(window.user.userName);
            that.getForm().findField('payment').setValue(Ext.data.StoreManager.lookup('SalePaymentMethodStore').getAt(0).get('value'));
            that.getForm().findField('send_type').setValue(Ext.data.StoreManager.lookup('SaleSendMethodStore').getAt(2).get('value'));
            that.calculateTotal(); 
    	}
    },
    /**
     *
     */
    onSaleProductLoad: function (records, opt, successful) {
    	var that=this;
        if (successful) {
            var products = [];
            Ext.Array.each(records, function (item) {
                var product = Ext.create('WJM.model.TProduct');
                product.setId(item.get('product_id'));
                product.set('code', item.get('product_code'));
                product.set('product_name', item.get('product_name'));
                product.set('agio_price', item.get('agio_price'));
                product.set('agio_price_old', item.get('agio_price'));
                product.set('agio', item.get('agio'));
                product.set('product_id', item.get('productid'));
                product.set('price_simgle', item.get('product_price'));
                product.set('num', item.get('product_num'));
                products.push(product);
            });
            
            Ext.Array.each(products, function (item) {
            	Ext.Ajax.request({
            	    url: location.context + '/product.do?action=list',
            	    params: {
            	    	id: item.get("id"),
            	    	product_id_all:"true"
            	    },
            	    reader: {
            	        type : 'json'
            	    },
            	    success: function(response,a,b){
            	    	if(JSON.parse(response.responseText).listData!=[]){
            	    		item.set("price_wholesale",JSON.parse(response.responseText).listData[0].price_wholesale);
                	    	item.set("price_simgle",JSON.parse(response.responseText).listData[0].price_simgle);
                	    	 //that.calculateTotal();
            	    	}
            	    	

            	    }
            	});
            	
            });
            this.down('gridpanel').getStore().loadRecords(products);
            this.calculateTotal(true);
            
            
        }
    },


    /**
     * 查询返回
     *
     */
    onProductLoad: function (opt) {
        var me = this;
        var gridpanle = me.down('gridpanel');
        var store = gridpanle.getStore();
        Ext.Array.each(opt.records, function (item) {
            var data = store.getById(item.getId());
            if (data) {
                data.set("num", data.get("num") + 1);
            } else {
                item.set("num", null);
                item.set('agio', 0);
                store.add(item);
            }
        });
        
        if (opt.records.length > 0) {
            me.editor.startEdit(opt.records[0], 4);
        }
        me.calculateTotal(true);
    },
    /**
     * 删除产品
     */
    onRemoveProductClick: function () {
        var me = this;
        var gridpanle = me.down('gridpanel');
        var selection = gridpanle.getView().getSelectionModel().getSelection()[0];
        if (selection) {
            gridpanle.getStore().remove(selection);
            me.calculateTotal(true);
        } else {
            Ext.Msg.alert('提示', '请选择产品');
        }
    },
    
    //批量使用批发价
    onUseCheap:function(){
    	var that=this;
    	var selection = this.down('grid[title="订单商品"]').getView().getSelectionModel().getSelection();
    	if(selection.length==0){
    		Ext.MessageBox.show({
				title : '提示', msg : '请至少选择一个商品', buttons : Ext.Msg.OK
			});
    		return false;
    	};
    	
    	

        var messageBox = Ext.Msg.prompt('approver', '请输入优惠确认人code:', function (btn, text) {
            if (btn == 'ok') {
            	Ext.Array.each(selection,function(recod){
            		if (!recod.get('old_wholesale')) {
                        recod.set('old_wholesale', recod.get('price_wholesale'));
                        recod.set('old_simgle', recod.get('price_simgle'));
                    }
                    var proxy = new Ext.data.proxy.Ajax({
                        model: 'WJM.model.TEmployee', url: 'sale.do?action=checkApprover',

                        reader: new Ext.data.reader.Json({
                            type: 'json', messageProperty: 'msg'
                        }),

                        extraParams: {
                            confirm_code: text
                        },

                        writer: Ext.create('WJM.FormWriter')
                    });
                    proxy.read(new Ext.data.Operation({}), function (records, operation) {
                        if (records.success) {
                        	recod.set('agio_price', recod.get('old_wholesale'));
                        	recod.set('agio_price_old', recod.get('old_wholesale'));
                        	 // recod.set('agio', (1-Ext.util.Format.number(recod.get('agio_price')/recod.get("price_simgle"),"0.000"))*100);
                              

                        } else {
                            Ext.Msg.alert('提示', records.error);
                        }
                        that.calculateTotal(null,recod);
                    });            
                    that.getForm().findField('confirm_code').setValue(text);
            	});
            	

            }
        });
        // 将弹出框hack 为 密码弹框
        Ext.dom.Element.get(messageBox.down('textfield').getInputId()).dom.type = 'password';
        
     //   this.calculateTotal();  
        

    	
        

        
        
    },
    //批量使用零售价
    onUseExpensive:function(){
    	var selection = this.down('grid[title="订单商品"]').getView().getSelectionModel().getSelection();
    	if(selection.length==0){
    		Ext.MessageBox.show({
				title : '提示', msg : '请至少选择一个商品', buttons : Ext.Msg.OK
			});
    		return false;
    	};

    	Ext.Array.each(selection,function(recod){
            if (!recod.get('old_wholesale')) {
                recod.set('old_wholesale', recod.get('price_wholesale'));
                recod.set('old_simgle', recod.get('price_simgle'));
            }
            recod.set('agio_price', recod.get('old_simgle'));  
            recod.set('agio_price_old', recod.get('old_simgle'));	
            recod.set('agio',0);
           

    	});
    	 this.getForm().findField('confirm_code').setValue("");
        this.calculateTotal(true);
    },
    
    adminConfirm:function(callback,errorCallback,cancelFn){
    	var messageBox = Ext.Msg.prompt('approver', '请输入管理员确认码', function (btn, text) {
            if (btn == 'ok') {
            	var proxy = new Ext.data.proxy.Ajax({
                    model: 'WJM.model.TEmployee', url: 'sale.do?action=checkApprover',

                    reader: new Ext.data.reader.Json({
                        type: 'json', messageProperty: 'msg'
                    }),

                    extraParams: {
                        confirm_code: text
                    },

                    writer: Ext.create('WJM.FormWriter')
                });
                proxy.read(new Ext.data.Operation({}), function (records, operation) {
                    if (records.success) {
                    	callback(text);
                    } else {
                    	if(errorCallback)errorCallback(text);
                        Ext.Msg.alert('提示', records.error);
                    }
                });   
                
                
            }
            else if(btn == 'cancel'){
            	if(cancelFn)cancelFn();
            }
        });
    	Ext.dom.Element.get(messageBox.down('textfield').getInputId()).dom.type = 'password';
    },
    
    /**
     * 添加临时产品
     */
    onAddProductClick: function () {
    	var that = this;
    	var messageBox = Ext.Msg.prompt('approver', '请输入管理员确认码', function (btn, text) {
            if (btn == 'ok') {
            	var proxy = new Ext.data.proxy.Ajax({
                    model: 'WJM.model.TEmployee', url: 'sale.do?action=checkApprover',

                    reader: new Ext.data.reader.Json({
                        type: 'json', messageProperty: 'msg'
                    }),

                    extraParams: {
                        confirm_code: text
                    },

                    writer: Ext.create('WJM.FormWriter')
                });
                proxy.read(new Ext.data.Operation({}), function (records, operation) {
                    if (records.success) {
                    	var gridpanle = that.down('gridpanel');
                        var product = Ext.create('WJM.model.TProduct');
                        product.setId(-1);
                        product.set('num', null);
                        product.set('code', '999999');
                        product.set('product_id', '999999');
                        product.set('product_name', '');
                        product.set('price_simgle', null);
                        product.set('agio', 0);
                        gridpanle.getStore().add(product);
                        that.calculateTotal(true);
                        that.editor.startEdit(product, 3);
                    } else {
                        Ext.Msg.alert('提示', records.error);
                    }
                });   
                
            }
        });
    	Ext.dom.Element.get(messageBox.down('textfield').getInputId()).dom.type = 'password';

    },
    
    
    /**
     * 选择客户时
     *
     * @param opt
     */
    onCustomerLoad: function (opt) {
        var me = this;
        Ext.Array.each(opt.records, function (item) {
            me.setCustomer(item);
        });
    },
    /**
     * 列表进行编辑时，取消编辑
     */
    onBeforeEdit: function (editor, data, eOpts) {
    	if(arguments[1].field == 'agio'){
        	bfAgio = data.record.data.agio;
    		return doEdit();
    	}else{
    		return doEdit();
    	}
    	function doEdit(){
    		if(data.field == 'product_name' || data.field == 'price_simgle') {
	            if (data.record.getId() == -1) {
	                return true;
	            } else {
	                return false;
	            }
	        } else {
	            return true;
	        }
    	}
       
    },

    beforeDestroy: function () {
        Ext.destroy(this.dragDorp);
        Ext.data.StoreManager.unregister(this.gridStoreId);
        this.callParent();
    }

});