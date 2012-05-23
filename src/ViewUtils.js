var ViewUtils = {
	
	getColor: function(du, r0, g0, b0) {
		var r = Math.min(255, Math.max(0, Math.floor(r0 * (1+du))));
		var g = Math.min(255, Math.max(0, Math.floor(g0 * (1+du))));
		var b = Math.min(255, Math.max(0, Math.floor(b0 * (1+du))));
		
		return {
			r: r,
			g: g,
			b: b
		};
	}
	
};
