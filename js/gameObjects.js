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
	digTime: 200, // milliseconds
}

var mouse = {
	x: -1,
	y: -1,
};

var domMouse = {
	x: 0,
	y: 0,
}