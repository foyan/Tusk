function Cell() {
	
	this.x = 0;
	this.y = 0;
	
	this.currentData = null;
	this.nextData = null;
	
	this.neighbours = null;

	this.currentVelocities = [0, 0];
	this.nextVelocities = [0, 0];
	this.custom=null;  // content depends on function
	
}
