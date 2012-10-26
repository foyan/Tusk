var NormalColorizer = {

	name: "Linear by channel",

	getColor: function(du, r0, g0, b0) {
		return {
			r: Math.min(255, Math.max(0, Math.floor(r0 * (1 + du)))),
			g: Math.min(255, Math.max(0, Math.floor(g0 * (1 + du)))),
			b: Math.min(255, Math.max(0, Math.floor(b0 * (1 + du))))
		};
	}

};