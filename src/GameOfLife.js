if (typeof(module) != "undefined") {
	module.exports = GameOfLife;
	var ATusk = require('../src/ATusk.js');
	var MooreNeighbourhood = require('../src/MooreNeighbourhood.js');
}

GameOfLife.prototype = new ATusk();

function GameOfLife() {

	this.slices = 1;
	
	//Override the parent's method
	GameOfLife.prototype.sayHello = function() { return "Game of Life"; }

	GameOfLife.prototype.getCellInfo=function(cell){
		var info= "u="+formatNum(cell.currentGradients[0]); 
		return info;
	}
	
	GameOfLife.prototype.mouseMoveAlt = function(cell, cellDefaultValue) {
		cell.currentData.status = 1;
	}
	
	this.setCellValue = function(cell, value) {
		cell.currentData.status = value;
	}

	this.events = [];
	
	this.createDeadCell = function() {
		return {status: 0, displayValue: function() { return this.status; }}
	}
	this.createLivingCell = function() {
		return {status: 1, displayValue: function() { return this.status; }}
	}
	
	this.createCellData = this.createDeadCell;

	this.getNeighbours = new MooreNeighbourhood().getNeighbours;

	GameOfLife.prototype.calcCell = function(cell, dt) 	{
		/*
			Regeln: 
				Quelle: http://alphard.ethz.ch/Hafner/PPS/PPS2001/Life/Life2.htm#Game
				
				Die Zelle ueberlebt wenn: die Zelle 2 oder 3 Nachbarn hat
				hat eine Zelle genau 3 lebende Nachbarn so wird sie geboren
				ansonsten stirbt sie.
		*/
				
		var livingNeighours = 0;
		for (var idx = 0; idx < cell.neighbours.length; idx++) {
			livingNeighours += cell.neighbours[idx].currentData.status;
		}

		if (cell.currentData.status == 1) {
			if (livingNeighours == 3) {
				return this.createLivingCell();
			}
			if (livingNeighours == 2) {
				return this.createLivingCell();
			}
		}
		if (cell.currentData.status == 0) {
			if (livingNeighours == 3) {
				return this.createLivingCell();
			}
		}
		return this.createDeadCell();
		
	}
}

