
(function () {
	
	var baseURL = document.querySelector('meta[name="vg.assets"]').content;
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
	
	var loadCSS = function (location) {
		var stylesheet = document.createElement('link');
		stylesheet.href = location;
		stylesheet.type = 'text/css';
		stylesheet.rel = 'stylesheet';
		document.head.appendChild(stylesheet);
	};
	
	var loadScaffolding = function (then) {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', baseURL + '/templates/scaffolding.html');
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4 && xhr.status === 200) {
				document.getElementById('visa-gate-widget').innerHTML = xhr.responseText;
				then();
			}
		}
		xhr.send();
	};
	
	var init = function () {
		
		depend(['m3/depend/router'], function(router) {
			var location = document.querySelector('meta[name="_scss"]').getAttribute('content') || baseURL + '/scss/_/js/';
			router.all().to(function(e) { return baseURL + '/js/' + e + '.js'; });
			router.equals('_scss').to( function() { return location + '_.scss.js'; });

			router.startsWith('_scss/').to(function(str) {
				return location + str.substring(6) + '.js';
			});
		});
		depend(
			['country.multiple', 'people.multiple', 'visa.output', 'regulations.output', 'map', 'pipe', 'm3/promises/promise', 'm3/core/request', 'm3/core/collection'], 
			function (target, people, visa, regout, map, pipe, Promise, request, collect) {

			var api = document.querySelector('meta[name="vg.api"]').content;
			var targets = undefined;
			var visaOut = undefined;
			var peopleP = undefined;
			var regoutP = undefined;
			var mapoutP = undefined;

			var main = function () {

				var validation = pipe(function (input, output) { 

					var _ret = {people : [], stops: []};

					if (input[0]) for (var i = 0; i < input[0].length; i++) {
						var item = input[0][i];

						if (item === undefined || !item.ISO || item.ISO === '') {
							console.log('Input is empty');
						}

						else {
							_ret.stops.push(item);
						}
					}

					if(input[1]) for (var i = 0; i < input[1].length; i++) {
						var item = input[1][i];

						if (item === undefined || !item.document || item.document === '') {
							console.log('Input is empty');
						}

						else {
							_ret.people.push(item);
						}
					}

					if (_ret.people.length > 0 && _ret.stops.length > 0) {
						output(_ret);
						document.getElementById('output').style.display = 'block';
					}
					else {
						document.getElementById('output').style.display = 'none';
					}

					if (_ret.stops.length > 0) {
						document.getElementById('country-error').style.display = 'none';
						document.getElementById('add-stop').style.display = 'block';
					}
					else {
						document.getElementById('add-stop').style.display = 'none';
						document.getElementById('country-error').style.display = 'block';
					}
				});

				var apiCall = pipe(function (input, output) {
					console.log('API CALL');
					console.log(input);
					var people = input[0].people;
					var stops = input[0].stops;



					request(api + '/itinerary/test.json', {
						people: collect(people).each(function (e) { return {name: e.name, documents: [e.document]}; }).raw(),
						stops: collect(stops).each(function (e) { return { country: e.ISO, reason: e.reason }; }).raw()
					})
					.then(JSON.parse)
					.then(function (payload) {
						output(payload.payload);
					});
				});

				var regulations = pipe(function (input, output) {
					console.log('REGULATIONS CALL');
					console.log(input);
					var stops = input[0];
					var isos = collect(stops).each(function (e) { return e.ISO; } ).raw();

					if (isos.length === 0) { 
						output({});
						return; 
					}

					request(api + '/country/regulations/' + isos.join(':') + '.json')
						.then(JSON.parse)
						.then(function (payload) {
							output(payload.payload);
						});
				});

				var output = pipe(function (input, output) {
					console.log(input);
				});

				validation.receive([targets, peopleP]);
				apiCall.receive([validation]);
				visaOut.receive([apiCall]);
				regulations.receive([targets]);
				regoutP.receive([regulations]);
				mapoutP.receive([targets]);

				console.log([validation, apiCall, visaOut, regulations, regoutP, mapoutP]);
			};

			people.init(document.getElementById('passports'), api)
				.then(function (p) { peopleP = p; return target.init(document.getElementById('destination'), api); })
				.then(function (p) { targets = p; return visa.init(document.getElementById('output'), api); })
				.then(function (p) { visaOut = p; return map.init(document.getElementById('map'), api); })
				.then(function (p) { mapoutP = p; return regout.init(document.getElementById('regulations'), api); })
				.then(function (p) { regoutP = p; main(); console.log('Success'); });
	 
			loadCSS(baseURL + '/css/app.css');
		});
		
	};
	
	var loadSynchronousNext = function () {
		if (preload.length) { loadScript(preload.shift(), loadSynchronousNext); }
		else { loadScaffolding(init); }
	};
	
	loadSynchronousNext();
}());