if (typeof(module) != "undefined") {
	module.exports = DiffusionEquation;
	var ATusk = require('../src/ATusk.js');
	var VonNeumannNeighbourhood = require('../../src/VonNeumannNeighbourhood.js');
}

DiffusionEquation.prototype = new ATusk();

function DiffusionEquation() {

	DiffusionEquation.prototype.sayHello = function() { return "Diffusion"; }
		
	this.createCellData = function() {
		return {
			u: 0,
			dudx: 0
		};
	};
	
	this.setCellValue = function(cell, value) {
		cell.currentData.u = value;
		cell.currentData.dudx = 0;
	}
	
	this.getNeighbours = new VonNeumannNeighbourhood().getNeighbours;
	
	this.templates = [];
	
	this.events = [
		new RainEvent(function(cell, value) { cell.currentData.u = value; }),
		new VortexEvent(function(cell, value) { cell.currentData.u = value; })
	];

	this.pools = [
		new Pool("du/dx", "_assets/pics/udx.png", function(cell) { return cell.currentData.dudx; }),
	];
	
	this.primaryPool = new Pool("u", "", function(cell) { return cell.currentData.u; });
	
	this.calcDifferentials = function(cell, dt, get) {
		var c = 1.0/this.viscosity;
		
		var dudx = (4 * get(cell).u
			- get(cell.neighbours.n).u 
			- get(cell.neighbours.w).u
			- get(cell.neighbours.e).u
			- get(cell.neighbours.s).u
		) / 4 * c;
		
		return { dudx: dudx };
	}
	
	this.applyDifferentials = function(cell, dt, differentials, get) {
		var nextData = this.createCellData();
		nextData.dudx = differentials.dudx;
		nextData.u = get(cell).u - differentials.dudx * dt;
		
		return nextData;
	}
	
	DiffusionEquation.prototype.calcCell = function(cell, dt) {
		
		var c = 1.0/this.viscosity;
		
		var nextData = this.createCellData();
		nextData.dudx = (4 * cell.currentData.u
			- cell.neighbours.n.currentData.u 
			- cell.neighbours.w.currentData.u
			- cell.neighbours.e.currentData.u
			- cell.neighbours.s.currentData.u
		) / 4 * c;
		nextData.u = cell.currentData.u - nextData.dudx * dt;

		return nextData;
	}

}