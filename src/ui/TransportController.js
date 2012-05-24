function TransportController(doc, view) {
	
	this.doc = doc;
	this.view = view;
	
	this.running = false;
	
	this.toggle = function() {
		this.running = !this.running;
		if (this.running) {
			this.step();
		}
	}
	
	this.step = function(){
		step();
	}
	
	this.step = function() {
		this.view.automata.step();
		view.paintAll();
		doc.iterationLabel.innerHTML = automata.iterations;
		if (this.running) {
			window.setTimeout((function(controller) {
				return function() {
					controller.step();
				};
			})(this), 0);
		}
	}
	
	this.reset = function() {
		this.view.automata.iterations = 0;
		initAutomata();
	}
	
	this.doc.toggle.onclick = (function(controller) { return function() { controller.toggle(); } })(this);
	this.doc.step.onclick = this.step;
	this.doc.reset.onclick = this.reset;
	
}
