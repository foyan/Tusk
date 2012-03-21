function load() {
	
	var body = document.body;
	
	var table = document.createElement("table");
	table.style.backgroundColor = "black";
	body.appendChild(table);
	
	for (i = 0; i < 50; i++) {
		var row = document.createElement("tr");
		table.appendChild(row);
		for (j = 0; j < 50; j++) {
			var cell = document.createElement("td");
			row.appendChild(cell);
		}
	}
}

window.onload = load;
