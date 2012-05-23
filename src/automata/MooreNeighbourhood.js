if (typeof(module) != "undefined") {
	module.exports = MooreNeighbourhood;
}

function MooreNeighbourhood() {
	
	this.getNeighbours = function(cell, cells) {
		
		var neighbours = [];
		
		for (var ox = -1; ox <= 1; ox++) {
			for (var oy = -1; oy <= 1; oy++) {
				var x = (cells.length + cell.x + ox) % cells.length;
				var y = (cells[0].length + cell.y + oy) % cells[0].length;
				if (!(x == cell.x && y == cell.y)) {
					neighbours.push(cells[y][x]);
				}
			}
		}
		
		return neighbours;
		
	};
	
}
