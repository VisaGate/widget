
import ancestor from 'find-parent';


depend(['m3/core/collection', 'pipe', 'm3/core/parent'], function (collect, pipe) {
	
	var assetsURL = document.querySelector('meta[name="vg.assets"]').content;
	var language  = document.querySelector('meta[name="vg.language"]').content;
	
	var makeSelection = function () {
		
		var selected  = document.querySelectorAll('input.visa-result-radio:checked');
		var selection = [];

		for (var i = 0; i < selected.length; i++) {
			selection.push(
				ancestor.withDataAttribute(selected[i], 'pid').getAttribute('data-pid') + '-' +
				ancestor.withDataAttribute(selected[i], 'sid').getAttribute('data-sid') + '-' + 
				selected[i].getAttribute('data-product')
			);
		}
		
		return selection;
	};
	
	return {
		init : function (parent, api) { 
			return new Promise(function (success, failure) {
				fetch(assetsURL + '/templates/' + language + '/visa.output.export.html')
					.then(response => response.text())
					.then(function (body) {
						parent.innerHTML = body;
						var payload = undefined;
						
						parent.querySelector("#pdf-export").addEventListener('click', function () {
							console.log('PDF Exporter received CALL');
							var button = this;
							button.classList.add('busy');
							button.classList.remove('idle');
							
							/*
							 * Add the selection to the request.
							 */
							payload.selection = makeSelection();

							fetch(api + '/generate/pdf', {
								method: 'POST',
								headers: { 'Content-type' : 'application/json' },
								body: JSON.stringify(payload)
							})
							.then(response => response.blob())
							.then(function (body) {
								
								try {
									var url = window.URL.createObjectURL(body);
									var a   = document.createElement('a');
									a.download = 'erstinformation.pdf';
									a.href = url;
									document.body.appendChild(a);
									a.click();
									setTimeout(function () { a.parentNode.removeChild(a); }, 200);
								} 
								catch (e) {
									if (window.navigator && window.navigator.msSaveOrOpenBlob) {
										window.navigator.msSaveOrOpenBlob(body, 'erstinformation.pdf');
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
							
							fetch(api + '/email/send', {
								method: 'POST',
								headers: { 'Content-type' : 'application/json' },
								body: JSON.stringify(payload)
							})
							.then(function (response) {
								alert('Email will be delivered in a few minutes')
							})
							.catch(console.error);
						});
						
						var p = pipe(function (input, output) { 	
						
							var people = input[0].people;
							var stops = input[0].stops;
							
							payload = {
								people: collect(people).each(function (e) { return {name: e.name, documents: [e.document], _pid : e._pid}; }).raw(),
								stops: collect(stops).each(function (e) { return { country: e.ISO, reason: e.reason, _sid : e._sid }; }).raw()
							};
						});
						
						success(p);
					})
					.catch(console.error);
			});
		}
	};
	
});