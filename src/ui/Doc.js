function Doc() {
	
	this.primaryCanvas = document.getElementById("pool");
	
	this.secondaryCanvas = document.getElementById("pool1");
	
	this.iterationLabel = document.getElementById("iterationCount");
	
	this.toggle = document.getElementById("toggle");
	
	this.step = document.getElementById("step");
	
	this.reset = document.getElementById("reset");
	
	this.tuskSelector = document.getElementById("diffFormel");
	
	this.viscositySelector = document.getElementById("viscosity");
	
	this.integration = document.getElementById("integration");
	
	this.cellValueBox = document.getElementById("setValue");
	
	this.scratchPadBox = document.getElementById("InitData");
	
	this.swimmersDiv = document.getElementById("swimmers");
	
	this.rows = document.getElementById("rows");
	
	this.cols = document.getElementById("cols");
	
	this.poolList = document.getElementById("poolList");
	
	this.secondaryCanvasDiv = document.getElementById("pool2div");
	
	this.lastBeforeCustom = document.getElementById("lastBeforeCustom");
	
	this.templateDiv = document.getElementById("templates");
	
	this.slicesBox = document.getElementById("slices");
	
	this.applyScratchPad = document.getElementById("applyScratchPad");
	
	this.removeSwimmers = document.getElementById("removeSwimmers");
	
	this.painter = document.getElementById("painter");
	
	this.size = {
		rows: document.getElementById("rows"),
		cols: document.getElementById("cols")
	};
	
	this.cellInspector = {
		w: document.getElementById("cellInspector_W"),
		e: document.getElementById("cellInspector_E"),
		n: document.getElementById("cellInspector_N"),
		s: document.getElementById("cellInspector_S"),
		ne: document.getElementById("cellInspector_NE"),
		nw: document.getElementById("cellInspector_NW"),
		se: document.getElementById("cellInspector_SE"),
		sw: document.getElementById("cellInspector_SW"),
		c: document.getElementById("cellInspector_C")
	};

};