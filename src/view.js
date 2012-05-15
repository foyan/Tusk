model = Array();

running = false;
runOnce=false;

ROWS = 60;
COLS = 60;
SLICES= 10;

WIDTH = 600;
HEIGHT = 600;
scaleWidth = WIDTH / COLS;  		
scaleHeight = HEIGHT / ROWS;

MAXITEMS=6;  // Gradienten in Cell

iterationLabel = null;
canvas = Array();
ctx = Array();

iterations = 0;
rainIntensity = null;
fountainIntensity=null;
statusMap=Array();
var statusCell=null;

var duckImage = null; 
var damping = 0.995;

firstTime=true;

canves2Idx=1;

viscosity=1;  // Wasser 20 Grad Celsius

var ducks;

var tusk=null;  // instance of DiffGleichung

function load() {
			
	iterationLabel = document.getElementById("iterationCount");
	rainIntensity = document.getElementById("rain");
	fountainIntensity= document.getElementById("fountain");
	canvas[0] = document.getElementById("pool");
	
	canvas[0].width = WIDTH;
	canvas[0].height = HEIGHT;
	ctx[0] = canvas[0].getContext("2d");
	
	canvas[1] = document.getElementById("pool1");
	canvas[1].width = WIDTH;
	canvas[1].height = HEIGHT;
	ctx[1] = canvas[1].getContext("2d");
	
	var select = document.getElementById("diffFormel");
	for (var strategy in strategies) {
		var opt = document.createElement("option");
		opt.text = strategies[strategy].sayHello();
		opt.value = strategy;
		select.options.add(opt);
	}

	
	cellDefaultValue = document.getElementById("setValue");
	
	statusLabel = document.getElementById("statusLabel");
	initDataTextbox = document.getElementById("InitData");
	modelname=document.getElementById("modelname");

	statusMapNorth= document.getElementById("u_north");
	statusMapSouth= document.getElementById("u_south");
	statusMapLeft= document.getElementById("u_left");
	statusMapRight= document.getElementById("u_right");
	statusMapMe= document.getElementById("u_me");
	statusMapPos= document.getElementById("u_pos");

	statusMap[0]=statusMapNorth; statusMap[1]=statusMapSouth;
	statusMap[2]=statusMapLeft; statusMap[3]=statusMapRight;
	statusMap[4]=statusMapMe; statusMap[5]=statusMapPos;
	

	
	tusk= tuskStrategy(getFormelCtrl()); 
	SLICES= tusk.SLICES;	
	
	canvas[0].onmousemove = function(e) {
		if (e.altKey) {	
		    var cell= getCell(e);
			if( cell!=null) {
				tusk.mouseMoveAlt(cell, cellDefaultValue);
				updateCellView(cell);
			}
		}
		if (e.shiftKey ) {
			var cell = getCell(e);
			if( cell!=null) {
				statusLabel.innerHTML = tusk.getCellInfo(cell);
				for (var d = 0; d < ducks.length; d++) {
					statusLabel.innerHTML +=  "<br/>Duck " + d + ": (" + ducks[d].x + "/" + ducks[d].y + "  Vx/Vy=" + ducks[d].velocityX + "/" + ducks[d].velocityY + ")";
				}
				statusCell=cell;
				setStatusMap(cell);
			}
		}
		if (e.ctrlKey && tusk.supportsDuck ) {
			var cell = getCell(e);
			if( cell!=null) {
				ducks[ducks.length]= new Point(1+cell.x*WIDTH/COLS, 1+cell.y*HEIGHT/ROWS);
				// cell.hasDuck = !cell.hasDuck;
				// updateCellView(cell);
			}
		}
	};
		
	canvas[1].onmousemove = function(e) {
		if (e.shiftKey ) {
			statusLabel.innerHTML = tusk.getCellInfo(getCell(e));									  
		}
	};		
		
		
		
	for (var i = 0; i < ROWS; i++) {
		model[i] = Array();
		for (var j = 0; j < COLS; j++) {
			var cellData = new CellData();
			for(var idx=0;idx< MAXITEMS;idx++) {
				cellData.currentGradients[idx] = 0;
				cellData.nextGradients[idx] = 0;
			}
			model[i][j] = cellData;
			cellData.x = j;
			cellData.y = i;
			updateCellView(cellData);
		}
	}
		
	step();
}



