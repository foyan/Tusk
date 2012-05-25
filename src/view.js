automata = null;

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
						
}

window.onload = load;
