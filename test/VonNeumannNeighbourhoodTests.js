var should = require('should');  
var VonNeumannNeighbourhood = require(__dirname + '/../src/automata/VonNeumannNeighbourhood.js'); 
  
describe('VonNeumannNeighbourhood', function() {

	it('should return all same for 1x1 model', function() {
		var neigh = new VonNeumannNeighbourhood();
		var cell = {x: 0, y: 0};
		var model = [[cell]];
		var n = neigh.getNeighbours(cell, model);
		n.e.should.equal(cell);
		n.w.should.equal(cell);
		n.s.should.equal(cell);
		n.n.should.equal(cell);
	});

	it('should return proper neighbours', function() {
		var neigh = new VonNeumannNeighbourhood();
		
		var nw = {x:0, y:0};
		var n  = {x:1, y:0};
		var ne = {x:2, y:0};
		var w  = {x:0, y:1};
		var c =  {x:1, y:1};
		var e =  {x:2, y:1};
		var sw = {x:0, y:2};
		var s  = {x:1, y:2};
		var se = {x:2, y:2};
		
		var model = [[nw, n, ne], [w,c,e], [sw,s,se]];
		var neighbours = neigh.getNeighbours(c, model);
		neighbours.e.should.equal(e);
		neighbours.w.should.equal(w);
		neighbours.s.should.equal(s);
		neighbours.n.should.equal(n);
	});

});