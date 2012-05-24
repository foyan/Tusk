var PainterFactory = {
	
	types: [
		{
			name: "Pixel manipulation",
			creator: function(canvas) {
				return new PixelCanvasPainter(canvas.getContext("2d"));
			}
		},
		{
			name: "Vector drawing",
			creator: function(canvas) {
				return new VectorCanvasPainter(canvas.getContext("2d"));
			}
		},
		{
			name: "NOOP",
			creator: function(canvas) {
				return new NoopCanvasPainter(canvas.getContext("2d"));
			}
		},
	]
					
};
