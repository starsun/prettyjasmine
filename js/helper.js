/**
 * ¸¨Öú¹¤¾ßÀà
 * @author qijun.weiqj@alibaba-inc.com
 */
define(['jquery'], function($) {

return {
	join: function() {
		var url = arguments[0] || '';
		for (var i = 1, len = arguments.length; i < len; i++) {
			var right =	arguments[i] || '';
			url = url.replace(/\/+$/, '') + '/' + right.replace(/^\/+/, '');
		}
		return url;
	},

	unparam: function(search) {
		var map = {};
		search = (search || '').replace(/^\?/, '').split('&');
		$.each(search, function(index, part) {
			part = part.split('=', 2);
			map[$.trim(part[0])] = $.trim(part[1] || '');
		});
		return map;
	},

	url: function(url, search) {
		return url + (url.indexOf('?') === -1 ? '?' : '&') + search;
	},

	serial: function(fns) {
		var promise = $.when();	
		$.each(fns, function(i, fn) {
			promise = promise.pipe(fn);	
		});
		return promise;
	}
};

		
});
