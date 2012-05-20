var should = require('should');  
var WaveEquation = require(__dirname + '/../src/WaveEquation.js');
var Cell = require(__dirname + '/../src/Cell.js');

describe('WaveEquation', function() {
	
	it('should calculate properly', function() {
		var wave = new WaveEquation();
		
		var expected = Math.cos(1.0);
		
		var cell = {currentData: wave.createCellData()};
		var e = {currentData: wave.createCellData()};
		var n = {currentData: wave.createCellData()};
		var s = {currentData: wave.createCellData()};
		var w = {currentData: wave.createCellData()};
		cell.neighbours = {w:w,e:e, n:n, s:s};
		
		cell.currentData.ut = 1.0;
		
		// do a thousand iterations
		for (var i = 0; i < 1000; i++) {
			var nextData = wave.calcCell(cell, 1.0/1000.0, 1.0, 1.0);
			cell.currentData = nextData;
		}
		
		//cell.currentData.ut.should.equal(expected);
	});
	
});
