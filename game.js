// Create canvas
var canvas = document.createElement("canvas");
var c = canvas.getContext("2d");
canvas.setAttribute("width", 960);
canvas.setAttribute("height", 544);
document.body.appendChild(canvas);
// ----------------------------------- GAME CODE --------------------------------------------
// Init global vars
var onTile, frames = 0, player, tiles = [], gridShow = false, move = 0, canJump = 0, jump_key = 0, canDig = 0, dig_click = 0;

// Init game objects
var gameWorld = {
	tile: 32,
	tileArr: [],
	gameWidth: 960,
	gameHeight: 544,
}

var player_obj = {
	x: null,
	y: null,
	health: 100,
	gravity: 0.6,
	jumpHeight: 2.4,
	speed: 3,
	digLength: 10,
	armor: 0,
}

var mouse = {
	x: -1,
	y: -1,
};

var domMouse = {
	x: 0,
	y: 0,
}

// Update mouse position on canvas
document.addEventListener('mousemove', function(e) {
	mouse = getMousePos(canvas, e);
	domMouse.x = e.clientX;
	domMouse.y = e.clientY;
});

// Listen to keyboard
document.addEventListener('keydown', function(e) {
	switch(e.keyCode) {
		case 65: // Left
			move = -1;
		break;
		case 68: // Right
			move = 1;
		break;
		case 71: // G for grids
			if (gridShow == false) {
				gridShow = true;
			} else {
				gridShow = false;
			}
		break;
		case 32: // Space for jump
			if (canJump == 1) {
				jump_key = 1;	
			}
		break;
	}
});

document.addEventListener('mousedown', function(e) {
	if (e.buttons == 1) {
		// left click
		if (canDig == 1) {
			dig_click = 1;
		}
	}
});

document.addEventListener('keyup', function(e) {
	switch(e.keyCode) {
		case 65: // Left
			move = 0;
		break;
		case 68: // Right
			move = 0;
		break;
	}
});

