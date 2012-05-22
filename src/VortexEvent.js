if (typeof(module) != "undefined") {
	module.exports = VortexEvent;
}

function VortexEvent(applyCell) {
	
	this.borderCells = 20;
	
	this.offset = 0;
	this.apply = function(automata) {
		// vortex borders
		var cellValue = 4 / this.borderCells;
		for (var i = 0; i < this.borderCells; i++) {
			this.applyCell(automata.model[this.offset][i], cellValue);
			this.applyCell(automata.model[automata.rows-1-this.offset][automata.cols-1-i], cellValue);
			this.applyCell(automata.model[i][automata.cols-1-this.offset], cellValue);
			this.applyCell(automata.model[automata.cols-1-i][this.offset], cellValue);
		}		
		// vortex center
		var width = 4;
		var height = 4;
		
		for (var x = 0; x < width; x++) {
			for (var y = 0; y < height; y++) {
				var cell = automata.model[automata.rows / 2 - width / 2 + x][automata.cols / 2 - height / 2 + y];
				this.applyCell(cell, -1);
			}
		}
	}
	
	this.createView = function(doc) {
		var table = doc.createElement("table");

		var tr1 = doc.createElement("tr");
		var tr1Label = doc.createElement("td");
		var tr1Val = doc.createElement("td");
		var borderCells = doc.createElement("input");
		borderCells.type = "text";
		borderCells.style.width = "50px"
		borderCells.value = this.borderCells;
		borderCells.onchange = (function(evt, val) {
			return function() {
				evt.borderCells = val.value;
			}
		})(this, borderCells);
		
		var tr2 = doc.createElement("tr");
		var tr2Label = doc.createElement("td");
		var tr2Val = doc.createElement("td");
		var offset = doc.createElement("input");
		offset.type = "text";
		offset.style.width = "50px"
		offset.value = this.offset;
		offset.onchange = (function(evt, val) {
			return function() {
				evt.offset = val.value;
			}
		})(this, offset);
		
		
		table.appendChild(tr1);
		table.appendChild(tr2);
		
		tr1.appendChild(tr1Label);
		tr1.appendChild(tr1Val);
		tr1Val.appendChild(borderCells);
		tr1Label.innerHTML = "Border Cells";
		
		tr2.appendChild(tr2Label);
		tr2.appendChild(tr2Val);
		tr2Val.appendChild(offset);
		tr2Label.innerHTML = "Offset";

		return table;
	}

	this.name = "Vortex";

	this.applyCell = applyCell;

}
