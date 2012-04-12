model = Array();
//cells = Array();

running = false;

ROWS = 100;
COLS = 100;

WIDTH = 500;
HEIGHT = 500;

iterationLabel = null;
canvas = Array();
ctx = Array();
iterations = 0;

function load() {
	
	var body = document.body;
	
	//var table = document.createElement("table");
	//table.style.backgroundColor = "black";
	//body.appendChild(table);
	
	iterationLabel = document.getElementById("iterationCount");
	canvas[0] = document.getElementById("pool");
	canvas[0].width = WIDTH;
	canvas[0].height = HEIGHT;
	ctx[0] = canvas[0].getContext("2d");
	
	canvas[1] = document.getElementById("pool1");
	canvas[1].width = WIDTH-1;
	canvas[1].height = HEIGHT-1;
	ctx[1] = canvas[1].getContext("2d");

	canvas[2] = document.getElementById("pool2");
	canvas[2].width = WIDTH-2;
	canvas[2].height = HEIGHT-2;
	ctx[2] = canvas[2].getContext("2d");

	canvas[0].onmousemove = function(e) {
		//if (e.button > 0) {
			var off = offset(e.target);
			var x = Math.floor((e.clientX - off.x - 2) / (WIDTH / COLS));
			var y = Math.floor((e.clientY - off.y - 2) / (HEIGHT / ROWS));
			var cell = model[y][x];
			cell.currentGradients[0] = 1;
			cell.currentGradients[1] = 0;
			cell.currentGradients[2] = 0;
			updateCellView(cell);
		//}
	};
		
	for (i = 0; i < ROWS; i++) {
		
		model[i] = Array();
		
		//var row = document.createElement("tr");
		//table.appendChild(row);
		for (j = 0; j < COLS; j++) {
			//var cell = document.createElement("td");
			//row.appendChild(cell);
			
			var cellData = new CellData();
			//cells[cell] = cellData;
			model[i][j] = cellData;
			//model[i][j].cell = cell;
			cellData.currentGradients[0] = -0.5 + 0.5 * Math.sin(i * 5 * Math.PI / ROWS) + 0.5 * Math.sin(j * 5 * Math.PI / COLS); //0; //j < COLS / 3 ? -1 : j < 2 * COLS / 3 ? 0 : 1; //i == 0 && j == 0 ? 255 : 0;
			cellData.currentGradients[1] = 0;
			cellData.currentGradients[2] = 0;
			
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
	
	//for (i = 0; )
	
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

function step() {
	
	if (!running) {
		return;
	}

	cycleCounter++;

	for (i = 0; i < ROWS; i++) {
		for (j = 0; j < COLS; j++) {
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
			
			var du = w(me.currentGradients, [x,y]);
			for (g = 0; g < du.length; g++) {
				me.nextGradients[g] = du[g];
			}
		}
	}
	
	for (i = 0; i < ROWS; i++) {
		for (j = 0; j < COLS; j++) {
			var me = model[i][j];
			for (g = 0; g < me.nextGradients.length; g++) {
				me.currentGradients[g] = me.nextGradients[g];
			}
			//if (iterations % 1 == 0) {
				updateCellView(me);
			//}
		}
	}
	
		iterationLabel.innerHTML = "# Iterations: " + iterations++;
	
	window.setTimeout(step, 0);
	
}

function w_jh(me, dimensions) {
	var du = Array();
	du[0] = 0;
	for (n = 0; n < dimensions.length; n++) {
	    dn = dimensions[n];
		du[0] += (dn.previous[0] - me[0]) * 0.3 / dimensions.length / 2;
		du[0] += (dn.next[0] - me[0]) * 0.3 / dimensions.length / 2;
	}
	return du;
}

c = 1.0;
dt = 0.001;

function w(me, dimensions) {
	
	// d^2u/dt^2 = c*d^2u/dx^2
	
	var du = Array();
	var d2x = 0;
	var d1x = 0;
	var d2t = 0;
	var d1t = 0;
	
	for (n = 0; n < dimensions.length; n++) {
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
	var c = getColor(du[0]);
	
	ctx[0].fillStyle = c;
	
	var width = WIDTH / COLS;
	var height = HEIGHT / ROWS;
	
	var x = cell.x * width;
	var y = cell.y * height;
	
	ctx[0].fillRect(x,y,width,height);
		
	//cell.cell.style.backgroundColor = getColor(du[0]);
	//cell.cell.title = "";
	//for (g = 0; g < du.length; g++) {
	//	cell.cell.title += g + "=" + du[g] + ";";
	//}
}

function getColor(du) {
	var r = Math.min(255, Math.max(0, Math.floor(128 * (1+du))));
	var g = Math.min(255, Math.max(0, Math.floor(128 * (1+du))));
	var b = Math.min(255, Math.max(0, Math.floor(255 * (1+du))));
	
	return "rgb(" + r + "," + g + "," + b + ")";
}

function CellData() {
	this.currentGradients = Array();
	this.nextGradients = Array();
	this.cell = null;
	this.x = 0;
	this.y = 0;
}

function Dimension() {
	this.previous = Array();
	this.next = Array();
}

window.onload = load;
