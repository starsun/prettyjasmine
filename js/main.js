/**
 * 测试运行入口 
 * @author qijun.weiqj@alibaba-inc.com
 */
require(['jquery'], function($) {

$.noConflict(true);

var Main = {

	init: function() {
		var urls = this.getTestUrls(),
			promise = null;
		if (urls) {
			this.setConfig();
			promise = this.loadTests(urls); 			
			promise.done($.proxy(this, 'runTests'));
		} else {
			alert('请在url中指定testcase/testsuite\n' +
					'例: test.html?test=http://style.china.alibaba.com/app/winport/main-test/suite.js');
		}
	},

	setConfig: function() {
		base = this.getParam('base');
		base && require.config({ baseUrl: base });
	},

	getTestUrls: function() {
		var url = this.getParam('test');
		return url ? url.split(/,/) : null;
	},

	getParam: function(name) {
		var params = this.params,
			qs;
		if (!params) {
			params = this.params = {};

			qs = $.trim((window.location.search || '').replace(/^\?+/, ''));
			if (!qs) {
				return;	
			}
			
			$.each(qs.split('&'), function(index, part) {
				part = part.split('=', 2);
				if (part.length === 2) {
					params[part[0]] = part[1];	
				}
			});
		}
		return params[name];
	},

	loadTests: function(urls) {
		var promise = $.when();
		$.each(urls, function(index, url) {
			promise = promise.pipe(function() {
				var d = $.Deferred();	
				require([url], d.resolve)
				return d;
			});
		});
		return promise.promise();
	},

	runTests: function() {
		var reporter = new jasmine.TrivialReporter(),
			env = jasmine.getEnv();

		env.updateInterval = 1000;
		env.addReporter(reporter);
		env.specFilter = function(spec) {
			return reporter.specFilter(spec);
		};

		env.execute();
	}
	
};

$($.proxy(Main, 'init'));

});
