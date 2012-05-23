automata = null;

WIDTH = 500;
HEIGHT = 500;

iterationLabel = null;
canvas = Array();
ctx = Array();

statusMap=Array();
var statusCell=null;

var duckImage = new Image();
duckImage.src = "pics/duck.png";
var ballImage = new Image();
ballImage.src = "pics/soccer_ball.png";

function createCanvasPainter(context) {
	return new PixelCanvasPainter(context);
}

function load() {
	
	automata = new CellularAutomata();
			
	iterationLabel = document.getElementById("iterationCount");
	rainIntensity = document.getElementById("rain");
	fountainIntensity= document.getElementById("fountain");
	canvas[0] = document.getElementById("pool");
	
	canvas[0].width = WIDTH;
	canvas[0].height = HEIGHT;
	
	ctx[0] = createCanvasPainter(canvas[0].getContext("2d"));
	ctx[0].baseColor = {r: 128, g: 128, b: 255};
	
	canvas[1] = document.getElementById("pool1");
	canvas[1].width = WIDTH;
	canvas[1].height = HEIGHT;
	
	ctx[1] = createCanvasPainter(canvas[1].getContext("2d"));
	
	var select = document.getElementById("diffFormel");
	for (var strategy in TuskRegistry) {
		var opt = document.createElement("option");
		opt.text = TuskRegistry[strategy].sayHello();
		opt.value = strategy;
		select.options.add(opt);
	}
	
	var sl = document.getElementById("viscosity");
	for (var visc in Viscosities) {
		var opt = document.createElement("option");
		opt.text = Viscosities[visc].name;
		opt.value = visc;
		sl.options.add(opt);
	}

	
	cellDefaultValue = document.getElementById("setValue");
	
	statusLabel = document.getElementById("statusLabel");
	initDataTextbox = document.getElementById("InitData");
	modelname=document.getElementById("modelname");
	
	automata.tusk = TuskRegistry[getFormelCtrl()]; 

	initTuskControls();
		
	canvas[0].onmousemove = function(e) {
		if (e.altKey) {	
		    var cell= getCell(e);
			if(cell!=null) {
				automata.tusk.mouseMoveAlt(cell, cellDefaultValue);
				updateAllCellView();
			}
		}
		if (e.shiftKey) {
			var cell = getCell(e);
			if( cell!=null) {
				updateCellInspector(cell);
				//statusLabel.innerHTML = automata.tusk.getCellInfo(cell);
			}
		}
		if (e.ctrlKey && tusk.supportsDuck ) {
			var cell = getCell(e);
			if( cell!=null) {
				ducks[ducks.length]= new Point(1+cell.x*WIDTH/automata.cols, 1+cell.y*HEIGHT/automata.rows);
				// cell.hasDuck = !cell.hasDuck;
				// updateCellView(cell);
			}
		}
	};
		
	canvas[1].onmousemove = function(e) {
		if (e.shiftKey ) {
			statusLabel.innerHTML = automata.tusk.getCellInfo(getCell(e));									  
		}
	};
	
	var swimmers = document.getElementById("swimmers");
	for(var type in SwimmerFactory.types) {
		var button = document.createElement("input");
		button.type = "button";
		button.value = SwimmerFactory.types[type].name + "!";
		button.onclick = (function(t) {
			return function() {
				var x = Math.floor(Math.random() * automata.cols);
				var y = Math.floor(Math.random() * automata.rows);
				automata.swimmers.push(SwimmerFactory.types[t].creator(x, y));
				updateAllCellView();
			}
		})(type);
		swimmers.appendChild(button);
	}
				
	initAutomata();
}

function removeSwimmers() {
	automata.swimmers = [];
	updateAllCellView();
}

