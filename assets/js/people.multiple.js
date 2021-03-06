/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


depend(['m3/core/lysine', 'pipe', 'autocomplete'], function (Lysine, pipe, autocomplete) {
	
	var assetsURL = document.querySelector('meta[name="vg.assets"]').content;
	var language  = document.querySelector('meta[name="vg.language"]').content;
	
	return {
		init : function (parent, api) { 
			return new Promise(function (success, failure) {
				fetch(assetsURL + '/templates/' + language + '/people.multiple.html')
					.then(response => response.text())
					.then(function (body) {
						parent.innerHTML = body;

						var view = new Lysine.view('multiple-people');
						view.setData({passengers: []});

						var ac = autocomplete(view.find('.autocomplete-passport'), function (input, output, entry) {
							fetch(api + '/search/find/document/' + input + '.json')
							.then(response => response.json())
							.then(function (r) {
								var ret = [];
								var c = 0;

								for (var i in r) {
									if (!r.hasOwnProperty(i)) { continue; }
									if (r[i].type !== 'passport') { continue; }
									if (c > 5) { continue; }
									
									var display = r[i].name.match(/Pass \([^\)]+\)/)? r[i].name.substr(6, r[i].name.length - 7) : r[i].name;
									
									ret.push(entry(display, r[i].resource, {name: display }));
									c++;
								}
								output(ret);
							})
							.catch(console.log);
						});
						
						view.find('.autocomplete-passport').addEventListener('change', function () {
							view.find('.button').classList[this.value? 'remove' : 'add']('disabled');
						});

						/*
						 * Initialize the autocomplete system.
						 */

						var p = pipe(function (input, output) {
							console.log('Woke up input pipe for people');
							view.on('#add-person', 'click', function () {
								var input = view.find('.autocomplete-passport');
								var data = view.get('passengers');

								if (input.value === '') { return; }
								
								/*
								 * The _PID argument is added as a random id, it just
								 * helps applications keeping track of multiple passengers
								 * in a single request. The string can be ommitted, it just
								 * sometimes helps having it to refer to a passenger.
								 * 
								 * It is entirely optional, and just intended to make
								 * life easier for application developers.
								 */
								data.push({
									name: view.find('#passenger-name').value || 'Passagier', 
									_pid : Math.random().toString(36).substring(7),
									document: input.value, 
									flag: api + '/image/flag/' + input.value.substr(1), 
									country: input.dataset.name
								});
								
								view.set('passengers', data);

								var s = view.get('passengers').slice(0);
								output(s);

								ac.empty();
								view.find('#passenger-name').value = '';
								
								view.find('#passenger-form').style.display = 'none';
								view.find('#passenger-new').style.display = 'block';
							});
							
							view.on('#passenger-new', 'click', function () {
								view.find('#passenger-form').style.display = 'block';
								view.find('#passenger-new').style.display = 'none';
							})

							view.sub('passengers').on('.remove', 'click', function (e, v) {
								v.destroy();
								var s = view.get('passengers').slice(0);
								output(s);
								
								if (s.length === 0) {
									view.find('#passenger-form').style.display = 'block';
									view.find('#passenger-new').style.display = 'none';
								}
							});
							
							view.sub('passengers').on('input', 'focusout', function (e, v) {
								var s = view.get('passengers').slice(0);
								output(s);
							});
						});

						p.wake();
						success(p);
					})
					.catch(console.error);
			});
		}
	};
	
});
