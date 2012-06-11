if (typeof(module) != "undefined") {
	module.exports = GameOfLife;
	var ATusk = require('../../src/tusks/ATusk.js');
	var MooreNeighbourhood = require('../../src/automata/MooreNeighbourhood.js');
	var Pool = require('../../src/tusks/Pool.js');
}

GameOfLife.prototype = new ATusk();

function GameOfLife() {

	this.slices = 1;
	
	GameOfLife.prototype.sayHello = function() { return "Game of Life"; }
	
	this.setCellValue = function(cell, value) {
		cell.currentData.status = value;
	}

	this.events = [];
	
	this.pools = [];
	
	this.primaryPool = new Pool("status", "", function(cell) { return cell.currentData.status; });

	this.templates = [
		{
			name: "Glider",
			get: function(automata) {
				var x = Math.floor(Math.random() * automata.cols - 6) + 3;
				var y = Math.floor(Math.random() * automata.rows - 6) + 3;
				var s  = y + "," + x + ",1;";
					s += (y+1) + "," + (x+1) + ",1;";
					s += (y+2) + "," + (x-1) + ",1,1,1";
				return s;
			}
		},
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
		},
		{
			name: "Window",
			get: function(automata) {
				var x = Math.floor(automata.cols / 2)-5;
				var y = Math.floor(automata.rows / 2)-5;
				var s  = y + "," + x + ",1,1,1,1,1,1,1,1,1,1,1,1,1;";
					s += (y+1) + "," + (x) + ",1,0,0,0,0,0,1,0,0,0,0,0,1;";
					s += (y+2) + "," + (x) + ",1,0,0,0,0,0,1,0,0,0,0,0,1;";
					s += (y+3) + "," + (x) + ",1,0,0,0,0,0,1,0,0,0,0,0,1;";
					s += (y+4) + "," + (x) + ",1,0,0,0,0,0,1,0,0,0,0,0,1;";
						s += (y+5) + "," + (x) + ",1,1,1,1,1,1,1,1,1,1,1,1,1;";
					s += (y+6) + "," + (x) + ",1,0,0,0,0,0,1,0,0,0,0,0,1;";
					s += (y+7) + "," + (x) + ",1,0,0,0,0,0,1,0,0,0,0,0,1;";
					s += (y+8) + "," + (x) + ",1,0,0,0,0,0,1,0,0,0,0,0,1;";
					s += (y+9) + "," + (x) + ",1,0,0,0,0,0,1,0,0,0,0,0,1;";
						s += (y+10) + "," + (x) + ",1,1,1,1,1,1,1,1,1,1,1,1,1;";
				return s;
			}
		}
	];
	
	this.createDeadCell = function() {
		return {status: 0};
	}
	this.createLivingCell = function() {
		return {status: 1};
	}
	
	this.createCellData = this.createDeadCell;

	this.getNeighbours = new MooreNeighbourhood().getNeighbours;

	this.calcDifferentials = function() {};

	this.applyDifferentials = function(cell, dt) 	{
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

