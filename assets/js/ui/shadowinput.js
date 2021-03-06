/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


depend('ui/shadowinput', function () {
	
	const KEY_ENTER = 13;
	const KEY_TAB   =  9;
	const KEY_ESC   = 27;
	const KEY_UP    = 38;
	const KEY_DOWN  = 40;
	
	var extend = function (obj, withObj) {
		for (var i in withObj) {
			if (!withObj.hasOwnProperty(i)) { continue; }
			obj[i] = withObj[i];
		}
	};
	
	var shadow = function (placeholder, callback) {
		var ctx = this;
		
		this.outer  = document.createElement('div');
		this.value  = document.createElement('input');
		this.inner  = document.createElement('div');
		this.shadow = document.createElement('span');
		this.placeholder = placeholder;
		
		this.outer.appendChild(this.inner);
		this.outer.appendChild(this.shadow);
		this.outer.appendChild(this.value);
		ctx.shadow.innerHTML = placeholder;
		
		this.onapply = function () { callback(ctx.inner.textContent, function (txt) { ctx.shadow.innerHTML = txt; }); };
		
		ctx.outer.className = 'shadow-input outer';
		ctx.inner.className = 'shadow-input inner';
		ctx.shadow.className = 'shadow-input shadow';
		
		extend(ctx.outer.style, {
			display: 'inline-block',
			cursor: 'pointer',
			whiteSpace: 'nowrap',
			overflow: 'hidden'
		});
		
		extend(ctx.inner.style, {
			display: 'inline-block',
			outline: 'none'
		});
		
		this.value.type = 'hidden';
		this.inner.contentEditable = true;
		
		this.outer.addEventListener('click', function () {
			
			var range = document.createRange();
			var sel = document.getSelection();
			
			range.setStart(ctx.inner.firstChild || ctx.inner, (ctx.inner.firstChild || ctx.inner).textContent.length);
			range.setEnd(ctx.inner.firstChild || ctx.inner, (ctx.inner.firstChild || ctx.inner).textContent.length);
			sel.removeAllRanges();
			sel.addRange(range);
		});
		
		this.inner.addEventListener('input', function () {
			if (this.textContent.slice(-1) === ctx.shadow.textContent.substr(0, 1)) {
				ctx.shadow.innerHTML = ctx.shadow.textContent.substr(1);
			}
			
			callback(this.textContent, function (txt) { ctx.shadow.innerHTML = txt; });
		});
		
		document.addEventListener('selectionchange', function () {
			var selection = window.getSelection();
			var range = selection.getRangeAt(0);
			console.log(range);
		})
		
		this.inner.addEventListener('blur', function () {
			if (this.textContent === '') { ctx.shadow.innerHTML = placeholder; }
		});
	};
	
	shadow.prototype = {
		accept : function () {
			this.inner.innerHTML+= this.shadow.textContent;
			this.inner.focus();
		},
		
		set : function (to) {
			var div = document.createElement('div');
			div.innerHTML = to;
			
			var range = document.createRange();
			var sel = document.getSelection();
			this.inner.innerHTML = div.textContent;
			
			if (this.inner.firstChild) {
				range.setStart(this.inner.firstChild, this.inner.firstChild.length);
				range.setEnd(this.inner.firstChild, this.inner.firstChild.length);
				sel.removeAllRanges();
				sel.addRange(range);
			}
			
			if (this.inner.textContent === '') { this.shadow.innerHTML = this.placeholder; }
		},
		
		suggest : function (txt) {
			this.shadow.innerHTML = txt;
		}
	};
	
	return shadow;
	
});
