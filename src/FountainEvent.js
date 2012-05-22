if (typeof(module) != "undefined") {
	module.exports = FountainEvent;
}

function FountainEvent(applyCell) {
	
	this.intensity = 1;
	
	this.pulseFrequency = 20;

	this.apply = function(automata) {
		if(this.intensity !=0 && automata.iterations % this.pulseFrequency == 0) {
			var fountains = [
				{
					x: automata.cols / 2,
					y: automata.rows / 2
				},
				{
					x: 10,
					y: 10
				}
			];
			for (var fi = 0; fi < fountains.length; fi++) {
				var fountain = fountains[fi];
				var cell = automata.model[fountain.x][fountain.y];
				applyCell(cell, this.intensity);
			}
		}
	}
	
	this.applyCell = applyCell;

}
