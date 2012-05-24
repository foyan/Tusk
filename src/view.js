automata = null;

WIDTH = 500;
HEIGHT = 500;

doc = null;

function load() {
	
	doc = new Doc();
					
	TheView.load(doc);
	
	automata = TheView.automata;
				
	TheView.doc.tuskSelector.onchange();
	TheView.doc.viscositySelector.onchange();
		
	doc.primaryCanvas.onmousemove = function(e) {
		if (e.altKey) {	
		    var cell= TheView.getCellAt(e);
			if(cell!=null) {
				automata.tusk.mouseMoveAlt(cell, doc.cellValueBox);
				TheView.paintAll();
			}
		}
		if (e.shiftKey) {
			var cell = TheView.getCellAt(e);
			if( cell!=null) {
				TheView.cellInspector.inspect(cell);
			}
		}
		if (e.ctrlKey && tusk.supportsDuck ) {
			var cell = TheView.getCellAt(e);
			if( cell!=null) {
				ducks[ducks.length]= new Point(1+cell.x*WIDTH/automata.cols, 1+cell.y*HEIGHT/automata.rows);
				// cell.hasDuck = !cell.hasDuck;
			}
		}
	};
						
	TheView.initAutomata();
}

function removeSwimmers() {
	automata.swimmers = [];
	TheView.paintAll();
}


var automataInitialized = false;
  
function initCells(){
	var initData=doc.scratchPadBox.value;	
	setCells(initData);
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

window.onload = load;
