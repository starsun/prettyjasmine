module('config');

config('requireBase', 'http://style.china.alibaba.com');
config('configB', '2');

test('test read and set config', function() {
	
	equal(config('requireBase'), 'http://style.china.alibaba.com');
	equal(config('configB'), '2');

	// set config in current context
	config('requireBase', 'http://style.china.alibaba.com/app/winport');
	equal(config('requireBase'), 'http://style.china.alibaba.com/app/winport');

	// clear config in current context 
	config('requireBase', null);
	equal(config('requireBase'), 'http://style.china.alibaba.com'); 

	// set and read in inner context
	(function() {
		config('requireBase', 'http://style.china.alibaba.com/app/workspace');
		equal(config('requireBase'), 'http://style.china.alibaba.com/app/workspace');
	})();

	equal(config('requireBase'), 'http://style.china.alibaba.com');
});
