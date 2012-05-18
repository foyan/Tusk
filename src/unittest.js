/*

	unittest.js

*/

var tabOut=null;

function startTest(){
	
	tabOut = document.getElementById("utOut");	
	addRow(tabOut, "Duck Test", "true", "true=Duck hat sich nicht verschoben");
	
	DuckTest01();
}

function DuckTest01(){
	//north=new CellData();
}


function addRow(table, td1, td2, td3) {
		var rowCount = table.rows.length;
		var row = table.insertRow(rowCount);
		var cell1 = row.insertCell(0);
		cell1.innerHTML =td1;
		var cell2 = row.insertCell(0);
		cell1.innerHTML =td1;
		var cell3 = row.insertCell(0);
		cell2.innerHTML =td2;
}


window.onload = startTest;