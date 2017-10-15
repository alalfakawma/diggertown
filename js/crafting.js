// Craft item function
function craft(id, player) {
	for (var i = 0; i < gameItems.length; i++) {
		var itemid = gameItems[i].id;
		var material = gameItems[i].material;
		var amt = gameItems[i].craftamt;
		var tocheck;

		if (material == 'gold') {
			tocheck = player.gold;
		} else if (material == 'diamond') {
			tocheck = player.diamond;
		} else if (material == 'copper') {
			tocheck = player.copper;
		} else if (material == 'silver') {
			tocheck = player.silver;
		}

		// If id matches up
		if (itemid == id) {
			if (tocheck < amt) {
				// less resources
				console.log('Need more ' + material);
			} else {
				// create item in inventory and reduce the player's resource
				if (player_obj.inventory.length <= player_obj.maxInven) {
					var createItem = new Item(player.x, player.y, 24, 24, gameItems[i]);
					player_obj.inventory.push(createItem);
					addToInvo(createItem);
					if (material == 'gold') {
						player.gold -= amt;
					} else if (material == 'diamond') {
						player.diamond -= amt;
					} else if (material == 'copper') {
						player.copper -= amt;
					} else if (material == 'silver') {
						player.silver -= amt;
					}
					console.log('Item crafted successfully!');
					break;
				}
			}
		}
	}
}

// Generate crafting menu based on available items
var getC = document.querySelector('#crafting');

for (var i = 0; i < gameItems.length; i++) {
	// Create the grids based on item length and assign items
	var createGrid = document.createElement('div');
	createGrid.setAttribute('class', 'itemGrid');
	createGrid.setAttribute('data-sprite', gameItems[i].sprite.src);
	createGrid.setAttribute('data-obj', JSON.stringify(gameItems[i]));
	createGrid.style.backgroundImage = "url( "+ gameItems[i].sprite.src + ")";
	getC.appendChild(createGrid);
}

// Handle mouseovers and mouseclicks
var getInterval;
var getGrids = document.querySelectorAll('#crafting .itemGrid');
for (var z = 0; z < getGrids.length; z++) {
	// Get item details
	getGrids[z].addEventListener('mouseover', function () {
		var current = JSON.parse(this.getAttribute('data-obj'));
		getInterval = setInterval(function () {
			document.querySelector('.craftInfo').style.display = "block";
			document.querySelector('.craftInfo .inTitle').innerHTML = current.name;
			document.querySelector('.craftInfo .craftAmt').innerHTML = 'Craft with ' + current.craftamt + ' ' + current.material;
			if (current.dmg != undefined && current.dmg != null) {
				document.querySelector('.craftInfo .dmg').innerHTML = 'Damage: ' + current.dmg[0] + ' - ' + current.dmg[1];
			} else {
				document.querySelector('.craftInfo .dmg').innerHTML = '';
			}
			if (current.armor != undefined && current.armor != null) {
				document.querySelector('.craftInfo .armor').innerHTML = 'Armor: ' + current.armor;
			} else {
				document.querySelector('.craftInfo .armor').innerHTML = '';
			}
			document.querySelector('.craftInfo .inInfo').innerHTML = current.info;
			document.querySelector('.craftInfo').style.left = (domMouse.x + 10) + 'px';
			document.querySelector('.craftInfo').style.top = (domMouse.y + 10) + 'px';
		}, 1);
	});

	getGrids[z].addEventListener('mouseleave', function () {
		document.querySelector('.craftInfo').style.display = "none";
		clearInterval(getInterval);
	});

	// Craft Item if craftable
	getGrids[z].addEventListener('click', function() {
		var getEnable = this.style.filter;

		if (getEnable == 'none') {
			var obj = JSON.parse(this.getAttribute('data-obj'));
			craft(obj.id, player);
		}
	});
}


function checkItems() {
	for (var i = 0; i < getGrids.length; i++) {
		var obj = JSON.parse(getGrids[i].getAttribute('data-obj'));
		if (obj.material == 'gold') {
			if (obj.craftamt > player.gold) {
				getGrids[i].style.filter = "grayscale()";
			} else {
				getGrids[i].style.filter = "none";
			}
		} else if (obj.material == 'copper') {
			if (obj.craftamt > player.copper) {
				getGrids[i].style.filter = "grayscale()";
			} else {
				getGrids[i].style.filter = "none";
			}
		} else if (obj.material == 'silver') {
			if (obj.craftamt > player.silver) {
				getGrids[i].style.filter = "grayscale()";
			} else {
				getGrids[i].style.filter = "none";
			}
		} else if (obj.material == 'diamond') {
			if (obj.craftamt > player.diamond) {
				getGrids[i].style.filter = "grayscale()";
			} else {
				getGrids[i].style.filter = "none";
			}
		}
	}
}