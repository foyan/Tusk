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
  		
function initTuskControls() {
	TheView.secondaryPainter.pool = null;

	TheView.bindTuskStrategies(automata.tusk);
}

function sizeChanged() {
	initAutomata();
}

function slicesChanged() {
	automata.tusk.slices = doc.slicesBox.value;
}

window.onload = load;
