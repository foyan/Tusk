function Viscosity(name, viscosity, baseColor) {
	
	this.name = name;
	
	this.viscosity = viscosity;
	
	this.baseColor = baseColor;
	
}

var Viscosities = {
	
	water: new Viscosity("Water @ 20° C", 1, {r: 128, g: 128, b: 255}),
	
	blood: new Viscosity("Blood", 10, {r: 255, g: 0, b: 0}),
	
	honey: new Viscosity("Honey", 1000, {r: 228, g: 202, b: 66}),
	
	petroleum: new Viscosity("Petroleum", 0.65, {r: 0, g: 180, b: 180}),
	
	concrete: new Viscosity("Concrete", 100000000, {r: 50, g: 50, b: 50})
	
};
