/*importScripts(
	"../automata/CellularAutomata.js"
);*/

importScripts("WorkerState.js");
importScripts("../automata/CellularAutomata.js");

self.onmessage = function(evt) {
	if (evt.data.msg == "init") {
		self.state = new WorkerState(evt.data.id, evt.data.count);
	}
};
