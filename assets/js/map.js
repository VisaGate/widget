
depend(['m3/core/lysine', 'pipe'], function (Lysine, pipe) {
	
	var assetsURL = document.querySelector('meta[name="vg.assets"]').content;
	var language  = document.querySelector('meta[name="vg.language"]').content;
	
	return {
		init : function (parent, api) {
			return new Promise(function (success, failure) {
				fetch(assetsURL + '/templates/' + language + '/map.html')
				.then(response => response.text())
				.then(function (body) {
					parent.innerHTML = body;
					
					var view = new Lysine.view('map');
					var mapimage = view.find('#mapimg');
					view.setData({stops: []});
					
					success(pipe(function (input, output) {
						var stops = JSON.parse(JSON.stringify(input[0]));
						var label = true;
						
						for (var i = 0; i < stops.length; i++) {
							
							var x = parseFloat(stops[i].lat);
							var y = parseFloat(stops[i].lon);

							var posx = (x + 180 - 30) / 320 * mapimage.clientWidth;
							var posy = (((y * -1) + 90 + 7) / 150) * mapimage.clientHeight;

							stops[i].offsetX = posx - 14 + 16;
							stops[i].offsetY = posy - 14 + 16;
							stops[i].label = label;
							
							label = false;
						}
						
						
						console.log(stops);
						view.setData({stops: stops});
						
						stops.length && setTimeout(function () {
							stops.push(stops[stops.length - 1]);
							view.setData({stops: stops});
						}, 1000);
						
					}));
				});
			});
		}
	};
});
