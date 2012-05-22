if (typeof(module) != "undefined") {
	module.exports = MooreNeighbourhood;
}

function MooreNeighbourhood() {
	
	this.getNeighbours = function(cell, cells) {
		
		var offsets = [-1,0,1];
		var neighbours = [];
		
		for (var ox = 0; ox < offsets.length; ox++) {
			for (var oy = 0; oy < offsets.length; oy++) {
				var x = cell.x + ox;
				var y = cell.y + oy;
				if (x >= 0 && x < cells.length && y >= 0 && y < cells[0].length) {
					neighbours.push(cells[x][y]);
				}
			}
		}
		
		return neighbours;
		
	};
	
}
