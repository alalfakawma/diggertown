// Create canvas
var canvas = document.createElement("canvas");
var c = canvas.getContext("2d");
canvas.setAttribute("width", 960);
canvas.setAttribute("height", 544);
document.body.appendChild(canvas);
// ----------------------------------- GAME CODE --------------------------------------------
// Init global vars
var onTile, frames = 0, player, tiles = [], gridShow = false, move = 0, canJump = 0, jump_key = 0, canDig = 0, dig_click = 0;

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

// Random min max - Thanks stackoverflow.com
function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}