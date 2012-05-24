function CellInspectorController(doc, view) {
	
	this.doc = doc;
	this.view = view;
	
	this.inspect = function(cell) {
		this.inspectOne("c", cell);
		var x = cell.x;
		var y = cell.y;
		if (x-1 >= 0 && y-1 >= 0) {
			this.inspectOne("nw", this.view.automata.model[y-1][x-1]);
		}
		if (x-1 >= 0 && y+1 < this.view.automata.rows) {
			this.inspectOne("sw", this.view.automata.model[y+1][x-1]);
		}
		if (x+1 < this.view.automata.cols && y+1 < this.view.automata.rows) {
			this.inspectOne("se", this.view.automata.model[y+1][x+1]);
		}
		if (y-1 >= 0 && x+1 < this.view.automata.cols) {
			this.inspectOne("ne", this.view.automata.model[y-1][x+1]);
		}
		if (y-1 >= 0) {
			this.inspectOne("n", this.view.automata.model[y-1][x]);
		}
		if (x-1 >= 0) {
			this.inspectOne("w", this.view.automata.model[y][x-1]);
		}
		if (y+1 < this.view.automata.rows) {
			this.inspectOne("s", this.view.automata.model[y+1][x]);
		}
		if (x+1 < this.view.automata.cols) {
			this.inspectOne("e", this.view.automata.model[y][x+1]);
		}
	};
	
	this.inspectOne = function(id, cell) {
		this.doc.cellInspector[id].innerHTML = ViewUtils.formatNumber(cell.currentData.displayValue());
	};
	
}
