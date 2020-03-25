/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



depend(['m3/core/request', 'm3/core/collection', 'm3/promises/promise', 'pipe', 'autocomplete'], function (request, collect, Promise, pipe, autocomplete) {
	
	var assetsURL = document.querySelector('meta[name="vg.assets"]').content;
	var language  = document.querySelector('meta[name="vg.language"]').content;
	
	return {
		init : function (parent, api) { 
			return new Promise(function (success, failure) {
				request(assetsURL + '/templates/' + language + '/visa.output.export.html')
					.then(function (response) {
						parent.innerHTML = response;
						var payload = undefined;
						
						parent.querySelector("#pdf-export").addEventListener('click', function () {
							console.log('PDF Exporter received CALL');
							var button = this;
							button.classList.add('busy');
							button.classList.remove('idle');

							request(api + '/generate/pdf', payload, true)
							.then(function (response) {
								
								try {
									var url = window.URL.createObjectURL(response);
									window.open(url);
								} 
								catch (e) {
									if (window.navigator && window.navigator.msSaveOrOpenBlob) {
										window.navigator.msSaveOrOpenBlob(response, 'erstinformation.pdf');
									}
									else { throw e; }
								}
								
								button.classList.add('idle');
								button.classList.remove('busy');
							})
							.catch(console.error);
						});
						
						parent.querySelector("#pdf-email").addEventListener('click', function () {
							console.log('PDF Exporter received CALL');
							
							payload.email = document.getElementById('email-address').value;
							
							request(api + '/email/send', payload, true)
							.then(function (response) {
								alert('Email will be delivered in a few minutes')
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