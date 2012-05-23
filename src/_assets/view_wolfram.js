model = Array();
//cells = Array();

running = false;

ROWS = 700;
COLS = 700;

WIDTH = 700;
HEIGHT = 700;

iterationLabel = null;
canvas = Array();
ctx = Array();
iterations = 0;

function load() {
	
	var body = document.body;
		
	iterationLabel = document.getElementById("iterationCount");
	canvas[0] = document.getElementById("pool");
	canvas[0].width = WIDTH;
	canvas[0].height = HEIGHT;
	ctx[0] = canvas[0].getContext("2d");
	
	canvas[0].onmousemove = function(e) {
		var off = offset(e.target);
		var x = Math.floor((e.clientX - off.x - 2) / (WIDTH / COLS));
		var y = Math.floor((e.clientY - off.y - 2) / (HEIGHT / ROWS));
		if (y == 0) {
			var cell = model[y][x];
			cell.currentGradients[0] = 1;
			cell.currentGradients[1] = 0;
			cell.currentGradients[2] = 0;
			updateCellView(cell);
		}
	};
		
	for (var i = 0; i < ROWS; i++) {
		
		model[i] = Array();
		
		for (var j = 0; j < COLS; j++) {
			
			var cellData = new CellData();
			model[i][j] = cellData;
			cellData.currentGradients[0] = 0;
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

var magicNumber = 0;


function step() {
	
	if (!running) {
		return;
	}
	
	if (iterations >= ROWS-1) {
		iterations = 0;
		magicNumber++;
	}
	
	var i = iterations;
	for (var j = 0; j < COLS; j++) {
		var prev = model[i][(COLS + j-1) % COLS];
		var next = model[i][(COLS + j+1) % COLS];
		
		var n = prev.currentGradients[0] * 4 + model[i][j].currentGradients[0] * 2 + next.currentGradients[0];
		model[i+1][j].currentGradients[0] = (magicNumber >> n) % 2;
		
		updateCellView(model[i+1][j]);

	}
		
	iterationLabel.innerHTML = "# Iterations: " + iterations++;
	
	window.setTimeout(step, 10);
	
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
