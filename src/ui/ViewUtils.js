var ViewUtils = {
	
	getColor: function(du, r0, g0, b0) {
		return {
			r: Math.min(255, Math.max(0, Math.floor(r0 * (1+du)))),
			g: Math.min(255, Math.max(0, Math.floor(g0 * (1+du)))),
			b: Math.min(255, Math.max(0, Math.floor(b0 * (1+du))))
		};
	},
	
	getFormattedColor: function(du, r0, g0, b0) {
		var color = getColor(du, r0, g0, b0);
		return "rgb(" + color.r + "," + color.g + "," + color.b + ")";
	},

	bindStrategiesToCombobox: function(combobox, strategies, text, onchange) {
		var def = null;
		for (var strategy in strategies) {
			var opt = document.createElement("option");
			opt.text = text(strategies[strategy]);
			opt.value = strategy;
			combobox.options.add(opt);
			def = strategies[strategy];
		}
		combobox.onchange = function() {
			var strategy = strategies[combobox.value];
			onchange(strategy);
		};
		if (def) {
//			onchange(def);
		}
	},
	
	bindStrategiesToButtonList: function(div, strategies, text, onclick) {
		for (var strategy in strategies) {
			var button = document.createElement("input");
			button.type = "button";
			button.value = text(strategies[strategy]);
			button.onclick = (function(s) {
				return function() {
					onclick(s);
				}
			})(strategies[strategy]);
			div.appendChild(button);
		}
	},
	
	bindStrategiesToRadioList: function(div, strategies, content, onchange) {
		div.innerHTML = "";
		
		var groupName = ViewUtils.makeObjectId();
		for (var strategy in strategies) {
			var radio = document.createElement("input");
			radio.setAttribute("type", "radio");
			radio.setAttribute("name", groupName);
			radio.setAttribute("value", ViewUtils.makeObjectId());
			radio.onclick = (function(s) {
				return function() {
					onchange(s);
				};
			});
			
			var cont = content(strategies[strategy]);
			
			div.appendChild(radio);
			div.appendChild(cont);
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
	}
		
};
