// Food constructor
var Food = function(x, y, w, h, sprite) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.gravity = player_obj.gravity;
	this.vspd = 0;
	this.random = randomIntFromInterval(1, 50);
	this.fallen = false;
	this.obj;
	this.type = 'food';

	if (Array.isArray(sprite)) {
		// Generate food sprite chance
		for (var i = 0; i < sprite.length; i++) {
			if (this.random == 2 || this.random == 23 || this.random == 49) {
				this.obj = sprite[0]; // Old Alcohol
			} else if (this.random == 44) {
				this.obj = sprite[1]; // Miner's feast
			} else {
				this.obj = sprite[2]; // Old canned food
			}
		}
	} else {
		this.sprite = sprite;
	}

	// Update
	this.sprite = this.obj.sprite;
	this.info = this.obj.info;
	this.name = this.obj.name;
	this.armor = this.obj.armor;
	this.health = this.obj.health;
	this.buff = this.obj.buff;

	this.draw = function() {
		c.drawImage(this.sprite, this.x, this.y, this.w * 1.2, this.h * 1.2);

		// Gravity effect
		this.vspd += this.gravity;

		// Vertical collision
		for (var i = 0; i < tiles.length; i++) {
			for (var p = 0; p < tiles[i].length; p++) {
				if (this.x < (tiles[i][p].x + tiles[i][p].w) && (this.x + this.w) > tiles[i][p].x && this.y < (tiles[i][p].y + tiles[i][p].h) && (this.y + this.h + this.vspd) > tiles[i][p].y) {
					if (this.h + this.y < tiles[i][p].y) {
						this.y += (tiles[i][p].y - (this.h + this.y));
					}
					this.vspd = 0;
					this.fallen = true;
					for (var l = 0; l < gameWorld.tileArr.length; l++) {
						for (var k = 0; k < gameWorld.tileArr[l].length; k++) {
							var thatX = gameWorld.tileArr[l][k].x;
							var thatY = gameWorld.tileArr[l][k].y;
							var thatW = gameWorld.tileArr[l][k].w;
							var thatH = gameWorld.tileArr[l][k].h;

							if (this.x < (thatX + thatW) && (this.x + this.w) > thatX && this.y < (thatY + thatH) && (this.y + this.h) > thatY) {
								if (this.fallen == true) {
								this.x = thatX + ((thatW/2) - this.w/2);

								// Float in space
								this.y = (thatY + ((thatH/2) - this.h/2)) + Math.sin((frames*1) * Math.PI / 180) * 3;
								}
							}
						}		
					}
				}
			}			
		}

		// Check for collisions with player
		if (this.x < (player_obj.x + player_obj.w) && this.x + this.w > player_obj.x && this.y < player_obj.y + player_obj.h && this.y + this.h > player_obj.y) {
			// Collided with player
			if (keyCode == 69) {
				// Player pressed E key add to player invo array
				// Check player invo first and check if inventory is full or not
				if (player_obj.inventory.length <= player_obj.maxInven) {
					player_obj.inventory.push(this);	
					// Add to player invo display
					addToInvo(this);
					// Remove this from tilearray
					bunchOfFood.splice(bunchOfFood.indexOf(this), 1);
				} else {
					// Inventory is full
					console.log('inventory full');
				}
				keyCode = null;
			}
		}

		// Add gravity
		if (!this.fallen) {
			this.y += this.vspd;	
		}
	}
}