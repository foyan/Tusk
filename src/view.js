model = Array();
//cells = Array();

running = false;

ROWS = 500;
COLS = 500;

WIDTH = 500;
HEIGHT = 500;

iterationLabel = null;
canvas = null;
ctx = null;
iterations = 0;

function load() {
	
	var body = document.body;
	
	//var table = document.createElement("table");
	//table.style.backgroundColor = "black";
	//body.appendChild(table);
	
	iterationLabel = document.getElementById("iterationCount");
	canvas = document.getElementById("pool");
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	ctx = canvas.getContext("2d");
	
	canvas.onmousemove = function(e) {
		if (e.button > 0) {
			var x = Math.floor((e.clientX - e.target.offsetLeft - 2) / (WIDTH / COLS));
			var y = Math.floor((e.clientY - e.target.offsetTop - 2) / (HEIGHT / ROWS));
			var cell = model[y][x];
			cell.currentGradients[0] = 1;
			cell.currentGradients[1] = 0;
			updateCellView(cell);
		}
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
			cellData.currentGradients[0] = 0; //j < COLS / 3 ? -1 : j < 2 * COLS / 3 ? 0 : 1; //i == 0 && j == 0 ? 255 : 0;
			cellData.currentGradients[1] = 0;
			
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
		
	step();
}

function step() {
	
	if (!running) {
		return;
	}
	
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
				me.nextGradients[g] = me.currentGradients[g] + du[g];
			}
		}
	}
	
	for (i = 0; i < ROWS; i++) {
		for (j = 0; j < COLS; j++) {
			var me = model[i][j];
			me.currentGradients = me.nextGradients;
			updateCellView(me);
		}
	}
	
	iterationLabel.innerHTML = "# Iterations: " + iterations++;
	
	window.setTimeout(step, 20);
	
}

function w_Diffusion(me, dimensions) {
	var du = Array();
	du[0] = 0;
	for(n = 0; n < dimensions.length; n++) {
		du[0] += (dimensions[n].previous[0] - me[0]) * 0.3 / dimensions.length / 2;
		du[0] += (dimensions[n].next[0] - me[0]) * 0.3 / dimensions.length / 2;
	}
	return du;
}

function w(me, dimensions) {
	var du = Array();
	du[0] = 0;
	du[1] = 0;
	for (n = 0; n < dimensions.length; n++) {
		du[0] += (dimensions[n].previous[1] - dimensions[n].next[1]) / dimensions.length;
		du[1] += (dimensions[n].previous[0] - me[0]) / dimensions.length / 2;
		du[1] += (me[0] - dimensions[n].next[0]) / dimensions.length / 2;
	}
	return du;
}


function toggle() {
	running = !running;
	step();
}

function updateCellView(cell) {
	return;
	var du = cell.currentGradients;
	var c = getColor(du[0]);
	
	ctx.fillStyle = c;
	
	var width = WIDTH / COLS;
	var height = HEIGHT / ROWS;
	
	var x = cell.x * width;
	var y = cell.y * height;
	
	ctx.fillRect(x,y,width,height);
		
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
