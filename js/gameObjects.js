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
	speed: [1.5, 2.4],
	attack: [0.5, 3],
	health: 30,
	attackSpeed: 1000, // in ms
	sprite: loadSprite("sprites/enemy-bug.png"),
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
	{
		"id" : 5,
		"type" : "eitem",
		"name" : "Copper Sword",
		"dmg" : [5, 7],
		"digTime" : null,
		"material" : "copper",
		"craftamt" : 200,
		"info" : "\"This looks like an ordinary sword which I could use to slay those pesky bugs..\"",
		"sprite" : loadSprite('sprites/item-copper-sword.png'),
	},
	{
		"id" : 6,
		"type" : "eitem",
		"name" : "Silver Sword",
		"dmg" : [10, 15],
		"digTime" : null,
		"material" : "silver",
		"craftamt" : 400,
		"info" : "\"A sword made of silver, what a marvellous piece of worksmanship\"",
		"sprite" : loadSprite('sprites/item-silver-sword.png'),
	},
	{
		"id" : 7,
		"type" : "eitem",
		"name" : "Gold Sword",
		"dmg" : [15, 25],
		"digTime" : null,
		"material" : "gold",
		"craftamt" : 650,
		"info" : "\"Looks like a golden sword, this is priceless, I can now kill even more bugs and those irritant pests\"",
		"sprite" : loadSprite('sprites/item-gold-sword.png'),
	},
	{
		"id" : 8,
		"type" : "eitem",
		"name" : "Diamond Sword",
		"dmg" : [35, 50],
		"digTime" : null,
		"material" : "diamond",
		"craftamt" : 1090,
		"info" : "\"Now I have seen all there is to be seen, a sword made of diamond, with cutting edge sharpness, i'm pretty much invincible now..\"",
		"sprite" : loadSprite('sprites/item-diamond-sword.png'),
	},
	{
		"id" : 9,
		"type" : "eitem",
		"name" : "Copper Armor",
		"armor" : 1,
		"material" : "copper",
		"craftamt" : 150,	
		"info" : "\"This looks like an old copper armor, but it should give me some protection\"",
		"sprite" : loadSprite('sprites/item-copper-armor.png'),
	},
	{
		"id" : 10,
		"type" : "eitem",
		"name" : "Gold Armor",
		"armor" : 5,
		"material" : "gold",
		"craftamt" : 270,	
		"info" : "\"Look at this gold plated armor, this looks like it has good potential\"",
		"sprite" : loadSprite('sprites/item-gold-armor.png'),
	},
	{
		"id" : 11,
		"type" : "eitem",
		"name" : "Diamond Armor",
		"armor" : 9,
		"material" : "diamond",
		"craftamt" : 200,	
		"info" : "\"Whoa! Is this really diamond? Looks real hard and durable\"",
		"sprite" : loadSprite('sprites/item-diamond-armor.png'),
	},
]
