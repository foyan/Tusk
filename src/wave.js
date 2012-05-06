/*

	- Wave -
	
	implementiert die Welle.
	implementiert Interface ITusk

*/


function Wave() {

	this.setSupportedFunction(true,true,true);
	
	//Override the parent's method
	Wave.prototype.sayHello = function() { return "Wave"; }

	Wave.prototype.getCellInfo=function(cell){		 
		var lf="\t";
		var info= 
		"u="+formatNum(cell.currentGradients[0]) + lf+
		"u'="+formatNum(cell.currentGradients[2]) + lf+
		"u''="+formatNum(cell.currentGradients[3])+lf+
		"u.="+formatNum(cell.currentGradients[1]) + lf+
		"u..="+formatNum(cell.currentGradients[4]) + lf+
		"v_x="+formatNum(cell.currentVelocities[0]) + lf+
		"v_y="+formatNum(cell.currentVelocities[1]) + lf+
		"phi="+formatNum(calculateDuckPhi(cell.currentVelocities[0], cell.currentVelocities[1]))*360/6.28 + "<br/>"
		return info;
	}
	
	Wave.prototype.mouseMoveAlt=function(cell, cellDefaultValue) {
		var initVal= (cellDefaultValue.value == null || cellDefaultValue.value == "") ? -0.9 : parseFloat(cellDefaultValue.value);
				
		cell.currentGradients[0] = initVal;
		cell.currentGradients[1] = 0;
		cell.currentGradients[2] = 0;
		cell.currentGradients[3] = 0;
		cell.currentGradients[4] = 0;
		cell.currentGradients[5] = 0;
	}

	Wave.prototype.initCell=function(cellData) {
		cellData.currentGradients[0] = 0; 
		cellData.currentGradients[1] = 0;
		cellData.currentGradients[2] = 0;
		cellData.currentGradients[3] = 0;
		cellData.currentGradients[4] = 0;
		cellData.currentGradients[5] = 0;
	}	
	
	Wave.prototype.getDuckImage=function(){
		return null;
		
		duckImage=new Image(); 
		duckImage.src = "pics/duck.png";
	
		return duckImage;
	}	
	
	// set cell values for the rain drops.
	// Parameter: cell, drops=value on the GUI, i=counter for drops: i=5 => 5th drops
	Wave.prototype.getRainValue=function(cell, drops, i){
		cell.currentGradients[0] = -0.5;  
		cell.currentGradients[1] = 0;
		cell.currentGradients[2] = 0;
		cell.currentGradients[3] = 0;
		cell.currentGradients[4] = 0;
		cell.currentGradients[5] = 0;
	}
	
	Wave.prototype.getFountains=function(intensity, rows, cols){
		var fountains= Array(); 
		var i=0;
		var f=new Fountain(); f.x=cols/2; f.y=rows/2; f.intensity=(parseFloat(intensity)); fountains[i++]=f; 
		// var f2=new Fountain(); f2.x=cols-10; f2.y=rows-10; f2.intensity=parseFloat(intensity); fountains[1]=f2;
		// var f3=new Fountain(); f3.x=10; f3.y=rows-10; f3.intensity=parseFloat(intensity); fountains[2]=f3;
		var f4=new Fountain(); f4.x=10; f4.y=10; f4.intensity=parseFloat(intensity); fountains[i++]=f4;
		
		return fountains;
	}
	
	Wave.prototype.getDucks=function(rows, cols){
		var ducks=Array();
		ducks[0]= new Point(10,40);
		ducks[1]= new Point(30,40);
		return ducks;
	}
	
	Wave.prototype.calcCell=function(me, dimensions, dt, damping, viscosity){
		var c = 1.0;
		c=1/viscosity;

		var uCurrent = me.currentGradients;
		var u = uCurrent[0];
		
		var udx = u - (dimensions[0].previous[0] + dimensions[1].previous[0]) / 2;
		var udxdx = -2 * u + (dimensions[0].previous[0] + dimensions[1].previous[0]) / 2 + (dimensions[0].next[0] + dimensions[1].next[0]) / 2;
		
		var upp = udxdx * c;
		var up = uCurrent[1] + upp * dt;
		var ut = (u + up * dt) * damping;
		
		return [
			ut,
			up,
			udx,
			udxdx,
			upp,
			ut
		];
	}
}
