PixelCanvasPainter = function(ctx) {
	this.context = ctx;
	
	this.pool = null;
	
	this.scaling = new Vector();
	
	this.view = null;

	this.baseColor = {r: 128, g: 128, b: 128};
	
	this.imageData = null;
	this.buf = null;
	this.buf8 = null;
	this.data = null;
	
	var PIXEL_DEPTH = 4;
	
	this.paintCell = function(cell) {
		
		if (this.pool == null) {
			return;
		}
		
		var x = cell.x * this.scaling.x;
		var y = cell.y * this.scaling.y;
		
		var baseColor = this.baseColor;
		var color = ViewUtils.getColor(this.pool.getValue(cell), baseColor.r, baseColor.g, baseColor.b);
		
		for (var ix = x; ix < x + this.scaling.x; ix++) {
			for (var iy = y; iy < y + this.scaling.y; iy++) {
				var p = (iy * this.view.CANVAS_WIDTH + ix);
				
				this.data[p] =
            		(255   << 24) | // alpha
            		(color.b << 16) |
            		(color.g <<  8) |
             		color.r;
			}
		}
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
		this.imageData = this.context.createImageData(this.view.CANVAS_WIDTH, this.view.CANVAS_HEIGHT);
		this.buf = new ArrayBuffer(this.imageData.data.length);
		this.buf8 = new Uint8ClampedArray(this.buf);
		this.data = new Uint32Array(this.buf);
	};
	
	this.end = function() {
		this.imageData.data.set(this.buf8);
		this.context.putImageData(this.imageData, 0, 0);
	};
	
}