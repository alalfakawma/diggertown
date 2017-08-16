// Create canvas
var canvas = document.createElement("canvas");
var c = canvas.getContext("2d");
canvas.setAttribute("width", 960);
canvas.setAttribute("height", 544);
document.body.appendChild(canvas);
// ----------------------------------- GAME CODE --------------------------------------------
// Init global vars
var onTile, frames = 0, player, tiles = [];

// Init game objects
var gameWorld = {
	tile: 32,
	tileArr: [],
}

var player_obj = {
	x: null,
	y: null,
	health: 100,
	gravity: 0.8,
	jumpVel: 3,
}

var mouse = {
	x: null,
	y: null,
};

// Update mouse position on canvas
document.addEventListener('mousemove', function(e) {
	mouse = getMousePos(canvas, e);;
});

// Push tiles to array for manipulation
for (var i = 0; i < (960 / gameWorld.tile); i++) {
	gameWorld.tileArr.push([]);
	for (var p = 0; p < (540 / gameWorld.tile); p++) {
		gameWorld.tileArr[i].push(new CreateTile(i * gameWorld.tile, p * gameWorld.tile, gameWorld.tile, gameWorld.tile, '#dfdfdf'));
	}
}

// ------------------- GAME FUNCTIONS ---------------------

function init() {	
	// Load sprites
	var s_soil = loadSprite("sprites/soil.png");
	var s_gold = loadSprite("sprites/gold.png");
	var s_diamond = loadSprite("sprites/diamond.png");
	var s_silver = loadSprite("sprites/silver.png");
	var s_bombs = loadSprite("sprites/bombs.png");

	var nonPsprites = [s_soil, s_gold, s_diamond, s_soil, s_soil, s_soil, s_soil, s_soil, s_soil, s_soil, s_soil];

	// Load objects
	for (var i = 0; i < gameWorld.tileArr.length; i++) {
		tiles.push([]);
		var random = randomIntFromInterval(3, 7);
		for (var p = random; p < gameWorld.tileArr[i].length; p++) {
			tiles[i].push(new DrawSpriteObj(gameWorld.tileArr[i][p].x, gameWorld.tileArr[i][p].y, nonPsprites[Math.floor(Math.random() * nonPsprites.length)]))
		}
	}

	player = new Player(0, 0, 32, 32);

	update();
}

function draw() {
	// draw room tiles
	for (var i = 0; i < gameWorld.tileArr.length; i++) {
		for (var p = 0; p < gameWorld.tileArr[i].length; p++) {
			gameWorld.tileArr[i][p].draw();
		}	
	}

	// draw object tiles and instances
	for (var i = 0; i < tiles.length; i++) {
		for (var p = 0; p < tiles[i].length; p++) {
			tiles[i][p].draw();
		}	
	}

	player.draw();

}

function update() {
	// Increment frames for animation
	frames++;

	c.clearRect(0, 0, canvas.width, canvas.height);
	draw();
	window.requestAnimationFrame(update);
}

// Start game
init();

// ------------------- OUTSIDE GAME FUNCTIONS -------------------------

// Mouse pos within canvas
function getMousePos(canvas, e) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
}

// Load sprite function
function loadSprite(src) {
	var spr = new Image();
	spr.src = src;

	return spr;
}

// Create tile obj function
function CreateTile(x, y, w, h, color) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.color = color;

	this.draw = function() {
		c.strokeStyle = this.color;
		c.strokeRect(this.x, this.y, this.w, this.h);	
	}

	// Get specific tile
	this.getTile = function(x, y) {
		if (x > this.x && x < (this.x + this.w) && y > this.y && y < (this.y + this.h)) {
			onTile = this;
		}
	}
}

// Player constructor
function Player(x, y, w, h, sprite) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.jumpVel = player_obj.jumpVel;
	this.gravity = player_obj.gravity;
	this.sprite = sprite;

	this.draw = function() {
		player_obj.x = this.x;
		player_obj.y = this.y;

		c.fillRect(this.x, this.y, this.w, this.h);
		//c.drawImage(sprite, this.w, this.h, 32, 32, this.x, this.y, gameWorld.tile, gameWorld.tile);


		this.y += this.gravity;
	}
}

// Randomize tile addition
function DrawSpriteObj(x, y, sprite, spriteW, spriteH) {
	this.x = x;
	this.y = y;
	this.w = spriteW;
	this.h = spriteH;
	this.sprite = sprite;

	this.draw = function() {
		c.drawImage(sprite, this.x, this.y);
	}
}

// Random min max - Thanks stackoverflow.com
function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}