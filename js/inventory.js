// Inventory code

var getInvo = document.querySelectorAll('#inventory .itemGrid');

function addToInvo(item) {
	// Check if itemGrid is empty

	for (var i = 0; i < getInvo.length; i++) {
		if (getInvo[i].innerHTML == '') {
			getInvo[i].innerHTML = item;
			break;
		} else {
			continue;
		}
	}
}

function removeFromInvo(item) {
	// Check for item
	for (var i = 0; i < getInvo.length; i++) {
		if (getInvo[i].innerHTML == item) {
			getInvo[i].innerHTML = '';
			break;
		} else {
			continue;
		}
	}
}

var invoInterval;
// Get inventory details
for (var z = 0; z < getInvo.length; z++) {
	getInvo[z].addEventListener('mouseover', function () {
		var playerInvo = player_obj.inventory;
		for (var p = 0; p < playerInvo.length; p++) {
			var thisImg = (this.querySelector('img')) ? true : false;
			if (thisImg == true) {
				if (this.querySelector('img').getAttribute('src') == playerInvo[p].sprite.src) {
					// Got the item in the frontend inventory
					var current = playerInvo[p];
					invoInterval = setInterval(function () {
						document.querySelector('#inventoryInfo').style.display = "block";
						document.querySelector('#inventoryInfo .inTitle').innerHTML = current.name;
						document.querySelector('#inventoryInfo .inInfo').innerHTML = current.info;
						document.querySelector('#inventoryInfo').style.left = domMouse.x + 'px';
						document.querySelector('#inventoryInfo').style.top = domMouse.y + 'px';
					}, 1);
				}
			}
		}
	});

	getInvo[z].addEventListener('mouseout', function () {
		document.querySelector('#inventoryInfo').style.display = "none";
		clearInterval(invoInterval);
	});
}

// Use inventory item