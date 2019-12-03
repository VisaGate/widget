/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



depend(['m3/core/request', 'm3/core/collection', 'm3/promises/promise', 'pipe', 'autocomplete'], function (request, collect, Promise, pipe, autocomplete) {
	
	var assetsURL = document.querySelector('meta[name="vg.assets"]').content;
	
	return {
		init : function (parent, api) { 
			return new Promise(function (success, failure) {
				request(assetsURL + '/templates/visa.output.export.html')
					.then(function (response) {
						parent.innerHTML = response;
						var payload = undefined;
						
						parent.querySelector("#pdf-export").addEventListener('click', function () {
							console.log('PDF Exporter received CALL');

							request(api + '/generate/pdf', payload, true)
							.then(function (response) {
								var url = window.URL.createObjectURL(response);
								window.open(url);
							})
							.catch(console.error);
						});
						
						var p = pipe(function (input, output) { 	
						
							var people = input[0].people;
							var stops = input[0].stops;
							
							payload = {
								people: collect(people).each(function (e) { return {name: e.name, documents: [e.document]}; }).raw(),
								stops: collect(stops).each(function (e) { return { country: e.ISO, reason: e.reason }; }).raw()
							};
						});
						
						success(p);
					})
					.catch(console.error);
			});
		}
	};
	
});