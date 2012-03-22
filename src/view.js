model = Array();
cells = Array();

running = false;

function load() {
	
	var body = document.body;
	
	var table = document.createElement("table");
	table.style.backgroundColor = "black";
	body.appendChild(table);
	
	for (i = 0; i < 50; i++) {
		
		model[i] = Array();
		
		var row = document.createElement("tr");
		table.appendChild(row);
		for (j = 0; j < 50; j++) {
			var cell = document.createElement("td");
			row.appendChild(cell);
			
			var cellData = new CellData();
			cells[cell] = cellData;
			model[i][j] = cellData;
			model[i][j].cell = cell;
			model[i][j].currentGradients[0] = 255; //i == 0 && j == 0 ? 255 : 0;
			
			updateCellView(cellData);
			
			cell.onmouseover = (function(ii, jj) {
				return function() {
					var c = model[ii][jj];
					c.currentGradients[0] = 0;
					updateCellView(c);
				}
			})(i, j);
		}
	}
	
	step();
}

function step() {
	
	if (!running) {
		return;
	}
	
	for (i = 0; i < 50; i++) {
		for (j = 0; j < 50; j++) {
			var nord = i == 0 ? null : model[i-1][j];
			var south = i == 49 ? null : model[i+1][j];
			var west = j == 0 ? null : model[i][j-1];
			var east = j == 49 ? null : model[i][j+1];
			var me = model[i][j];
			var du = (
				  (nord != null ? nord.currentGradients[0] - me.currentGradients[0] : 0)
				+ (south != null ? south.currentGradients[0] - me.currentGradients[0] : 0)
				+ (west != null ? west.currentGradients[0] - me.currentGradients[0] : 0)
				+ (east != null ? east.currentGradients[0] - me.currentGradients[0] : 0)
				) * 0.3 * 0.25;
			me.nextGradients[0] = me.currentGradients[0] + du;
		}
	}
	
	for (i = 0; i < 50; i++) {
		for (j = 0; j < 50; j++) {
			var me = model[i][j];
			var prev = me.currentGradients[0];
			me.currentGradients[0] = me.nextGradients[0];
			updateCellView(me);
		}
	}
	
	window.setTimeout(step, 20);
	
}

function toggle() {
	running = !running;
	step();
}

function updateCellView(cell) {
	var color  = Math.floor(cell.currentGradients[0]);
	cell.cell.style.backgroundColor = "rgb(" + color + ", " + color + ", " + color + ")";
	cell.cell.title  = cell.currentGradients[0];
}

function CellData() {
	this.currentGradients = Array();
	this.nextGradients = Array();
	this.cell = null;
}

window.onload = load;
