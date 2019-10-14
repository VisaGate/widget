/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


depend(['m3/core/request', 'm3/core/lysine', 'm3/promises/promise', 'pipe', 'autocomplete'], function (request, Lysine, Promise, pipe, autocomplete) {
	
	var assetsURL = document.querySelector('meta[name="vg.assets"]').content;
	
	return {
		init : function (parent, api) { 
			return new Promise(function (success, failure) {
				request(assetsURL + '/templates/visa.output.html')
					.then(function (response) {
						parent.innerHTML = response;

						var view = new Lysine.view('visa-output');
						view.on('input', 'change', function (ev, vi) { 
							this.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector('input[name="selected"]').value = this.dataset.product;
						});

						/*
						 * Initialize the autocomplete system.
						 */

						var p = pipe(function (input, output) {
							console.log('Renderer activated');
							console.log({passengers: input[0]});
							
							var passengers = input[0];
							
							try {
								view.setData({passengers: passengers});
								
								/**
								 * This is necessary to default the inputs to selecting 
								 * the default element.
								 * 
								 * @type type
								 */
								var inputs = view.findAll('div[data-for="candidates"]:not([data-lysine-view]):first-child .product:not([data-lysine-view]) input[type="radio"]');
								for (var i = 0; i < inputs.length; i++) {
									inputs[i].checked = true;
								}
							}catch (e) {console.log(e);}
						});
						
						success(p);
					})
					.catch(console.error);
			});
		}
	};
	
});
