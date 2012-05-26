if (typeof(module) != "undefined") {
	module.exports = Swimmer;
	var Vector = require('../../src/utils/Vector.js');
}

function AutoSwimmer() {
	
	this.image = null;
	
	this.location = new Vector();
	
	this.velocity = new Vector();
	
	this.autoVelocity = new Vector();
	this.autoVelocity.x = Math.random() * 1.41 - 1.41/2;
	this.autoVelocity.y = Math.random() * 1.41 - 1.41/2;
	
	this.move = function(d) {
		this.velocity = this.autoVelocity.clone().scale(0.8).add(d.scale(0.2));
		this.location.add(this.autoVelocity);
	}
	
	this.bounced = function() {
		this.autoVelocity.scale(-1);
	}
	
	this.scale = 1;
	
	this.phi = function() {
		return (this.velocity.x >= 0 && this.velocity.y < 0 ? Math.atan(this.velocity.x/-this.velocity.y)
			: this.velocity.x > 0 && this.velocity.y >= 0 ? Math.PI/2 + Math.atan(-this.velocity.y/this.velocity.x)
			: this.velocity.x <= 0 && this.velocity.y > 0 ? Math.PI + Math.atan(this.velocity.x/-this.velocity.y)
			: this.velocity.x < 0 && this.velocity.y <= 0 ? Math.PI * 3/2 + Math.atan(-this.velocity.y/this.velocity.x)
			: 0);
	}
	
	/*
	this.changeValue = function(value) {
		return -0.2;
	}
	*/
}
