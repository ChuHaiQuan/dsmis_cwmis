/**
 * 用于替代json方式<br>
 * FormAjaxWriter
 */
Ext.define('WJM.FormWriter', {
	extend : 'Ext.data.writer.Writer',

	writeRecords : function(request, data) {
		if (data.length > 1) {
			throw new Error('保存失败');
		}

		data = data[0];
		Ext.Object.each(data, function(key, value, myself) {
			request.params[key] = value;
		});
		return request;
	}
});