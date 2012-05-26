if (typeof(module) != "undefined") {
	module.exports = WaveEquation;
	var ATusk = require('../../src/tusks/ATusk.js');
	var VonNeumannNeighbourhood = require('../../src/automata/VonNeumannNeighbourhood.js');
	var RainEvent = require('../../src/events/RainEvent.js');
	var VortexEvent = require('../../src/events/VortexEvent.js');
	var FountainEvent = require('../../src/events/FountainEvent.js');
	var Pool = require('../../src/tusks/Pool.js');
}

WaveEquation.prototype = new ATusk();

function WaveEquation() {
	
	this.createCellData = function() {
		return {
			u: 0,
			udx: 0,
			udxdx: 0,
			udtdt: 0,
			udt: 0,
			vx: 0,
			vy: 0,

			displayValue: function() { return this.u; }
		};
	};
	
	this.getNeighbours = new VonNeumannNeighbourhood().getNeighbours;
	
	this.templates = [];

	this.events = [
		new RainEvent(
			function(cell, value) {
				cell.currentData.udt = value - cell.currentData.u;
				cell.currentData.u = value;
			}
		),
		new VortexEvent(
			function(cell, value) {
				cell.currentData.udt = value - cell.currentData.u;
				cell.currentData.u = value;
			}
		),
		new FountainEvent(
			function(cell, value) {
				cell.currentData.udt = value - cell.currentData.u;
				cell.currentData.u = value;
			}
		)
	];
	
	this.setCellValue = function(cell, value) {
		cell.currentData.udt = value - cell.currentData.u;
		cell.currentData.u = value;
	}
	
	this.pools = [
		new Pool("du/dx", "_assets/pics/udx.png", function(cell) { return cell.currentData.udx; }),
		new Pool("d2u/dx2", "_assets/pics/udxdx.png", function(cell) { return cell.currentData.udxdx;}),
		new Pool("udtdt", "_assets/pics/udt.png", function(cell) {return cell.currentData.udtdt;}),
		new Pool("udt", "_assets/pics/u(x,t+dt).png", function(cell) {return cell.currentData.udt;}),
		new Pool("vx", "", function(cell) {return cell.currentData.vx;}),
		new Pool("vy", "", function(cell) {return cell.currentData.vy;})
	];
	
	this.primaryPool = new Pool("u", "", function(cell) { return cell.currentData.u;});
	
	WaveEquation.prototype.sayHello = function() { return "Wave Equation"; }

	this.getVelocity = function(cell) {
		var v = new Vector();
		v.x = cell.currentData.vx;
		v.y = cell.currentData.vy;
		return v;
	}
	
	this.calcDifferentials = function(cell, dt, get) {
		var c = 1.0 / this.viscosity;

		var u = get(cell).u;
		
		var udx = u - (get(cell.neighbours.w).u + get(cell.neighbours.n).u) / 2;
		var udxdx = -2 * u + (get(cell.neighbours.w).u + get(cell.neighbours.n).u) / 2
			+ (get(cell.neighbours.e).u + get(cell.neighbours.s).u) / 2;
		
		var udtdt = udxdx * c;
		var udt = get(cell).udt + udtdt * dt;
		
		return {
			udt: udt,
			udtdt: udtdt,
			
			udx: udx,
			udxdx: udxdx
		};
	}
	
	this.applyDifferentials = function(cell, dt, differentials, get) {
		return {
			u: (get(cell).u + differentials.udt * dt) * this.damping,
			udt: differentials.udt,
			vx: (get(cell.neighbours.w).u - get(cell).u) * 10 / this.viscosity,
			vy: (get(cell.neighbours.n).u - get(cell).u) * 10 / this.viscosity,
			
			udx: differentials.udx,
			udxdx: differentials.udxdx,
			udtdt: differentials.udtdt,
			
			displayValue: function() { return this.u; }
		};
	}
		
}
