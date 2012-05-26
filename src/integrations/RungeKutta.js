function RungeKutta() {
	
	this.name = "Runge/Kutta";
	
	this.integrate = function(automata) {
		var y = function(cell) { return cell.currentData; };

		var f1 = function(cell) { return cell.f1; };
		var f2 = function(cell) { return cell.f2; };
		var f3 = function(cell) { return cell.f3; };
		
		var k1 = function(cell) { return cell.k1; };
		var k2 = function(cell) { return cell.k2; };
		var k3 = function(cell) { return cell.k3; };

		var dt = 1 / automata.tusk.slices;
		var iters = automata.tusk.slices;
		for (var t = 0; t < iters; t++) {
			
			automata.forEachCell(function(cell) {
				cell.f1 = automata.tusk.applyDifferentials(cell, dt/2, automata.tusk.calcDifferentials(cell, dt/2, y), y);
				cell.k1 = automata.tusk.applyDifferentials(cell, dt/6, automata.tusk.calcDifferentials(cell, dt/6, y), y);
			});

			automata.forEachCell(function(cell) {
				cell.f2 = automata.tusk.applyDifferentials(cell, dt/2, automata.tusk.calcDifferentials(cell, dt/2, f1), f1);
				cell.k2 = automata.tusk.applyDifferentials(cell, dt/3, automata.tusk.calcDifferentials(cell, dt/3, f1), k1);
			});

			automata.forEachCell(function(cell) {
				cell.f3 = automata.tusk.applyDifferentials(cell, dt/2, automata.tusk.calcDifferentials(cell, dt/1, f2), f2);
				cell.k3 = automata.tusk.applyDifferentials(cell, dt/3, automata.tusk.calcDifferentials(cell, dt/3, f2), k2);
			});

			automata.forEachCell(function(cell) {
				cell.currentData = automata.tusk.applyDifferentials(cell, dt/3, automata.tusk.calcDifferentials(cell, dt/6, f3), k3);
			});

		};
	
	}
	
}
