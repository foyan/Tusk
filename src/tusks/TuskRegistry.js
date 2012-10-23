if (typeof(module) != "undefined") {
	module.exports = TuskRegistry;
	var WaveEquation = require('../src/WaveEquation.js');
	var GameOfLife = require('../src/GameOfLife.js');
	var Diffusion = require('../src/Diffusion.js');
	var PascalTriangle = require('../src/PascalTriangle.js');
}

var TuskRegistry = {
	wave: new WaveEquation(),
	gameoflife: new GameOfLife(),
	diffusion: new DiffusionEquation(),
	pascaltriangle: new PascalTriangle()
};
