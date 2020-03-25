

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
		
		/*
		 * Push data into the pipe.
		 * 
		 * This was included to ensure that pipes that are generally sources (like
		 * an input field) can be sent information to change their content on the 
		 * fly. This function should not be called regularly, if your application
		 * intends to regularly send updates to a pipe, it should be creating a pipe
		 * of it's own and feed data that way.
		 */
		feed: function (data) {
			var self = this;
			this.body(data, function (e) { self.broadcast(e); });
		},
		
		broadcast: function (value) {
			for (var i = 0; i < this.outputs.length; i++) {
				this.outputs[i].notify(value);
			}
		}
	};
	
	return function (e) { return new Pipe(e); };
});