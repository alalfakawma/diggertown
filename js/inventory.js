// Inventory code

var getInvo = document.querySelectorAll('#inventory .itemGrid');

function addToInvo(item) {
	// Check if itemGrid is empty
	for (var i = 0; i < getInvo.length; i++) {
		if (getInvo[i].getAttribute('data-sprite') == '' || getInvo[i].getAttribute('data-sprite') == undefined || getInvo[i].getAttribute('data-sprite') == null) {
			getInvo[i].setAttribute('data-sprite', item.sprite.src);
			getInvo[i].setAttribute('data-obj', JSON.stringify(item));
			getInvo[i].style.backgroundImage = "url( "+ item.sprite.src + ")";
			break;
		} else {
			continue;
		}
	}
}

function removeFromInvo(item) {
	// Check for item
	for (var i = 0; i < getInvo.length; i++) {
		if (getInvo[i].getAttribute('data-sprite') != '' && getInvo[i].getAttribute('data-sprite') != undefined && getInvo[i].getAttribute('data-sprite') != null) {
			var objectParse = JSON.parse(getInvo[i].getAttribute('data-obj'));
			if (item.x == objectParse.x && item.y == objectParse.y && item.sprite.src == getInvo[i].getAttribute('data-sprite')) {
				// remove from invo
				player_obj.inventory.splice(player_obj.inventory.indexOf(item), 1);
				// remove from frontend invo
				getInvo[i].setAttribute('data-sprite', '');
				getInvo[i].setAttribute('data-obj', '');
				getInvo[i].style.backgroundImage = "";
				break;
			}
		}
	}
}

var invoInterval;
for (var z = 0; z < getInvo.length; z++) {
	// Get inventory details
	getInvo[z].addEventListener('mouseover', function () {
		var playerInvo = player_obj.inventory;
		for (var p = 0; p < playerInvo.length; p++) {
			var thisImg = (this.style.backgroundImage != '' || this.style.backgroundImage != undefined) ? true : false;
			if (thisImg == true) {
				if (this.getAttribute('data-sprite') == playerInvo[p].sprite.src) {
					// Got the item in the frontend inventory
					var current = playerInvo[p];
					invoInterval = setInterval(function () {
						document.querySelector('#inventoryInfo').style.display = "block";
						document.querySelector('#inventoryInfo .inTitle').innerHTML = current.name;
						document.querySelector('#inventoryInfo .inInfo').innerHTML = current.info;
						document.querySelector('#inventoryInfo').style.left = (domMouse.x + 10) + 'px';
						document.querySelector('#inventoryInfo').style.top = (domMouse.y + 10) + 'px';
					}, 1);
					break;
				}
			}
		}
	});

	getInvo[z].addEventListener('mouseleave', function () {
		document.querySelector('#inventoryInfo').style.display = "none";
		clearInterval(invoInterval);
	});


	// Use inventory item
	getInvo[z].addEventListener('click', function() {
		var playerInvo = player_obj.inventory;
		if (this.getAttribute('data-sprite') != '' && this.getAttribute('data-sprite') != undefined && this.getAttribute('data-sprite') != null) {
			// Get and parse object
			var getObject = JSON.parse(this.getAttribute('data-obj'));
			for (var i = 0; i < playerInvo.length; i++) {
				if (playerInvo[i].x == getObject.x && playerInvo[i].y == getObject.y && playerInvo[i].sprite.src == this.getAttribute('data-sprite')) {
					// Match found in player's inventory
					var armor = playerInvo[i].armor;
					var health = playerInvo[i].health;
					var buff = null;
					// Use the item and add to player stats
					player_obj.health += health;
					player_obj.armor += armor;

					// Remove item after player has used it
					removeFromInvo(playerInvo[i]);
					break;
				}
			}
		}
	});
}

