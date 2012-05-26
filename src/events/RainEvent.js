if (typeof(module) != "undefined") {
	module.exports = RainEvent;
}

function RainEvent(applyCell) {
	
	this.dropsPerIteration = 4;
	
	this.sign = 1;
	
	this.apply = function(automata) {
		var drops = this.dropsPerIteration == 0 ? 0
			: this.dropsPerIteration >= 1 ? this.dropsPerIteration
			: automata.iterations % (Math.floor(1 / this.dropsPerIteration)) == 0 ? 1 : 0;
		
		for (var i = 0; i < drops; i++) {
			var x = Math.floor(Math.random() * automata.cols);
			var y = Math.floor(Math.random() * automata.rows);
			var cell = automata.model[x][y];
			this.sign = this.sign * -1;
			applyCell(cell, this.sign);
		}
		
	}
	
	this.name = "Rain";
	
	this.createView = function(doc) {
		var table = doc.createElement("table");
		var tr1 = doc.createElement("tr");
		var tr1Label = doc.createElement("td");
		var tr1Val = doc.createElement("td");
		var drops = doc.createElement("input");
		drops.type = "text";
		drops.style.width = "50px"
		drops.value = this.dropsPerIteration;
		drops.onchange = (function(evt, val) {
			return function() {
				evt.dropsPerIteration = val.value;
			}
		})(this, drops);
		
		table.appendChild(tr1);
		tr1.appendChild(tr1Label);
		tr1.appendChild(tr1Val);
		tr1Val.appendChild(drops);
		tr1Label.innerHTML = "Drops/Iteration";
		
		return table;
	}
	
	this.applyCell = applyCell;
		
}
