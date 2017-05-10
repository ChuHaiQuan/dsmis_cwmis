/**
 * 产品快速检索
 */
Ext.define('WJM.customer.CustomerQuickSearchForm', {
    extend: 'Ext.form.Panel',
    requires: [ 'WJM.model.TCustomer' ],
    keyMapTarget: null,
    keyMap: null,
    initComponent: function () {
        var me = this;

        Ext.apply(this, {
            bodyPadding: 10,
            items: [
                {
                    store: 'CustomerQuickStore', xtype: 'combobox', fieldLabel: '客户智能检索(ctrl+alt+c)', labelWidth: 100, name: 'shortName',
                    displayField: 'shortName', valueField: 'id', queryParam: 'shortName', forceSelection: true, hideTrigger: true,
                    queryDelay: 500, enableKeyEvents: true, minChars: 1, mode: 'remote', anchor: '100%', listeners: {
                    select: me.onCustomerSelect, scope: me
                }
                }
            ]
        });
        this.callParent();
        me.on("afterrender", this.initKeyMap, me);
    },

    /**
     * 选择返回
     *
     * @param combo
     * @param records
     */
    onCustomerSelect: function (combo, records) {
        combo.setValue('');
        var results = [];
        Ext.Array.each(records, function (item) {
            results.push(Ext.create('WJM.model.TCustomer', item.getData()));
        });
        this.fireEvent('onProductLoad', {
            records: results
        });
    },

    /**
     * 设置用户框高亮
     */
    setFocusCustomerQuickSearch: function () {
        console.log("customer");
        this.down('combobox').focus();
    },

    beforeDestroy: function () {
        Ext.destroy(this.keyMap);
        this.callParent();
    },

    initKeyMap: function () {
        var me = this;
        this.keyMap = new Ext.util.KeyMap({
            target: 'bodycss',
            key: 'c',
            fn: me.setFocusCustomerQuickSearch,
            scope: me,
            alt: true,
            ctrl: true,
            shift: false,
            eventName: "keydown"
        });
        this.keyMap.enable();
    },

    beforehide: function () {
        this.keyMap.disable();
        this.callParent();
    }
});