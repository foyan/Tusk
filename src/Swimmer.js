if (typeof(module) != "undefined") {
	module.exports = Swimmer;
	var Vector = require('../src/Vector.js');
}

function Swimmer() {
	
	this.image = null;
	
	this.location = new Vector();
	
	this.velocity = new Vector();
	
	this.move = function(d) {
		this.velocity = d;
		//this.velocity.scale(0.2).add(d).scale(0.8);
		this.location.add(d);
	}
	
	this.scale = 1;
	
	this.phi = function() {
		return (this.velocity.x >= 0 && this.velocity.y < 0 ? Math.atan(this.velocity.x/-this.velocity.y)
			: this.velocity.x > 0 && this.velocity.y >= 0 ? Math.PI/2 + Math.atan(-this.velocity.y/this.velocity.x)
			: this.velocity.x <= 0 && this.velocity.y > 0 ? Math.PI + Math.atan(this.velocity.x/-this.velocity.y)
			: this.velocity.x < 0 && this.velocity.y <= 0 ? Math.PI * 3/2 + Math.atan(-this.velocity.y/this.velocity.x)
			: 0);
	}
	
}
