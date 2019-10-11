

depend(['m3/core/collection'], function (collect) {

	var Entry = function (key, value, meta) {
		this.key = key;
		this.value = value;
		this.meta = meta;
	};

	var Option = function (ctx, entry) {
		this.html = undefined;
		this.entry = entry;

		this.render = function (wrapper) {
			var opt = this.html = wrapper.appendChild(document.createElement('div'));
			opt.className = 'autocomplete-result';
			opt.value = entry.key;
			opt.innerHTML = entry.value;
			Object.assign(opt.dataset, entry.meta);

			opt.addEventListener('click', function (e) {
				ctx.dummy.value = entry.value;
				ctx.element.value = entry.key;
				Object.assign(ctx.element.dataset, entry.meta);
				ctx.element.dispatchEvent(new Event('change', {'bubbles': false, 'cancelable': true}));
				e.stopPropagation();
				ctx.reset();
			}, false);
		};

		this.remove = function () {
			this.html.parentNode.removeChild(this.html);
		};
		
		this.focus = function () {
			this.html.classList.add('active');
		};
		
		this.blur = function () {
			this.html.classList.remove('active');
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
		this.active = undefined;

		this.dummy.type = 'text';
		this.dummy.className = 'autocomplete-input';
		this.dummy.placeholder = this.element.getAttribute('data-placeholder');
		this.anchor.className = 'autocomplete-results-anchor';
		this.drop.className = 'autocomplete-results autocomplete-hidden';

		element.parentNode.insertBefore(this.dummy,element);
		element.parentNode.insertBefore(this.anchor,element);
		this.anchor.appendChild(this.drop);

		this.draw = function (result) {
			
			var rss = collect(result).each(function (e) {
				return new Option(self, e instanceof Entry? e : new Entry(e, e, {}));
			});
			
			this.reset();
			
			rss.each(function (e) { e.render(self.drop); });
			this.rendered = rss;
			this.active = 0;
			this.rendered.get(this.active).focus();
			
			this.drop.classList.remove('autocomplete-hidden');
		};

		this.reset = function () {
			this.rendered? this.rendered.each(function (e) { e.remove(); }) : null;
			this.rendered = undefined;
			this.drop.classList.add('autocomplete-hidden');
		};
		
		this.empty = function () {
			this.element.value = '';
			this.dummy.value = '';
			this.reset();
			this.element.dispatchEvent(new Event('change', {'bubbles': false, 'cancelable': true}));
		};

		this.dummy.addEventListener('focus', function (e) {
			this.select();
		}, false);

		this.dummy.addEventListener('keydown', function (e) {
			if (e.keyCode === 13 || e.keyCode === 9) {
				e.stopPropagation();
				e.preventDefault();
			}
		}, false);
		
		this.dummy.addEventListener('keyup', function (e) {
			
			if (e.keyCode === 40 && self.rendered) {
				if (self.rendered.length() > self.active + 1) {
					self.rendered.get(self.active).blur();
					self.active++;
					self.rendered.get(self.active).focus();
				}
				e.stopPropagation();
				e.preventDefault();
				return;
			}
			
			if (e.keyCode === 38 && self.rendered && self.active> 0) {
				self.rendered.get(self.active).blur();
				self.active--;
				self.rendered.get(self.active).focus();
				e.stopPropagation();
				e.preventDefault();
				return;
			}
			
			if (e.keyCode === 13 || e.keyCode === 9) {
				if (self.rendered) {
					var entry = self.rendered.get(self.active);
					self.dummy.value = entry.entry.value;
					self.element.value = entry.entry.key;
					Object.assign(self.element.dataset, entry.entry.meta);
					self.element.dispatchEvent(new Event('change', {'bubbles': false, 'cancelable': true}));
					e.stopPropagation();
					self.reset();
				}
				e.stopPropagation();
				e.preventDefault();
				return;
			}
			
			callable(this.value, function (result) {
				//Result is expected to be an object of keys and strings
				//Or an array
				self.draw(result);
			}, function (v, k, m) { return new Entry(k, v, m); });
			
			if (self.element.value !== '') {
				self.element.value = '';
				self.element.dispatchEvent(new Event('change', {'bubbles': false, 'cancelable': true}));
			}
			
			e.stopPropagation();
		}, false);

		this.dummy.addEventListener('click', function (e) {
			callable(this.value, function (result) {
				//Result is expected to be an object of keys and strings
				//Or an array
				self.draw(result);
			}, function (v, k, m) { return new Entry(k, v, m); });

			e.stopPropagation();
		}, false);

		document.addEventListener('click', function () {
			self.reset();
		});
	};

	return function (e, cb) { return new Autocomplete(e, cb); };

});
