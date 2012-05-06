/*
	ATusk : abstract Tusk  angelehnt an ITusk
	
	by Detlev Ziereisen, Florian Lüthi
	
	Jede Formel sollte von ATusk abgeleitet werden.
	ReferenzImpl game.js  (game of life)
*/	

function ATusk() {

	var canRain = false;
	var canFountain=false;
	var canDuck = false;
	var tab="\t";

	
	this.SLICES=10;
	
	this.sayHello = function () { return "implement me!"; }
	this.supportsFountain= function() { return canFountain; }
	this.supportsRains= function() { return canRain; }

	this.supportsDuck = function() { return canDuck;}
	this.getDuckImage=function() { return null; }  // => object of Image
	this.getDucks= function(rows, cols) { return  Array(); } // => Point[]
	this.setSupportedFunction=function(supportsRains, supportsFountains, supportsDucks){
		canRain=supportsRains;
		canFountain=supportsFountains;
		canDuck=supportsDucks;
	}

	// set cell values for the rain drops.
	// Parameter: cell, drops=value on the GUI, i=counter for drops: i=5 => 5th drops
	this.getRainValue=function(cell, drops, i) {}  //  => no return

	this.getFountains=function(intensity, rows, cols) { return  Array(); }  //	=> returns a array of fountains

	// get Info über die Werte in Cell
	this.getCellInfo=function(cell) { return "implement me"; } // => returns string


	// Aktion bei MouseMove mit Alt
	this.mouseMoveAlt=function(cell, cellDefaultValue) {} // modify cell


	// custom settings. Wird beim ersten Run von Step() aufgerufen.
	this.customFirstTime=function(tuskObject) {} 

	// init CallData with usefull values
	this.initCell=function(cellData) {} // => no return modify cellData

	// Berechnet den neuen Wert einer Zelle.	
	this.calcCell=function(me, dimensions, dt, damping, viscosity) {} // => du = float[] wobei du[0]=u
}

// get an instance of your formel
function tuskStrategy(formel){
	if( formel=="gameoflife") {
		GameOfLife.prototype = new ATusk();
		return new GameOfLife();
	}
	
	if( formel=="wave") {
		Wave.prototype = new ATusk();
		return new Wave();
	}
	
	if( formel=="diffusion") {
		Diffusion.prototype = new ATusk();
		return new Diffusion();
	}
}

