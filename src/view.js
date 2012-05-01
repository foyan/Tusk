model = Array();
//cells = Array();

running = false;
runOnce=false;

ROWS = 50;
COLS = 50;
SLICES= 10;

WIDTH = 400;
HEIGHT = 400;

iterationLabel = null;
canvas = Array();
ctx = Array();
iterations = 0;
rainIntensity = null;

var duckImage = new Image();
duckImage.src = "pics/duck.png";

supportedFunctions= {INIT : 0, DIFFUS : 1, WAFE : 2 } ;
currentFunction= supportedFunctions.WAFE;
	


function load() {
	
	var body = document.body;
	
	//var table = document.createElement("table");
	//table.style.backgroundColor = "black";
	//body.appendChild(table);
	
	iterationLabel = document.getElementById("iterationCount");
	rainIntensity = document.getElementById("rain");
	canvas[0] = document.getElementById("pool");
	canvas[0].width = WIDTH;
	canvas[0].height = HEIGHT;
	ctx[0] = canvas[0].getContext("2d");
	
	canvas[1] = document.getElementById("pool1");
	canvas[1].width = WIDTH;
	canvas[1].height = HEIGHT;
	ctx[1] = canvas[1].getContext("2d");

	canvas[2] = document.getElementById("pool2");
	canvas[2].width = WIDTH;
	canvas[2].height = HEIGHT;
	ctx[2] = canvas[2].getContext("2d");

	cellDefaultValue = document.getElementById("SetValue");
	
	statusLabel = document.getElementById("statusLabel");
	initDataTextbox = document.getElementById("InitData");
	
	canvas[0].onmousemove = function(e) {
		if (e.altKey) {		
		    var initVal= (cellDefaultValue.value == null || cellDefaultValue.value == "") ? -0.9 : parseFloat(cellDefaultValue.value);
			var cell= getCell(e);
			cell.currentGradients[0] = initVal;
			cell.currentGradients[1] = 0;
			cell.currentGradients[2] = 0;
			cell.currentGradients[3] = 0;
			cell.currentGradients[4] = 0;
			cell.currentGradients[5] = 0;
			updateCellView(cell);
		}
		if (e.shiftKey ) {
			var cell = getCell(e);
			statusLabel.innerHTML =  getCellInfo(cell); 
		}
		if (e.ctrlKey) {
			var cell = getCell(e);
			cell.hasDuck = !cell.hasDuck;
			updateCellView(cell);
		}
	};
		
	canvas[1].onmousemove = function(e) {
		if (e.shiftKey ) {
			statusLabel.innerHTML = getCellInfo(getCell(e));									  
		}
	};		
	canvas[2].onmousemove = function(e) {
		if (e.shiftKey ) {
			statusLabel.innerHTML = getCellInfo(getCell(e));									  
		}
	};		
		
		
	for (var i = 0; i < ROWS; i++) {
		
		model[i] = Array();
		
		//var row = document.createElement("tr");
		//table.appendChild(row);
		for (var j = 0; j < COLS; j++) {
			//var cell = document.createElement("td");
			//row.appendChild(cell);
			
			var cellData = new CellData();
			//cells[cell] = cellData;
			model[i][j] = cellData;
			//model[i][j].cell = cell;
			cellData.currentGradients[0] = 0; //-0.5 + 0.5 * Math.sin(i * 5 * Math.PI / ROWS) + 0.5 * Math.sin(j * 5 * Math.PI / COLS); //0; //j < COLS / 3 ? -1 : j < 2 * COLS / 3 ? 0 : 1; //i == 0 && j == 0 ? 255 : 0;
			cellData.currentGradients[1] = 0;
			cellData.currentGradients[2] = 0;
			cellData.currentGradients[3] = 0;
			cellData.currentGradients[4] = 0;
			cellData.currentGradients[5] = 0;
			
			cellData.x = j;
			cellData.y = i;
			
			updateCellView(cellData);
			
			/*cell.onmousemove = (function(ii, jj) {
				return function() {
					var c = model[ii][jj];
					c.currentGradients[0] = 1;
					updateCellView(c);
				}
			})(i, j);*/
		}
	}
	
	// model[10][10].currentGradients[0] = 1;
	// updateCellView(model[10][10]);
	
	/*
	if( 1>2) {
	setCells("0,0,0;10,10,1");
	} else if(1<2){
		setCells("0,0,0;24,24,1,1;25,24,1,1");
	}
	*/
	//for (i = 0; )
	
	model[20][20].hasDuck = true;
	updateCellView(model[20][20]);
	
	/*
	model[49][49].currentGradients[0] = 1;
	model[50][49].currentGradients[0] = 1;
	model[49][50].currentGradients[0] = 1;
	model[50][50].currentGradients[0] = 1;
	
	updateCellView(model[49][49]);
	updateCellView(model[50][49]);
	updateCellView(model[50][50]);
	updateCellView(model[49][50]);
	*/
	
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
	var x = Math.floor((e.clientX - off.x - 2) / (WIDTH / COLS));
	var y = Math.floor((e.clientY - off.y - 2) / (HEIGHT / ROWS));
	var cell = model[y][x];
	return cell;
}	

