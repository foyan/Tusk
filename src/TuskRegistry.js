if (typeof(module) != "undefined") {
	module.exports = TuskRegistry;
	var WaveEquation = require('../src/WaveEquation.js');
	var GameOfLife = require('../src/GameOfLife.js');
	var Diffusion = require('../src/Diffusion.js');
}

var TuskRegistry = {
	wave: new WaveEquation(),
	gameoflife: new GameOfLife(),
	diffusion: new Diffusion()
};
