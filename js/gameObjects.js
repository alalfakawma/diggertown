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
	attack: 0,
	health: 100,
	gravity: 0.6,
	jumpHeight: 2.4,
	speed: 3,
	digLength: 10,
	armor: 0,
	digTime: 200, // milliseconds
	maxInven: 26, // +1 for frontend, 26 for array since 0 base
	maxHealth: 150,
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

// Game items / Game Tools
var gameItems = [
	{
		"id" : 1,
		"type" : "eitem",
		"name" : "Copper Pickaxe",
		"dmg" : [1, 3],
		"digTime" : 200,
		"material" : "copper",
		"craftamt" : 50,
		"info" : "\"Simple little pickaxe made of copper\"",
		"sprite" : loadSprite('sprites/item-copper-pickaxe.png'),
	},
	{
		"id" : 2,
		"type" : "eitem",
		"name" : "Silver Pickaxe",
		"dmg" : [4, 6],
		"digTime" : 150,
		"material" : "silver",
		"craftamt" : 200,
		"info" : "\"This defo looks lot better than the default copper pickaxe\"",
		"sprite" : loadSprite('sprites/item-silver-pickaxe.png'),
	},
	{
		"id" : 3,
		"type" : "eitem",
		"name" : "Gold Pickaxe",
		"dmg" : [8, 10],
		"digTime" : 100,
		"material" : "gold",
		"craftamt" : 490,
		"info" : "\"A gold pickaxe, now beat that!\"",
		"sprite" : loadSprite('sprites/item-gold-pickaxe.png'),
	},
	{
		"id" : 4,
		"type" : "eitem",
		"name" : "Diamond Pickaxe",
		"dmg" : [12, 16],
		"digTime" : 20,
		"material" : "diamond",
		"craftamt" : 750,
		"info" : "\"Wow! This is some crazy piece of worksmanship, i'm gonna be mining like Flash now!!!\"",
		"sprite" : loadSprite('sprites/item-diamond-pickaxe.png'),
	},
]
