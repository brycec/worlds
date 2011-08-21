window.onload = function () {
	var socket = io.connect('http://localhost');
	
	socket.on('world', function(data) {
		world.generate(data);
	});
	
	world = {
		sprite: '',
		
		generate: function(data)
		{
			this.sprite = data.sprite;
			
			//start crafty
		    WIDTH = 400;
		    HEIGHT = 320;

		    Crafty.init(WIDTH, HEIGHT);
		    //Crafty.canvas.init();

		    
		    //turn the sprite map into usable components
		    Crafty.sprite(16, this.sprite, {
		        grass1: [0, 0],
		        grass2: [1, 0],
		        grass3: [2, 0],
		        grass4: [3, 0],
		        flower: [0, 1],
		        bush1: [0, 2],
		        bush2: [1, 2],
		        player: [0, 3],
		        treasure: [0, 4],
		        tanne1: [4, 0],
		        tanne2: [4, 1]
		    });

		    //the loading screen that will display while our assets load
		    Crafty.scene("loading", function () {
		        //load takes an array of assets and a callback when complete
		    	console.log(world.sprite)
		        Crafty.load([world.sprite], function () {
		            Crafty.scene("main"); //when everything is loaded, run the main scene
		        });

		        //black background with some loading text
		        Crafty.background("#fff");
		        Crafty.e("2D, DOM, Text").text("Loading...").css({
		            "text-align": "center",
		            "color": "#f00"
		        }).draw("20", "150", "200", "50");;
		    });
		    //automatically play the loading scene
		    Crafty.scene("loading");
		    

		    Crafty.scene("main", function () {
		    	Crafty.background("#333");
		    	Crafty.e("2D, DOM, flower, SpriteAnimation")
		    	.attr({x: 0, y: 0})
		    	.animate("wind", 0, 1, 3)
		    	.bind("EnterFrame", function()
		    	{
		    		if (!this.isPlaying())
		    			this.animate("wind", 80);
		    	});
		    });
		}
	};
    
};