/*
  OOP Ansatz mit JavaScript 
  
  by Detlev Ziereisen
  
  Quellen:
  - http://www.webmasterpro.de/coding/article/objektorientierte-programmierung-in-javascript.html
*/

function Car(power) {
	this.power = power;
	
	this.setPower = function (newPower) {
		this.power= newPower;
	}
}

function Audi(model, power, halter) {
    
    this.constructor(power);  //  <=> super(power)
    this.model = model;  // public model
	var _halter=halter;  // private _halter
    
	// public getter
    this.getCarInfos = function() {
        return this.model + " has " + this.power+ " PS (="+getKW()+" kW  owned by "+_halter;        
    }
	
	// private getter
	var getKW = function() { return power * 1.4; } // kei Ahnig was der Faktor isch 
        

	this.getHalter = function() { return _halter; }
}


function ooTest(){

	var car= new Car(200);
	var pw= car.power;

	Audi.prototype = new Car();  // extends in JS. Hier wird definiert, dass Audi von Car erbt.
	var audiA3 = new Audi("A3-2K",200, "Detlev");
	
	var a3pw= audiA3.getCarInfos();
	
	var a3model=audiA3.model;
	var a3halter= audiA3._halter;  	//  returns null
	var a3halter2=audiA3.halter;  	// returns null
	var a3halter3= audiA3.getHalter();  // returns "Detlev" 
	// var a3kw=audiA3.getKW();	  	// abort => returns to caller
	
	var dummy="set the BK here";
}