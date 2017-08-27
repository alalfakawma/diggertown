// Bug Constructor Object
var Bug = function(x, y, w, h, speed, sprite, attack, attackSpeed, health) {
	var self = this;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.vspd = 0;
	this.gravity = player_obj.gravity;
	this.speed = randomDec(speed[0], speed[1]);
	this.sprite = sprite;
	this.attack = attack;
	this.health = health;
	this.dugout = 1; // debug 1
	this.hspd = 0;
	this.move = 0;
	this.attackSpeed = attackSpeed;
	this.canAttack = 0;
	this.state = 0; // non-climbing state
	this.itemCont = false; // contains item or not

	// give random value for food
	var rand = randomIntFromInterval(10, 20);

	if (rand < 15) {
		this.itemCont = true;
	}

	setInterval(function() {
		if (self.canAttack == 0) {
			self.canAttack = 1;
		}
	}, this.attackSpeed);

	this.draw = function() {
		if (this.dugout == 1) {
			// Climb states for animated climbing
			if (this.state == 1) {
				// right climb
				c.save();
				c.translate(this.x, this.y);
				c.rotate(-90 * Math.PI / 180);
				c.drawImage(this.sprite, -this.w, 0, this.w, this.h);
				c.restore();
			} else if (this.state == 2) {
				// left climb
				c.save();
				c.translate(this.x, this.y);
				c.rotate(90 * Math.PI / 180);
				c.drawImage(this.sprite, 0, -this.h, this.w, this.h);
				c.restore();
			} else {
				c.drawImage(this.sprite, this.x, this.y, this.w, this.h);
			}

			// reset to normal state
			this.state = 0;

			this.vspd += this.gravity;

			// Horizontal collision
			this.hspd = this.speed * this.move;
			if (this.move != 0) {
				// Horizontal collision
				for (var i = 0; i < tiles.length; i++) {
					for (var p = 0; p < tiles[i].length; p++) {
						if ((this.x) < (tiles[i][p].x + tiles[i][p].w) && (this.x + this.hspd + this.w) > tiles[i][p].x && this.y < (tiles[i][p].y + tiles[i][p].h) && (this.y + this.h) > tiles[i][p].y) {
							// right side
							if (this.x + this.w < tiles[i][p].x) {
								this.x += (tiles[i][p].x - (this.w + this.x));
							}
							this.hspd = 0;
							this.state = 1;
							this.vspd -= 0.9;
						} else if ((this.x + this.hspd) < (tiles[i][p].x + tiles[i][p].w) && (this.x + this.w) > tiles[i][p].x && this.y < (tiles[i][p].y + tiles[i][p].h) && (this.y + this.h) > tiles[i][p].y) {
							// left side
							if (this.x > tiles[i][p].x + tiles[i][p].w) {
								this.x -= (this.x - (tiles[i][p].x + tiles[i][p].w));
							}
							this.hspd = 0;
							this.state = 2;
							this.vspd -= 0.9;
						}
					}			
				}
				this.x += this.hspd;	
			}

			// Find player / Pathfinding
			if (this.ground == true) {
				if (this.x - 200 < (player_obj.x + player_obj.w) && this.y - 100 < (player_obj.y + player_obj.h) && this.x + this.w + 200 > player_obj.x && this.y + this.h + 100 > player_obj.y) {
					// player detected around vicinity
					for (i = 0; i < gameWorld.tileArr.length; i++) {
						for (p = 0; p < gameWorld.tileArr[i].length; p++) {
							var tile = gameWorld.tileArr[i][p];

							// check tile where the bug is on / (Checks if the bug is completely inside the tile and only then returns the output)
							if (collides(this, tile)) {
								// Start a* pathfinding
								var playerTile = player.whichTile();
								var path = pathfind(tile, playerTile);

								// Execute and follow the found path if path is found
								if (path) {
									var pathx = path[0].x;
									var pathw = path[0].w;

									if (collides(this, player_obj)) {
										this.move = 0;
										if (this.canAttack == 1) {
											// attack the player with the random amount of the attack power specified in the object file
											var randomAttack = randomDec(this.attack[0], this.attack[1]);
											player_obj.health -= ((randomAttack - player_obj.armor) < 0) ? 0 : (randomAttack - player_obj.armor);
											player.attacked();
											// reset the canattack for attack interval
											this.canAttack = 0;
										}
									}

									if (pathx + pathw < this.x) {
										this.move = -1;
									} else if (pathx > this.x + this.w) {
										this.move = 1;
									}
								}
							}
						}
					}
				} else {
					this.move = 0;
				}
			}

			// Vertical collision
			for (var i = 0; i < tiles.length; i++) {
				for (var p = 0; p < tiles[i].length; p++) {
					if (this.x < (tiles[i][p].x + tiles[i][p].w) && (this.x + this.w) > tiles[i][p].x && this.y < (tiles[i][p].y + tiles[i][p].h) && (this.y + this.h + this.vspd) > tiles[i][p].y) {
						if (this.h + this.y < tiles[i][p].y) {
							this.y += (tiles[i][p].y - (this.h + this.y));
						}
						this.vspd = 0;
						this.ground = true;
					} else if (this.x < (tiles[i][p].x + tiles[i][p].w) && (this.x + this.w) > tiles[i][p].x && (this.y + this.vspd) < (tiles[i][p].y + tiles[i][p].h) && (this.y + this.h) > tiles[i][p].y) {
						if (this.y < tiles[i][p].y + tiles[i][p].h) {
							this.y -= (this.y - (tiles[i][p].y + tiles[i][p].h));
						}
						this.vspd = 0;
						this.ground = false;
					}
				}			
			}

			this.y += this.vspd;
		}

		// Dead / Execute when object is dead
		if (this.health <= 0) {
			enemyArr.splice(enemyArr.indexOf(this), 1);
		}
	}

	this.collide = function() {
		// hitbox
		var newX = this.x - 5,
			newY = this.y,
			newW = this.w + 10,
			newH = this.h + 5;

		// return a hitbox based on the current position but with bigger than object size for accuracy
		return {x: newX, y: newY, w: newW, h: newH};
	}

}