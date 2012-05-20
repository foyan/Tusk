if (typeof(module) != "undefined") {
	module.exports = GameOfLife;
	var ATusk = require('../src/ATusk.js');
}

GameOfLife.prototype = new ATusk();

function GameOfLife() {

	this.setSupportedFunction(false,false,false);
	this.SLICES=1;
	
	//Override the parent's method
	GameOfLife.prototype.sayHello = function() { return "Game of Life"; }

	GameOfLife.prototype.getCellInfo=function(cell){
		var info= "u="+formatNum(cell.currentGradients[0]); 
		return info;
	}
	
	GameOfLife.prototype.mouseMoveAlt=function(cell, cellDefaultValue) {
		var initVal= (cellDefaultValue.value == null || cellDefaultValue.value == "") ? -0.9 : parseFloat(cellDefaultValue.value);
		cell.currentGradients[0] = initVal;
	}

	GameOfLife.prototype.initCell=function(cellData) {
		cellData.currentGradients[0] = 0; 
	}
	
	GameOfLife.prototype.calcCell=function(me, dimensions, dt, damping, viscosity) 	{
		var x= me.x;
		var y= me.y;
		
		/*
			Regeln: 
				Quelle: http://alphard.ethz.ch/Hafner/PPS/PPS2001/Life/Life2.htm#Game
				
				Die Zelle ueberlebt wenn: die Zelle 2 oder 3 Nachbarn hat
				hat eine Zelle genau 3 lebende Nachbarn so wird sie geboren
				ansonsten stirbt sie.
		*/
		
		
		var i=y;
		var j=x;

		var n = i == 0 ? null : model[i-1][j];
		var ne = (i == 0  ? null : model[i-1][j+1]);
		var e = j == COLS-1 ? null : model[i][j+1];
		var es = ( i>=ROWS-1 || j >= COLS-1 ? null : model[i+1][j+1]);
		var s= i == ROWS-1 ? null : model[i+1][j];
		var sw = ( i>=ROWS-1 || j == 0 ? null : model[i+1][j-1]);
		var w = j == 0 ? null : model[i][j-1];
		var nw = (i==0 || j == 0 ? null : model[i-1][j-1]);
		
		var cells= [ n,ne,e,es,s,sw,w,nw];
		var lifeCounter=0;
		for (var idx = 0; idx < cells.length; idx++) 
			if (cells[idx] !=null)
				if( cells[idx].currentGradients[0]==1)
					lifeCounter=lifeCounter+1;

		if( lifeCounter==3) return [1];
		if( lifeCounter == 2) return me.currentGradients[0];
		return [0];
		
	}
}

// funktioniert nicht GameOfLife.prototype = new ATusk();



// // get Eigennamen der TuskImplementierung
// function sayHello() { return "Game of Life"; }

// function supportsDuck() { return false; }
// function supportsFountain() { return false; }
// function supportsRains() { return false; }

// function getDuckImage() { return null; }

// function getDucks(rows, cols) { return  Array(); }

// // set cell values for the rain drops.
// // Parameter: cell, drops=value on the GUI, i=counter for drops: i=5 => 5th drops
// function getRainValue(cell, drops, i) {}

// function getFountains(intensity, rows, cols) {}


// // get Info �ber die Werte in Cell
// function getCellInfo(cell){
	// var lf="\t";
	// var info= "u="+formatNum(cell.currentGradients[0]); 
	// return info;
// }

// // Aktion bei MouseMove mit Alt
// function mouseMoveAlt(cell, cellDefaultValue) {
	// var initVal= (cellDefaultValue.value == null || cellDefaultValue.value == "") ? -0.9 : parseFloat(cellDefaultValue.value);
			
	// cell.currentGradients[0] = initVal;
// }

// // Aktion bei MouseMove mit Alt: Setzen der Werte von cell.
// function mouseMoveShift(cell, initVal) {}

// // custom settings. Wird beim ersten Run von Step() aufgerufen.
// function customFirstTime() { SLICES=1;}

// function initCell(cellData) {
	// cellData.currentGradients[0] = 0; 
// }

// Berechnet den neuen Wert einer Zelle.
// function calcCell(me, dimensions, dt, damping, viscosity) 	{
	
	// var x= me.x;
	// var y= me.y;
	
	// /*
		// Regeln: 
			// Quelle: http://alphard.ethz.ch/Hafner/PPS/PPS2001/Life/Life2.htm#Game
			
			// Die Zelle ueberlebt wenn: die Zelle 2 oder 3 Nachbarn hat
			// hat eine Zelle genau 3 lebende Nachbarn so wird sie geboren
			// ansonsten stirbt sie.
	// */
	
	
	// var i=y;
	// var j=x;

	// var n = i == 0 ? null : model[i-1][j];
	// var ne = (i == 0  ? null : model[i-1][j+1]);
	// var e = j == COLS-1 ? null : model[i][j+1];
	// var es = ( i>=ROWS-1 || j >= COLS-1 ? null : model[i+1][j+1]);
	// var s= i == ROWS-1 ? null : model[i+1][j];
	// var sw = ( i>=ROWS-1 || j == 0 ? null : model[i+1][j-1]);
	// var w = j == 0 ? null : model[i][j-1];
	// var nw = (i==0 || j == 0 ? null : model[i-1][j-1]);
	
	// var cells= [ n,ne,e,es,s,sw,w,nw];
	// var lifeCounter=0;
	// for (var idx = 0; idx < cells.length; idx++) 
		// if (cells[idx] !=null)
			// if( cells[idx].currentGradients[0]==1)
				// lifeCounter=lifeCounter+1;

	// if( lifeCounter==3) return [1];
	// if( lifeCounter == 2) return me.currentGradients[0];
	// return [0];
	
// }
