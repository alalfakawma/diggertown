// Create canvas
var canvas = document.createElement("canvas");
var c = canvas.getContext("2d");
canvas.setAttribute("width", 960);
canvas.setAttribute("height", 544);
document.body.appendChild(canvas);
// ----------------------------------- GAME CODE --------------------------------------------
// Init global vars
var onTile, frames = 0, player;

// Init game objects
var gameWorld = {
	tile: 32,
	tileArr: [],
}

var player_obj = {
	x: null,
	y: null,
	health: 100,
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

	update();
}

function draw() {
	for (var i = 0; i < gameWorld.tileArr.length; i++) {
		for (var p = 0; p < gameWorld.tileArr[i].length; p++) {
			gameWorld.tileArr[i][p].draw();
			gameWorld.tileArr[i][p].getTile(mouse.x, mouse.y);
		}	
	}
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
	this.sprite = sprite;

	this.draw = function() {
		c.drawImage(sprite, this.w, this.h, 32, 32, this.x, this.y, gameWorld.tile, gameWorld.tile);
	}
}

// Fill tile function
function fillTile(tileX, tileY, sprite) {
	c.drawImage(sprite, tileX, tileY);
}

