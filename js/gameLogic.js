console.log('ready mofo')

//logic for missile command game

var missileCommand = (function() {
	var canvas = document.querySelector( 'canvas'),
		context = canvas.getContext('2d');


	//game variables. Things that will change like score and ammount of cities/missiles left
	score = 0,
	level = 1, //level will start at level 1. Make more sense to be level as it will change.
	cities = [],
	defenceTowers = [],
	defenceAmmo = [],
	attackAmmo = [],
	timerID;

  //Game logic constants for different variables of the game
  CANVAS_W = canvas.width;
  CANVAS_H = canvas.height;
  MISSILE = {
  	active = 1,
  	exploding = 2,
  	imploding = 3,
  	exploded = 4
  };

  //starting logic to draw and create towers and cities
  var initialize = function() {

  	cities.push( new City(80, 430) );
  	cities.push( new City(130, 430) );
  	cities.push( new City(180, 430) );
  	cities.push( new City(300, 430) );
  	cities.push( new City(350, 430) );
  	cities.push( new City(400, 430) );

  	defenceTowers.push( new DefenceTowers(35, 410));
  	defenceTowers.push( new DefenceTowers(255, 410));
  	defenceTowers.push( new DefenceTowers(475, 410));

  	startGame()
  };

  var startGame = function() {
  	$.each ( defenceTowers, function(index, deftow){
  		deftow.missilesLeft = 10
  	});

  	attackAmmo = [];
  	defenceAmmo = [];

  	createAttackMissiles();
  	drawStartLevel();
  };





})