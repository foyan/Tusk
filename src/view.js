automata = null;

ROWS = 100;
COLS = 100;
SLICES= 10;

WIDTH = 600;
HEIGHT = 600;
scaleWidth = WIDTH / COLS;  		
scaleHeight = HEIGHT / ROWS;

MAXITEMS=6;  // Gradienten in Cell

iterationLabel = null;
canvas = Array();
ctx = Array();

rainIntensity = null;
fountainIntensity=null;
statusMap=Array();
var statusCell=null;

var duckImage = new Image();
duckImage.src = "pics/duck.png";
var ballImage = null;

var damping = 0.995;

firstTime=true;

canves2Idx=1;

viscosity=1;  // Wasser 20 Grad Celsius

function createCanvasPainter(context) {
	return new PixelCanvasPainter(context);
}

function load() {
	
	automata = new CellularAutomata();
			
	iterationLabel = document.getElementById("iterationCount");
	rainIntensity = document.getElementById("rain");
	fountainIntensity= document.getElementById("fountain");
	canvas[0] = document.getElementById("pool");
	
	canvas[0].width = WIDTH;
	canvas[0].height = HEIGHT;
	
	ctx[0] = createCanvasPainter(canvas[0].getContext("2d"));
	
	canvas[1] = document.getElementById("pool1");
	canvas[1].width = WIDTH;
	canvas[1].height = HEIGHT;
	
	ctx[1] = createCanvasPainter(canvas[1].getContext("2d"));
	ctx[1].getColor = function() {return {r: 128, g: 128, b: 128}; };
	ctx[1].getUIndex = function() { return canves2Idx; };
	
	var select = document.getElementById("diffFormel");
	for (var strategy in TuskRegistry) {
		var opt = document.createElement("option");
		opt.text = TuskRegistry[strategy].sayHello();
		opt.value = strategy;
		select.options.add(opt);
	}

	
	cellDefaultValue = document.getElementById("setValue");
	
	statusLabel = document.getElementById("statusLabel");
	initDataTextbox = document.getElementById("InitData");
	modelname=document.getElementById("modelname");

	statusMapNorth= document.getElementById("u_north");
	statusMapSouth= document.getElementById("u_south");
	statusMapLeft= document.getElementById("u_left");
	statusMapRight= document.getElementById("u_right");
	statusMapMe= document.getElementById("u_me");
	statusMapPos= document.getElementById("u_pos");

	statusMap[0]=statusMapNorth; statusMap[1]=statusMapSouth;
	statusMap[2]=statusMapLeft; statusMap[3]=statusMapRight;
	statusMap[4]=statusMapMe; statusMap[5]=statusMapPos;
	

	
	automata.tusk = TuskRegistry[getFormelCtrl()]; 
	tusk = automata.tusk;
	SLICES= tusk.SLICES;	
	
	canvas[0].onmousemove = function(e) {
		if (e.altKey) {	
		    var cell= getCell(e);
			if(cell!=null) {
				automata.tusk.mouseMoveAlt(cell, cellDefaultValue);
				updateAllCellView();
			}
		}
		if (e.shiftKey) {
			var cell = getCell(e);
			if( cell!=null) {
				statusLabel.innerHTML = automata.tusk.getCellInfo(cell);
			}
		}
		if (e.ctrlKey && tusk.supportsDuck ) {
			var cell = getCell(e);
			if( cell!=null) {
				ducks[ducks.length]= new Point(1+cell.x*WIDTH/automata.cols, 1+cell.y*HEIGHT/automata.rows);
				// cell.hasDuck = !cell.hasDuck;
				// updateCellView(cell);
			}
		}
	};
		
	canvas[1].onmousemove = function(e) {
		if (e.shiftKey ) {
			statusLabel.innerHTML = automata.tusk.getCellInfo(getCell(e));									  
		}
	};		
		
	automata.initCells();
		
	automata.swimmers.push(new Swimmer());
	automata.swimmers[0].image = duckImage;
	automata.swimmers[0].location.x = 10;
	automata.swimmers[0].location.y = 10;
	
	automata.swimmers.push(new Swimmer());
	automata.swimmers[1].image = duckImage;
	automata.swimmers[1].location.x = 20;
	automata.swimmers[1].location.y = 30;

	automata.swimmers.push(new Swimmer());
	automata.swimmers[2].image = duckImage;
	automata.swimmers[2].location.x = 80;
	automata.swimmers[2].location.y = 60;

	automata.swimmers.push(new Swimmer());
	automata.swimmers[3].image = duckImage;
	automata.swimmers[3].location.x = 40;
	automata.swimmers[3].location.y = 40;

	beginUpdate();
	automata.forEachCell(updateCellView);
	endUpdate();
	automata.forEachSwimmer(drawSwimmer);
				
}



function offset(target) {
	var off = {x: target.offsetLeft, y: target.offsetTop};
	if (target.offsetParent) {
		var poff = offset(target.offsetParent);
		off.x += poff.x;
		off.y += poff.y;
	}
	return off;
}

