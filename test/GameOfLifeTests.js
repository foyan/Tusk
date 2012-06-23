var should = require('should');  
var GameOfLife = require(__dirname + '/../src/tusks/GameOfLife.js'); 
  
describe('GameOfLife', function() {

	var game = new GameOfLife();

	var creator = function(st) {
		return {currentData: {status: st}};
	};
	
	var assert = function(game, cell, model, expected) {
		cell.neighbours = game.getNeighbours(cell, model);
		var result = game.applyDifferentials(cell, 1, 1, 1);
		
		result.status.should.equal(expected);
	}

	it('should comply to rule 1', function() {
		var cell = {x:1, y:1, currentData: {status: 0}};
				
		var model = [
			[creator(1), creator(1), creator(1)],
			[creator(0), cell      , creator(0)],
			[creator(0), creator(0), creator(0)]
		];
		
		assert(game, cell, model, 1);
				
	});
	
	it('should comply to rule 2', function() {
		var cell = {x:1, y:1, currentData: {status: 0}};
				
		var model = [
			[creator(1), creator(0), creator(0)],
			[creator(0), cell      , creator(0)],
			[creator(0), creator(0), creator(0)]
		];
		
		assert(game, cell, model, 0);
				
	});

	it('should comply to rule 3_1', function() {
		var cell = {x:1, y:1, currentData: {status: 1}};
				
		var model = [
			[creator(1), creator(1), creator(0)],
			[creator(0), cell      , creator(0)],
			[creator(0), creator(0), creator(0)]
		];
		
		assert(game, cell, model, 1);
				
	});

	it('should comply to rule 3_2', function() {
		var cell = {x:1, y:1, currentData: {status: 1}};
				
		var model = [
			[creator(1), creator(1), creator(1)],
			[creator(0), cell      , creator(0)],
			[creator(0), creator(0), creator(0)]
		];
		
		assert(game, cell, model, 1);
				
	});

	it('should comply to rule 4', function() {
		var cell = {x:1, y:1, currentData: {status: 1}};
				
		var model = [
			[creator(1), creator(1), creator(1)],
			[creator(1), cell      , creator(0)],
			[creator(0), creator(0), creator(0)]
		];
		
		assert(game, cell, model, 0);
				
	});

	it('should comply to rule 5', function() {
		var cell = {x:1, y:1, currentData: {status: 0}};
				
		var model = [
			[creator(1), creator(0), creator(0)],
			[creator(1), cell      , creator(0)],
			[creator(0), creator(0), creator(0)]
		];
		
		assert(game, cell, model, 0);
				
	});

});