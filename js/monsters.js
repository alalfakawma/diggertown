// Bug Constructor Object
var Bug = function(x, y, w, h, speed, sprite, attack, attackSpeed, health) {
	var self = this;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.vspd = 0;
	this.gravity = player_obj.gravity;
	this.speed = speed;
	this.sprite = sprite;
	this.attack = attack;
	this.health = health;
	this.dugout = 0;
	this.hspd = 0;
	this.move = 0;
	this.attackSpeed = attackSpeed;
	this.canAttack = 0;

	setInterval(function() {
		if (self.canAttack == 0) {
			self.canAttack = 1;
		}
	}, this.attackSpeed);

	this.draw = function() {
		if (this.dugout == 1) {
			c.fillStyle = 'red';
			c.fillRect(this.x, this.y, this.w, this.h);

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
							this.vspd -= 1;
						} else if ((this.x + this.hspd) < (tiles[i][p].x + tiles[i][p].w) && (this.x + this.w) > tiles[i][p].x && this.y < (tiles[i][p].y + tiles[i][p].h) && (this.y + this.h) > tiles[i][p].y) {
							// left side
							if (this.x > tiles[i][p].x + tiles[i][p].w) {
								this.x -= (this.x - (tiles[i][p].x + tiles[i][p].w));
							}
							this.hspd = 0;
							this.vspd -= 1;
						}
					}			
				}
				this.x += this.hspd;	
			}

			// Find player / Pathfinding
			if (this.x - 100 < (player_obj.x + player_obj.w) && this.y - 100 < (player_obj.y + player_obj.h) && this.x + this.w + 100 > player_obj.x && this.y + this.h + 100 > player_obj.y) {
				// player detected around vicinity
				if (this.x + this.w < player_obj.x + (this.w / 2) && this.y > player_obj.y && this.y + this.h <= player_obj.y + player_obj.h) {
					this.move = 1;
					console.log('going right');
				} else if ((this.w / 2) + this.x > player_obj.x + player_obj.w && this.y > player_obj.y && this.y + this.h <= player_obj.y + player_obj.h) {
					this.move = -1;
					console.log('going left');
				} else if (this.y > player_obj.y + player_obj.h) {
					// Jump if the player is above you or going up
					if (this.x + this.w - 200 < player_obj.x) {
						this.move = 1;	
					} else if (this.x + this.w + 200 > player_obj.x) {
						this.move = -1;
					}
					console.log('im trying to come up');
				} else if (this.y + this.h < player_obj.y) {
					// Player below the bug
					console.log('im coming down');
					if (this.x + this.w - 200 < player_obj.x) {
						this.move = 1;	
					} else if (this.x + this.w + 200 > player_obj.x) {
						this.move = -1;
					}
				} else {
					// Bug on player
					var attackDmg = randomDec(this.attack[0], this.attack[1]);
					if (this.canAttack == 1) {
						if (this.x < (player_obj.x + player_obj.w) && (this.x + this.w) > player_obj.x && this.y < (player_obj.y + player_obj.h) && (this.y + this.h) > player_obj.y) {
							player_obj.health -= parseFloat(attackDmg);		
							this.canAttack = 0;
						}
					}
					this.move = 0;
				}
			} else {
				this.move = 0;
			}

			// Vertical collision
			for (var i = 0; i < tiles.length; i++) {
				for (var p = 0; p < tiles[i].length; p++) {
					if (this.x < (tiles[i][p].x + tiles[i][p].w) && (this.x + this.w) > tiles[i][p].x && this.y < (tiles[i][p].y + tiles[i][p].h) && (this.y + this.h + this.vspd) > tiles[i][p].y) {
						if (this.h + this.y < tiles[i][p].y) {
							this.y += (tiles[i][p].y - (this.h + this.y));
						}
						this.vspd = 0;
					} else if (this.x < (tiles[i][p].x + tiles[i][p].w) && (this.x + this.w) > tiles[i][p].x && (this.y + this.vspd) < (tiles[i][p].y + tiles[i][p].h) && (this.y + this.h) > tiles[i][p].y) {
						if (this.y < tiles[i][p].y + tiles[i][p].h) {
							this.y -= (this.y - (tiles[i][p].y + tiles[i][p].h));
						}
						this.vspd = 0;
					}
				}			
			}

			this.y += this.vspd;
		}
	}

}