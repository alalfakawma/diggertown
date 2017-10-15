// ITEMS CONTROLLER
// Control what the user is using

function updateItemUI(id) {
	if (id == 0) {
		document.getElementsByClassName('equipItem')[0].setAttribute('data-sprite', '');
		document.getElementsByClassName('equipItem')[0].setAttribute('data-obj', '');
		document.getElementsByClassName('equipItem')[0].style.backgroundImage = "";
		return;
	} else if (id == -1) {
		document.getElementsByClassName('equipItem')[1].setAttribute('data-sprite', '');
		document.getElementsByClassName('equipItem')[1].setAttribute('data-obj', '');
		document.getElementsByClassName('equipItem')[1].style.backgroundImage = "";
		return;
	}

	for (var i = 0; i < gameItems.length; i++) {
		var thisItem = gameItems[i];

		if (thisItem.id == id) {
			// Update the UI with the respective sprite
			// Update to the first box if this is not an armor
			if (id < 9) {
				// Tools/weapons
				document.getElementsByClassName('equipItem')[0].setAttribute('data-sprite', thisItem.sprite.src);
				document.getElementsByClassName('equipItem')[0].setAttribute('data-obj', JSON.stringify(thisItem));
				document.getElementsByClassName('equipItem')[0].style.backgroundImage = "url("+ thisItem.sprite.src + ")";
			} else {
				// Armor
				document.getElementsByClassName('equipItem')[1].setAttribute('data-sprite', thisItem.sprite.src);
				document.getElementsByClassName('equipItem')[1].setAttribute('data-obj', JSON.stringify(thisItem));
				document.getElementsByClassName('equipItem')[1].style.backgroundImage = "url("+ thisItem.sprite.src + ")";
			}
		}
	}
}

// Item object constructor
function Item(x, y, w, h, object) {
	this.uid = genuid();
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.obj = object;
	this.vspd = 0;
	this.gravity = player_obj.gravity;
	this.fallen = false;
	this.sprite = this.obj.sprite;
	this.info = this.obj.info;
	this.name = this.obj.name;
	this.type = this.obj.type;
	this.id = this.obj.id;
	this.random = randomIntFromInterval(20, 200)

	this.draw = function() {
		c.drawImage(this.obj.sprite, this.x, this.y, this.w, this.h);

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
									this.y = (thatY + ((thatH/2) - this.h/2)) + Math.sin((frames+this.random*1) * Math.PI / 180) * 3;
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
					itemArray.splice(itemArray.indexOf(this), 1);;
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


// Unequip item with click
var itemStack = document.getElementsByClassName('equipItem');

var itemInterval;
for (var i = 0; i < itemStack.length; i++) {
	itemStack[i].addEventListener('click', function () {
		if (this.getAttribute('data-obj') != undefined && this.getAttribute('data-obj') != null && this.getAttribute('data-obj') != '') {
			var obj = JSON.parse(this.getAttribute('data-obj'));
			player.unequip(obj.id);
		}
	});

	itemStack[i].addEventListener('mouseover', function() {
		for (var p = 0; p < gameItems.length; p++) {
			var thisImg = (this.style.backgroundImage != '' || this.style.backgroundImage != undefined) ? true : false;
			if (thisImg == true) {
				if (this.getAttribute('data-sprite') == gameItems[p].sprite.src) {
					// Got the item in the frontend inventory
					var current = gameItems[p];
					itemInterval = setInterval(function () {
						document.querySelector('.itemInfo').style.display = "block";
						document.querySelector('.itemInfo .inTitle').innerHTML = current.name;
						document.querySelector('.itemInfo .inInfo').innerHTML = current.info;
						if (current.dmg != undefined && current.dmg != null) {
							document.querySelector('.itemInfo .dmg').innerHTML = 'Damage: ' + current.dmg[0] + ' - ' + current.dmg[1];
						} else {
							document.querySelector('.itemInfo .dmg').innerHTML = '';
						}
						if (current.armor != undefined && current.armor != null) {
							document.querySelector('.itemInfo .armor').innerHTML = 'Armor: ' + current.armor;
						} else {
							document.querySelector('.itemInfo .armor').innerHTML = '';
						}
						document.querySelector('.itemInfo').style.left = (domMouse.x + 10) + 'px';
						document.querySelector('.itemInfo').style.top = (domMouse.y - 50) + 'px';
					}, 1);
					break;
				}
			}
		}
	});

	itemStack[i].addEventListener('mouseleave', function () {
		document.querySelector('.itemInfo').style.display = "none";
		clearInterval(itemInterval);
	});
}