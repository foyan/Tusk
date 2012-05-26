function Runge() {
	
	this.name = "Runge";
	
	this.integrate = function(automata) {
		var dt = 1 / automata.tusk.slices;
		var iters = automata.tusk.slices;
		for (var t = 0; t < iters; t++) {
			
			automata.forEachCell(
				function(cell) {
					var innerDifferentials = automata.tusk.calcDifferentials(cell, dt/2,
						function(cell2) {
							return cell2.currentData;
						}
					);
					cell.innerNextData = automata.tusk.applyDifferentials(cell, dt/2, innerDifferentials,
						function(cell2) {
							return cell2.currentData;
						}
					);
				}
			);
						
			automata.forEachCell(
				function(cell) {
					var outerDifferentials = automata.tusk.calcDifferentials(cell, dt,
						function(cell2) {
							return cell2.innerNextData;
						}	
					);
					cell.nextData = automata.tusk.applyDifferentials(cell, dt, outerDifferentials,
						function(cell2) {
							return cell2.currentData;
						}
					)
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
