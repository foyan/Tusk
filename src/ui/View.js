function View() {
	
	this.CANVAS_WIDTH = 500;
	this.CANVAS_HEIGHT = 500;
	
	this.doc = null;
	
	this.automata = new CellularAutomata();
	
	this.load = function(doc) {
		this.doc = doc;
		
		this.configureCanvases();
		
		this.primaryPainter = PainterFactory.types[0].creator(this.doc.primaryCanvas);
		this.secondaryPainter = PainterFactory.types[0].creator(this.doc.secondaryCanvas);
		
		ViewUtils.bindStrategies(this.doc.tuskSelector, TuskRegistry, function(s) { return s.sayHello(); }, (function(view) {
			return function(tusk) {
				view.automata.tusk = tusk;
				view.automata.initCells();
				initTuskControls;
				view.paintAll();
			};
		})(this));
		
	}
	
	this.configureCanvases = function() {
		this.doc.primaryCanvas.width = this.CANVAS_WIDTH;
		this.doc.primaryCanvas.height = this.CANVAS_HEIGHT;
		this.doc.secondaryCanvas.width = this.CANVAS_WIDTH;
		this.doc.secondaryCanvas.height = this.CANVAS_HEIGHT;
	}
	
	this.primaryPainter = null;
	this.secondaryPainter = null;
	
	this.forAllPainters = function(fn) {
		fn(this.primaryPainter);
		fn(this.secondaryPainter);
	}
	
	this.initAutomata = function() {
		this.automata.rows = this.doc.rows.value;
		this.automata.cols = this.doc.cols.value;
		this.automata.initCells();
		
		this.forAllPainters((function(view) {
			return function(painter) {
				painter.scaling.x = view.CANVAS_WIDTH / view.automata.rows;
				painter.scaling.y = view.CANVAS_HEIGHT / view.automata.cols;
			};
		})(this));
				
		this.paintAll();
		automataInitialized = true;
	}
	
	this.paintAll = function() {
		this.forAllPainters((function(view) {
			return function(painter) {
				painter.begin();
				view.automata.forEachCell(function(cell) {
					painter.paintCell(cell);
				});
				painter.end();
			};
		})(this));
		this.automata.forEachSwimmer((function(view) {
			return function(swimmer) {
				view.primaryPainter.paintSwimmer(swimmer);
			}
		})(this));
	}

}

var TheView = new View();
//window.onload = TheView.load(new Doc());
