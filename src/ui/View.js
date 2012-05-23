function View() {
	
	this.doc = null;
	
	this.load = function(doc) {
		
		this.doc = doc;
		
	}
	
}

var TheView = new View();
window.onload = TheView.load(new Doc());
