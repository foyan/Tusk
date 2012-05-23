if (typeof(module) != "undefined") {
	module.exports = ATusk;
}

function ATusk() {

	var tab="\t";

	this.slices = 5;
	
	this.sayHello = function () { return "implement me!"; }
		
	// get Info über die Werte in Cell
	this.getCellInfo=function(cell) { return "implement me"; } // => returns string


	// Aktion bei MouseMove mit Alt
	this.mouseMoveAlt=function(cell, cellDefaultValue) {} // modify cell

	// Berechnet den neuen Wert einer Zelle.	
	this.calcCell = function(me, dt) {} // => du = float[] wobei du[0]=u
	
	this.viscosity = 0.5;
	
	this.damping = 0.995;
	
}
