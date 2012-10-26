function LinearColorizer() {

	this.name = "Linear";
	
	this.THRESHOLD = 1000000;
	
	this.step = 0;
	
	this.min = -16000;
	this.max = +16000;

	this.getColor = function(du, r0, g0, b0) {
		var rgb = Math.abs(Math.floor(du));
		return {
			r: rgb & 255,
			g: (rgb >> 8) & 255,
			b: (rgb >> 16) & 255
		};
	};

};
