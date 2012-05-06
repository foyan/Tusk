/*  
  ITusk 
   Berechnungsmodelle für den Zellulären Automaten
   by Detlev und Florian ZHAW i10b, 4S/2012
   
   Pseudocode da JS keine Interfaces unterstützt
*/

// get Eigennamen der TuskImplementierung
function sayHello() => returns string

function supportsDuck() => returns true/false
function supportsFountain() => returns true/false
function supportsRains() => returns true/false

function getDuckImage() => object of Image

function getDucks(rows, cols) => Point[]

// set cell values for the rain drops.
// Parameter: cell, drops=value on the GUI, i=counter for drops: i=5 => 5th drops
function getRainValue(cell, drops, i)  => no return

// get Info über die Werte in Cell
function getCellInfo(cell) => returns string

// Aktion bei MouseMove mit Alt
function mouseMoveAlt(cell, cellDefaultValue) => undef

// Aktion bei MouseMove mit Alt: Setzen der Werte von cell.
function mouseMoveShift(cell, initVal) => undef

// custom settings. Wird beim ersten Run von Step() aufgerufen.
function customFirstTime(); 

function calcCell(me, dimensions, dt, damping) => du = float[] wobei du[0]=u

function initCell(cellData) => no return
