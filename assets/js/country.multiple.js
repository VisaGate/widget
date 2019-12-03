/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


depend(['m3/core/request', 'm3/core/lysine', 'pipe', 'autocomplete', 'm3/promises/promise'], function (request, Lysine, pipe, autocomplete, Promise) {
	
	var assetsURL = document.querySelector('meta[name="vg.assets"]').content;
	
	return {
		init : function (parent, api) {
			return new Promise(function (success, error) {
				request(assetsURL + '/templates/country.multiple.html')
				.then(function (response) {
					parent.innerHTML = response;

					var view = new Lysine.view('country-multiple');
					view.setData({stops : []});

					/*
					 * Initialize the autocomplete system.
					 */
					var ac = autocomplete(view.find('.autocomplete-target'), function (input, output, entry) {
						request(api + '/search/find/country/' + input + '.json')
						.then(JSON.parse)
						.then(function (r) {
							var ret = [];
							var c = 0;

							for (var i in r) {
								if (!r.hasOwnProperty(i)) { continue; }
								if (c > 5) { continue; }
								ret.push(entry(r[i].name, r[i].resource, {lon: r[i].coordinates[0], lat: r[i].coordinates[1], name: r[i].name }));
								c++;
							}
							output(ret);
						})
						.catch(console.log);
					});

					var p = pipe(function (input, output) {
						console.log('Woke up input pipe');
						view.on('#commit-stop', 'click', function (el, e) {
							var input = view.find('.autocomplete-target');
							var data = view.get('stops');
							
							if (input.value === '') { return; }

							data.push({name: input.dataset.name, ISO: input.value, lat: input.dataset.lat, lon: input.dataset.lon, reason: view.find('#reason').value })
							view.set('stops', data);

							var s = view.get('stops').slice(0);
							output(s);

							ac.empty();
							el.preventDefault();
							
							view.find('#target-country-form').style.display = 'none';
							view.find('#add-stop').style.display = 'block';
						});
						
						view.find('#add-stop').addEventListener('click', function () {
							view.find('#target-country-form').style.display = 'block';
							view.find('#add-stop').style.display = 'none';
						});
						
						view.find('.autocomplete-target').addEventListener('change', function () {
							view.find('#commit-stop').classList[view.find('.autocomplete-target').value? 'remove' : 'add']('disabled');
						});

						view.sub('stops').on('.remove', 'click', function (e, v) {
							v.destroy();
						});
					});

					p.wake();
					success(p);
				})
				.catch(console.error);
			})
		}
	};
});
