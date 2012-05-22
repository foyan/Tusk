function RainEvent(applyCell) {
	
	this.dropsPerIteration = 0;
	
	this.apply = function(automata) {
		var drops = this.dropsPerIteration == 0 ? 0
			: this.dropsPerIteration >= 1 ? this.dropsPerIteration
			: automata.iterations % (Math.floor(1 / this.dropsPerIteration)) == 0 ? 1 : 0;
		
		for (var i = 0; i < drops; i++) {
			var x = Math.floor(Math.random() * automata.cols);
			var y = Math.floor(Math.random() * automata.rows);
			var cell = automata.model[x][y];
			applyCell(cell, 1);
		}
		
	}
	
	this.applyCell = applyCell;
		
}
