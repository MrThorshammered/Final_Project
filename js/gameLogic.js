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
  	if(this.state === MISSILE.active){
  		context.strokeStyle = this.trailColor;
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo( this.startX, this.startY );
      context.lineTo( this.x, this.y );
      context.stroke();

      context.fillStyle = this.color;
      context.fillRect( this.x - 1, this.y - 1, this.width, this.height );
  	}else if(this.state === MISSILE.exploding || 
  					 this.state === MISSILE.imploding) {

  		context.fillStyle = 'white';
      context.beginPath();
      context.arc( this.x, this.y, this.explodeRadius, 0, 2 * Math.PI );
      context.closePath();

      explodeOtherMissiles( this, context );

      context.fill();
  	}
  };

  //Logic for the explosion radius and how to expand it out and then back in

  Missile.prototype.explode = function(){
  	if(this.state === MISSILE.exploding){
  		this.explodeRadius++;
  	}
  	if(this.explodeRadius > 30) {
  		this.state = MISSILE.imploding
  	}
  	if(this.state === MISSILE.imploding){
  		this.explodeRadius--;
  		if(this.groundExplosion){
  			(this.target[2] instanceof City) ? this.target[2].active = false :
  																				 this.target[2].missilesLeft = 0;
  		}
  	}
  	if(this.explodeRadius < 0 ){
  		this.state = MISSILE.exploded;
  	}
  };

  //Logic for creating the defenders missiles
  function playerMissile( source, endX, endY){
  	//cutting the board into thirds as there are three defenceTowers.
  	//this stops the risk of trying to fire a missile straight accross the board
  	//or all three firing at once
  	var deftow = defenceTowers[source];

  	Missile.call(this, {startX: deftow.x,  startY: deftow.y,
                          endX: endX,     endY: endY, 
                          color: 'green', trailColor: 'blue'});

  	var xDistance = this.endX - this.startX,
  			yDistance = this.endY - this.startY;

  	//player missile distance has been set now we must set angle and speed
  	var angleSpeed = (function(){
  		var distance = Math.sqrt( Math.pow(xDistance, 2)+
  									 					  Math.pow(yDistance, 2) ),

  	//central tower has widest distance to fire so its missiles get a speed boost
  				distancePerFrame = ( source === 1) ? 20 : 12

  				return distance / distancePerFrame;
  	}) ();

  	this.dx = xDistance / angleSpeed;
  	this.dy = yDistance / angleSpeed;
  	deftow.missilesLeft--;
  }

  //playerMissile needs to inherit characteristics from missile constructor
  playerMissile.prototype = Object.create( Missile.prototype );
  playerMissile.prototype.constructor = playerMissile;


  //physics logic to track the players missile and explode it
  playerMissile.prototype.update = function(){
  	if(this.state === MISSILE.active && this.y === this.endY ){
  		//the target can be considered to have been reached 
  		this.x = this.endX;
  		this.y = this.endY;
  		this.state = MISSILE.exploding;
  	}
  	if (this.state === MISSILE.active){
  		this.x += this.dx;
  		this.y += this.dy;
  	}else{
  		this.explode();
  	}
  };

  //now that logic for missile has been done we need to create a missile
  var playerShoot = function(x,y){
  	if(y >= 50 && y <= 370){
  		var source = whichDefTower(x);
  		if(source === -1){ //if source returns with minus one then the defTower is out of ammo
  			return;
  		}
  		defenceAmmo.push( new playerMissile( source, x, y));
  	}
  };

  //now we require the constructor logic for the enemies missile(how would they attack?)
  var AttackMissile(targets){
  	var startX = random(CANVAS_W, 0),
  			startY = 0, //because the attacking missiles will always start at the top of the page
  			//we then want to add a bit of variation in missiles so we'll add speed variation
  			changeSpeed = random(80, 120) / 100,
  			//since we're adding variation to speed we also want random targets instead of every 
  			//missile attacking one location
  			target = targets[ random(0, targets.length -1)],
  			disToTarget;

  			Missile.call( this, { startX: startX, startY: startY, endX: target[0], endY: target[1],
  														color: 'yellow', trailColor: 'red'});

  			disToTarget = (650 - 30 * level) / changeSpeed;
  				if(disToTarget < 20) {
  					disToTarget = 20;
  				}
  			this.dx = ( this.endX - this.startX) / disToTarget
  			this.dy = ( this.endY - this.startY) / disToTarget

  			this.target = target;

  			//we also don't want all missiles to fire at once as that would end the
  			//level / game very quickly 
  			this.delay = random(0, 50 + level*15);
  			this.groundExplosion = false;
  }

  AttackMissile.prototype = Object.create(Missile.prototype);
  AttackMissile.prototype.constructor = AttackMissile;

  //now to track the missile and update it's status depending on where it is
  AttackMissile.prototype.update = function(){
  	if(this.delay){//function to countdown the delay until the missile fires
  		this.delay--;
  		return;
  	}
  	if(this.state === MISSILE.active && this.y >= this.endY){//aka missile has hit something

  		this.x = this.endX;
  		this.y = this.endY;
  		this.state = MISSILE.exploding;
  		this.groundExplosion = true;
  	}
  	if(this.state === MISSILE.active){//aka missile fired but not hit anything
  		this.x += this.dx;
  		this.y += this.dy;
  	}else{
  		this.explode();//badda bing, badda boom!!
  	}
  };

  //we also want to blow up other enemy missiles with the blast radius from an 
  //exploding enemy missiles (chaining of explosions)
  var explodeOtherMissiles(Missile, context){
  	if( !missile.groundExplosion){
  		$.each( attackAmmo, function(index, otherMissile){
  			if(context.isPointInPath( otherMissile.x, otherMissile.y) 
  					&& otherMissile.state === MISSILE.active){
  				score += 25 * getMultiplier();
  				otherMissile.state = MISSILE.exploding;
  			}
  		});
  	}
  };

  //now we need logic for the attacking ai to target specific cities and defence towers
  var potentialTargets = function(){
  	var targets =[];

  	//need to add all the cities that are alive for selection
  	$.each(cities, function(index, city){
  		if(city.active) {
  			targets.push( [ ctiy.x +15, city.y -10, city] );
  		}
  	});
  	//randomly select 3 cities. Gives the ai a better chance to hit and destroy a city
  	while( targets.length > 3 ){
  		targets.splice( random(0, targets.length -1), 1);
  	}

  	//will also need to inculde the defence towers as targets to attack as well
  	$.each(defenceTowers, function(index, deftow){
  		targets.push([deftow.x, deftow.y, deftow]);
  	});

  	return targets;
  };

  //need to now animate each frame as it happens

  var animate = function() {
  	drawGameParts();
  	updateAttackMissiles();
  	drawAttackMissiles();
  	updatePlayerMissiles();
  	drawPlayerMissiles();
  	checkEndOfLevel();
  }

  //now to check to see if the round/game has ended
  var checkEndOfLevel = function(){
  	if(!attackAmmo.length){
  		finishLevel();
  		$('container').off('click');
  		var missilesLeft = totalMissilesLeft();
  		citiesSaved = totalCitiesSaved();

  		!citiesSaved ? endGame(missilesLeft):
  									 endLevel(missilesLeft, citiesSaved);
  	}
  };

  //logic for if the round has ended but game is still going 
  var endLevel = function(missilesLeft, citiesSaved) {
  	var missilesBonus = missilesLeft * 5 * getMultiplier(),
  			citiesBonus = citiesSaved * 50 * getMultiplier();

  			endOfLevelMessage( missilesLeft, missilesBonus, 
                  citiesSaved, citiesBonus );

  	//show the initial end of level score then update with knew bonus score
  	setTimout( function(){
  		score += missilesBonus += citiesBonus
  	})
  }









})