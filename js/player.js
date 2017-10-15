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
	this.attack = player_obj.attack;
	this.vspd = 0;
	this.hspd;
	this.gold = 0;
	this.diamond = 0;
	this.silver = 0;
	this.copper = 0;
	this.inventory = player_obj.inventory;
	this.itemID = 0;
	this.dm = 1;
	this.frames = 0;
	this.digging = 0;
	this.rope = false;
	this.playerTopTile = [];

	// Update object
	player_obj.w = this.w;
	player_obj.h = this.h;

	this.equip = function(id) {
		if (this.itemID != 0 && id < 9) {
			// Check if there is an item already equipped and unequip that item
			var storedItem = this.itemID;

			if (player_obj.inventory.length <= player_obj.maxInven) {
				this.unequip(this.itemID);
			}
		}

		if (id < 9) {
			// set the player's item if item is hand held
			this.itemID = id;
		} else if (id > 8) {
			// first check if any armor has been equipped then unequip it
			var getArmorObj = document.getElementsByClassName('equipItem')[1].getAttribute('data-obj');

			if (getArmorObj != null && getArmorObj != undefined && getArmorObj != '') {
				// there is an item that has been equipped before
				var obj = JSON.parse(getArmorObj);

				// unequip that item
				if (player_obj.inventory.length <= player_obj.maxInven) {
					this.unequip(obj.id);
				}
			}
		}

		// update the item UI to the respective sprite
		updateItemUI(id);

		// Update player stats acc to item
		for (var i = 0; i < gameItems.length; i++) {
			if (id == gameItems[i].id) {
				if (id < 9) {
					if (gameItems[i].digTime != null && gameItems[i].digTime != '' && gameItems[i].digTime != undefined) {
						player_obj.digTime = gameItems[i].digTime;
						player_obj.attack = gameItems[i].dmg;
						this.attack = player_obj.attack;	
						break;
					} else {
						player_obj.attack = gameItems[i].dmg;
						this.attack = player_obj.attack;
					}
				} else if (id >= 9) {
					player_obj.armor += gameItems[i].armor;
					break;
				}
			}
		}
	}

	this.unequip = function(id) {
		if (player_obj.inventory.length <= player_obj.maxInven) {
			// add the item back to the inventory
			for (var i = 0; i < gameItems.length; i++) {
				if (id == gameItems[i].id) {
					// Create an item obj and add it to the inventory
					var createItem = new Item(this.x, this.y, 24, 24, gameItems[i]);
					player_obj.inventory.push(createItem);
					addToInvo(createItem);
					if (id >= 9) {
						player_obj.armor -= gameItems[i].armor;
					} else {
						player_obj.attack = 0;
					}
					break;
				}
			}

			if (id < 9) {
				updateItemUI(0);	
				this.itemID = 0;
			} else if (id > 8) {
				updateItemUI(-1);
			}		
		}
	}

	// Equip the default, copper pickaxe when player starts
	this.equip(1);

	// animation timer for digging
	var digAnimTimer = 0;

	// Tile to move for rope action
	var goRope = false;

	// Store grid color
	var tempGridHi = gridHi;

	this.draw = function(tiles) {

		// Quick Switch Helper
		if (keyCode == 49) {
			// Button 1
			for (var i = 0; i < this.inventory.length; i++) {
				if (this.inventory[i].id > 0 && this.inventory[i].id < 5) {
					for (var s = 0; s < this.inventory.length; s++) {
						if (this.inventory[i].uid == this.inventory[s].uid) {
							this.equip(this.inventory[i].id);
							removeFromInvo(this.inventory[s]);
							break;
						}
					}
				}
			}
		} else if (keyCode == 50) {
			// Button 2
			for (var i = 0; i < this.inventory.length; i++) {
				if (this.inventory[i].id > 4 && this.inventory[i].id < 9) {
					for (var s = 0; s < this.inventory.length; s++) {
						if (this.inventory[i].uid == this.inventory[s].uid) {
							this.equip(this.inventory[i].id);
							removeFromInvo(this.inventory[s]);
							break;
						}
					}
				}
			}
		}

		// Clear player Top tiles array
		this.playerTopTile = [];

		// Continuously check for tiles on top of the player for the rope function
		for (var i = 0; i < tiles.length; i++) {
			for (var p = 0; p < tiles[i].length; p++) {
				if (this.x < (tiles[i][p].x + tiles[i][p].w) && (this.x + this.w) > tiles[i][p].x && (this.y + (-544)) < (tiles[i][p].y + tiles[i][p].h) && (this.y + this.h) > tiles[i][p].y) {
					this.playerTopTile.push(tiles[i][p]);
				}
			}
		}

		if (this.rope == true) {
			gridHi = '#19ff5a';
		} else {
			gridHi = tempGridHi;
		}

		// change delta move
		if (mouse.x < this.x) {
			this.dm = -1;
		} else if (mouse.x > this.x + this.w) {
			this.dm = 1;
		}

		// Digging animation speed
		if (digAnimTimer > player_obj.digTime / 12) {
			digAnimTimer = 0;
			this.digging = 0;
		}


		// animation speed
		if (frames % 4 == 0) {
			this.frames++;
		}

		// reset frames after 3
		if (this.frames > 3) {
			this.frames = 0;
		}

		if (move != 0) {
			// Store old position of move for use with animation
			this.dm = move;
		}

		player_obj.x = this.x;
		player_obj.y = this.y;
		this.health = player_obj.health;

		// Control health bar
		document.getElementsByClassName('bar')[0].style.width = this.health + 'px';

		// Gravity
		this.vspd += this.gravity;

		// Jump
		if (jump_key == 1 && this.rope == false) {
			this.vspd -= this.jumpHeight;
			canDig = 0;
			setTimeout(function() {
				jump_key = 0;
				canJump = 0;
			}, 50);
		}

		// If player has rope and mouse button is clicked, start climbing only if the tile is near enough
		if (this.rope == true) {
			if (mouseButton == 1 && onTile.x - onTile.w < this.x && onTile.x + (onTile.w * 2) > this.x + this.w) {
				goRope = true;
			}

			if (goRope == true) {
				// Create a rope and ascend
				c.beginPath();
				c.moveTo((this.x + this.w) - (this.w / 2), (this.y + this.h) - (this.h / 2));
				c.strokeStyle = "#af4a00";

				// Ascending code
				if (onTile.y < this.y + this.h + 10) {
					this.hspd = 0;
					this.vspd = -2; // ascend speed

					if (onTile.x > this.x) {
						if (move == -1) {
							move = 0;
						}

						// Check for player x
						if (this.x + this.w > onTile.x) {
							goRope = false;
							this.rope = false;
						} else {
							if (this.playerTopTile.length > 0) {
							var tt = this.playerTopTile[this.playerTopTile.length - 1];

							// Bottom Tile
							c.lineTo((tt.x + tt.w), tt.y + tt.h);
							} else {
								// Right
								c.lineTo(onTile.x - 5, onTile.y - 10);
								c.moveTo(onTile.x - 5, onTile.y - 10);
								c.lineTo(onTile.x, onTile.y);
							}
						}
					} else if (onTile.x < this.x) {
						if (move == 1) {
							move = 0;
						}

						if (this.x < onTile.x + onTile.w) {
							goRope = false;
							this.rope = false;
						} else {
							if (this.playerTopTile.length > 0) {
								var tt = this.playerTopTile[this.playerTopTile.length - 1];

								// Bottom Tile
								c.lineTo(tt.x, tt.y + tt.h);
							} else {
								// Left
								c.lineTo((onTile.x + onTile.w) + 5, onTile.y - 10);
								c.moveTo((onTile.x + onTile.w) + 5, onTile.y - 10);
								c.lineTo(onTile.x + onTile.w, onTile.y);
							}
						}
					}
				} else {
					goRope = false;
					this.rope = false;
				}

				// Reset goRope and rope var once player is above the tile to be climbed on
				if (this.y + this.h < onTile.y) {
					goRope = false;
					this.rope = false;
				}

				c.stroke();
				c.closePath();
			}
		}

		// Vertical collision
		for (var i = 0; i < tiles.length; i++) {
			for (var p = 0; p < tiles[i].length; p++) {
				if (this.x < (tiles[i][p].x + tiles[i][p].w) && (this.x + this.w) > tiles[i][p].x && this.y < (tiles[i][p].y + tiles[i][p].h) && (this.y + this.h + this.vspd) > tiles[i][p].y) {
					// Bottom collision
					if (this.h + this.y < tiles[i][p].y) {
						this.y += (tiles[i][p].y - (this.h + this.y));
					}
					this.vspd = 0;
					canJump = 1;
					canDig = 1;
				} else if (this.x < (tiles[i][p].x + tiles[i][p].w) && (this.x + this.w) > tiles[i][p].x && (this.y + this.vspd) < (tiles[i][p].y + tiles[i][p].h) && (this.y + this.h) > tiles[i][p].y) {
					// Top collision
					if (this.y < tiles[i][p].y + tiles[i][p].h) {
						this.y -= (this.y - (tiles[i][p].y + tiles[i][p].h));
					}
					this.rope = false;
					goRope = false;
					this.vspd = 0;
				}
			}			
		};

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

			// Handle animation
			if (move > 0 && this.hspd != 0) {
				// moving to right
				c.drawImage(this.sprite[2], 32 * this.frames, 0, 27, 32, this.x, this.y, this.w, this.h);
			} else if (move < 0 && this.hspd != 0) {
				// moving to left
				c.drawImage(this.sprite[3], 32 * this.frames, 0, 27, 32, this.x, this.y, this.w, this.h);
			}
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
				if (diggable.length > 0 && this.rope == false) {
					for (var i = 0; i < diggable.length; i++) {
						if (dig_click == 1) {
							if (mouse.x > (diggable[i].x) && mouse.x < (diggable[i].x + diggable[i].w) && mouse.y > (diggable[i].y) && mouse.y < (diggable[i].y + diggable[i].h)) {
								for (var o = 0; o < tiles.length; o++) {
									for (var p = 0; p < tiles[o].length; p++) {
										if (diggable[i] == tiles[o][p]) {
											// start dig animation
											this.digging = 1;
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

			// set digging animation
			if (this.digging == 1 && this.dm > 0) {
				// dig to right
				c.drawImage(this.sprite[4], 32 * this.frames, 0, 27, 32, this.x, this.y, this.w, this.h);
				digAnimTimer++;
			} else if (this.digging == 1 && this.dm < 0) {
				// dig to left
				c.drawImage(this.sprite[5], 32 * this.frames, 0, 27, 32, this.x, this.y, this.w, this.h);
				digAnimTimer++;
			}

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

		// Player attack
		if (this.itemID < 9) {
			if (mouseButton == 1) {
				this.digging = 1;
				for (var i = 0; i < enemyArr.length; i++) {
					if (collides(this, enemyArr[i])) {
						// Deal damage with the object that is attacking you
						enemyArr[i].health -= randomIntFromInterval(this.attack[0], this.attack[1]);
					}
				}
			}

			// set attack animation using the digging animation controller
			if (this.digging == 1 && this.dm > 0) {
				// attack right
				if (this.itemID > 4 && this.itemID < 9) {
					c.drawImage(this.sprite[6], 32 * this.frames, 0, 27, 32, this.x, this.y, this.w, this.h);	
				} else if (this.itemID > 0 && this.itemID < 5) {
					c.drawImage(this.sprite[4], 32 * this.frames, 0, 27, 32, this.x, this.y, this.w, this.h);
				} else {
					c.drawImage(this.sprite[0], 0, 0, 27, 32, this.x, this.y, this.w, this.h);
				}
				digAnimTimer++;
			} else if (this.digging == 1 && this.dm < 0) {
				// attack left
				if (this.itemID > 4 && this.itemID < 9) {
					c.drawImage(this.sprite[7], 32 * this.frames, 0, 27, 32, this.x, this.y, this.w, this.h);	
				} else if (this.itemID > 0 && this.itemID < 5) {
					c.drawImage(this.sprite[5], 32 * this.frames, 0, 27, 32, this.x, this.y, this.w, this.h);	
				} else {
					c.drawImage(this.sprite[1], 0, 0, 27, 32, this.x, this.y, this.w, this.h);
				}
				digAnimTimer++;
			}
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

		// Stop animation
		if (this.hspd == 0 && this.digging == 0) {
			if (this.dm > 0)  {
			// right
				c.drawImage(this.sprite[0], 2, 0, 27, 32, this.x, this.y, this.w, this.h);
			} else if (this.dm < 0) {
				//left
				c.drawImage(this.sprite[1], 2, 0, 27, 32, this.x, this.y, this.w, this.h);
			}
		}

		// Draw light
		c.drawImage(this.sprite[this.sprite.length - 1], this.x, this.y, 200, 200);
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