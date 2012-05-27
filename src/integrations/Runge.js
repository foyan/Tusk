function Runge() {

	this.name = "Runge";
	
	this.integrate = function(automata) {
		var dt = 1 / automata.tusk.slices;
		var iters = automata.tusk.slices;
		
		var y = function(cell) { return cell.currentData; };
		var n = function(cell) { return cell.innerNextData; };
		
		for (var t = 0; t < iters; t++) {
	
			automata.forEachCell(function(cell) {
				var innerDifferentials = automata.tusk.calcDifferentials(cell, dt/2, y);
				cell.innerNextData = automata.tusk.applyDifferentials(cell, dt/2, innerDifferentials, y);
			});
	
			automata.forEachCell(function(cell) {
				var outerDifferentials = automata.tusk.calcDifferentials(cell, dt, n);
				cell.nextData = automata.tusk.applyDifferentials(cell, dt, outerDifferentials, y);
			});
	
			automata.forEachCell( function(cell) { cell.currentData = cell.nextData; });
	
		}
	}
	
}
