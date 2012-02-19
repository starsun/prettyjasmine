(function() {

var $ = jQuery;
window.$ = window.jQuery = undefined;

var TCore = {
	init: function() {
		this._proxyDescribe();
	},
  
	run: function() {
		var self = this;
		this._loadSpec(function() {
			self._loadRequires(function() {
				self._runDescribe();  
				self._runJasmine();
			});
		});
	},

	require: function(src) {
		this._requires.push(src);
	},

	_loadSpec: function(callback) {
		var url = /^\?(.*)$/.exec(window.location.search)[1];
		$.ajax(url, { 
			dataType: 'script', 
			cache: false,
			success: callback
		});
	},

	_proxyDescribe: function() {
		var self = this;
		this._describe = window.describe;		 
		window.describe = function() {
			self._describes.push(arguments);		 
		};
	},

	_loadRequires: function(callback) {
		var defer = $.when({});
		$.each(this._requires, function(index, require) {
			defer = defer.pipe(function() {
			  return $.ajax(require, { dataType: 'script', cache: false });
			});
		});
		defer.done(callback);
	},

	_runDescribe: function() {
		window.describe = this._describe;
		$.each(this._describes, function(index, desc) {
			window.describe.apply(window, desc);	
		});
	},

	_runJasmine: function() {
		var reporter = new jasmine.TrivialReporter(),
			env = jasmine.getEnv();

		env.updateInterval = 1000;
		env.addReporter(reporter);
		env.specFilter = function(spec) {
			return reporter.specFilter(spec);
		};

		env.execute();
	},

	_requires: [],
	_describes: []

};
	

$.extend(window, TCore);
TCore.init();
$($.proxy(TCore, 'run'));
  

})();
