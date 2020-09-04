
(function () {
	
	var baseURL = document.querySelector('meta[name="vg.assets"]').content;
	var language  = document.querySelector('meta[name="vg.language"]').content;
	
	var loadCSS = function (location) {
		var stylesheet = document.createElement('link');
		stylesheet.href = location;
		stylesheet.type = 'text/css';
		stylesheet.rel = 'stylesheet';
		document.head.appendChild(stylesheet);
	};
	
	var loadScaffolding = function (then) {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', baseURL + '/templates/' + language + '/scaffolding.html');
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4 && xhr.status === 200) {
				document.getElementById('visa-gate-widget').innerHTML = xhr.responseText;
				then();
			}
		}
		xhr.send();
	};
	
	var init = function () {
		depend(
			['country.multiple', 'people.multiple', 'visa.output', 'visa.output.export', 'regulations.output', 'map', 'pipe', 'm3/promises/promise', 'm3/core/request', 'm3/core/collection'], 
			function (target, people, visa, modExport, regout, map, pipe, Promise, request, collect) {

			var api = document.querySelector('meta[name="vg.api"]') ? document.querySelector('meta[name="vg.api"]').content : 'https://discovery.visa-gate.com/';;
			var targets = undefined;
			var visaOut = undefined;
			var peopleP = undefined;
			var regoutP = undefined;
			var mapoutP = undefined;
			var exportP = undefined;

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
						document.getElementById('export').style.display = 'block';
					}
					else {
						document.getElementById('output').style.display = 'none';
						document.getElementById('export').style.display = 'none';
					}

					if (_ret.stops.length > 0 && _ret.people.length > 0) {
						document.getElementById('country-error').style.display = 'none';
						document.getElementById('passenger-error').style.display = 'none';
						document.getElementById('add-stop').style.display = 'block';
						document.getElementById('step2').style.display = 'block';
					}
					else if (_ret.people.length > 0 && _ret.stops.length === 0) {
						document.getElementById('add-stop').style.display = 'none';
						document.getElementById('country-error').style.display = 'block';
						document.getElementById('passenger-error').style.display = 'none';
						document.getElementById('step2').style.display = 'block';
						document.getElementById('target-country-form').style.display = 'block';
					}
					else {
						document.getElementById('country-error').style.display = 'none';
						document.getElementById('passenger-error').style.display = 'block';
						document.getElementById('add-stop').style.display = 'none';
						document.getElementById('step2').style.display = 'none';
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
						console.log(payload);
						for (var i = 0; i < payload.payload.length; i++) {
							payload.payload[i]._pid = people[i]._pid;
							for (var j = 0; j < payload.payload[i].stops.length; j++) {
								payload.payload[i].stops[j]._sid = stops[j]._sid;
							}
						}
						output(payload.payload);
					})
					.catch(console.error);
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

				validation.receive([targets, peopleP]);
				apiCall.receive([validation]);
				exportP.receive([validation]);
				visaOut.receive([apiCall]);
				regulations.receive([targets]);
				regoutP.receive([regulations]);
				mapoutP.receive([targets]);

				console.log([validation, apiCall, visaOut, regulations, regoutP, mapoutP]);
			};

			people.init(document.getElementById('passports'), api).then(function (p) { peopleP = p; })
				/*
				 * Load the destination module. This allows the user to select which
				 * destinations they wish to target. This can be removed if the application
				 * intents to feed the data from a different source (for example flight
				 * reservation information)
				 */
				.then(function () { return target.init(document.getElementById('destination'), api); }).then(function (p) { targets = p; })
				.then(function () { return visa.init(document.getElementById('output'), api); }).then(function (p) { visaOut = p; })
				.then(function () { return map.init(document.getElementById('map'), api); }).then(function (p) { mapoutP = p; })
				.then(function () { return regout.init(document.getElementById('regulations'), api); }).then(function (p) { regoutP = p; })
				.then(function () { return modExport.init(document.getElementById('export'), 'https://pdf.stage.visa-gate.com/'); }).then(function (p) { exportP = p; })
				.then(function () { main(); console.log('Success'); });
	 
			loadCSS(baseURL + '/css/app.css');
			
			/*
			 * Update the copyright year. I personally do HATE noticing that I forgot 
			 * updating the copyright year and feel quite ashamed when I do so.
			 * 
			 * Because of this, I'll automate it here.
			 */
			try {
				var year = document.querySelectorAll('.current-year');
				collect(year).each(function (e) { e.textContent = (new Date()).getFullYear(); })
			}
			catch (e) {
				console.error('Failed to update the copyright year, got error' + e);
			}
		});
		
	};
	
	window.initVG = function () { loadScaffolding(init); }
}());
