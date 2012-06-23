function Viscosity(name, viscosity, baseColor) {
	
	this.name = name;
	
	this.viscosity = viscosity;
	
	this.baseColor = baseColor;
	
}

var Viscosities = {
	
	water: new Viscosity("Water @ 20° C", 0.5, {r: 128, g: 128, b: 255}),
	
	blood: new Viscosity("Blood", 5, {r: 255, g: 60, b: 60}),
	
	honey: new Viscosity("Honey", 500, {r: 228, g: 202, b: 66}),
	
	petroleum: new Viscosity("Petroleum", 0.325, {r: 0, g: 90, b: 90}),
	
	concrete: new Viscosity("Concrete", 100000000, {r: 50, g: 50, b: 50})
	
};
