

depend(['m3/core/collection'], function (collect) {

	var option = function (ctx, k, v) {
		this.html = undefined;

		this.render = function (wrapper) {
			var opt = this.html = wrapper.appendChild(document.createElement('div'));
			opt.value = k;
			opt.innerHTML = v;

			opt.addEventListener('click', function (e) {
				ctx.dummy.value = v;
				ctx.element.value = k;
				e.stopPropagation();
				ctx.reset();
			}, false);
		};

		this.remove = function () {
			this.html.parentNode.removeChild(this.html);
		}
	}

	var autocomplete = function (element, callable) {
		//Register listeners
		//Provide a callback
		//Provide mechanism to unregister the listeners
		var self = this;

		this.element = element;
		this.dummy = document.createElement('input');
		this.drop  = document.createElement('div');
		this.callable = callable;
		this.rendered = undefined;

		this.dummy.type = 'text';

		element.parentNode.insertBefore(this.dummy,element);
		element.parentNode.insertBefore(this.drop,element);

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

			this.reset()

			console.log(rss);
			collect(rss).each(function (e) { e.render(this.drop); });
			this.rendered = rss;
		}

		this.reset = function () {
			this.rendered? collect(this.rendered).each(function (e) { e.remove(); }) : null;
			this.rendered = undefined;
		}

		this.dummy.addEventListener('keyup', function (e) {
			callable(this.value, function (result) {
				//Result is expected to be an object of keys and strings
				//Or an array
				self.draw(result);
			});

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
		})
	};

	return autocomplete;

});
