var should = require('should');  
var CellularAutomata = require(__dirname + '/../src/CellularAutomata');  
  
describe('CellularAutomata', function() {

	it('should initialize', function() {
		
		var auto = new CellularAutomata();
		auto.initCells();
		
	});
		
});
