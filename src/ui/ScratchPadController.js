function ScratchPadController(doc, view) {
	
	this.doc = doc;
	
	this.view = view;
	
	this.doc.applyScratchPad.onclick = (function(controller) { return function() {
		controller.applyScratchPad(controller.doc.scratchPadBox.value);
	} })(this);

	this.applyScratchPad = function(data) {
		var idRows = data.split(";");	
		var idx = 0;
		var maxRows = idRows.length < this.view.automata.rows ? idRows.length : this.view.automata.rows;
		for (var i = 0; i < maxRows; i++) {
			var idCols = idRows[i].split(",");
			var y = parseFloat(idCols[0]);
			var startX = parseFloat(idCols[1]);
			var maxCols = idCols.length < this.view.automata.cols ? idCols.length : this.view.automata.cols;
			for (var j = 2; j < maxCols; j++) {	
				idx = startX + j - 2;
				idx = idx > this.view.automata.cols ? this.view.automata.cols : idx;
	
				var cell = this.view.automata.model[y][idx];
				this.view.automata.tusk.setCellValue(cell, parseFloat(idCols[j]));
			}
		}
		this.view.paintAll();
	};
	
}