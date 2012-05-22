var should = require('should');  
var MooreNeighbourhood = require(__dirname + '/../src/MooreNeighbourhood.js'); 
  
describe('MooreNeighbourhood', function() {

	it('should not return anything for 1x1 model', function() {
		var neigh = new MooreNeighbourhood();
		var cell = {x: 0, y: 0};
		var model = [[cell]];
		var n = neigh.getNeighbours(cell, model);
		
		n.length.should.equal(0);
	});
	
	it ('should return 8 cells', function() {
		var neigh = new MooreNeighbourhood();
		var cell = {x: 1, y: 1};
		var model = [[{},{},{}],[{},cell,{}],[{},{},{}]];
		var n = neigh.getNeighbours(cell, model);
		
		n.length.should.equal(8);
	});
	
});