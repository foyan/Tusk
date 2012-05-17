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
		var du = cell.currentGradients;
		
		var x = cell.x * scaleWidth;
		var y = cell.y * scaleHeight;
		
		var baseColor = this.getBaseColor();
		var color = getColor(du[this.getUIndex()], baseColor.r, baseColor.g, baseColor.b);
		
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
		//this.context.fillStyle = getColor(du[this.getUIndex()], baseColor.r, baseColor.g, baseColor.b);
		//this.context.fillRect(x,y,scaleWidth,scaleHeight);
	};
	
	this.drawDuck = function(duck, cell) {
		/*
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
		*/
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