function getCell(e) {
	var off = offset(e.target);
	var x = Math.floor((e.clientX - off.x - 2) / (scaleWidth));
	var y = Math.floor((e.clientY - off.y - 2) / (scaleHeight));
	if( x<0 || y<0 || x>automata.cols || y>automata.rows) return null;
	var cell = automata.model[y][x];
	return cell;
}	
  
function initCells(){
	var initData=initDataTextbox.value;	
	setCells(initData);
}

function reset(){
	firstTime=true;
	step();
}

function setCells(data)	{
	var idRows=data.split(";");	
	var idx=0;
	var maxRows=(idRows.length < automata.rows ? idRows.length: automata.rows);
	beginUpdate();
	for (var i = 0; i < maxRows; i++) {
		var idCols=idRows[i].split(",");
		var y=parseFloat(idCols[0]);
		var startX=parseFloat(idCols[1]);
		var maxCols=(idCols.length < automata.cols ? idCols.length: automata.cols);
		for (var j = 2; j < maxCols; j++) {	
			idx= startX+j-2;
			idx=(idx>automata.cols?automata.cols:idx);				
			var cellData= automata.model[y][idx] ;
			cellData.currentGradients[0] = parseFloat(idCols[j]); 
			for( var i2=1; i2<cellData.currentGradients.length; i2++) {
				cellData.currentGradients[i2] = 0;
			}
			updateCellView(cellData);
		}
	}
	endUpdate();
}
		
function setStatusMap(cell){
	var x=cell.x;
	var y=cell.y;
	
	statusMapRight.innerHTML= getStatusMapInfo(y,x+1);  
	statusMapLeft.innerHTML= getStatusMapInfo(y,x-1);  
	statusMapNorth.innerHTML= getStatusMapInfo(y-1,x); 
	statusMapSouth.innerHTML= getStatusMapInfo(y+1,x); 
	statusMapMe.innerHTML= getStatusMapInfo(y,x);
	statusMapPos.innerHTML= "x/y: " + x +"/"+ y;
}		
		
function getStatusMapInfo(y,x){
	var m=automata.model[y][x]
	var u=m.currentGradients[canves2Idx];
	var s=formatNum(u);
	return s;
}		


function radioCanvesChanged(radioButton) {
	canves2Idx= radioButton.value;
	updateAllCellView();
	setStatusMap(statusCell);
}

function changeViscosity(){
	var ctrl=document.getElementById("viscosity");
	var idx=ctrl.selectedIndex;
	var val=ctrl.options[idx].value;
	
	viscosity= parseInt(val);
}



function getFormelCtrl(){
	var ctrl=document.getElementById("diffFormel");
	var idx=ctrl.selectedIndex;
	var val=ctrl.options[idx].value;
	
	return val;
}
// called when DiffFormel has changed
function tuskChanged(){	
	automata.tusk = TuskRegistry[getFormelCtrl()];
	automata.initCells();
	updateAllCellView();
}

var running = false;

function toggle() {
	running = !running;
	if (running) {
		step();
	}
}

function singleStep(){
	step();
}



function step() {
	automata.step();
	updateAllCellView();
	automata.forEachSwimmer(drawSwimmer);
	iterationLabel.innerHTML = "# Iterations: " + automata.iterations;
	if (running) {
		window.setTimeout(step, 00);
	}
}


function getCells(pt) {
	return automata.model[Math.floor(pt.x / (scaleWidth))][Math.floor(pt.y / (scaleHeight))];
};
		
function updateAllCellView(){
	beginUpdate();
	automata.forEachCell(updateCellView);
	endUpdate();
}		


function transformDisp2CellCoordinate(x,y){
	var x1 = Math.floor(x / scaleWidth);
	var y1 = Math.floor(y / scaleHeight);
	return new Point(x1,y1);
}

function updateCellView(cell) {
	ctx[0].updateCellView(cell);
	ctx[1].updateCellView(cell);
}

function drawSwimmer(swimmer) {
	ctx[0].drawSwimmer(swimmer);
}

function beginUpdate() {
	ctx[0].begin();
	ctx[1].begin();
}

function endUpdate() {
	ctx[0].end();
	ctx[1].end();
}

function getColor(du, r0, g0, b0) {
	var r = Math.min(255, Math.max(0, Math.floor(r0 * (1+du))));
	var g = Math.min(255, Math.max(0, Math.floor(g0 * (1+du))));
	var b = Math.min(255, Math.max(0, Math.floor(b0 * (1+du))));
	
	return {
		r: r,
		g: g,
		b: b
	};
}

function getFormattedColor(du, r0, g0, b0) {
	var color = getColor(du, r0, g0, b0);
	return "rgb(" + color.r + "," + color.g + "," + color.b + ")";
}

function formatNum(num){
  return num.toPrecision(4);
}

window.onload = load;
