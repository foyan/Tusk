if (typeof(module) != "undefined") {
	module.exports = ATusk;
}

function ATusk() {

	var tab="\t";

	this.slices = 5;
	
	this.sayHello = function () { return "implement me!"; }
		
	// Berechnet den neuen Wert einer Zelle.	
	this.calcCell = function(me, dt) {} // => du = float[] wobei du[0]=u
	
	this.viscosity = 0.5;
	
	this.damping = 0.995;
	
}
