VectorCanvasPainter = function(ctx) {
	this.context = ctx;
	
	this.scaling = new Vector();
		
	this.paintCell = function(cell) {
		var du = cell.currentGradients; // get values ...
		var x = cell.x * scaleWidth; // ... calculate x position in pixels ...
		var y = cell.y * scaleHeight; // ... calculate y position in pixels ...
		var baseColor = this.getBaseColor(); // ... get base painter color ...
		// ... let Tusk calculate actual cell color, and format it as 'rgb(r, g, b)...'
		var color = ViewUtils.getFormattedColor(du[this.getUIndex()], baseColor.r, baseColor.g, baseColor.b);
		this.context.fillStyle = color;
		// ... draw and fill a rectangle.
		this.context.fillRect(x, y, scaleWidth, scaleHeight);
	};
	
	this.paintSwimmer = function(duck, cell) {
		if(duckImage == null) {
			this.context.fillStyle = "rgb(255,255,0)";
			this.context.fillRect(duck.x,duck.y,scaleWidth,scaleHeight);
		} else {
			var phi = calculateDuckPhi(cell.currentVelocities[0], cell.currentVelocities[1])
			this.context.translate(duck.x, duck.y);
			this.context.rotate(phi);
			this.context.drawImage(duckImage, -18, -18);
			this.context.rotate(-phi);
			this.context.translate(-duck.x, -duck.y);
		}
	};
	
	this.begin = function() {
		// no action required because fillRect(...) has immediate effect
	};
	
	this.end = function() {
		// no action required because fillRect(...) has immediate effect
	};
	
}