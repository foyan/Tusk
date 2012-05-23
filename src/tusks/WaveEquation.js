if (typeof(module) != "undefined") {
	module.exports = WaveEquation;
	var ATusk = require('../../src/tusks/ATusk.js');
	var VonNeumannNeighbourhood = require('../../src/automata/VonNeumannNeighbourhood.js');
	var RainEvent = require('../../src/RainEvent.js');
	var VortexEvent = require('../../src/VortexEvent.js');
	var FountainEvent = require('../../src/FountainEvent.js');
	var Pool = require('../../src/Pool.js');
}

WaveEquation.prototype = new ATusk();

function WaveEquation() {
	
	this.createCellData = function() {
		return {
			ut: 0,
			up: 0,
			udx: 0,
			udxdx: 0,
			upp: 0,
			ut: 0,
			vx: 0,
			vy: 0,
			
			displayValue: function() { return this.ut; }
		};
	};
	
	this.getNeighbours = new VonNeumannNeighbourhood().getNeighbours;
	
	this.events = [
		new RainEvent(
			function(cell, value) {
				cell.currentData.ut = value;
			}
		),
		new VortexEvent(
			function(cell, value) {
				cell.currentData.up = value - cell.currentData.ut;
				cell.currentData.ut = value;
			}
		),
		new FountainEvent(
			function(cell, value) {
				cell.currentData.up = value - cell.currentData.ut;
				cell.currentData.ut = value;
			}
		)
	];
	
	this.setCellValue = function(cell, value) {
		cell.currentData.up = value - cell.currentData.ut;
		cell.currentData.ut = value;
	}
	
	this.pools = [
		new Pool("du/dx", "pics/udx.png", function(cell) { return cell.currentData.udx; }),
		new Pool("d2u/dx2", "pics/udxdx.png", function(cell) { return cell.currentData.udxdx;}),
		new Pool("upp", "pics/udt.png", function(cell) {return cell.currentData.upp;}),
		new Pool("up", "pics/u(x,t+dt).png", function(cell) {return cell.currentData.up;}),
		new Pool("vx", "", function(cell) {return cell.currentData.vx;}),
		new Pool("vy", "", function(cell) {return cell.currentData.vy;})
	];
	
	WaveEquation.prototype.sayHello = function() { return "Wave Equation"; }

	WaveEquation.prototype.getCellInfo = function(cell){		 
		var lf="\t";
		var info= 
		"u="+formatNum(cell.currentData.ut) + lf+
		"u'="+formatNum(cell.currentData.udx) + lf+
		"u''="+formatNum(cell.currentData.udxdx)+lf+
		"u.="+formatNum(cell.currentData.up) + lf+
		"u..="+formatNum(cell.currentData.upp) + lf+
		//"v_x="+formatNum(cell.currentVelocities[0]) + lf+
		//"v_y="+formatNum(cell.currentVelocities[1]) + lf+
		//"phi="+formatNum(calculateDuckPhi(cell.currentVelocities[0], cell.currentVelocities[1]))*360/6.28 +
		 "<br/>"
		return info;
	}
	
	WaveEquation.prototype.mouseMoveAlt=function(cell, cellDefaultValue) {
		var initVal= (cellDefaultValue.value == null || cellDefaultValue.value == "") ? -0.9 : parseFloat(cellDefaultValue.value);
				
		cell.currentData.ut = initVal;
		cell.currentData.up = this.calculateUp(cell, 1, 1);
	}
	
	this.getVelocity = function(cell) {
		var v = new Vector();
		v.x = cell.currentData.vx;
		v.y = cell.currentData.vy;
		return v;
	}
	
	this.calculateUp = function(cell, dt, c) {
		var udxdx = -2 * cell.currentData.ut
			+ (cell.neighbours.w.currentData.ut + cell.neighbours.n.currentData.ut) / 2
			+ (cell.neighbours.e.currentData.ut + cell.neighbours.s.currentData.ut) / 2;
		var upp = udxdx * c;
		return cell.currentData.up + upp * dt;
	}
		
	WaveEquation.prototype.calcCell = function(cell, dt) {
		var c = 1.0 / this.viscosity;

		var u = cell.currentData.ut;
		
		var udx = u - (cell.neighbours.w.currentData.ut + cell.neighbours.n.currentData.ut) / 2;
		var udxdx = -2 * u + (cell.neighbours.w.currentData.ut + cell.neighbours.n.currentData.ut) / 2 + (cell.neighbours.e.currentData.ut + cell.neighbours.s.currentData.ut) / 2;
		
		var upp = udxdx * c;
		var up = cell.currentData.up + upp * dt;
		var ut = (u + up * dt) * this.damping;
		
		return {
			ut: ut,
			up: up,
			udx: udx,
			udxdx: udxdx,
			upp: upp,
			ut: ut,
			vx: (-u + cell.neighbours.w.currentData.ut) * 10 / this.viscosity,
			vy: (-u + cell.neighbours.n.currentData.ut) * 10 / this.viscosity,
			
			displayValue: function() { return this.ut; }
		};
	}
	
}
