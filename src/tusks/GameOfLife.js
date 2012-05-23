if (typeof(module) != "undefined") {
	module.exports = GameOfLife;
	var ATusk = require('../../src/tusks/ATusk.js');
	var MooreNeighbourhood = require('../../src/MooreNeighbourhood.js');
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
	
	this.templates = [
		{
			name: "50% Alive",
			get: function(automata) {
				var s = "";
				for (var y = 0; y < automata.rows; y++) {
					for (var x = 0; x < automata.cols; x++) {
						var val = Math.random() >= 0.5 ? "1" : "0";
						if (val == "1") {
							s += y + "," + x + "," + val + ";";
						}
					}
				}
				return s;
			}
		},
		/*{
			name: "Glider",
			get: function(automata) {
				var x = Math.floor(Math.random() * automata.cols - 6) + 3;
				var y = Math.floor(Math.random() * automata.rows - 6) + 3;
				var s  = y + "," + x + ",1;";
					s += (y+1) + "," + (x+1) + ",1;";
					s += (y+2) + "," + (x-1) + ",1,1,1";
				return s;
			}
		},*/
		{
			name: "54-0",
			get: function(automata) {
				var x = Math.floor(automata.cols / 2)-1;
				var y = Math.floor(automata.rows / 2)-1;
				return y + "," + x + ",1,1,1;"
					+ (y+1) + "," + (x+0) + ",1;" + (y+1) + "," + (x+2) + ",1;"
					+ (y+2) + "," + (x+0) + ",1;" + (y+2) + "," + (x+2) + ",1;"
					+ (y+4) + "," + (x+0) + ",1;" + (y+4) + "," + (x+2) + ",1;"
					+ (y+5) + "," + (x+0) + ",1;" + (y+5) + "," + (x+2) + ",1;"
					+ (y+6) + "," + (x+0) + ",1,1,1;"
				;
			}
		},
		{
			name: "f-Pentomimo",
			get: function(automata) {
				var x = Math.floor(automata.cols / 2)-1;
				var y = Math.floor(automata.rows / 2)-1;
				return y + "," + x + ",1,1;"
					+ (y+1) + "," + (x-1) + ",1,1;"
					+ (y+2) + "," + x + ",1"
				;
			}
		}
		/*{
			name: "Glider (downstairs, R=>L)",
			get: function(automata) {
				var x = Math.floor(Math.random() * automata.cols - 6) + 3;
				var y = Math.floor(Math.random() * automata.rows - 6) + 3;
				var s  = y + "," + x + ",1;";
					s += (y+1) + "," + (x-1) + ",1;";
					s += (y+2) + "," + (x-1) + ",1,1,1";
				return s;
			}
		},
		{
			name: "Glider (upstairs, L=>R)",
			get: function(automata) {
				var x = Math.floor(Math.random() * automata.cols - 6) + 3;
				var y = Math.floor(Math.random() * automata.rows - 6) + 3;
				var s  = (y+2) + "," + x + ",1;";
					s += (y+1) + "," + (x+1) + ",1;";
					s += (y) + "," + (x-1) + ",1,1,1";
				return s;
			}
		},
		{
			name: "Glider (upstairs, R=>L)",
			get: function(automata) {
				var x = Math.floor(Math.random() * automata.cols - 6) + 3;
				var y = Math.floor(Math.random() * automata.rows - 6) + 3;
				var s  = (y+2) + "," + x + ",1;";
					s += (y+1) + "," + (x-1) + ",1;";
					s += (y) + "," + (x-1) + ",1,1,1";
				return s;
			}
		}*/
	];
	
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