// Push tiles to array for manipulation / also this equates to the worlds size
for (var i = 0; i < (gameWorld.gameWidth / gameWorld.tile); i++) {
	gameWorld.tileArr.push([]);
	for (var p = 0; p < (gameWorld.gameHeight / gameWorld.tile); p++) {
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
	var s_player_standing = loadSprite("sprites/player_standing.png");

	// sprite randomizer
	var groundSpriteArr = [s_soil, s_gold, s_diamond, s_silver, s_bombs];

	// Load objects
	for (var i = 0; i < gameWorld.tileArr.length; i++) {
		tiles.push([]);
		var random = randomIntFromInterval(3, 5);
		for (var p = random; p < gameWorld.tileArr[i].length; p++) {
			tiles[i].push(new DrawSpriteObj(gameWorld.tileArr[i][p].x, gameWorld.tileArr[i][p].y, groundSpriteArr, 32, 32))
		}
	}

	player = new Player(canvas.width / 2 - 16, 0, 20, 26, s_player_standing);

	update();
}

function draw() {
	// canvas bg
	c.fillStyle = "#fff";
	c.fillRect(0, 0, canvas.width, canvas.height);

	// draw object tiles and instances
	for (var i = 0; i < tiles.length; i++) {
		for (var p = 0; p < tiles[i].length; p++) {
			tiles[i][p].draw();
		}	
	}

	player.draw(tiles);

	// Hide tile info
	document.querySelector('.showInfo').style.display = "none";

	// draw room tiles
	for (var i = 0; i < gameWorld.tileArr.length; i++) {
		for (var p = 0; p < gameWorld.tileArr[i].length; p++) {
			gameWorld.tileArr[i][p].draw();
			gameWorld.tileArr[i][p].highlight(mouse.x, mouse.y);
		}	
	}

	if (player.health <= 0) {
		window.location.reload();
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

// ------------------- OUTSIDE GAME FUNCTIONS AND GAME OBJECTS -------------------------

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
		if (gridShow == true) {
			c.strokeStyle = this.color;
			c.strokeRect(this.x, this.y, this.w, this.h);	
		}	
	}

	// Get specific tile
	this.getTile = function(x, y) {
		if (x > (this.x + 1) && x < (this.x + this.w) && y > (this.y + 1) && y < (this.y + this.h)) {
			onTile = this;
		}
	}

	this.highlight = function(x, y) {
		if ((x + 1) > this.x && x < (this.x + this.w) && y > (this.y + 1) && y < (this.y + this.h)) {
			c.strokeStyle = "black";
			c.strokeRect(this.x, this.y, this.w, this.h);
			c.strokeRect(this.x, this.y, this.w, this.h);

			// SHOW TILE INFO
			for (var i = 0; i < tiles.length; i++) {
				for (var p = 0; p < tiles[i].length; p++) {
					if (tiles[i][p].x == this.x && tiles[i][p].y == this.y) {
						tiles[i][p].showInfo();
					}
				}
			}
		}
	}
}

// Player constructor
function Player(x, y, w, h, sprite) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.jumpHeight = player_obj.jumpHeight;
	this.gravity = player_obj.gravity;
	this.air = true;
	this.sprite = sprite;
	this.color = "#000";
	this.vspd = 0;
	this.hspd;
	this.health = player_obj.health;
	this.gold = 0;
	this.diamond = 0;
	this.silver = 0;

	this.draw = function(tiles) {
		player_obj.x = this.x;
		player_obj.y = this.y;

		// Control health bar
		document.getElementsByClassName('bar')[0].style.width = this.health + 'px';

		// Gravity
		this.vspd += this.gravity;

		// Jump
		if (jump_key == 1) {
			this.vspd -= this.jumpHeight;
			canDig = 0;
			setTimeout(function() {
				jump_key = 0;
				canJump = 0;
			}, 50);
		}

		// Vertical collision
		for (var i = 0; i < tiles.length; i++) {
			for (var p = 0; p < tiles[i].length; p++) {
				if (this.x < (tiles[i][p].x + tiles[i][p].w) && (this.x + this.w) > tiles[i][p].x && this.y < (tiles[i][p].y + tiles[i][p].h) && (this.y + this.h + this.vspd) > tiles[i][p].y) {
					if (this.h + this.y < tiles[i][p].y) {
						this.y += (tiles[i][p].y - (this.h + this.y));
					}
					this.vspd = 0;
					canJump = 1;
					canDig = 1;
				} else if (this.x < (tiles[i][p].x + tiles[i][p].w) && (this.x + this.w) > tiles[i][p].x && (this.y + this.vspd) < (tiles[i][p].y + tiles[i][p].h) && (this.y + this.h) > tiles[i][p].y) {
					if (this.y < tiles[i][p].y + tiles[i][p].h) {
						this.y -= (this.y - (tiles[i][p].y + tiles[i][p].h));
					}
					this.vspd = 0;
				}
			}			
		}

		// Gravity effect
		this.y += this.vspd;

		// Move player
		this.hspd = player_obj.speed * move;
		if (move != 0) {
			// Horizontal collision
			for (var i = 0; i < tiles.length; i++) {
				for (var p = 0; p < tiles[i].length; p++) {
					if ((this.x) < (tiles[i][p].x + tiles[i][p].w) && (this.x + this.hspd + this.w) > tiles[i][p].x && this.y < (tiles[i][p].y + tiles[i][p].h) && (this.y + this.h) > tiles[i][p].y) {
						// right side
						if (this.x + this.w < tiles[i][p].x) {
							this.x += (tiles[i][p].x - (this.w + this.x));
						}
						this.hspd = 0;
					} else if ((this.x + this.hspd) < (tiles[i][p].x + tiles[i][p].w) && (this.x + this.w) > tiles[i][p].x && this.y < (tiles[i][p].y + tiles[i][p].h) && (this.y + this.h) > tiles[i][p].y) {
						// left side
						if (this.x > tiles[i][p].x + tiles[i][p].w) {
							this.x -= (this.x - (tiles[i][p].x + tiles[i][p].w));
						}
						this.hspd = 0;
					}
				}			
			}
			this.x += this.hspd;	
		}

		// Dig ground
		var diggable = [];

		for (var i = 0; i < tiles.length; i++) {
			for (var p = 0; p < tiles[i].length; p++) {
				if ((this.x - player_obj.digLength) < (tiles[i][p].x + tiles[i][p].w) && (this.x + this.w + player_obj.digLength) > tiles[i][p].x && (this.y - player_obj.digLength) < (tiles[i][p].y + tiles[i][p].h) && (this.y + player_obj.digLength + this.h) > tiles[i][p].y) {
					diggable.push(tiles[i][p]);
				}
			}		
		}
			// Dig the diggable land
			if (diggable.length > 0) {
				for (var i = 0; i < diggable.length; i++) {
					if (dig_click == 1) {
						if (mouse.x > (diggable[i].x) && mouse.x < (diggable[i].x + diggable[i].w) && mouse.y > (diggable[i].y) && mouse.y < (diggable[i].y + diggable[i].h)) {
							for (var o = 0; o < tiles.length; o++) {
								for (var p = 0; p < tiles[o].length; p++) {
									if (diggable[i] == tiles[o][p]) {
										// check grid contents
										if (tiles[o][p].resource == 'Bombs') {
											this.health -= 10 - player_obj.armor;
										} else if (tiles[o][p].resource == 'Silver') {
											this.silver += tiles[o][p].amount;
										} else if (tiles[o][p].resource == 'Gold') {
											this.gold += tiles[o][p].amount;
										} else if (tiles[o][p].resource == 'Diamond') {
											this.diamond += tiles[o][p].amount;
										}
										// remove block/tile/grid from array
										tiles[o].splice(p, 1);
									}
								}
							}
						}
					}
				}	
			}
		dig_click = 0;

		// Update resources
		document.querySelector('.resources.gold .amount').innerHTML = this.gold;
		document.querySelector('.resources.silver .amount').innerHTML = this.silver;
		document.querySelector('.resources.diamond .amount').innerHTML = this.diamond;

		// Draw the sprite
		c.drawImage(sprite, 2, 0, 27, 32, this.x, this.y, this.w, this.h);
	}
}