function offset(target) {
	var off = {x: target.offsetLeft, y: target.offsetTop};
	if (target.offsetParent) {
		var poff = offset(target.offsetParent);
		off.x += poff.x;
		off.y += poff.y;
	}
	return off;
}

function getCell(e) {
	var off = offset(e.target);
	var x = Math.floor((e.clientX - off.x - 2) / (scaleWidth));
	var y = Math.floor((e.clientY - off.y - 2) / (scaleHeight));
	if( x<0 || y<0 || x>COLS || y>ROWS) return null;
	var cell = model[y][x];
	return cell;
}	
  
function initCells(){
	var initData=initDataTextbox.value;	
	setCells(initData);
}

function reset(){
	firstTime=true;
	step();
}

function setCells(data)	{
	var idRows=data.split(";");	
	var idx=0;
	var maxRows=(idRows.length < ROWS? idRows.length: ROWS);
	for (var i = 0; i < maxRows; i++) {
		var idCols=idRows[i].split(",");
		var y=parseFloat(idCols[0]);
		var startX=parseFloat(idCols[1]);
		var maxCols=(idCols.length < COLS? idCols.length: COLS);
		for (var j = 2; j < maxCols; j++) {	
			idx= startX+j-2;
			idx=(idx>COLS?COLS:idx);				
			var cellData= model[y][idx] ;
			cellData.currentGradients[0] = parseFloat(idCols[j]); 
			for( var i2=1; i2<cellData.currentGradients.length; i2++)
				cellData.currentGradients[i2] = 0;
			updateCellView(cellData);
		}
	}
}
		
function setStatusMap(cell){
	var x=cell.x;
	var y=cell.y;
	
	statusMapRight.innerHTML= getStatusMapInfo(y,x+1);  
	statusMapLeft.innerHTML= getStatusMapInfo(y,x-1);  
	statusMapNorth.innerHTML= getStatusMapInfo(y-1,x); 
	statusMapSouth.innerHTML= getStatusMapInfo(y+1,x); 
	statusMapMe.innerHTML= getStatusMapInfo(y,x);
	statusMapPos.innerHTML= "x/y: " + x +"/"+ y;
}		
		
function getStatusMapInfo(y,x){
	var m=model[y][x]
	var u=m.currentGradients[canves2Idx];
	var s=formatNum(u);
	return s;
}		


function radioCanvesChanged(radioButton) {
	canves2Idx= radioButton.value;
	updateAllCellView();
	setStatusMap(statusCell);
}

function changeViscosity(){
	var ctrl=document.getElementById("viscosity");
	var idx=ctrl.selectedIndex;
	var val=ctrl.options[idx].value;
	
	viscosity= parseInt(val);
}



function getFormelCtrl(){
	var ctrl=document.getElementById("diffFormel");
	var idx=ctrl.selectedIndex;
	var val=ctrl.options[idx].value;
	
	return val;
}
// called when DiffFormel has changed
function changeFormel(){	
	tusk= tuskStrategy(getFormelCtrl()); 
	SLICES= tusk.SLICES;
	firstTime=true;
	step();	
}

function toggle() {
	running = !running;
	step();
}

function singleStep(){
	runOnce=true;
	step();
}



