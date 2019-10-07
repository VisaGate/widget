/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


depend(['m3/core/request', 'm3/core/lysine', 'm3/promises/promise', 'pipe', 'autocomplete'], function (request, Lysine, Promise, pipe, autocomplete) {
	return {
		init : function (parent, api) { 
			return new Promise(function (success, failure) {
				request('assets/templates/regulations.output.html')
					.then(function (response) {
						parent.innerHTML = response;

						var view = new Lysine.view('regulation');
						view.setData({});
						
						view.on('.description', 'click', function (e, v) {
							var self = this;
							
							view.findAll('.description:not(.limited)').forEach(function (e) {
								if (e === self) { return; }
								if (e.clientHeight > 75) { e.classList.add('limited'); }
							});
								
							this.classList.toggle('limited');
						});

						/*
						 * Initialize the autocomplete system.
						 */

						var p = pipe(function (input, output) {
							console.log('Renderer activated');
							console.log(input);
							//view.setData({passengers: input[0]});
							try {
								view.setData(input[0]);
								
								view.findAll('.description').forEach(function (e) {
									if (e.clientHeight > 75) { e.classList.add('limited'); }
									else { e.classList.remove('limited'); }
								});
							}catch (e) {console.log(e);}
						});
						
						success(p);
					})
					.catch(console.error);
			});
		}
	};
	
});