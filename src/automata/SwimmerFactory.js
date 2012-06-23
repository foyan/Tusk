var SwimmerFactory = {
	
	duckImage: new Image(),
	ballImage: new Image(),
	boatImage: new Image(),
	
	internalCreator: function(x, y, type) {
		var swimmer = new type();
		swimmer.location.x = x;
		swimmer.location.y = y;
		return swimmer;
	},
	
	types: {
		duck: {
			name: "Duck",
			creator: function(x, y) {
				var swimmer = SwimmerFactory.internalCreator(x, y, Swimmer);
				swimmer.image = SwimmerFactory.duckImage;
				return swimmer;
			}
		},
		ball: {
			name: "Ball",
			creator: function(x, y) {
				var swimmer = SwimmerFactory.internalCreator(x, y, Swimmer);
				swimmer.image = SwimmerFactory.ballImage;
				return swimmer;
			}
		},
		boat: {
			name: "Boat",
			creator: function(x, y) {
				var swimmer = SwimmerFactory.internalCreator(x, y, AutoSwimmer);
				swimmer.image = SwimmerFactory.boatImage;
				return swimmer;
			}
		}
	}
	
};

SwimmerFactory.duckImage.src = "_assets/pics/duck.png";
SwimmerFactory.ballImage.src = "_assets/pics/soccer_ball.png";
SwimmerFactory.boatImage.src = "_assets/pics/boat.png";
