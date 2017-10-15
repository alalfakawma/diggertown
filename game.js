// Create canvas
var canvas = document.createElement("canvas");
var c = canvas.getContext("2d");
canvas.setAttribute("width", 960);
canvas.setAttribute("height", 544);
document.body.appendChild(canvas);

var canvasPos = canvas.getBoundingClientRect();
// ----------------------------------- GAME CODE --------------------------------------------
// Init global vars
var gridHi = 'white', onTile, frames = 0, player, tiles = [], gridShow = false, move = 0, canJump = 0, jump_key = 0, canDig = 0, dig_click = 0, bug, bunchOfFood = [],
	keyCode, inventory_open = false, itemArray = [], foodArray, enemyArr = [], uid = 0, mouseButton, craft_open = false, groundSpriteArr = [];

// Update mouse position on canvas
document.addEventListener('mousemove', function(e) {
	mouse = getMousePos(canvas, e);
	domMouse.x = e.clientX;
	domMouse.y = e.clientY;
});

// Listen to keyboard
document.addEventListener('keydown', function(e) {
	keyCode = e.keyCode;
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
		case 81: // inventory I
			if (inventory_open == true) {
				inventory_open = false;
			} else {
				inventory_open = true;
			}

			// Close crafting menu if open
			if (craft_open == true) {
				craft_open = false;
			}
		break;
		case 67: // inventory I
			if (craft_open == true) {
				craft_open = false;
			} else {
				craft_open = true;
			}

			// Close inventory if open
			if (inventory_open == true) {
				inventory_open = false;
			}
		break;
	}
});

document.addEventListener('mousedown', function(e) {
	mouseButton = e.buttons;
	if (e.buttons == 1) {
		// left click
		if (canDig == 1) {
			dig_click = 1;
		}
	} else {
		e.preventDefault();
	}
});


// Stop right click
document.addEventListener('contextmenu', function(evt) { 
  evt.preventDefault();
}, false);

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
		gameWorld.tileArr[i].push(new CreateTile(i * gameWorld.tile, p * gameWorld.tile, gameWorld.tile, gameWorld.tile, '#dfdfdf', i, p));
	}
}

// Add neighbors to tiles
for (var i = 0; i < gameWorld.tileArr.length; i++) {
	for (var p = 0; p < gameWorld.tileArr[i].length; p++) {
		gameWorld.tileArr[i][p].addNeighbors(gameWorld.tileArr);
	}
}

// ------------------- GAME FUNCTIONS ---------------------
function init() {	
	// Load sprites ------------------------------------
	// Sprite tiles ------------------------------------
	var s_soil = loadSprite("sprites/soil.png");
	var s_gold = loadSprite("sprites/gold.png");
	var s_diamond = loadSprite("sprites/diamond.png");
	var s_copper = loadSprite("sprites/copper.png");
	var s_silver = loadSprite("sprites/silver.png");
	var s_bombs = loadSprite("sprites/bombs.png");

	// Player sprites ------------------------------------
	var s_light_sprite = loadSprite("sprites/light_sprite.png");
	var s_player_standing = loadSprite("sprites/player_standing.png");
	var s_player_standing_left = loadSprite("sprites/player_standing_left.png");
	var s_player_walking = loadSprite("sprites/player_walking-sheet.png");
	var s_player_walking_left = loadSprite("sprites/player_walking_left-sheet.png");
	var s_player_digging = loadSprite("sprites/player_digging-sheet.png");
	var s_player_digging_left = loadSprite("sprites/player_digging_left-sheet.png");
	var s_player_slash = loadSprite("sprites/player_slash-sheet.png");
	var s_player_slash_left = loadSprite("sprites/player_slash_left-sheet.png");
	var s_player = [s_player_standing, s_player_standing_left, s_player_walking, s_player_walking_left, s_player_digging, s_player_digging_left, s_player_slash, s_player_slash_left, s_light_sprite];

	// Food sprites ------------------------------------
	var s_oldalcohol = loadSprite("sprites/oldalcohol.png");
	oldAlcohol.sprite = s_oldalcohol;
	var s_oldcannedfood = loadSprite("sprites/oldcannedfood.png");
	oldCannedFood.sprite = s_oldcannedfood;
	var s_minerstreat = loadSprite("sprites/minerstreat.png");
	minersTreat.sprite = s_minerstreat;

	// Food array for food generator ------------------------------------
	foodArray = [oldAlcohol, minersTreat, oldCannedFood];

	// sprite randomizer ------------------------------------
	groundSpriteArr = [s_soil, s_gold, s_diamond, s_silver, s_bombs, s_copper];

	// Load objects ------------------------------------
	for (var i = 0; i < gameWorld.tileArr.length; i++) {
		tiles.push([]);
		var random = randomIntFromInterval(3, 5);
		for (var p = random; p < gameWorld.tileArr[i].length; p++) {
			tiles[i].push(new DrawSpriteObj(gameWorld.tileArr[i][p].x, gameWorld.tileArr[i][p].y, groundSpriteArr, 32, 32))
		}
	}

	// Load player
	player = new Player(randomIntFromInterval(50, 160), 0, 20, 26, s_player);

	update();
}

function draw() {
	// canvas bg ------------------------------------
	c.fillStyle = "#444";
	c.fillRect(0, 0, canvas.width, canvas.height);

	// draw object tiles and instances ------------------------------------
	for (var i = 0; i < tiles.length; i++) {
		for (var p = 0; p < tiles[i].length; p++) {
			tiles[i][p].draw();
			if (mouseButton == 1) {
				tiles[i][p].getTile(mouse.x, mouse.y);
			}
		}	
	}

	// Darken the room but not the player/food/enemies
	c.fillStyle = "rgba(0, 0, 0, 0.4)";
	c.fillRect(0, 0, canvas.width, canvas.height);

	player.draw(tiles);

	// reset mouse button
	mouseButton = 0;

	// Draw enemies --------------------
	for (var i = 0; i < enemyArr.length; i++) {
		enemyArr[i].draw();
	}

	// Draw items ------------------------------
	for (var i = 0; i < itemArray.length; i++) {
		itemArray[i].draw()
	}

	// Draw food ------------------------------------
	for(var i = 0; i < bunchOfFood.length; i++) {
		bunchOfFood[i].draw();
	}

	// Hide tile info ------------------------------------
	document.querySelector('.showInfo').style.display = "none";
	document.querySelector('.foodInfo').style.display = "none";

	// draw room tiles ------------------------------------
	for (var i = 0; i < gameWorld.tileArr.length; i++) {
		for (var p = 0; p < gameWorld.tileArr[i].length; p++) {
			gameWorld.tileArr[i][p].draw();
			gameWorld.tileArr[i][p].highlight(mouse.x, mouse.y);
		}	
	}

	// Inventory Open close ------------------------------------
	var inventory = document.getElementById('inventory');

	if (inventory_open == true) {
		inventory.style.display = "table";
	} else {
		inventory.style.display = "none";
		document.querySelector('#inventoryInfo').style.display = "none";
	}

	// Crafting open close -----------------------------
	if (craft_open == true) {
		document.querySelector('#crafting').style.display = "block";
	} else {
		document.querySelector('#crafting').style.display = "none";
		document.querySelector('.craftInfo').style.display = "none";
	}

	// Check items regularly
	checkItems();

	// Restart game if player is dead
	if (player.health <= 0) {
		window.location.reload();
		return;
	}

	// Reset keyCode
	keyCode = undefined;
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