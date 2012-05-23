NoopCanvasPainter = function(ctx) {
	this.context = ctx;
	
	this.getUIndex = function() { return 0; };
	this.getBaseColor = function() { return {r: 128, g: 128, b: 255 }; };
	
	this.updateCellView = function(cell) {
		// NOOP.
	};
	
	this.drawDuck = function(duck, cell) {
		// NOOP.
	};
	
	this.begin = function() {
		// NOOP.
	};
	
	this.end = function() {
		// NOOP.
	};
	
}