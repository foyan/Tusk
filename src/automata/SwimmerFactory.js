var SwimmerFactory = {
	
	duckImage: new Image(),
	ballImage: new Image(),
	
	internalCreator: function(x, y) {
		var swimmer = new Swimmer();
		swimmer.location.x = x;
		swimmer.location.y = y;
		return swimmer;
	},
	
	types: {
		duck: {
			name: "Duck",
			creator: function(x, y) {
				var swimmer = SwimmerFactory.internalCreator(x, y);
				swimmer.image = SwimmerFactory.duckImage;
				return swimmer;
			}
		},
		ball: {
			name: "Ball",
			creator: function(x, y) {
				var swimmer = SwimmerFactory.internalCreator(x, y);
				swimmer.image = SwimmerFactory.ballImage;
				return swimmer;
			}
		}
	}
	
};

SwimmerFactory.duckImage.src = "_assets/pics/duck.png";
SwimmerFactory.ballImage.src = "_assets/pics/soccer_ball.png";
