automata = null;

WIDTH = 500;
HEIGHT = 500;

doc = null;

function load() {
	
	doc = new Doc();
					
	TheView.load(doc);
	
	automata = TheView.automata;
		
	for (var strategy in TuskRegistry) {
		var opt = document.createElement("option");
		opt.text = TuskRegistry[strategy].sayHello();
		opt.value = strategy;
		doc.tuskSelector.options.add(opt);
	}
	
	for (var visc in Viscosities) {
		var opt = document.createElement("option");
		opt.text = Viscosities[visc].name;
		opt.value = visc;
		doc.viscositySelector.options.add(opt);
	}
	
	automata.tusk = TuskRegistry[doc.tuskSelector.value]; 

	initTuskControls();
		
	doc.primaryCanvas.onmousemove = function(e) {
		if (e.altKey) {	
		    var cell= getCell(e);
			if(cell!=null) {
				automata.tusk.mouseMoveAlt(cell, doc.cellValueBox);
				TheView.paintAll();
			}
		}
		if (e.shiftKey) {
			var cell = getCell(e);
			if( cell!=null) {
				updateCellInspector(cell);
			}
		}
		if (e.ctrlKey && tusk.supportsDuck ) {
			var cell = getCell(e);
			if( cell!=null) {
				ducks[ducks.length]= new Point(1+cell.x*WIDTH/automata.cols, 1+cell.y*HEIGHT/automata.rows);
				// cell.hasDuck = !cell.hasDuck;
			}
		}
	};
			
	for(var type in SwimmerFactory.types) {
		var button = document.createElement("input");
		button.type = "button";
		button.value = SwimmerFactory.types[type].name + "!";
		button.onclick = (function(t) {
			return function() {
				var x = Math.floor(Math.random() * automata.cols);
				var y = Math.floor(Math.random() * automata.rows);
				automata.swimmers.push(SwimmerFactory.types[t].creator(x, y));
				TheView.paintAll();
			}
		})(type);
		doc.swimmersDiv.appendChild(button);
	}
				
	TheView.initAutomata();
}

function removeSwimmers() {
	automata.swimmers = [];
	TheView.paintAll();
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
	var initData=doc.scratchPadBox.value;	
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
	TheView.paintAll();
}
		
function viscosityChanged(){
	var viscosity = Viscosities[doc.viscositySelector.value];
	automata.tusk.viscosity = viscosity.viscosity;
	TheView.primaryPainter.baseColor = viscosity.baseColor;
	TheView.paintAll();
}

function tuskChanged(){	
	automata.tusk = TuskRegistry[doc.tuskSelector.value];
	automata.initCells();
	initTuskControls();
	TheView.paintAll();
}

function initTuskControls() {
	TheView.secondaryPainter.pool = null;

	doc.poolList.innerHTML = "";
	for (var i in automata.tusk.pools) {
		var pool = automata.tusk.pools[i];
		
		if (TheView.secondaryPainter.pool == null) {
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
		
		doc.poolList.appendChild(radio);
		doc.poolList.appendChild(img);
	}
	if (TheView.secondaryPainter.pool != null) {
		doc.secondaryCanvasDiv.style.display = "block";
		doc.poolList.getElementsByTagName("input")[0].checked = true;
	} else {
		doc.secondaryCanvasDiv.style.display = "none";
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
			doc.lastBeforeCustom.parentNode.appendChild(div);
			
			eventBoxes.push(div);
		}
	}

	for (var i = 0; i < templateButtons.length; i++) {
		templateButtons[i].parentNode.removeChild(templateButtons[i]);
	}
	templateButtons = [];
	if (automata.tusk.templates) {
		for (var i = 0; i < automata.tusk.templates.length; i++) {
			var template = automata.tusk.templates[i];
			var button = document.createElement("input");
			button.type = "button";
			button.value = template.name;
			button.onclick = (function(tmpl, automata) {
				return function() {
					var data = tmpl.get(automata);
					doc.scratchPadBox.value = data;
				}
			})(template, automata);
			doc.templateDiv.appendChild(button);
			templateButtons.push(button);
		}
	}
	doc.templateDiv.style.display = templateButtons.length > 0 ? "block" : "none";
}

var eventBoxes = [];
var templateButtons = [];

function sizeChanged() {
	initAutomata();
}

function slicesChanged() {
	automata.tusk.slices = doc.slicesBox.value;
}

function selectedPoolChanged(pool) {
	TheView.secondaryPainter.pool = pool;
	if (automataInitialized) {
		TheView.paintAll();
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
	TheView.paintAll();
	doc.iterationLabel.innerHTML = automata.iterations;
	if (running) {
		window.setTimeout(step, 0);
	}
}


function getCells(pt) {
	return automata.model[Math.floor(pt.x / (WIDTH/automata.cols))][Math.floor(pt.y / (HEIGHT/automata.rows))];
};
		
function transformDisp2CellCoordinate(x,y){
	var x1 = Math.floor(x / WIDTH/automata.cols);
	var y1 = Math.floor(y / HEIGHT/automata.rows);
	return new Point(x1,y1);
}

function getFormattedColor(du, r0, g0, b0) {
	var color = getColor(du, r0, g0, b0);
	return "rgb(" + color.r + "," + color.g + "," + color.b + ")";
}

function formatNum(num){
  return num.toPrecision(6);
}

function updateCellInspector(cell) {
	updateCellInspectorCell("c", cell);
	var x = cell.x;
	var y = cell.y;
	if (x-1 >= 0 && y-1 >= 0) {
		updateCellInspectorCell("nw", automata.model[y-1][x-1]);
	}
	if (x-1 >= 0 && y+1 < automata.rows) {
		updateCellInspectorCell("sw", automata.model[y+1][x-1]);
	}
	if (x+1 < automata.cols && y+1 < automata.rows) {
		updateCellInspectorCell("se", automata.model[y+1][x+1]);
	}
	if (y-1 >= 0 && x+1 < automata.cols) {
		updateCellInspectorCell("ne", automata.model[y-1][x+1]);
	}
	if (y-1 >= 0) {
		updateCellInspectorCell("n", automata.model[y-1][x]);
	}
	if (x-1 >= 0) {
		updateCellInspectorCell("w", automata.model[y][x-1]);
	}
	if (y+1 < automata.rows) {
		updateCellInspectorCell("s", automata.model[y+1][x]);
	}
	if (x+1 < automata.cols) {
		updateCellInspectorCell("e", automata.model[y][x+1]);
	}
}

function updateCellInspectorCell(id, cell) {
	doc.cellInspector[id].innerHTML = formatNum(cell.currentData.displayValue());
}

window.onload = load;
