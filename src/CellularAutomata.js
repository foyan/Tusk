if (typeof(module) != "undefined") {
	module.exports = CellularAutomata;
	var Cell = require('../src/Cell.js');
}

function CellularAutomata() {

	this.tusk = null;

	this.model = [];
		
	this.iterations = 0;
	
	this.rows = 100;
	
	this.cols = 100;
	
	this.damping = .995;
	
	this.viscosity = 1.0;
	
	this.forEachCell = function(fn) {
		for (var x = 0; x < this.cols; x++) {
			for (var y = 0; y < this.rows; y++) {
				var cell = this.model[x][y];
				fn(cell);
			}
		}
	};
	
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
				
		//this.additionalSupportSteps();
		if (this.tusk != null) {
			var dt = 1 / this.tusk.slices;
			for (var t = 0; t < this.tusk.slices; t++) {
				
				this.forEachCell(
					(function(automata) {
						return function(cell) {
							var nextData = automata.tusk.calcCell(cell, dt, automata.damping, automata.viscosity);
							cell.nextData = nextData;
							
							//me.nextVelocities = (tusk.supportsDuck==false? 0: 
							//					w_Duck(me.currentGradients[0], [x.previous[0], y.previous[0]], me.currentVelocities));
						};
					})(this)
				);
				
				this.forEachCell(
					function(cell) {
						cell.currentData = cell.nextData;
					}
				);
				
			}
		}
		
		//this.doTheDuck();
		
		this.iterations++;
			
	}
	
	this.additionalSupportSteps = function() {
		if(this.tusk.supportsRains){
			var drops = rainIntensity.value == 0 ? 0
				: rainIntensity.value >= 1 ? rainIntensity.value
				: automata.iterations % (Math.floor(1/rainIntensity.value)) == 0 ? 1 : 0;
			
			for (var i = 0; i < drops; i++) {
				var x = Math.floor(Math.random() * automata.cols);
				var y = Math.floor(Math.random() * automata.rows);
				tusk.getRainValue(automata.model[x][y], drops, i);		
			}
		}  // rainSupport
		
		if(this.tusk.supportsFountain) {	
			if( fountainIntensity.value !=0 && automata.iterations % 20==0) {
				var fountains=tusk.getFountains(fountainIntensity.value, automata.rows, automata.cols);  // returns Fountain[]
				if( fountains.length >0){
					for (var fi = 0; fi < fountains.length; fi++) {
						var f=fountains[fi];
						var g=automata.model[f.x][f.y];
						g.currentGradients[0] = f.intensity;
						for (var i= 1;i<= 5;i++) 
							g.currentGradients[i]=0;
					}
				}
			}
		}  // fountainSupport	
	}
	
	this.doTheDuck = function() {
		if (tusk.supportsDuck) {
			for (var d = 0; d < ducks.length; d++) {
				var duck = ducks[d];
				var duckCell = getCells(duck);
	
				var i = duckCell.x;
				var j = duckCell.y;
	
				var nord = i == 0 ? null : automata.model[i-1][j];
				var south = i == automata.rows -1 ? null : automata.model[i+1][j];
				var west = j == 0 ? null : automata.model[i][j-1];
				var east = j == automata.cols-1 ? null : automata.model[i][j+1];
								
				var me = duckCell;
				var k=30;
								
				xprevious = (west != null ? west : me).currentGradients;
				xnext = (east != null ? east : me).currentGradients;
				yprevious = (nord != null ? nord : me).currentGradients;
				ynext = (south != null ? south : me).currentGradients;
	
				// duck.velocityX += (duckCell.currentGradients[0]-xprevious[0])*k;
				// duck.velocityX += (-duckCell.currentGradients[0]+xnext[0])*k;
				// duck.velocityY += (duckCell.currentGradients[0]-yprevious[0])*k;
				// duck.velocityY += (-duckCell.currentGradients[0]+ynext[0])*k;
				
				var cellxy= new Duck(0,0,0,0);
				
				cellxy.velocityX+=-xprevious[0];
				cellxy.velocityX+=-xnext[0];
				cellxy.velocityY+=-yprevious[0];
				cellxy.velocityY+=-ynext[0];
				
				var duckxy= new Point(duck.velocityX,duck.velocityY);
				duckxy.x+= cellxy.velocityX*k;
				duckxy.y+= cellxy.velocityY*k;
				duckxy.velocityX=cellxy.velocityX;
				duckxy.velocityY=cellxy.velocityY;
				
				duck.x=Math.max(0, Math.min(WIDTH-1,duck.x+duckxy.x));
				duck.y=Math.max(0, Math.min(HEIGHT-1,duck.y+duckxy.y));
				
				// duck.x = Math.max(0, Math.min(WIDTH-1, duck.velocityX));
				// duck.y = Math.max(0, Math.min(HEIGHT-1, duck.velocityY));
				var newDuckCell = getCells(duck);
				drawDuck(duck, duckCell);
				if (duckCell != newDuckCell) {
					duckCell.currentVelocities[0] = 0;
					duckCell.currentVelocities[1] = 0;
					duckCell.currentGradients[0] = 0;
				}
			}
		}
		
	}
		
}