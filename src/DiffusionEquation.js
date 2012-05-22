if (typeof(module) != "undefined") {
	module.exports = DiffusionEquation;
	var ATusk = require('../src/ATusk.js');
	var VonNeumannNeighbourhood = require('../src/VonNeumannNeighbourhood.js');
}

DiffusionEquation.prototype = new ATusk();

function DiffusionEquation() {

	this.setSupportedFunction(false,true,false);
	
	//Override the parent's method
	DiffusionEquation.prototype.sayHello = function() { return "Diffusion"; }

	
	DiffusionEquation.prototype.getFountains=function(intensity, rows, cols){
		var fountains= Array(); 
		var i=0;
		var f=new Fountain(); f.x=10; f.y=10; f.intensity=(parseFloat(intensity)); fountains[i++]=f; 
		
		return fountains;
	}

	// get Info �ber die Werte in Cell
	DiffusionEquation.prototype.getCellInfo=function(cell){
		var lf="\t";
		var info= "u="+formatNum(cell.currentData.u); 
		return info;
	}

	// Aktion bei MouseMove mit Alt
	DiffusionEquation.prototype.mouseMoveAlt=function(cell, cellDefaultValue){
		var initVal= (cellDefaultValue.value == null || cellDefaultValue.value == "") ? -0.9 : parseFloat(cellDefaultValue.value);
		cell.currentData.u = 0.9;
	}
	
	DiffusionEquation.prototype.initCell=function(cellData) {
		cellData.currentGradients[0] = 0; 
	}
	
	this.createCellData = function() {
		return {
			u: 0,
			dudx: 0,
			displayValue: function() { return this.u; }
		};
	};
	
	this.getNeighbours = new VonNeumannNeighbourhood().getNeighbours;

	DiffusionEquation.prototype.calcCell = function(cell, dt, damping, viscosity) {
		
		var c = 1.0/viscosity;
		
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