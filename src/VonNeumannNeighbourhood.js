function VonNeumannNeighbourhood() {
	
	this.getNeighbours = function(cell, cells) {
		
		var rows = cells.length;
		var cols = cells[0].length;
		
		var n = cell.y == 0 ? cell : cells[cell.y-1][cell.x];
		var s = cell.y == rows-1 ? cell : cells[cell.y+1][cell.x];
		var w = cell.x == 0 ? cell : cells[cell.y][cell.x-1];
		var e = cell.x == cols-1 ? cell : cells[cell.y][cell.x+1];
		
		return {
			n: n,
			s: s,
			w: w,
			e: e
		};
		
	};
	
}