function step() {

	if( firstTime){
	//	loadjscssfile("wave.js", "js") //dynamically load and add this .js file	

		firstTime=false;
		statusLabel.innerHTML= tusk.sayHello();
		modelname.innerHTML=tusk.sayHello();
		
		
		
		for (var i = 0; i < ROWS; i++) {
			model[i] = Array();
			for (var j = 0; j < COLS; j++) {
				var cellData = new CellData();
				tusk.initCell(cellData);
				model[i][j] = cellData;
				
				cellData.x = j;
				cellData.y = i;
				
				updateCellView(cellData);
			}
		}
		
		
		if(tusk.supportsDuck){
			duckImage=tusk.getDuckImage();
			ducks= tusk.getDucks();
/*			for( var i=0;i<ducks.length;i++) {
			    var duck=ducks[i];
				//var cell=model[duck.y][duck.y];
				cell.hasDuck = true;   // TODO: to wave.js
				updateCellView(cell);
			}*/
		}
		
		tusk.customFirstTime();
		firstTime=false;
	}
	
	
	if (!runOnce && !running) {
		return;
	}

	if( tusk.supportsRains){
		var drops = rainIntensity.value == 0 ? 0
			: rainIntensity.value >= 1 ? rainIntensity.value
			: iterations % (Math.floor(1/rainIntensity.value)) == 0 ? 1 : 0;
		
		for (var i = 0; i < drops; i++) {
			var x = Math.floor(Math.random() * COLS);
			var y = Math.floor(Math.random() * ROWS);
			tusk.getRainValue(model[x][y], drops, i);		
		}
	}  // rainSupport
	
	if( tusk.supportsFountain) {	
		if( fountainIntensity.value !=0 && iterations % 20==0) {
			var fountains=tusk.getFountains(fountainIntensity.value, ROWS, COLS);  // returns Fountain[]
			if( fountains.length >0){
				for (var fi = 0; fi < fountains.length; fi++) {
					var f=fountains[fi];
					var g=model[f.x][f.y];
					g.currentGradients[0] = f.intensity;
					var b=g.hasDuck;
					for (var i= 1;i<= 5;i++) 
						g.currentGradients[i]=0;
				}
			}
		}
	}  // fountainSupport	
	
	var dt = 1/SLICES;
	for (var t = 0; t < SLICES; t++) {
		for (var i = 0; i < ROWS; i++) {
			for (var j = 0; j < COLS; j++) {
				var nord = i == 0 ? null : model[i-1][j];
				var south = i == ROWS-1 ? null : model[i+1][j];
				var west = j == 0 ? null : model[i][j-1];
				var east = j == COLS-1 ? null : model[i][j+1];
				
				var x = new Dimension();
				var y = new Dimension();
				var me = model[i][j];
				
				x.previous = (west != null ? west : me).currentGradients;
				x.next = (east != null ? east : me).currentGradients;
				y.previous = (nord != null ? nord : me).currentGradients;
				y.next = (south != null ? south : me).currentGradients;
				
				var du = tusk.calcCell(me, [x,y], dt, damping, viscosity);
				for (var g = 0; g < du.length; g++) {
					me.nextGradients[g] = du[g];
				}
				
				me.nextVelocities = (tusk.supportsDuck==false? 0: 
									w_Duck(me.currentGradients[0], [x.previous[0], y.previous[0]], me.currentVelocities));
			}
		}
		
		var getCells = function(pt) {
			return model[Math.floor(pt.x / (scaleWidth))][Math.floor(pt.y / (scaleHeight))];
		};
		
		for (var i = 0; i < ROWS; i++) {
			for (var j = 0; j < COLS; j++) {
				var me = model[i][j];
				for (var g = 0; g < me.nextGradients.length; g++) {
					me.currentGradients[g] = me.nextGradients[g];
				}
				me.currentVelocities = me.nextVelocities;
				
				/*
				if (tusk.supportsDuck && me.hasDuck) {
					var x = me.currentVelocities[0] <= -0.0001 ? -1 : me.currentVelocities[0] >= 0.0001 ? 1 : 0;
					var y = me.currentVelocities[1] <= -0.0001 ? -1 : me.currentVelocities[1] >= 0.0001 ? 1 : 0;
					if (i+x < 0 || i+x >= ROWS) {
						x = -x;
					}
					if (j+y < 0 || j+y >= COLS) {
						y = -y;
					}
					me.hasDuck = false;
					model[i+x][j+y].hasDuck = true;
				} // duckSupport */
			}
		}
		
	}
	
	for (var i = 0; i < ROWS; i++) {
		for (var j = 0; j < COLS; j++) {
			var me = model[i][j];
			updateCellView(me);
		}
	}
		
	if (tusk.supportsDuck) {
		for (var d = 0; d < ducks.length; d++) {
			var duck = ducks[d];
			var duckCell = getCells(duck);

			var i = duckCell.x;
			var j = duckCell.y;

			var nord = i == 0 ? null : model[i-1][j];
			var south = i == ROWS-1 ? null : model[i+1][j];
			var west = j == 0 ? null : model[i][j-1];
			var east = j == COLS-1 ? null : model[i][j+1];
							
			var me = duckCell;
			var k=100;
							
			xprevious = (west != null ? west : me).currentGradients;
			xnext = (east != null ? east : me).currentGradients;
			yprevious = (nord != null ? nord : me).currentGradients;
			ynext = (south != null ? south : me).currentGradients;

			// duck.velocityX += (duckCell.currentGradients[0]-xprevious[0])*k;
			// duck.velocityX += (-duckCell.currentGradients[0]+xnext[0])*k;
			// duck.velocityY += (duckCell.currentGradients[0]-yprevious[0])*k;
			// duck.velocityY += (-duckCell.currentGradients[0]+ynext[0])*k;
			
			var cellxy= new Point(0,0);
			
			cellxy.velocityX+=-xprevious[0];
			cellxy.velocityX+=-xnext[0];
			cellxy.velocityY+=-yprevious[0];
			cellxy.velocityY+=-ynext[0];
			
			var duckxy= new Point(duck.velocityX,duck.velocityY);
			duckxy.x+= cellxy.velocityX;
			duckxy.y+= cellxy.velocityY;
			
			duck.x=Math.max(0, Math.min(WIDTH-1,duckxy.x));
			duck.y=Math.max(0, Math.min(HEIGHT-1,duckxy.y));
			
			// duck.x = Math.max(0, Math.min(WIDTH-1, duck.velocityX));
			// duck.y = Math.max(0, Math.min(HEIGHT-1, duck.velocityY));
			var newDuckCell = getCells(duck);
			drawDuck(duck, duckCell);
			if (duckCell != newDuckCell) {
				duckCell.currentVelocities[0] = 0;
				duckCell.currentVelocities[1] = 0;
				duckCell.currentGradients[0] = 0;
			}
		}
	}

	iterationLabel.innerHTML = "# Iterations: " + iterations++;
	
	if( runOnce) {
		runOnce=false;
		return;
	}
	
	window.setTimeout(step, 0);
}


