

depend(['m3/core/collection'], function (collect) {

	var option = function (ctx, k, v) {
		this.html = undefined;

		this.render = function (wrapper) {
			var opt = this.html = wrapper.appendChild(document.createElement('div'));
			opt.className = 'autocomplete-result';
			opt.value = k;
			opt.innerHTML = v;

			opt.addEventListener('click', function (e) {
				ctx.dummy.value = v;
				ctx.element.value = k;
				ctx.element.dispatchEvent(new Event('change', {'bubbles': false, 'cancelable': true}));
				e.stopPropagation();
				ctx.reset();
			}, false);
		};

		this.remove = function () {
			this.html.parentNode.removeChild(this.html);
		};
	};

	var Autocomplete = function (element, callable) {
		//Register listeners
		//Provide a callback
		//Provide mechanism to unregister the listeners
		var self = this;

		this.element = element;
		this.dummy = document.createElement('input');
		this.anchor  = document.createElement('div');
		this.drop  = document.createElement('div');
		this.callable = callable;
		this.rendered = undefined;

		this.dummy.type = 'text';
		this.dummy.className = 'autocomplete-input';
		this.anchor.className = 'autocomplete-results-anchor';
		this.drop.className = 'autocomplete-results autocomplete-hidden';

		element.parentNode.insertBefore(this.dummy,element);
		element.parentNode.insertBefore(this.anchor,element);
		this.anchor.appendChild(this.drop);

		this.draw = function (result) {
			var rss = [];

			if (result instanceof Array) {
				for (var i = 0; i < result.length; i++) {
					rss.push(new option(self, result[i], result[i]));
				}
			}
			else {
				for (var i in result) {
					if (!result.hasOwnProperty(i)) { continue; }
					rss.push(new option(self, i, result[i]));
				}
			}

			this.reset();
			
			collect(rss).each(function (e) { e.render(self.drop); });
			this.rendered = rss;
			this.drop.classList.remove('autocomplete-hidden');
		};

		this.reset = function () {
			this.rendered? collect(this.rendered).each(function (e) { e.remove(); }) : null;
			this.rendered = undefined;
			this.drop.classList.add('autocomplete-hidden');
		};

		this.dummy.addEventListener('keyup', function (e) {
			callable(this.value, function (result) {
				//Result is expected to be an object of keys and strings
				//Or an array
				self.draw(result);
			});
			
			self.element.value = '';
			self.element.dispatchEvent(new Event('change', {'bubbles': false, 'cancelable': true}));
			e.stopPropagation();
		}, false);

		this.dummy.addEventListener('click', function (e) {
			callable(this.value, function (result) {
				//Result is expected to be an object of keys and strings
				//Or an array
				self.draw(result);
			});

			e.stopPropagation();
		}, false);

		document.addEventListener('click', function () {
			self.reset();
		});
	};

	return function (e, cb) { return new Autocomplete(e, cb); };

});