function initAutomata() {
	automata.rows = document.getElementById("rows").value;
	automata.cols = document.getElementById("cols").value;
	automata.initCells();
	
	for (var i = 0; i < ctx.length; i++) {
		ctx[i].scaling.x = WIDTH / automata.cols;
		ctx[i].scaling.y = HEIGHT / automata.rows;
	}
	
	updateAllCellView();
	automataInitialized = true;
}

var automataInitialized = false;

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
	var x = Math.floor((e.clientX - off.x - 2) / (WIDTH/automata.rows));
	var y = Math.floor((e.clientY - off.y - 2) / (HEIGHT/automata.cols));
	if( x<0 || y<0 || x>automata.cols || y>automata.rows) return null;
	var cell = automata.model[y][x];
	return cell;
}	
  
function initCells(){
	var initData=initDataTextbox.value;	
	setCells(initData);
}

function reset(){
	initAutomata();
}

function setCells(data)	{
	var idRows=data.split(";");	
	var idx=0;
	var maxRows=(idRows.length < automata.rows ? idRows.length: automata.rows);
	for (var i = 0; i < maxRows; i++) {
		var idCols=idRows[i].split(",");
		var y=parseFloat(idCols[0]);
		var startX=parseFloat(idCols[1]);
		var maxCols=(idCols.length < automata.cols ? idCols.length: automata.cols);
		for (var j = 2; j < maxCols; j++) {	
			idx= startX+j-2;
			idx=(idx>automata.cols?automata.cols:idx);

			var cell = automata.model[y][idx];
			automata.tusk.setCellValue(cell, parseFloat(idCols[j]));
		}
	}
	updateAllCellView();
}
		
function viscosityChanged(){
	var viscosity = Viscosities[document.getElementById("viscosity").value];
	automata.tusk.viscosity = viscosity.viscosity;
	ctx[0].baseColor = viscosity.baseColor;
	updateAllCellView();
}

function getFormelCtrl(){
	var ctrl=document.getElementById("diffFormel");
	var idx=ctrl.selectedIndex;
	var val=ctrl.options[idx].value;
	
	return val;
}
// called when DiffFormel has changed
function tuskChanged(){	
	automata.tusk = TuskRegistry[getFormelCtrl()];
	automata.initCells();
	initTuskControls();
	updateAllCellView();
}

function initTuskControls() {
	ctx[1].pool = null;
	var poolList = document.getElementById("poolList");
	poolList.innerHTML = "";
	for (var i in automata.tusk.pools) {
		var pool = automata.tusk.pools[i];
		
		if (ctx[1].pool == null) {
			selectedPoolChanged(pool);
		}
		
		var radio = document.createElement("input");
		radio.setAttribute("type", "radio");
		radio.setAttribute("name", "pools");
		radio.setAttribute("value", pool.name);
		
		var img = document.createElement("img");
		img.setAttribute("src", pool.imageSource);
		img.setAttribute("alt", pool.name);
		
		radio.onchange = (function(p) {return function() {selectedPoolChanged(p);}})(pool);
		
		poolList.appendChild(radio);
		poolList.appendChild(img);
	}
	if (ctx[1].pool != null) {
		poolList.style.display = "block";
		poolList.getElementsByTagName("input")[0].checked = true;
	} else {
		poolList.style.display = "none";
	}
	
	// events
	for (var i = 0; i < eventBoxes.length; i++) {
		eventBoxes[i].parentNode.removeChild(eventBoxes[i]);
	}
	eventBoxes = [];
	if (automata.tusk.events) {
		for (var i = 0; i < automata.tusk.events.length; i++) {
			var event = automata.tusk.events[i];
			
			var div = document.createElement("div");
			div.className = "ctrlSection disabled";
			
			var h = document.createElement("h1");
			
			var checkbox = document.createElement("input");
			checkbox.type = "checkbox";
			checkbox.style.margin = "0px";
			checkbox.style.marginBottom = "-6px";
			checkbox.style.marginRight = "3px";
			checkbox.style.padding = "0px";
			checkbox.onchange = (function(ev, div) {
				return function() {
					ev.enabled = !ev.enabled;
					if (!ev.enabled) {
						div.classList.add("disabled");
					} else {
						div.classList.remove("disabled");
					}
				};	
			})(event, div);
			
			var span = document.createElement("span");
			span.innerHTML = event.name;
			
			h.appendChild(checkbox);
			h.appendChild(span);
			
			div.appendChild(h);
			if (event.createView) {
				div.appendChild(event.createView(document));
			} else {
				var span = document.createElement("span");
				span.innerHTML = ":-)";
				div.appendChild(span);

			}
			document.getElementById("lastBeforeCustom").parentNode.appendChild(div);
			
			eventBoxes.push(div);
		}
	}
}

