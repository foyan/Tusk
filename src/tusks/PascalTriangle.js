if (typeof(module) != "undefined") {
	module.exports = PascalTriangle;
	var ATusk = require('../../src/tusks/ATusk.js');
	var MooreNeighbourhood = require('../../src/automata/MooreNeighbourhood.js');
	var Pool = require('../../src/tusks/Pool.js');
}

PascalTriangle.prototype = new ATusk();

function PascalTriangle() {

	this.slices = 1;
	
	PascalTriangle.prototype.sayHello = function() { return "Pascal Triangle"; }
	
	this.setCellValue = function(cell, value) {
		cell.currentData.status = value;
	}

	this.events = [];
	
	this.pools = [];
	
	this.primaryPool = new Pool("status", "", function(cell) { return cell.currentData.status; });

	this.templates = [
		{
			name: "Start",
			get: function(automata) {
				var x = Math.floor(Math.random() * automata.cols - 6) + 3;
				var y = Math.floor(Math.random() * automata.rows - 6) + 3;
				var s  = y + "," + x + ",1,1";
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
	this.cellStatus = function(val) {
		return {status: val};
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
				
		  var val = (cell.neighbours[0].currentData.status + cell.neighbours[3].currentData.status)   ;
		//this.setCellValue(cell, val);
		return {status: Math.max(val, cell.currentData.status)};
		
		
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

