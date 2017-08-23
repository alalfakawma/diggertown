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
	this.gold = 0;
	this.diamond = 0;
	this.silver = 0;
	this.copper = 0;
	this.inventory = player_obj.inventory;
	this.itemID = 1;

	// Update object
	player_obj.w = this.w;
	player_obj.h = this.h;

	this.equip = function(id) {
		this.itemID = id;
		for (var i = 0; i < gameTools.length; i++) {
			var thisID = gameTools[i].id;

			if (id == thisID) {
				
				break;
			}
		}
	}

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
		if (this.itemID <= 4) {
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
							tiles[i].splice(p, 1);
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
}