function w_Duck(u, neighbourUs, currentVs) {
	var dt = 1/SLICES;
		
	return [
		/*currentVs[0] +*/ (-u + neighbourUs[0]) * 1000,
		/*currentVs[1] +*/ (-u + neighbourUs[1]) * 1000
	]
}


function updateAllCellView(){
	for (var i = 0; i < ROWS; i++) {
		for (var j = 0; j < COLS; j++) {
			updateCellView(model[i][j]);
		}
	}
}		


function transformDisp2CellCoordinate(x,y){
	var x1 = Math.floor(x / scaleWidth);
	var y1 = Math.floor(y / scaleHeight);
	return new Point(x1,y1);
}

function updateCellView(cell) {	
	var du = cell.currentGradients;
	
	var x = cell.x * scaleWidth;
	var y = cell.y * scaleHeight;
	
	ctx[0].fillStyle = getColor(du[0], 128, 128, 255);
	ctx[0].fillRect(x,y,scaleWidth,scaleHeight);

	ctx[1].fillStyle = getColor(du[canves2Idx], 128, 128, 128);
	ctx[1].fillRect(x,y,scaleWidth,scaleHeight);

}

function drawDuck(duck, cell) {
	if( duckImage==null) {
		ctx[0].fillStyle = "rgb(255,255,0)";
		ctx[0].fillRect(duck.x,duck.y,scaleWidth,scaleHeight);
	} else {
		var phi = calculateDuckPhi(cell.currentVelocities[0], cell.currentVelocities[1])
		ctx[0].translate(duck.x, duck.y);
		ctx[0].rotate(phi);
		ctx[0].drawImage(duckImage, -18, -18);
		ctx[0].rotate(-phi);
		ctx[0].translate(-duck.x, -duck.y);
	}
}

function calculateDuckPhi(x, y) {
	return x >= 0 && y < 0 ? Math.atan(x/-y)
		: x > 0 && y >= 0 ? Math.PI/2 + Math.atan(-y/x)
		: x <= 0 && y > 0 ? Math.PI + Math.atan(x/-y)
		: x < 0 && y <= 0 ? Math.PI * 3/2 + Math.atan(-y/x)
		: 0;
}

function getColor(du, r0, g0, b0) {
	var r = Math.min(255, Math.max(0, Math.floor(r0 * (1+du))));
	var g = Math.min(255, Math.max(0, Math.floor(g0 * (1+du))));
	var b = Math.min(255, Math.max(0, Math.floor(b0 * (1+du))));
	
	return "rgb(" + r + "," + g + "," + b + ")";
}

function formatNum(num){
  return num.toPrecision(4);
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

function Dimension() {
	this.previous = Array();
	this.next = Array();
}

function Fountain() {
	this.x=-1;
	this.y=-1;
	this.intensity=0;
}


function Point(x, y){
	this.x = x;
	this.y = y;
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

window.onload = load;
