automata = null;

function load() {
	
	doc = new Doc();
					
	TheView.load(doc);
	
	automata = TheView.automata;
				
	TheView.doc.tuskSelector.onchange();
	TheView.doc.viscositySelector.onchange();						
}

window.onload = load;
