if (typeof(module) != "undefined") {
	module.exports = SmorkEvent;
}

function SmorkEvent(applyCell) {
	
	this.dropsPerIteration = 4;
	
	this.sign = 1;
	
	this.apply = function(automata) {
		var x = Math.floor(automata.cols / 2);
		var y = Math.floor(automata.rows / 2);
		
		applyCell(automata.model[x][y], 1);
		applyCell(automata.model[x+1][y+1], 1);
		applyCell(automata.model[x][y+1], -1);
		applyCell(automata.model[x+1][y], -1);
				
	}
	
	this.name = "Smork";
		
	this.applyCell = applyCell;
		
}
