
(function () {
	
	var baseURL = document.querySelector('meta[name="vg.assets"]') ? document.querySelector('meta[name="vg.assets"]').content : 'https://widget.visa-gate.com/assets/';
	var preload = [
		baseURL + '/js/m3/depend.js',
		baseURL + '/js/m3/depend/router.js'
	];
	
	var loadScript = function (location, then) {
		var script = document.createElement('script');
		script.src = location;
		script.type = 'text/javascript';
		document.head.appendChild(script);
		
		script.addEventListener('load', then);
	};
	
	var init = function () {
		
		depend(['m3/depend/router'], function(router) {
			var location = document.querySelector('meta[name="_scss"]').getAttribute('content') || (baseURL + '/scss/_/js/');
			router.all().to(function(e) { return baseURL + '/js/' + e + '.js'; });
			router.equals('_scss').to( function() { return location + '_.scss.js'; });
			router.equals('collection').to( function() { return baseURL + '/js/m3/core/collection.js'; });
			router.equals('test').to(function () { return function () { depend(function () { console.log('t'); return new Date(); }); }})

			router.startsWith('_scss/').to(function(str) {
				return location + str.substring(6) + '.js';
			});
		});
		
		/*
		 * Start the user facing logic
		 */
		try {
			loadScript(baseURL + '/js/init.js', function () { 
				window.initVG();
				setTimeout(function () {
					depend(['collection'], function (e) {
						console.log('test');
						console.log(e); 
					})
				}, 5000);
			});
		} 
		catch (e) {
			console.log(e);
		}
		
	};
	
	var loadSynchronousNext = function () {
		if (preload.length) { loadScript(preload.shift(), loadSynchronousNext); }
		else { init(); }
	};
	
	loadSynchronousNext();
}());
