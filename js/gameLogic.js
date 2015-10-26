console.log('ready mofo')

//logic for missile command game

var missileCommand = (function() {
	var canvas = document.querySelector( 'canvas'),
		context = canvas.getContext('2d');


	//game variables. Things that will change like score and ammount of cities/missiles left
	var score = 0,
			level = 1, //level will start at level 1. Make more sense to be level as it will change.
			cities = [],
			defenceTowers = [],
			defenceAmmo = [],
			attackAmmo = [],
			timerID;

  //Game logic constants for different variables of the game
  var CANVAS_W = canvas.width,
  		CANVAS_H = canvas.height,
  		MISSILE = {
  		active : 1,
  		exploding : 2,
  		imploding : 3,
  		exploded : 4
  };

  //contructor for the cities
  function City(x, y) {
  	this.x = x;
  	this.y = y;
  	this.active = true;
  }

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

  //this creates the amount of missiles that will attack depending on the level
  //and increase the difficulty (number of missiles) depending on the level
  createAttackMissiles = function() {
  	var defenceTargets = potentialTargets(),
  		missileNum = ((level + 7) < 30 ) ? level + 7 : 30;

  	for (var i = 0; i < missileNum; i++) {
  		attackAmmo.push( new AttackMissile(targets) );
  	}
  };

  //get a random number of where to attack for AI
  var random = function(min, max){
  	return Math.floor( Math.random() * (max - min +1 )) + min;
  };


  var drawStartLevel = function(){
  	drawGameParts();
  	drawLevelMessage();
  };

  var drawGameParts = function(){
  	drawBackGround();
  	drawCities();
  	drawDefenceTowers();
  	userScore();
  };

  //show the current score of the user defending 
  var userScore = function(){
  	context.fillStyle = 'red'
  	context.font = 'bold 20px Helvetica'
  	context.fillText('Score ' + score, 80,15);
  };

  //This is the message that appears before the
  //start of every level to give the user a chance to get ready

  var drawLevelMessage = function(){
  	context.fillStyle = 'blue';
    context.font = 'bold 20px Helvetica';
    context.fillText( 'CLICK TO START LEVEL', 130, 180 );
    context.fillStyle = 'red';
    context.fillText( ' ' + level, 370, 180 );

    context.fillText( '' + getMultiplier(), 195, 245 );
    context.fillStyle = 'blue';
    context.fillText( 'X  POINTS', 215, 245 );

    context.fillText( 'DEFEND', 100, 355 );
    context.fillText( 'CITIES', 330, 355 );
  };

  //This is the message at the end of every level to show the user how they've done
  var endOfLevelMessage = function( missilesLeft, missilesBonus, citiesSaved,	citiesBonus){
  	drawGameParts();

  	context.fillStyle = 'blue';
    context.font = 'bold 20px arial';
    context.fillText( 'BONUS POINTS', 150, 149 );
    context.fillStyle = 'red';
    context.fillText( '' + missilesBonus, 170, 213 );
    context.fillStyle = 'blue';
    context.fillText( 'Missiles Left: ' + missilesLeft, 230, 213 );
    context.fillStyle = 'red';
    context.fillText( '' + citiesBonus, 170, 277 );
    context.fillStyle = 'blue';
    context.fillText( 'Cities Saved: ' + citiesSaved, 230, 277 );
  };

  //this is for when the game is over. ie all cities are destroyed
  var drawEndGame = function() {
    context.fillStyle = 'red';
    context.fillRect( 0, 0, CANVAS_W, CANVAS_H );

    // Yellow hexagon
    context.fillStyle = 'yellow';
    context.beginPath();
    context.moveTo( 255, 30  );
    context.lineTo( 396, 89  );
    context.lineTo( 455, 230 );
    context.lineTo( 396, 371 );
    context.lineTo( 255, 430 );
    context.lineTo( 114, 371 );
    context.lineTo( 55,  230 );
    context.lineTo( 114, 89  );
    context.closePath();
    context.fill();

    context.fillStyle = 'red';
    context.font = 'bold 85px Helvetica';
    context.fillText( 'THE END', 70, 260 );

    context.fillStyle = 'yellow';
    context.font = 'bold 26px Helvetica';
    context.fillText( 'Final Score: ' + score, 80, 20 );
    context.fillText( 'CLICK TO PLAY NEW GAME', 80, 458 );
  };

  //draw the cities onto the canvas
  var drawCities = function () {
  	$.each( cities, function(index, city) {
  		if (city.active) {
  			city.draw();
  		}
  	});
  };

  //draw the deffence towers onto the canvas and all the missiles within them
  var drawDefenceTowers = function() {
  	$.each(defenceTowers, function(index, deftow){
  		deftow.draw();
  	});
  }

  //get the multiplier of the level up to a maximum of six(score * amount of cities left)
  var getMultiplier = function(){
  	return(level > 10) ? 6 : Math.floor( (level + 1) / 2 );
  };

  var drawBackGround = function() {
  	 // Black background which is good for visuals
    context.fillStyle = 'black';
    context.fillRect( 0, 0, CANVAS_W, CANVAS_H );

    // Yellow area at bottom of the screen for cities and
    // anti missile batteries which will stand out nicely against the black
    context.fillStyle = 'yellow';
    context.beginPath();
    context.moveTo( 0, 460 );
    context.lineTo( 0,  430 );
    context.lineTo( 25, 410 );
    context.lineTo( 45, 410 );
    context.lineTo( 70, 430 );
    context.lineTo( 220, 430 );
    context.lineTo( 245, 410 );
    context.lineTo( 265, 410 );
    context.lineTo( 290, 430 );
    context.lineTo( 440, 430 );
    context.lineTo( 465, 410 );
    context.lineTo( 485, 410 );
    context.lineTo( 510, 430 );
    context.lineTo( 510, 460 );
    context.closePath();
    context.fill();
  };
  

  //drawing a city depending on its position
  City.prototype.draw = function() {
  	var x = this.x,
  			y = this.y;

  		context.fillStyle = 'cyan';
    	context.beginPath();
    	context.moveTo( x, y );
    	context.lineTo( x, y - 10 );
    	context.lineTo( x + 10, y - 10 );
    	context.lineTo( x + 15, y - 15 );
    	context.lineTo( x + 20, y - 10 );
    	context.lineTo( x + 30, y - 10 );
    	context.lineTo( x + 30, y );
    	context.closePath();
    	context.fill();
  };

  function DefenceTower(x, y){
  	this.x = x;
  	this.y = y;
  	this.missilesLeft = 10;
  };

  DefenceTower.prototype.hasMissile = function() {
  	return !! this.missilesLeft;
  };

  //visually showing how many missiles are left within the defence towers
  DefenceTower.prototype.draw = function(){
  	var x, y;
    var delta = [ [0, 0], [-6, 6], [6, 6], [-12, 12], [0, 12],
                  [12, 12], [-18, 18], [-6, 18], [6, 18], [18, 18] ];

    for( var i = 0, len = this.missilesLeft; i < len; i++ ) {
      x = this.x + delta[i][0];
      y = this.y + delta[i][1];

      // Draw a missile while it's in the defence tower
      context.strokeStyle = 'blue';
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo( x, y );
      context.lineTo( x, y + 8 );
      context.moveTo( x - 2, y + 10 );
      context.lineTo( x - 2, y + 6 );
      context.moveTo( x + 2, y + 10 );
      context.lineTo( x + 2, y + 6 );
      context.stroke();
    }
  };

  //what the missile will look like and the trail it leaves behind it

  function Missile( options ){
  	this.startX = options.startX;
  	this.startY = options.startY;
  	this.endX = opitons.endX;
  	this.endY = options.endY;
  	this.color = options.color;
  	this.trailColor = options.trailColor;
  	this.x = options.startX;
  	this.y = options.startY;
  	this.state = MISSILE.active;
  	this.width = 2;
  	this.height = 2;
  	this.explodeRadius = 0;
  };

  //function to draw the missile animation between X && Y || Missile explosion
  Missile.prototype.draw = function (){
  	if(this.state === Missile.active){
  		context.strokeStyle = this.trailColor;
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo( this.startX, this.startY );
      context.lineTo( this.x, this.y );
      context.stroke();

      context.fillStyle = this.color;
      context.fillRect( this.x - 1, this.y - 1, this.width, this.height );
  	}else if(this.state === Missile.exploding || 
  					 this.state === Missile.imploding) {

  		context.fillStyle = 'white';
      context.beginPath();
      context.arc( this.x, this.y, this.explodeRadius, 0, 2 * Math.PI );
      context.closePath();

      explodeOtherMissiles( this, context );

      context.fill();
  	};
  }









})