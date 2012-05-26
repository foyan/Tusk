function GodsPanelController(doc, view) {

	this.doc = doc;
	
	this.view = view;
	
	this.doc.primaryCanvas.onmousemove = (function(controller) {
		return function(e) {
			var cell = controller.view.getCellAt(e);
			if (cell != null) {
				if (e.ctrlKey) {
					controller.view.automata.tusk.setCellValue(cell, parseFloat(controller.doc.cellValueBox.value));
					controller.view.paintAll();
				}
				if (e.shiftKey) {
					controller.view.cellInspector.inspect(cell);
				}
			}
		}
	})(this);

}