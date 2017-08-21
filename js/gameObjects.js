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
	w: null,
	h: null,
	inventory: [],
	health: 100,
	gravity: 0.6,
	jumpHeight: 2.4,
	speed: 3,
	digLength: 10,
	armor: 0,
	digTime: 200, // milliseconds
	maxInven: 26, // +1 for frontend, 26 for array
}

var mouse = {
	x: -1,
	y: -1,
};

var domMouse = {
	x: 0,
	y: 0,
}

// Bug object
var bug = {
	speed: 2,
	attack: [0.5, 3],
	health: 10,
	attackSpeed: 1000, // in ms
}

// Food items and behaviours
var oldCannedFood = {
	name: "Old Canned Food",
	armor: 0,
	health: 5,
	buff: null,
	info: '"Good ol\' canned food, must\'ve been there for a long time now."'
}

var oldAlcohol = {
	name: "Old Alcohol",
	armor: 0,
	health: 0,
	buff: [1.5, 2, 100], // Speed, armor, digTime * x
	info: '"Oooh, stumbled upon a gold mine here, perfect to quench your thirst and go on a mining escapade."'
}

var minersTreat = {
	name: "Miner's Feast",
	armor: 1,
	health: 50,
	buff: null,
	info: '"Must\'ve been dropped by miner\'s a long time ago, but with out of the world preservatives, I must say."'
}
