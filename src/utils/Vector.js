if (typeof(module) != "undefined") {
	module.exports = Vector;
}

function Vector() {
	
	this.x = 0;
	
	this.y = 0;
	
	this.add = function(d) {
		this.x += d.x;
		this.y += d.y;
		return this;
	}
	
	this.scale = function(s) {
		this.x *= s;
		this.y *= s;
		return this;
	}
	
	this.clone = function() {
		var v = new Vector();
		v.x = this.x;
		v.y = this.y;
		return v;
	}
	
}