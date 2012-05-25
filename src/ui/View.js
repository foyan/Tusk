function View() {
	
	this.CANVAS_WIDTH = 500;
	this.CANVAS_HEIGHT = 500;
	
	this.doc = null;
	
	this.automata = new CellularAutomata();
	
	this.transport = null;
	this.cellInspector = null;
	
	this.load = function(doc) {
		this.doc = doc;
		this.transport = new TransportController(this.doc, this);
		this.cellInspector = new CellInspectorController(this.doc, this);
		
		this.bindRootStrategies();
		
		this.configureCanvases();
		
		this.primaryPainter = PainterFactory.types[0].creator(this.doc.primaryCanvas);
		this.secondaryPainter = PainterFactory.types[0].creator(this.doc.secondaryCanvas);
		
	}
	
	this.configureCanvases = function() {
		this.doc.primaryCanvas.width = this.CANVAS_WIDTH;
		this.doc.primaryCanvas.height = this.CANVAS_HEIGHT;
		this.doc.secondaryCanvas.width = this.CANVAS_WIDTH;
		this.doc.secondaryCanvas.height = this.CANVAS_HEIGHT;
	}
	
	this.bindRootStrategies = function() {
		ViewUtils.bindStrategiesToCombobox(null, this.doc.tuskSelector, TuskRegistry, function(s) { return s.sayHello(); }, (function(view) {
			return function(tusk) {
				view.automata.tusk = tusk;
				view.automata.initCells();
				initTuskControls();
				view.paintAll();
			};
		})(this));
		
		ViewUtils.bindStrategiesToCombobox(null, this.doc.viscositySelector, Viscosities, function(s) { return s.name; }, (function(view) {
			return function(viscosity) {
				view.automata.tusk.viscosity = viscosity.viscosity;
				view.primaryPainter.baseColor = viscosity.baseColor;
				view.paintAll();
			};
		})(this));
		
		ViewUtils.bindStrategiesToButtonList(null, this.doc.swimmersDiv, SwimmerFactory.types, function(s) { return s.name + "!"; }, (function(view) {
			return function(type) {
				var x = Math.floor(Math.random() * view.automata.cols);
				var y = Math.floor(Math.random() * view.automata.rows);
				view.automata.swimmers.push(type.creator(x, y));
				view.paintAll();
			};
		})(this));		
	}
	
	this.bindTuskStrategies = function(tusk) {
		ViewUtils.bindStrategiesToRadioList("pools", this.doc.poolList ? this.doc.poolList : {}, tusk.pools, (function(view) {
			return function(pool) {
				var img = document.createElement("img");
				img.setAttribute("src", pool.imageSource);
				img.setAttribute("alt", pool.name);
				return img;
			};
		})(this), (function(view) {
			return function(pool) {
				view.secondaryPainter.pool = pool;
				if (automataInitialized) {
					view.paintAll();
				}
			};
		})(this));
		
		this.doc.secondaryCanvasDiv.style.display = tusk.pools && tusk.pools.length > 0 ? "block" : "none";
		
		ViewUtils.bindStrategiesToBoxes("events", doc.lastBeforeCustom.parentNode, tusk.events, function(ev) {
			return ev.name;
		}, function(ev, enabled) {
			ev.enabled = enabled;
		}, function(ev, doc) {
			return ev.createView ? ev.createView(doc) : null;
		});
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
	
	this.getCellAt = function(event) {
		var off = ViewUtils.offset(event.target);
		var x = Math.floor((event.clientX - off.x - 2) / (this.CANVAS_WIDTH / this.automata.rows));
		var y = Math.floor((event.clientY - off.y - 2) / (this.CANVAS_HEIGHT / this.automata.cols));
		if (x < 0 || y < 0 || x >= this.automata.cols || y >= this.automata.rows) return null;
		return this.automata.model[y][x];
	}

}

var TheView = new View();
//window.onload = TheView.load(new Doc());
