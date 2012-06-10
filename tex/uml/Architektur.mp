input metauml;
beginfig(1);

	Class.View("View")()();
	Class.Doc("Doc")()();
	
	Class.CellularAutomata("CellularAutomata")()();
	Class.Cell("Cell")()();
	Class.Swimmer("Swimmer")()();

	leftToRight(10)(View, Doc);
	leftToRight(10)(CellularAutomata, Cell);

    Package.ui("ui")(View, Doc);
    Package.automata("automata")();
    Package.tusks("tusks")();
    Package.events("events")();
    Package.integrations("integrations")();
	
	leftToRight(50)(ui, automata, tusks, events, integrations, utils);
	
	drawObjects(ui, automata, tusks, events, integrations);
	
endfig;
end