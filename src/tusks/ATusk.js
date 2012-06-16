if (typeof(module) != "undefined") {
	module.exports = ATusk;
}

function ATusk() {

	this.slices = 5;

	this.sayHello = function () { return "implement me!"; }
		
	this.viscosity = 0.5;

	this.damping = 0.995;
	
}
