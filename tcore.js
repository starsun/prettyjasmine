/**
 * 测试公用方法
 * @author qijun.weiqj
 */
(function() {
 
var extend = function(des, src) {
	for (var k in src || {}) {
		des[k] = src[k];
	}
};


var globalCache = {},
	cacheField = 'tcoreconfig' + (new Date()).getTime();

var config = function(name, value) {
	if (Object.prototype.toString.call(name) === '[object Object]') {
		for (var k in name) {
			config(k, name[k]);
		}
		return;
	}

	var o = arguments.callee.caller,
		cache = null;
	
	if (value !== undefined) { // set
		cache = o ? o[cacheField] : globalCache;
		if (!cache) {
			cache = o[cacheField] = {};  
		}
		cache[name] = value;
		return value;
	}
	
	// get
	while (o) {
		cache = o[cacheField];
		if (cache && cache[name] !== null) {
			break;  
		}
		o = o.caller;
	}
	return (cache || globalCache)[name];
}


var require = function(url) {
		
};


extend(window, {
	config: config,
	require: require
});

  
})();