// Draw sprite object on screen / could be sprite Tiles, etc.
function DrawSpriteObj(x, y, spriteArray, spriteW, spriteH) {
	this.x = x;
	this.y = y;
	this.w = spriteW;
	this.h = spriteH;
	this.sprite;
	this.resource;
	this.amount;
	this.randomValue = Math.floor(Math.random() * 150);

	// Generate sprite according to the randomValue and spriteArray
	if (this.randomValue == 67 || this.randomValue == 87 || this.randomValue == 143) {
		this.sprite = spriteArray[1]; // gold
	} else if (this.randomValue == 89 || this.randomValue == 92 || this.randomValue == 127 || this.randomValue == 145) {
		this.sprite = spriteArray[3]; // silver
	} else if (this.randomValue == 24 || this.randomValue == 99 || this.randomValue == 12 || this.randomValue == 123 || this.randomValue == 122 || this.randomValue == 111) {
		this.sprite = spriteArray[4]; // bomb
	} else if (this.randomValue == 10 || this.randomValue == 20) {
		this.sprite = spriteArray[2] // diamond
	} else {
		this.sprite = spriteArray[0]; // soil
	}

	// update resource acc to sprite
	if (this.sprite.src.includes('gold')) {
		this.resource = 'Gold';
		this.amount = Math.ceil(Math.random() * 4);
	} else if (this.sprite.src.includes('silver')) {
		this.resource = 'Silver';
		this.amount = Math.ceil(Math.random() * 8);
	} else if (this.sprite.src.includes('diamond')) {
		this.resource = 'Diamond';
		this.amount = Math.ceil(Math.random() * 2);
	} else if (this.sprite.src.includes('bombs')) {
		this.resource = 'Bombs';
	} else {
		this.resource = '';
	}

	this.draw = function() {
		c.drawImage(this.sprite, this.x, this.y);
	}

	this.hit = function() { // DEBUG
		c.fillStyle = "blue";
		c.fillRect(this.x, this.y, this.w, this.h);
	}

	this.showInfo = function() {
		if (this.resource.length) {
			document.getElementsByClassName('showInfo')[0].style.display = "block";
			document.getElementsByClassName('showInfo')[0].innerHTML = this.resource;
			document.getElementsByClassName('showInfo')[0].style.left = domMouse.x + 10 + 'px';
			document.getElementsByClassName('showInfo')[0].style.top = domMouse.y + 10 + 'px';
		} else {
			document.getElementsByClassName('showInfo')[0].style.display = "none";
		}
	}
}

// Random min max - Thanks stackoverflow.com
function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}