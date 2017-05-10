/**
 * 产品快速检索
 */
Ext.define('WJM.product.ProductQuickSearchForm', {
    extend: 'Ext.form.Panel',
    requires: [ 'WJM.model.TProduct' ],
    keyMapTarget: null,
    keyMap: null,
    initComponent: function () {
        var me = this;
        Ext.apply(this, {
            bodyPadding: 10,
            items: [
                {
                    store: 'ProductQuickStore', xtype: 'combobox', fieldLabel: '产品智能检索(ctrl+alt+p)', labelWidth: 100, name: 'product_quick',
                    displayField: 'product_name_full', valueField: 'id', queryParam: 'product_quick', forceSelection: true, hideTrigger: true,
                    queryDelay: 500, enableKeyEvents: true, minChars: 1, mode: 'remote', anchor: '100%', listeners: {
                    select: me.onProductSelect, scope: me
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
    onProductSelect: function (combo, records) {
        combo.setValue('');
        var results = [];
        Ext.Array.each(records, function (item) {
            results.push(Ext.create('WJM.model.TProduct', item.getData()));
        });
        this.fireEvent('onProductLoad', {
            records: results
        });
    },
    /**
     * 设置产品框高亮
     */
    setFocusProductQuickSearch: function () {
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
            key: 'p',
            fn: me.setFocusProductQuickSearch,
            scope: me,
            eventName: "keydown",
            alt: true,
            ctrl: true,
            shift: false
        });
        this.keyMap.enable();
    },
    beforehide: function () {
        this.keyMap.disable();
        this.callParent();
    }
})
;