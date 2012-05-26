if (typeof(module) != "undefined") {
	module.exports = CellularAutomata;
	var Cell = require('../../src/automata/Cell.js');
	var Swimmer = require('../../src/automata/Swimmer.js');
}

function CellularAutomata() {

	this.tusk = null;

	this.model = [];
		
	this.iterations = 0;
	
	this.rows = 100;
	
	this.cols = 100;
	
	this.swimmers = [];
	
	this.integration = null;
	
	this.forEachCell = function(fn) {
		for (var x = 0; x < this.cols; x++) {
			for (var y = 0; y < this.rows; y++) {
				var cell = this.model[x][y];
				fn(cell);
			}
		}
	};
	
	this.forEachSwimmer = function(fn) {
		for (var i = 0; i < this.swimmers.length; i++) {
			var swimmer = this.swimmers[i];
			fn(swimmer);
		}
	}
	
	this.initCells = function() {
		this.createCells();
		this.wireNeighbourCells();
	};
	
	this.createCells = function() {
		for (var i = 0; i < this.rows; i++) {
			this.model[i] = [];
			for (var j = 0; j < this.cols; j++) {
				var cell = new Cell();
				cell.x = j;
				cell.y = i;
				if (this.tusk != null) {
					cell.currentData = this.tusk.createCellData();
				}
				this.model[i][j] = cell;
			}
		}
	}
	
	this.wireNeighbourCells = function() {
		if (this.tusk != null) {
			this.forEachCell(
				(function(automata) {
					return function(cell) {
						cell.neighbours = automata.tusk.getNeighbours(cell, automata.model);
					};
				})(this)
			);
		}
	}
		
	this.step = function() {
				
		if (this.tusk != null) {
			
			// fire events, such as rain, vorteces etc.
			if (this.tusk.events) {
				for (var i = 0; i < this.tusk.events.length; i++) {
					if (this.tusk.events[i].enabled) {
						this.tusk.events[i].apply(this);
					}
				}
			}
			
			this.integration.integrate(this);
			
			// let swimmers travel
			if (this.tusk.getVelocity) {
				this.forEachSwimmer(
					(function(automata) {
						return function(swimmer) {
							var cell = automata.model[Math.floor(swimmer.location.y)][Math.floor(swimmer.location.x)];
							var velocity = automata.tusk.getVelocity(cell);
							swimmer.move(velocity);
							// swimmer collides with boundary => weggespickt!
							if (swimmer.location.x < 0 || swimmer.location.x >= automata.cols || swimmer.location.y < 0 || swimmer.location.y >= automata.rows) {
								if (swimmer.bounced) {
									swimmer.bounced();
									swimmer.move(velocity);
								} else {
									velocity = velocity.scale(-1);
									swimmer.move(velocity);
								}
							}
							cell = automata.model[Math.floor(swimmer.location.y)][Math.floor(swimmer.location.x)];
							swimmer.scale = 1.2 + Math.min(1, Math.max(-1, automata.tusk.primaryPool.getValue(cell)));
							if (swimmer.changeValue) {
								automata.tusk.setCellValue(cell, swimmer.changeValue(automata.tusk.primaryPool.getValue(cell)));
							}
						};
					})(this)
				);
			}
		}
				
		this.iterations++;
			
	}
		
}