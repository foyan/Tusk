function Euler() {
	
	this.name = "Euler";
	
	this.integrate = function(automata) {
		var dt = 1 / automata.tusk.slices;
		for (var t = 0; t < automata.tusk.slices; t++) {
			
			automata.forEachCell(
				function(cell) {
					var differentials = automata.tusk.calcDifferentials(cell, dt, function(cell2) {
						return cell2.currentData;
					});
					cell.nextData = automata.tusk.applyDifferentials(cell, dt, differentials, function(cell2) {
						return cell2.currentData;
					})
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
