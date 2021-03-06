var ViewUtils = {
	
	/*getColor: function(du, r0, g0, b0) {
		var rgb = (1 + du) * Math.pow(256, 3);
		return {
			r: (rgb >> 16) & 255,
			g: (rgb >> 8) & 255,
			b: rgb & 255
		};
	},*/
	
	formatColor: function(color) {
		return "rgb(" + color.r + "," + color.g + "," + color.b + ")";
	},

	strategyBoxes: [],

	clearStrategies: function(id) {
		if (id) {
			if (ViewUtils.strategyBoxes[id]) {
				for (var i = 0; i < ViewUtils.strategyBoxes[id].length; i++) {
					ViewUtils.strategyBoxes[id][i].parentNode.removeChild(ViewUtils.strategyBoxes[id][i]);
				}
			}
			ViewUtils.strategyBoxes[id] = [];
		}
	},
	
	addStrategy: function(id, content) {
		if (id) {
			ViewUtils.strategyBoxes[id].push(content);			
		}
	},
		
	bindStrategiesToCombobox: function(id, combobox, strategies, text, onchange) {
		ViewUtils.clearStrategies(id);
		for (var strategy in strategies) {
			var opt = document.createElement("option");
			opt.text = text(strategies[strategy]);
			opt.value = strategy;
			combobox.options.add(opt);
			ViewUtils.addStrategy(id, opt);
		}
		combobox.onchange = function() {
			var strategy = strategies[combobox.value];
			onchange(strategy);
		};
	},
	
	bindStrategiesToButtonList: function(id, div, strategies, text, onclick, image) {
		ViewUtils.clearStrategies(id);
		strategies = ViewUtils.arrayToObject(strategies);
		for (var strategy in strategies) {
			var a = document.createElement("a");
			a.href = "#";
			a.className = "buttonLink";
			a.style.cssFloat = "left";
			a.onclick = (function(s) {
				return function() {
					onclick(s);
				}
			})(strategies[strategy]);
			div.appendChild(a);
			var img = document.createElement("img");
			img.src = image ? image(strategies[strategy]) : "_assets/pics/ghost.gif";
			img.style.height = "16px";
			if (!image) {
				img.style.width = "16px";
			}
			a.appendChild(img);
			a.innerHTML += text(strategies[strategy]);
			ViewUtils.addStrategy(id, a);
		}
	},
	
	bindStrategiesToRadioList: function(id, div, strategies, content, onchange) {
		ViewUtils.clearStrategies(id);
		var groupName = ViewUtils.makeObjectId();
		for (var strategy in strategies) {
			var radio = document.createElement("input");
			radio.setAttribute("type", "radio");
			radio.setAttribute("name", groupName);
			radio.setAttribute("value", ViewUtils.makeObjectId());
			radio.onchange = (function(s) {
				return function() {
					onchange(s);
				};
			})(strategies[strategy]);
			
			var cont = content(strategies[strategy]);
			
			div.appendChild(radio);
			div.appendChild(cont);
			ViewUtils.addStrategy(id, radio);
			ViewUtils.addStrategy(id, cont);
		}
	},
	
	bindStrategiesToBoxes: function(id, parent, strategies, name, toggle, createView) {
		ViewUtils.clearStrategies(id);
		for (var i = 0; i < strategies.length; i++) {
			var strategy = strategies[i];
			
			var div = document.createElement("div");
			div.className = "ctrlSection disabled";
			
			var h = document.createElement("h1");
			
			var checkbox = document.createElement("input");
			checkbox.type = "checkbox";
			checkbox.style.margin = "0px";
			checkbox.style.marginBottom = "-6px";
			checkbox.style.marginRight = "3px";
			checkbox.style.padding = "0px";
			checkbox.onchange = (function(s, div, chk) {
				return function() {
					toggle(s, chk.checked);
					if (!chk.checked) {
						div.classList.add("disabled");
					} else {
						div.classList.remove("disabled");
					}
				};	
			})(strategy, div, checkbox);
			
			var span = document.createElement("span");
			span.innerHTML = name(strategy);
			
			h.appendChild(checkbox);
			h.appendChild(span);
			
			div.appendChild(h);
			var view = createView(strategy, document);
			if (view != null) {
				div.appendChild(view);
			} else {
				var span = document.createElement("span");
				span.innerHTML = ":-)";
				div.appendChild(span);
			}
			parent.appendChild(div);
			
			ViewUtils.addStrategy(id, div);
		}
		
	},
	
	offset: function(target) {
		var off = {x: target.offsetLeft, y: target.offsetTop};
		if (target.offsetParent) {
			var poff = ViewUtils.offset(target.offsetParent);
			off.x += poff.x;
			off.y += poff.y;
		}
		return off;
	},
	
	formatNumber: function(num){
		return num.toPrecision(6);
	},
	
	__objectId: 1,
	
	makeObjectId: function() {
		return "obj" + (ViewUtils.__objectId++);
	},
	
	arrayToObject: function(arr) {
		if (arr.length) {
			var obj = {};
			for (var i = 0; i < arr.length; i++) {
				obj[i] = arr[i];
			}
		}
		return arr;
	}
		
};
