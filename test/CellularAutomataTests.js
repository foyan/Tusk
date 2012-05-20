var should = require('should');  
var CellularAutomata = require(__dirname + '/../src/CellularAutomata.js');  
  
describe('CellularAutomata', function() {

	it('should initialize without Tusk', function() {
		var auto = new CellularAutomata();
		auto.initCells();
	});
	
	it('should step without Tusk', function() {
		var auto = new CellularAutomata();
		auto.initCells();
		var iterations = auto.iterations;
		auto.step();
		auto.iterations.should.equal(iterations+1);
	});
	
	it('should initialize with mocked Tusk', function() {

		var tusk = {
			slices: 2,
			createCellData: function() {
				return "Boing";
			},
			getNeighbours: function(cell, cells) {
				return cell;
			}
		};

		var auto = new CellularAutomata();
		auto.rows = 1;
		auto.cols = 1;	
		auto.tusk = tusk;
		auto.initCells();
		auto.model.length.should.equal(1);
		auto.model[0].length.should.equal(1);
		auto.model[0][0].currentData.should.equal("Boing");
		auto.model[0][0].neighbours.should.equal(auto.model[0][0]);
	});
		
	it('should step with mocked Tusk', function() {

		var tusk = {
			slices: 1,
			createCellData: function() {
				return "Boing";
			},
			getNeighbours: function(cell, cells) {
				return cell;
			},
			calcCell: function(cell, dt, damping, viscosity) {
				return cell.currentData + ".";
			}
		};

		var auto = new CellularAutomata();
		auto.rows = 1;
		auto.cols = 1;	
		auto.tusk = tusk;
		auto.initCells();

		auto.step();
		auto.model[0][0].currentData.should.equal("Boing.");
	});

	it('should triple-step with mocked Tusk and three slices', function() {

		var tusk = {
			slices: 3,
			createCellData: function() {
				return "Boing";
			},
			getNeighbours: function(cell, cells) {
				return cell;
			},
			calcCell: function(cell, dt, damping, viscosity) {
				return cell.currentData + ".";
			}
		};

		var auto = new CellularAutomata();
		auto.rows = 1;
		auto.cols = 1;	
		auto.tusk = tusk;
		auto.initCells();

		var iterations = auto.iterations;
		auto.step();
		auto.model[0][0].currentData.should.equal("Boing...");
		auto.iterations.should.equal(iterations+1);
	});

	it('should six-step with mocked Tusk and three slices and step() two times', function() {

		var tusk = {
			slices: 3,
			createCellData: function() {
				return "Boing";
			},
			getNeighbours: function(cell, cells) {
				return cell;
			},
			calcCell: function(cell, dt, damping, viscosity) {
				return cell.currentData + ".";
			}
		};

		var auto = new CellularAutomata();
		auto.rows = 1;
		auto.cols = 1;	
		auto.tusk = tusk;
		auto.initCells();

		var iterations = auto.iterations;
		auto.step();
		auto.model[0][0].currentData.should.equal("Boing...");
		auto.iterations.should.equal(iterations+1);
		auto.step();
		auto.model[0][0].currentData.should.equal("Boing......");
		auto.iterations.should.equal(iterations+2);
	});

});
