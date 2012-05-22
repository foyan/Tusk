if (typeof(module) != "undefined") {
	module.exports = VortexEvent;
}

function VortexEvent(applyCell) {
	
	this.borderCells = 20;
	
	this.offset = 0;
	this.apply = function(automata) {
		return;
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

	this.applyCell = applyCell;

}
