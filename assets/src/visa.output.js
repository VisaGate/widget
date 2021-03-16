
import ancestor from 'find-parent';

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


depend(['m3/core/lysine', 'pipe', 'm3/core/collection'], function (Lysine, pipe, collect) {
	
	var assetsURL = document.querySelector('meta[name="vg.assets"]').content;
	var language  = document.querySelector('meta[name="vg.language"]').content;
	
	/*
	 * The selection cache allows the system to persist the user's selection when
	 * the UI is refreshed. Lysine will reset the selection, since the data it receives
	 * does not indicate whether the selection was made.
	 * 
	 * Once the data has been redrawn, we will explicitly set the selection back 
	 * in place.
	 * 
	 * @type Array
	 */
	var selectionCache = [];
	
	return {
		init : function (parent, api) { 
			return new Promise(function (success, failure) {
				fetch(assetsURL + '/templates/' + language + '/visa.output.html')
					.then(response => response.text())
					.then(function (body) {
						parent.innerHTML = body;

						var view = new Lysine.view('visa-output');
						view.on('input', 'change', function (ev, vi) { 
							this.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector('input[name="selected"]').value = this.dataset.product;
						});

						/*
						 * Initialize the autocomplete system.
						 */

						var p = pipe(function (input, output) {
							
							var selected  = document.querySelectorAll('input.visa-result-radio:checked');
							selectionCache = [];
							
							for (var i = 0; i < selected.length; i++) {
								selectionCache.push([
									ancestor.withDataAttribute(selected[i], 'pid').getAttribute('data-pid'),
									ancestor.withDataAttribute(selected[i], 'sid').getAttribute('data-sid'),
									selected[i].getAttribute('data-product')
								]);
							}
							
							var passengers = input[0];
							
							try {
								
								/*
								 * This extracts the data from the selection cache and
								 * matches it against the data returned from the server.
								 * 
								 * Needs a proper refactoring, I think this was the first
								 * time I needed the letter L for an iterator.
								 */
								collect(selectionCache).each(function (selection) {
									collect(passengers).each(function (passenger) {
										if (passenger._pid !== selection[0]) { return; } 
										
										collect(passenger.stops).each(function (stop) {
											if (stop._sid !== selection[1]) { return } 
											
											collect(stop.candidates).each(function (candidate) {
												if (!candidate.documents[0].product) { return; } 
												candidate.documents[0].product.selected = candidate.documents[0].product.id === parseInt(selection[2]);
											});
										});
									});
								});
								
								view.setData({passengers: passengers});
								
							}catch (e) {console.log(e);}
						});
						
						success(p);
					})
					.catch(console.error);
			});
		}
	};
	
});
