PixelCanvasPainter = function(ctx) {
	this.context = ctx;
	
	this.getUIndex = function() { return 0; };
	this.getBaseColor = function() { return {r: 128, g: 128, b: 255 }; };
	
	this.imageData = null;
	this.buf = null;
	this.buf8 = null;
	this.data = null;
	
	var PIXEL_DEPTH = 4;
	
	this.updateCellView = function(cell) {
		
		var x = cell.x * scaleWidth;
		var y = cell.y * scaleHeight;
		
		var baseColor = this.getBaseColor();
		var color = getColor(cell.currentData.displayValue(), baseColor.r, baseColor.g, baseColor.b);
		
		for (var ix = x; ix < x + scaleWidth; ix++) {
			for (var iy = y; iy < y + scaleHeight; iy++) {
				var p = (iy * WIDTH + ix);
				
				this.data[p] =
            		(255   << 24) | // alpha
            		(color.b << 16) |
            		(color.g <<  8) |
             		color.r;
			}
		}
	};
	
	this.drawSwimmer = function(swimmer) {
		
		if (swimmer.image != null) {
			var x = swimmer.location.x * scaleWidth;
			var y = swimmer.location.y * scaleHeight;
			var width = swimmer.image.width * swimmer.scale;
			var height = swimmer.image.height * swimmer.scale;
			this.context.translate(x, y);
			this.context.rotate(swimmer.phi());
			this.context.drawImage(swimmer.image, -width / 2, -height / 2, width, height);
			this.context.rotate(-swimmer.phi());
			this.context.translate(-x, -y);
		} else {
			this.context.fillStyle = "rgb(255,255,0)";
			this.context.fillRect(duck.x,duck.y,scaleWidth,scaleHeight);
		}
				
	};
	
	this.begin = function() {
		this.imageData = this.context.createImageData(WIDTH, HEIGHT);
		this.buf = new ArrayBuffer(this.imageData.data.length);
		this.buf8 = new Uint8ClampedArray(this.buf);
		this.data = new Uint32Array(this.buf);
	};
	
	this.end = function() {
		this.imageData.data.set(this.buf8);
		this.context.putImageData(this.imageData, 0, 0);
	};
	
}