/*

	- Wave -
	
	implementiert die Welle.
	implementiert Interface ITusk

*/


function Wave() {

	this.setSupportedFunction(true,true,true);
	
	Wave.prototype.createCellData = function() {
		return {
			ut: 0,
			up: 0,
			udx: 0,
			udxdx: 0,
			upp: 0,
			ut: 0,
			
			displayValue: function() { return this.ut; }
		};
	}
	
	Wave.prototype.getNeighbours = function(cell, cells) {
		
		var rows = cells.length;
		var cols = cells[0].length;
		
		var n = cell.y == 0 ? cell : cells[cell.y-1][cell.x];
		var s = cell.y == rows-1 ? cell : cells[cell.y+1][cell.x];
		var w = cell.x == 0 ? cell : cells[cell.y][cell.x-1];
		var e = cell.x == cols-1 ? cell : cells[cell.y][cell.x+1];
		
		return {
			n: n,
			s: s,
			w: w,
			e: e
		};
		
	}
	
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
				
		cell.currentData.ut = initVal;
	}
	
	Wave.prototype.getDuckImage=function(){
		//return null;
		
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
		ducks[0]= new Duck(100,400,0,0);
		ducks[1]= new Duck(300,400,0,0);
		return ducks;
	}
	
	Wave.prototype.calcCell=function(me, dt, damping, viscosity) {
		var c = 1.0;
		c=1/viscosity;

		var u = me.currentData.ut;
		
		var udx = u - (me.neighbours.w.currentData.ut + me.neighbours.n.currentData.ut) / 2;
		var udxdx = -2 * u + (me.neighbours.w.currentData.ut + me.neighbours.n.currentData.ut) / 2 + (me.neighbours.e.currentData.ut + me.neighbours.s.currentData.ut) / 2;
		
		var upp = udxdx * c;
		var up = me.currentData.up + upp * dt;
		var ut = (u + up * dt) * damping;
		
		return {
			ut: ut,
			up: up,
			udx: udx,
			udxdx: udxdx,
			upp: upp,
			ut: ut,
			
			displayValue: function() { return this.ut; }
		};
	}
}
