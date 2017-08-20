// Create tile obj function
function CreateTile(x, y, w, h, color) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.color = color;

	this.draw = function() {
		if (gridShow == true) {
			c.strokeStyle = this.color;
			c.strokeRect(this.x, this.y, this.w, this.h);	
		}	
	}

	// Get specific tile
	this.getTile = function(x, y) {
		if (x > (this.x + 1) && x < (this.x + this.w) && y > (this.y + 1) && y < (this.y + this.h)) {
			onTile = this;
		}
	}

	this.highlight = function(x, y) {
		if ((x + 1) > this.x && x < (this.x + this.w) && y > (this.y + 1) && y < (this.y + this.h)) {
			c.strokeStyle = "black";
			c.strokeRect(this.x, this.y, this.w, this.h);
			c.strokeRect(this.x, this.y, this.w, this.h);

			// SHOW TILE INFO
			for (var i = 0; i < tiles.length; i++) {
				for (var p = 0; p < tiles[i].length; p++) {
					if (tiles[i][p].x == this.x && tiles[i][p].y == this.y) {
						tiles[i][p].showInfo();
					}
				}
			}

			for (var i = 0; i < bunchOfFood.length; i++) {
				if (bunchOfFood[i].x > this.x && bunchOfFood[i].y > this.y && bunchOfFood[i].x + bunchOfFood[i].w < this.x + this.w && bunchOfFood[i].y + bunchOfFood[i].h < this.y + this.h) {
					// Food is there inside this tile
					// Show the food info
					document.getElementsByClassName('foodInfo')[0].style.display = "block";
					document.getElementsByClassName('foodInfotitle')[0].innerHTML = bunchOfFood[i].name;
					document.getElementsByClassName('foodInfoInfo')[0].innerHTML = bunchOfFood[i].info;
					document.getElementsByClassName('foodInfo')[0].style.left = domMouse.x + 10 + 'px';
					document.getElementsByClassName('foodInfo')[0].style.top = domMouse.y + 10 + 'px';
				}
			}
		}
	}

	this.hit = function() { // DEBUG
		c.fillStyle = 'red';
		c.fillRect(this.x, this.y, this.w, this.h);
	}
}
