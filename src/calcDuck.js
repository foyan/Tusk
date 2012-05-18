
/*

 calc the new position of the duck.
 returns a duck-object
 
 sampel call: var newDuck= calcDuck(duck, duckCell, yprevious, xnext, ynext, xprevious);

*/
function calcDuck(duck, duckcell, north, east, south, west){
	var cellxy= new Duck(0,0,0,0);
	
	var k=10;
	cellxy.velocityX+=-west[0];
	cellxy.velocityX+=east[0];
	cellxy.velocityY+=-north[0];
	cellxy.velocityY+=south[0];
	
	var duckxy= new Point(duck.velocityX,duck.velocityY);
	duckxy.x+= cellxy.velocityX*k;
	duckxy.y+= cellxy.velocityY*k;
	duckxy.velocityX=cellxy.velocityX;
	duckxy.velocityY=cellxy.velocityY;
	
	duck.x=Math.max(0, Math.min(WIDTH-1,duck.x+duckxy.x));
	duck.y=Math.max(0, Math.min(HEIGHT-1,duck.y+duckxy.y));
	
	return duck;
}