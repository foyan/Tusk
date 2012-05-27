function View() {
	
	this.CANVAS_WIDTH = 500;
	this.CANVAS_HEIGHT = 500;
	
	this.doc = null;
	
	this.automata = new CellularAutomata();
	
	this.transport = null;
	this.cellInspector = null;
	this.scratchPad = null;
	this.godsPanel = null;
		
	this.load = function(doc) {
		this.doc = doc;
		this.transport = new TransportController(this.doc, this);
		this.cellInspector = new CellInspectorController(this.doc, this);
		this.scratchPad = new ScratchPadController(this.doc, this);
		this.godsPanel = new GodsPanelController(this.doc, this);
		
		this.bindRootStrategies();
		
		this.configureCanvases();
		
		this.primaryPainter = PainterFactory.create(PainterFactory.types[0], this.doc.primaryCanvas, this);
		this.secondaryPainter = PainterFactory.create(PainterFactory.types[0], this.doc.secondaryCanvas, this);
		
		this.doc.removeSwimmers.onclick = (function(view) {
			return function() {
				view.automata.swimmers = [];
				view.paintAll();
			};
		})(this);
		
		this.doc.size.rows.onchange = (function(view) {
			return function() {
				view.initAutomata();
			}
		})(this);
		this.doc.size.cols.onchange = this.doc.size.rows.onchange;
		
		this.doc.slicesBox.onchange = (function(view){
			return function() {
				view.automata.tusk.slices = view.doc.slicesBox.value;
			};
		})(this);
		
		this.doc.tuskSelector.onchange();
		this.doc.painter.onchange();
		this.doc.tuskSelector.onchange();
		this.doc.viscositySelector.onchange();
		this.doc.integration.onchange();

		this.initAutomata();

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
				view.bindTuskStrategies();
				view.primaryPainter.pool = tusk.primaryPool;
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
		})(this), function(s) {
			var sw = s.creator(0,0);
			return sw.image.src;
		});
		
		ViewUtils.bindStrategiesToCombobox(null, this.doc.painter, PainterFactory.types, function(p) {
			return p.name;
		}, (function(view) {
			return function(p) {
				view.primaryPainter = PainterFactory.create(p, view.doc.primaryCanvas, view);
				view.secondaryPainter = PainterFactory.create(p, view.doc.secondaryCanvas, view);
				view.updatePainterScaling();
				view.doc.viscositySelector.onchange();
				if (view.automata.tusk != null) {
					view.primaryPainter.pool = view.automata.tusk.primaryPool;
				}
			};
		})(this));	

		ViewUtils.bindStrategiesToCombobox(null, this.doc.integration, IntegrationRegistry, function(i) {
			return i.name;
		}, (function(view) {
			return function(i) {
				view.automata.integration = i;
			};
		})(this));	
	}
	
	this.bindTuskStrategies = function(tusk) {
		this.secondaryPainter.pool = null;

		ViewUtils.bindStrategiesToRadioList("pools", this.doc.poolList, this.automata.tusk.pools, (function(view) {
			return function(pool) {
				var img = document.createElement("img");
				img.setAttribute("src", pool.imageSource);
				img.setAttribute("alt", pool.name);
				return img;
			};
		})(this), (function(view) {
			return function(pool) {
				view.secondaryPainter.pool = pool;
				view.paintAll();
			};
		})(this));
				
		this.doc.secondaryCanvasDiv.style.display = this.automata.tusk.pools && this.automata.tusk.pools.length > 0 ? "block" : "none";
		
		ViewUtils.bindStrategiesToBoxes("events", this.doc.lastBeforeCustom.parentNode, this.automata.tusk.events, function(ev) {
			return ev.name;
		}, function(ev, enabled) {
			ev.enabled = enabled;
		}, function(ev, doc) {
			return ev.createView ? ev.createView(doc) : null;
		});
		
		ViewUtils.bindStrategiesToButtonList("templates", this.doc.templateDiv, this.automata.tusk.templates, function(template) {
			return template.name;
		}, (function(view) {
			return function(template) {
				var data = template.get(view.automata);
				view.doc.scratchPadBox.value = data;
			};
		})(this));

		this.doc.templateDiv.style.display = this.automata.tusk.templates.length > 0 ? "block" : "none";
		
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
		
		this.updatePainterScaling();
		this.paintAll();
	}
	
	this.updatePainterScaling = function() {
		this.forAllPainters((function(view) {
			return function(painter) {
				painter.scaling.x = view.CANVAS_WIDTH / view.automata.rows;
				painter.scaling.y = view.CANVAS_HEIGHT / view.automata.cols;
			};
		})(this));
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

window.onload = function() { new View().load(new Doc()); };