var eventBoxes = [];

function sizeChanged() {
	initAutomata();
}

function slicesChanged() {
	automata.tusk.slices = document.getElementById("slices").value;
}

function selectedPoolChanged(pool) {
	ctx[1].pool = pool;
	if (automataInitialized) {
		updateAllCellView();
	}
}

var running = false;

function toggle() {
	running = !running;
	if (running) {
		step();
	}
}

function singleStep(){
	step();
}



function step() {
	automata.step();
	updateAllCellView();
	iterationLabel.innerHTML = automata.iterations;
	if (running) {
		window.setTimeout(step, 00);
	}
}


function getCells(pt) {
	return automata.model[Math.floor(pt.x / (WIDTH/automata.cols))][Math.floor(pt.y / (HEIGHT/automata.rows))];
};
		
function updateAllCellView(){
	beginUpdate();
	automata.forEachCell(updateCellView);
	endUpdate();
	automata.forEachSwimmer(drawSwimmer);
}		


function transformDisp2CellCoordinate(x,y){
	var x1 = Math.floor(x / WIDTH/automata.cols);
	var y1 = Math.floor(y / HEIGHT/automata.rows);
	return new Point(x1,y1);
}

function updateCellView(cell) {
	ctx[0].updateCellView(cell);
	ctx[1].updateCellView(cell);
}

function drawSwimmer(swimmer) {
	ctx[0].drawSwimmer(swimmer);
}

function beginUpdate() {
	ctx[0].begin();
	ctx[1].begin();
}

function endUpdate() {
	ctx[0].end();
	ctx[1].end();
}

function getFormattedColor(du, r0, g0, b0) {
	var color = getColor(du, r0, g0, b0);
	return "rgb(" + color.r + "," + color.g + "," + color.b + ")";
}

function formatNum(num){
  return num.toPrecision(6);
}

function updateCellInspector(cell) {
	updateCellInspectorCell("C", cell);
	var x = cell.x;
	var y = cell.y;
	if (x-1 >= 0 && y-1 >= 0) {
		updateCellInspectorCell("NW", automata.model[y-1][x-1]);
	}
	if (x-1 >= 0 && y+1 < automata.rows) {
		updateCellInspectorCell("SW", automata.model[y+1][x-1]);
	}
	if (x+1 < automata.cols && y+1 < automata.rows) {
		updateCellInspectorCell("SE", automata.model[y+1][x+1]);
	}
	if (y-1 >= 0 && x+1 < automata.cols) {
		updateCellInspectorCell("NE", automata.model[y-1][x+1]);
	}
	if (y-1 >= 0) {
		updateCellInspectorCell("N", automata.model[y-1][x]);
	}
	if (x-1 >= 0) {
		updateCellInspectorCell("W", automata.model[y][x-1]);
	}
	if (y+1 < automata.rows) {
		updateCellInspectorCell("S", automata.model[y+1][x]);
	}
	if (x+1 < automata.cols) {
		updateCellInspectorCell("E", automata.model[y][x+1]);
	}
}

function updateCellInspectorCell(id, cell) {
	document.getElementById("cellInspector_" + id).innerHTML = formatNum(cell.currentData.displayValue());
}

window.onload = load;
