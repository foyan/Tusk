/*
	common types

*/



function Point(x, y){
	this.x = x;
	this.y = y;
}	


function CellData() {
	this.currentGradients = Array();
	this.nextGradients = Array();
	this.cell = null;
	this.x = 0;
	this.y = 0;
	this.hasDuck = false;
	this.currentVelocities = [0, 0];
	this.nextVelocities = [0, 0];
	this.custom=null;  // content depends on function
}

/*
	x,y: Point wo sich die Ente befindet
	ax,ay: beschleunigungs Vektor der Ente
*/
function Duck(x,y, ax,ay){
	this.x=x;
	this.y=y;
	this.velocityX=ax;  // TODO: => Geschwindigkeit
	this.velocityY=ay;
}

	