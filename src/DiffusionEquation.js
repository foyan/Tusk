if (typeof(module) != "undefined") {
	module.exports = DiffusionEquation;
	var ATusk = require('../src/ATusk.js');
}

DiffusionEquation.prototype = new ATusk();

function DiffusionEquation() {

	this.setSupportedFunction(false,true,false);
	
	//Override the parent's method
	Diffusion.prototype.sayHello = function() { return "Diffusion"; }

	
	Diffusion.prototype.getFountains=function(intensity, rows, cols){
		var fountains= Array(); 
		var i=0;
		var f=new Fountain(); f.x=10; f.y=10; f.intensity=(parseFloat(intensity)); fountains[i++]=f; 
		
		return fountains;
	}

	// get Info �ber die Werte in Cell
	Diffusion.prototype.getCellInfo=function(cell){
		var lf="\t";
		var info= "u="+formatNum(cell.currentGradients[0]); 
		return info;
	}

	// Aktion bei MouseMove mit Alt
	Diffusion.prototype.mouseMoveAlt=function(cell, cellDefaultValue){
		var initVal= (cellDefaultValue.value == null || cellDefaultValue.value == "") ? -0.9 : parseFloat(cellDefaultValue.value);
		cell.currentGradients[0] = initVal;
	}
	
	Diffusion.prototype.initCell=function(cellData) {
		cellData.currentGradients[0] = 0; 
	}

	Diffusion.prototype.calcCell=function(me, dimensions, dt, damping, viscosity) {
		var du = Array();
		var diff=0;
		du[0] = 0;
		for (n = 0; n < dimensions.length; n++) {
			dn = dimensions[n];
			diff= (-dn.previous[0] + me.currentGradients[0])*0.01;
			du[0]-=diff;
		}
		du[0]+=me.currentGradients[0];
		return du;
	}

}