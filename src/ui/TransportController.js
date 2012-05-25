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
	
	this.step = function() {
		this.view.automata.step();
		this.view.paintAll();
		this.doc.iterationLabel.innerHTML = this.view.automata.iterations;
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
		this.view.initAutomata();
		this.doc.iterationLabel.innerHTML = this.view.automata.iterations;
	}
	
	this.doc.toggle.onclick = (function(controller) { return function() {
		controller.toggle();
	} })(this);
	
	this.doc.step.onclick = (function(controller) { return function() { 
		controller.step(); 
	} })(this);
	
	this.doc.reset.onclick = (function(controller) { return function() { 
		controller.reset();
	} })(this);
	
}
