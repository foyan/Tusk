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

	this.createCellData = this.createDeadCell;

	this.getNeighbours = new MooreNeighbourhood().getNeighbours;

	this.calcDifferentials = function() {};

	this.applyDifferentials = function(cell, dt) 	{
		/*
			Regeln: 
				...
		*/
				
		var val = (cell.neighbours[0].currentData.status + cell.neighbours[3].currentData.status)   ;
		return {status: Math.max(val, cell.currentData.status)};
		
	}
}

