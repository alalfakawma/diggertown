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
	this.attack = player_obj.attack;
	this.vspd = 0;
	this.hspd;
	this.gold = 0;
	this.diamond = 0;
	this.silver = 0;
	this.copper = 0;
	this.inventory = player_obj.inventory;
	this.itemID = 0;

	// Update object
	player_obj.w = this.w;
	player_obj.h = this.h;

	this.equip = function(id) {
		if (this.itemID != 0 && id < 9) {
			// Check if there is an item already equipped and unequip that item
			this.unequip(this.itemID);
		}

		if (id < 9) {
			// set the player's item if item is hand held
			this.itemID = id;
		} else if (id > 9) {
			// first check if any armor has been equipped then unequip it
			var getArmorObj = document.getElementsByClassName('equipItem')[1].getAttribute('data-obj');

			if (getArmorObj != null && getArmorObj != undefined && getArmorObj != '') {
				// there is an item that has been equipped before
				var obj = JSON.parse(getArmorObj);
				// unequip that item
				this.unequip(obj.id);
			}
		}

		// update the item UI to the respective sprite
		updateItemUI(id);

		// Update player stats acc to item
		for (var i = 0; i < gameItems.length; i++) {
			if (id == gameItems[i].id) {
				if (id < 9) {
					player_obj.digTime = gameItems[i].digTime;	
					break;
				} else if (id >= 9) {
					player_obj.armor += gameItems[i].armor;
					break;
				}
			}
		}
	}

	this.unequip = function(id) {
		// add the item back to the inventory
		for (var i = 0; i < gameItems.length; i++) {
			if (id == gameItems[i].id) {
				// Create an item obj and add it to the inventory
				var createItem = new Item(this.x, this.y, 24, 24, gameItems[i]);
				player_obj.inventory.push(createItem);
				addToInvo(createItem);
				if (id >= 9) {
					player_obj.armor -= gameItems[i].armor;
				}
				break;
			}
		}

		if (id < 9) {
			updateItemUI(0);	
			this.itemID = 0;
		} else if (id > 9) {
			updateItemUI(-1);
		}		
	}

	// Equip the default, copper pickaxe when player starts
	this.equip(1);

	this.draw = function(tiles) {
		player_obj.x = this.x;
		player_obj.y = this.y;
		this.health = player_obj.health;

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

		// Dig ground if equipping digging item
		if (this.itemID <= 4 && this.itemID != 0) {
			var diggable = [], removeTile;

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
												player_obj.health = this.health;
											} else if (tiles[o][p].resource == 'Silver') {
												this.silver += tiles[o][p].amount;
											} else if (tiles[o][p].resource == 'Gold') {
												this.gold += tiles[o][p].amount;
											} else if (tiles[o][p].resource == 'Diamond') {
												this.diamond += tiles[o][p].amount;
											} else if (tiles[o][p].resource == 'Copper') {
												this.copper += tiles[o][p].amount;
											}
											// remove block/tile/grid from array
											removeTile = tiles[o][p];
										}
									}
								}
							}
						}
					}	
				}
			dig_click = 0;

			// remove tile from array
			setTimeout(function () {
				for (var i = 0; i < tiles.length; i++) {
					for (var p = 0; p < tiles[i].length; p++) {
						if (tiles[i][p] == removeTile) {
							var food = tiles[i][p].foodCont;
							var enemy = tiles[i][p].enemyCont;
							var etype = tiles[i][p].enemyType;
							var x = tiles[i][p].x;
							var y = tiles[i][p].y;
							var w = tiles[i][p].w;
							var h = tiles[i][p].h;

							// remove the tile
							tiles[i].splice(p, 1);

							// check if tile contains food and spit it out after it is gone
							if (food) {
								// generate food item and push to food array
								bunchOfFood.push(new Food(x + (w / 2), y + h - 6, 12, 12, foodArray));
							}

							// check if tile contains an enemy after it has been mined
							if (enemy) {
								if (etype == 'bug') {
									var amt = randomIntFromInterval(1, 2); // spawn 1 or 2 bugs
									for (var l = 0; l < amt; l++) {
										enemyArr.push(new Bug(x + (w / 2), y + (h / 2), 12, 12, bug.speed, bug.sprite, bug.attack, bug.attackSpeed, bug.health));		
									}
								}
							}
						}
					}		 
				}
			}, player_obj.digTime);
			

			// Update resources
			document.querySelector('.resources.gold .amount').innerHTML = this.gold;
			document.querySelector('.resources.silver .amount').innerHTML = this.silver;
			document.querySelector('.resources.diamond .amount').innerHTML = this.diamond;
			document.querySelector('.resources.copper .amount').innerHTML = this.copper;
		}

		// Don't let player leave room
		if (this.x + this.w > canvas.width) {
			this.x = canvas.width - this.w;
		} else if (this.x < 0) {
			this.x = 0;
		}

		if (this.y > canvas.height) {
			player_obj.health--;
		}

		// Draw the sprite
		c.drawImage(sprite, 2, 0, 27, 32, this.x, this.y, this.w, this.h);
	}

	this.whichTile = function() {
		for (i = 0; i < gameWorld.tileArr.length; i++) {
			for (p = 0; p < gameWorld.tileArr[i].length; p++) {
				var tile = gameWorld.tileArr[i][p];

				if (this.x < (tile.x + tile.w) && (this.x + this.w) > (tile.x) && this.y < (tile.y + tile.h) && (this.y + this.h) > (tile.y)) {
					return tile;
				}
			}
		}
	}

	this.attacked = function() {
		// player is getting attacked / play animation or frame where the player is getting attacked
		c.fillStyle = "red";
		c.fillRect(this.x, this.y, this.w, this.h);
	}
}