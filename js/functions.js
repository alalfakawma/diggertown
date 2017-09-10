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

// Generate UID
function genuid() {
  uid++;
  return uid;
}

// Heuristic for A*
function heuristic(a, b) {
  var dist = Math.sqrt( Math.pow((a.x-b.x), 2) + Math.pow((a.y-b.y), 2) );
  return dist;
}

// collision checker
function collides(a, b) {
  if ((a.x + a.w) > b.x && a.x < (b.x + b.w) && (a.y + a.h) > b.y && a.y < (b.y + b.h)) {
    return true;
  } else {
    return false;
  }
}

// Random min max - Thanks stackoverflow.com
function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

// Random decimal numbers
function randomDec(min, max) {
	return (Math.random() * (max - min) + min).toFixed(4);
}

// Run to goto new randomly generated level
function nextLevel() {
  player.x = randomIntFromInterval(20, 180);
  player.y = 0;
  tiles = [];

  for (var i = 0; i < gameWorld.tileArr.length; i++) {
    tiles.push([]);
    var random = randomIntFromInterval(3, 5);
    for (var p = random; p < gameWorld.tileArr[i].length; p++) {
      tiles[i].push(new DrawSpriteObj(gameWorld.tileArr[i][p].x, gameWorld.tileArr[i][p].y, groundSpriteArr, 32, 32))
    }
  }
}