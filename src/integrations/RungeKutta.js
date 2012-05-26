function RungeKutta() {
	
	this.name  = "Runge/Kutta";
	
	this.integrate = function(automata) {
		
		var dt = 1 / automata.tusk.slices;
		var iters = automata.tusk.slices;
		for (var t = 0; t < iters; t++) {
			
			automata.forEachCell(
				function(cell) {
					cell.k1diff = automata.tusk.calcDifferentials(cell, dt/2,
						function(cell2) {
							return cell2.currentData;
						}
					);
					cell.k1 = automata.tusk.applyDifferentials(cell, dt/2, cell.k1diff,
						function(cell2) {
							return cell2.currentData;
						}
					);
				}
			);
						
			automata.forEachCell(
				function(cell) {
					cell.k2diff = automata.tusk.calcDifferentials(cell, dt/2,
						function(cell2) {
							return cell2.k1;
						}
					);
					cell.k2 = automata.tusk.applyDifferentials(cell, dt/2, cell.k2diff,
						function(cell2) {
							return cell2.currentData;
						}
					);
				}
			);

			automata.forEachCell(
				function(cell) {
					cell.k3diff = automata.tusk.calcDifferentials(cell, dt/2,
						function(cell2) {
							return cell2.k2;
						}
					);
					cell.k3 = automata.tusk.applyDifferentials(cell, dt/2, cell.k3diff,
						function(cell2) {
							return cell2.currentData;
						}
					);
				}
			);

			automata.forEachCell(
				function(cell) {
					cell.k4diff = automata.tusk.calcDifferentials(cell, dt,
						function(cell2) {
							return cell2.k3;
						}
					);
					/*cell.k4 = automata.tusk.applyDifferentials(cell, dt, cell.k4diff,
						function(cell2) {
							return cell2.currentData;
						}
					);*/
					cell.nextData = automata.tusk.applyDifferentials(cell, dt/3, cell.k1diff,
						function(cell2) {
							return cell2.currentData;
						}
					);
					cell.nextData = automata.tusk.applyDifferentials(cell, dt/3*2, cell.k2diff,
						function(cell2) {
							return cell2.nextData;
						}
					);
					cell.nextData = automata.tusk.applyDifferentials(cell, dt/3*2, cell.k3diff,
						function(cell2) {
							return cell2.nextData;
						}
					);
					cell.nextData = automata.tusk.applyDifferentials(cell, dt/3, cell.k4diff,
						function(cell2) {
							return cell2.nextData;
						}
					);
				}
			);
			
			automata.forEachCell(
				function(cell) {
					cell.currentData = cell.nextData;
				}
			);
			
		}
		
		
	};
	
}
