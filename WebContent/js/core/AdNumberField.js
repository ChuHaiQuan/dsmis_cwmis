Ext.define('Ext.ux.form.field.AdNumberField', {
	extend : 'Ext.form.field.Number',

	alias : [ 'widget.adnumberfield' ],

	format : '0.00',

	valueToRaw : function(value) {
		var me = this, decimalSeparator = me.decimalSeparator;
		value = me.parseValue(value);
		value = me.fixPrecision(value);
		value = Ext.isNumber(value) ? value : parseFloat(String(value).replace(decimalSeparator, '.'));
		if (this.format) {
			value = Ext.util.Format.number(value, this.format);
		}
		value = isNaN(value) ? '' : String(value).replace('.', decimalSeparator);
		return value;
	}

});
