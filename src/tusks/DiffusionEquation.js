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
			dudx: 0,
			displayValue: function() { return this.u; }
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