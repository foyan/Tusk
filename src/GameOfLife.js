if (typeof(module) != "undefined") {
	module.exports = GameOfLife;
	var ATusk = require('../src/ATusk.js');
}

GameOfLife.prototype = new ATusk();

function GameOfLife() {

	this.setSupportedFunction(false,false,false);
	this.slices = 1;
	
	//Override the parent's method
	GameOfLife.prototype.sayHello = function() { return "Game of Life"; }

	GameOfLife.prototype.getCellInfo=function(cell){
		var info= "u="+formatNum(cell.currentGradients[0]); 
		return info;
	}
	
	GameOfLife.prototype.mouseMoveAlt=function(cell, cellDefaultValue) {
		cell.currentData.status = 1;
	}

	GameOfLife.prototype.initCell=function(cellData) {
		cellData.currentGradients[0] = 0; 
	}
	
	this.createCellData = function() {
		return {
			status: 0,
			
			displayValue: function() { return this.status; }
		};
	};

	this.getNeighbours = new MooreNeighbourhood().getNeighbours;

	GameOfLife.prototype.calcCell = function(cell, dt, damping, viscosity) 	{
		/*
			Regeln: 
				Quelle: http://alphard.ethz.ch/Hafner/PPS/PPS2001/Life/Life2.htm#Game
				
				Die Zelle ueberlebt wenn: die Zelle 2 oder 3 Nachbarn hat
				hat eine Zelle genau 3 lebende Nachbarn so wird sie geboren
				ansonsten stirbt sie.
		*/
		
		
		var cells = cell.neighbours;

		var lifeCounter = 0;
		for (var idx = 0; idx < cells.length; idx++) {
			lifeCounter += cells[idx].currentData.status;
		}

		if (lifeCounter == 3) {
			return {status: 1, displayValue: function() { return this.status; }};
		}
		if (lifeCounter == 2) {
			return {status: 0, displayValue: function() { return this.status; }};
		}
		return {status: 0, displayValue: function() { return this.status; }};
		
	}
}

