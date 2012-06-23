if (typeof(module) != "undefined") {
	module.exports = Pool;
}

function Pool(name, imageSource, getValue) {
	
	this.name = name;
	
	this.getValue = getValue;
	
	this.imageSource = imageSource;
	
}
