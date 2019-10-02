

depend([], function () {
	
	var Input = function (ctx) {
		this.content = undefined;
		this.ctx = ctx;
	};
	
	Input.prototype = {
		notify : function (content) {
			this.content = content;
			this.ctx.notify();
		}
	};
	
	var Pipe = function (body) {
		this.inputs = [];
		this.outputs = [];
		this.body = body;
	};
	
	Pipe.prototype = {
		receive : function (inputs) {
			var l = [];
			for (var i = 0; i < inputs.length; i++) {
				var input = new Input(this);
				inputs[i].subscribe(input);
				l.push(input);
			}
			
			this.inputs = l;
		},
		
		subscribe : function (using) {
			this.outputs.push(using);
		},
		
		notify: function () {
			var l = [];
			var self = this;
			
			for (var i = 0; i < this.inputs.length; i++) {
				l.push(this.inputs[i].content);
			}
			
			this.body(l, function (e) { self.broadcast(e); });
		},
		
		wake: function () {
			
			var self = this;
			this.body(undefined, function (e) { self.broadcast(e); });
		},
		
		broadcast: function (value) {
			for (var i = 0; i < this.outputs.length; i++) {
				this.outputs[i].notify(value);
			}
		}
	};
	
	return function (e) { return new Pipe(e); };
});