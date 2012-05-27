VectorCanvasPainter = function(ctx) {
	this.context = ctx;
	
	this.scaling = new Vector();
	
	this.baseColor = {r: 128, g: 128, b: 128};

	this.paintCell = function(cell) {
		
		if (this.pool == null) {
			return;
		}
		
		var x = cell.x * this.scaling.x;
		var y = cell.y * this.scaling.y;
		var baseColor = this.baseColor;

		var color = ViewUtils.getFormattedColor(this.pool.getValue(cell), baseColor.r, baseColor.g, baseColor.b);
		this.context.fillStyle = color;

		this.context.fillRect(x, y, this.scaling.x, this.scaling.y);
	};
	
	this.paintSwimmer = function(swimmer) {
		if (swimmer.image != null) {
			var x = swimmer.location.x * this.scaling.x;
			var y = swimmer.location.y * this.scaling.y;
			var width = swimmer.image.width * swimmer.scale;
			var height = swimmer.image.height * swimmer.scale;
			this.context.translate(x, y);
			this.context.rotate(swimmer.phi());
			this.context.drawImage(swimmer.image, -width / 2, -height / 2, width, height);
			this.context.rotate(-swimmer.phi());
			this.context.translate(-x, -y);
		} else {
			this.context.fillStyle = "rgb(255,255,0)";
			this.context.fillRect(swimmer.x, swimmer.y, this.scaling.x, this.scaling.y);
		}
	};
	
	this.begin = function() {
		// no action required because fillRect(...) has immediate effect
	};
	
	this.end = function() {
		// no action required because fillRect(...) has immediate effect
	};
	
}