


// get Eigennamen der TuskImplementierung
function sayHello(){ return "diffusion"; }

function supportsDuck() { return false; }
function supportsFountain() { return true; }
function supportsRains() { return false; }

function getDuckImage() { return null; }

function getDucks(rows, cols) { return  Array(); }

// set cell values for the rain drops.
// Parameter: cell, drops=value on the GUI, i=counter for drops: i=5 => 5th drops
function getRainValue(cell, drops, i)  {}


function getFountains(intensity, rows, cols){
	var fountains= Array(); 
	var i=0;
	var f=new Fountain(); f.x=cols/2; f.y=rows/2; f.intensity=(parseFloat(intensity)); fountains[i++]=f; 
	
	return fountains;
}


// get Info über die Werte in Cell
function getCellInfo(cell){
	var lf="\t";
	var info= "u="+formatNum(cell.currentGradients[0]); 
	return info;
}

// Aktion bei MouseMove mit Alt: Setzen der Werte von cell.
function mouseMoveShift(cell, initVal){}

// Aktion bei MouseMove mit Alt
function mouseMoveAlt(cell, cellDefaultValue){
	var initVal= (cellDefaultValue.value == null || cellDefaultValue.value == "") ? -0.9 : parseFloat(cellDefaultValue.value);
			
	cell.currentGradients[0] = initVal;
}

// custom settings. Wird beim ersten Run von Step() aufgerufen.
function customFirstTime() {}
	
function initCell(cellData) {
	cellData.currentGradients[0] = 0; 
}

function calcCell(me, dimensions, dt, damping) {
	var du = Array();
	var diff=0;
	du[0] = 0;
	for (n = 0; n < dimensions.length; n++) {
	    dn = dimensions[n];
		diff= (-dn.previous[0] + me[0])*0.01;
		du[0]-=diff;
	}
	du[0]+=me[0];
	return du;
}

