NoopCanvasPainter = function(ctx) {
	this.context = ctx;
	
	this.scaling = new Vector();
	
	this.paintCell = function(cell) {
		// NOOP.
	};
	
	this.paintSwimmer = function(swimmer, cell) {
		// NOOP.
	};
	
	this.begin = function() {
		// NOOP.
	};
	
	this.end = function() {
		// NOOP.
	};
	
}