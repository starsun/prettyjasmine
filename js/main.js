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
			promise = this.loadTests(urls); 			
			promise.done($.proxy(this, 'runTests'));
		} else {
			alert('请在url中指定testcase/testsuite\n' +
					'例: test.html?test=http://style.china.alibaba.com/app/winport/main-test/suite.js');
		}
	},

	getTestUrls: function() {
		var qs = $.trim((window.location.search || '').replace(/^\?+/, ''));
		if (!qs) {
			return;
		}

		qs = qs.split('&');
		for (var i = 0, len = qs.length; i < len; i++) {
			var m = qs[i].split('=', 2);
			if (m[0] === 'test' && m[1]) {
				return m[1].split(/,\s*/);	
			}
		}
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
