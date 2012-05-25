if (typeof(module) != "undefined") {
	module.exports = DiffusionEquation;
	var ATusk = require('../src/ATusk.js');
	var VonNeumannNeighbourhood = require('../../src/VonNeumannNeighbourhood.js');
}

DiffusionEquation.prototype = new ATusk();

function DiffusionEquation() {

	DiffusionEquation.prototype.sayHello = function() { return "Diffusion"; }

	DiffusionEquation.prototype.getCellInfo=function(cell){
		var lf="\t";
		var info= "u="+formatNum(cell.currentData.u); 
		return info;
	}

	DiffusionEquation.prototype.mouseMoveAlt=function(cell, cellDefaultValue){
		var initVal= (cellDefaultValue.value == null || cellDefaultValue.value == "") ? -0.9 : parseFloat(cellDefaultValue.value);
		cell.currentData.u = 0.9;
	}
		
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