function getCellInfo(cell){
	var info= 
		"u="+formatNum(cell.currentGradients[0]) + "<br/>"+
		"u'="+formatNum(cell.currentGradients[2]) + "<br/>"+
		"u''="+formatNum(cell.currentGradients[3])+"<br/>"+
		"u.="+formatNum(cell.currentGradients[1]) + "<br/>"+
		"u..="+formatNum(cell.currentGradients[4]) + "<br/>"+
		"v_x="+formatNum(cell.currentVelocities[0]) + "<br/>"+
		"v_y="+formatNum(cell.currentVelocities[1]) + "<br/>"+
		"phi="+formatNum(calculateDuckPhi(cell.currentVelocities[0], cell.currentVelocities[1])) + "<br/>"
	return info;
}

function formatNum(num){
  return num.toPrecision(4);
}
  
  
function initCells(){
	var initData=initDataTextbox.value;	
	setCells(initData);
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
				cellData.currentGradients[1] = 0;
				cellData.currentGradients[2] = 0;
				cellData.currentGradients[3] = 0;
				cellData.currentGradients[4] = 0;
				cellData.currentGradients[5] = 0;
				updateCellView(cellData);
		}
	}
}
		

function step() {
	
	if (!running) {
		return;
	}
	
	var drops = rainIntensity.value == 0 ? 0
		: rainIntensity.value >= 1 ? rainIntensity.value
		: iterations % (Math.floor(1/rainIntensity.value)) == 0 ? 1 : 0;
	
	for (var i = 0; i < drops; i++) {
		var x = Math.floor(Math.random() * COLS);
		var y = Math.floor(Math.random() * ROWS);
		model[x][y].currentGradients[0] = -0.5;
		model[x][y].currentGradients[1] = 0;
		model[x][y].currentGradients[2] = 0;
		model[x][y].currentGradients[3] = 0;
		model[x][y].currentGradients[4] = 0;
		model[x][y].currentGradients[5] = 0;
	}
	
	
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
				
				var du = calcCell(me.currentGradients, [x,y]);
				for (var g = 0; g < du.length; g++) {
					me.nextGradients[g] = du[g];
				}
				
				me.nextVelocities = w_Duck(me.currentGradients[0], [x.previous[0], x.next[0]], me.currentVelocities);
			}
		}
		
		for (var i = 0; i < ROWS; i++) {
			for (var j = 0; j < COLS; j++) {
				var me = model[i][j];
				for (var g = 0; g < me.nextGradients.length; g++) {
					me.currentGradients[g] = me.nextGradients[g];
				}
				me.currentVelocities = me.nextVelocities;
				if (me.hasDuck) {
					var x = me.currentVelocities[0] <= -0.01 ? -1 : me.currentVelocities[0] >= 0.01 ? 1 : 0;
					var y = me.currentVelocities[1] <= -0.01 ? -1 : me.currentVelocities[1] >= 0.01 ? 1 : 0;
					if (i+x < 0 || i+x >= ROWS) {
						x = -x;
					}
					if (j+y < 0 || j+y >= COLS) {
						y = -y;
					}
					me.hasDuck = false;
					model[i+x][j+y].hasDuck = true;
				}
			}
		}
	
	}
	
	var cellsWithDuck = [];
	
	for (var i = 0; i < ROWS; i++) {
		for (var j = 0; j < COLS; j++) {
			var me = model[i][j];
			updateCellView(me);
			if (me.hasDuck) {
				cellsWithDuck.push(me);
			}
		}
	}
	
	for (var i = 0; i < cellsWithDuck.length; i++) {
		updateCellView(cellsWithDuck[i]);
	}

	iterationLabel.innerHTML = "# Iterations: " + iterations++;
	
	window.setTimeout(step, 0);
	
}

function w_jh(me, dimensions) {
	var du = Array();
	du[0] = 0;
	for (var n = 0; n < dimensions.length; n++) {
	    dn = dimensions[n];
		du[0] += (dn.previous[0] - me[0]) * 0.3 / dimensions.length / 2;
		du[0] += (dn.next[0] - me[0]) * 0.3 / dimensions.length / 2;
	}
	return du;
}


