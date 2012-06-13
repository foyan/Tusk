if (typeof(module) != "undefined") {
	module.exports = Cell;
}

function Cell() {
	
	this.x = 0;
	this.y = 0;
	
	this.currentData = null;
	this.nextData = null;
	
	this.neighbours = null;

}
