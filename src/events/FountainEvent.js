if (typeof(module) != "undefined") {
	module.exports = FountainEvent;
}

function FountainEvent(applyCell) {
	
	this.intensity = 1;
	
	this.pulseFrequency = 20;

	this.apply = function(automata) {
		var fountains = [
			{
				x: Math.floor(automata.cols / 2),
				y: Math.floor(automata.rows / 2),
				threshold: 10
			},
			{
				x: 10,
				y: 10,
				threshold: 0
			}
		];
		for (var fi = 0; fi < fountains.length; fi++) {
			var fountain = fountains[fi];
			if(this.intensity !=0 && automata.iterations % this.pulseFrequency == fountain.threshold) {
				var cell = automata.model[fountain.x][fountain.y];
				applyCell(cell, this.intensity);
			}
		}
	}
	
	this.name = "Pulse Fountain";
	
	this.applyCell = applyCell;

}
