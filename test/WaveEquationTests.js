var should = require('should');  
var WaveEquation = require(__dirname + '/../src/WaveEquation.js'); 

describe('WaveEquation', function() {
	
	it('should calculate properly', function() {
		var wave = new WaveEquation();
		
		var expected = Math.sin(1.0);
		
		// do a thousand iterations
		for (var i = 0; i < 1000; i++) {
			
		}	
	});
	
});