function calcCell(me, dimensions) {

	switch(currentFunction){
		case supportedFunctions.DIFFUS:
			break ;
		case supportedFunctions.WAFE:
			return w(me, dimensions);
		default:
			alert("sorry not supported");
			break;
	}

}

var damping = 0.995;

function w(me, dimensions) {

	var c = 1.0;
	var dt = 1/SLICES;

	var uCurrent = me;
	var u = uCurrent[0];
	
	var udx = u - (dimensions[0].previous[0] + dimensions[1].previous[0]) / 2;
	var udxdx = -2 * u + (dimensions[0].previous[0] + dimensions[1].previous[0]) / 2 + (dimensions[0].next[0] + dimensions[1].next[0]) / 2;
	
	var upp = udxdx * c;
	var up = uCurrent[1] + upp * dt;
	var ut = (u + up * dt) * damping;
	
	return [
		ut,
		up,
		udx,
		udxdx,
		upp,
		ut
	];
	
}

function w_Duck(u, neighbourUs, currentVs) {
	var dt = 1/SLICES;
		
	return [
		/*currentVs[0] +*/ (-u + neighbourUs[0]) * dt,
		/*currentVs[1] +*/ (-u + neighbourUs[1]) * dt
	]
}

function waerme(y) {
	var res = Array();
	res[0] = y[0];
	//res[1] = y[1];
	return res;
}

function schwingung(y) {
	var res = Array();
	res[1] = y[0];
	res[0] = -y[1];
	return res;
}

function add(v1, v2) {
	var n = v1.length;
	var res = Array();
	for (var nn = 0; nn < n; nn++) {
		res[nn] = v1[nn] + v2[nn];
	}
	return res;
}

function multiply(scalar, vector) {
	var n = vector.length;
	var res = Array();
	for (var nn = 0; nn < n; nn++) {
		res[nn] = vector[nn] * scalar;
	}
	return res;
}

function w_kjkk(me, dimensions) {
	
	// d^2u/dt^2 = c*d^2u/dx^2
	
	var du = Array();
	var d2x = 0;
	var d1x = 0;
	var d2t = 0;
	var d1t = 0;
	
	for (var n = 0; n < dimensions.length; n++) {
		d1x += dimensions[n].next[0] - me[0];
		d2x += -dimensions[n].previous[0] + 2 * me[0] - dimensions[n].next[0];
		d1t += (me[0] - me[1]);
		d2t += (2*me[1] - me[2] - me[0])/dt;
		//d1t += dimensions[n].next[0] - me[0];
		//d2t += -dimensions[n].previous[0] + 2 * me[0] - dimensions[n].next[0];
	}
	
	d2x /= dimensions.length;
	d1x /= dimensions.length;
	d1t /= dimensions.length;
	d2t /= dimensions.length;
	
	var res = me[0] + (d1x + c*d2x) + (d1t + d2t*dt)*dt;
	du[0] = res;
	du[2] = me[1];
	du[1] = me[0];
	
	return du;
}

function toggle() {
	running = !running;
	step();
}

function updateCellView(cell) {
	
	var du = cell.currentGradients;
	
	var width = WIDTH / COLS;  		// TODO: calc this var just once
	var height = HEIGHT / ROWS;
	
	var x = cell.x * width;
	var y = cell.y * height;
	
	ctx[0].fillStyle = getColor(du[0], 128, 128, 255);
	ctx[0].fillRect(x,y,width,height);

	ctx[1].fillStyle = getColor(du[1], 128, 128, 128);
	ctx[1].fillRect(x,y,width,height);

	ctx[2].fillStyle = getColor(du[4], 128, 128, 128);
	ctx[2].fillRect(x,y,width,height);

	if (cell.hasDuck) {
		ctx[0].fillStyle = "rgb(255,255,0)";
		ctx[0].fillRect(x,y,width,height);
			/*	
		var phi = calculateDuckPhi(cell.currentVelocities[0], cell.currentVelocities[1])
				
		ctx[0].translate(x, y);
		ctx[0].rotate(phi);
		ctx[0].drawImage(duckImage, width / 2 - 18, width / 2 - 18);
		ctx[0].rotate(-phi);
		ctx[0].translate(-x, -y);
		*/
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

function CellData() {
	this.currentGradients = Array();
	this.nextGradients = Array();
	this.cell = null;
	this.x = 0;
	this.y = 0;
	this.hasDuck = false;
	this.currentVelocities = [0, 0];
	this.nextVelocities = [0, 0];
}

function Dimension() {
	this.previous = Array();
	this.next = Array();
}


function CellValues() {
	this.u=0;
	this.up=0;
	this.upp=0;
	this.udx=0;
	this.udxdx=0;
	this.newU=0;
}



window.onload = load;
