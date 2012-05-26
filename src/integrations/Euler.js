function Euler() {
	
	this.integrate = function(automata) {
		var dt = 1 / automata.tusk.slices;
		for (var t = 0; t < automata.tusk.slices; t++) {
			
			automata.forEachCell(
				function(cell) {
					var nextData = automata.tusk.calcCell(cell, dt);
					cell.nextData = nextData;
				}
			);
			
			automata.forEachCell(
				function(cell) {
					cell.currentData = cell.nextData;
				}
			);
			
		}
	}
	
}
