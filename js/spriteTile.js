// Draw sprite object on screen / could be sprite Tiles, etc.
function DrawSpriteObj(x, y, spriteArray, spriteW, spriteH) {
	this.x = x;
	this.y = y;
	this.w = spriteW;
	this.h = spriteH;
	this.sprite;
	this.resource;
	this.amount;
	this.randomValue = Math.floor(Math.random() * 150);

	// Generate sprite according to the randomValue and spriteArray
	if (this.randomValue == 67 || this.randomValue == 87 || this.randomValue == 143) {
		this.sprite = spriteArray[1]; // gold
	} else if (this.randomValue == 89 || this.randomValue == 92 || this.randomValue == 127 || this.randomValue == 145) {
		this.sprite = spriteArray[3]; // silver
	} else if (this.randomValue == 24 || this.randomValue == 99 || this.randomValue == 12 || this.randomValue == 123 || this.randomValue == 122 || this.randomValue == 111) {
		this.sprite = spriteArray[4]; // bomb
	} else if (this.randomValue == 10 || this.randomValue == 20) {
		this.sprite = spriteArray[2] // diamond
	} else {
		this.sprite = spriteArray[0]; // soil
	}

	// update resource acc to sprite
	if (this.sprite.src.includes('gold')) {
		this.resource = 'Gold';
		this.amount = Math.ceil(Math.random() * 4);
	} else if (this.sprite.src.includes('silver')) {
		this.resource = 'Silver';
		this.amount = Math.ceil(Math.random() * 8);
	} else if (this.sprite.src.includes('diamond')) {
		this.resource = 'Diamond';
		this.amount = Math.ceil(Math.random() * 2);
	} else if (this.sprite.src.includes('bombs')) {
		this.resource = 'Bombs';
	} else {
		this.resource = '';
	}

	this.draw = function() {
		c.drawImage(this.sprite, this.x, this.y);
	}

	this.hit = function() { // DEBUG
		c.fillStyle = "blue";
		c.fillRect(this.x, this.y, this.w, this.h);
	}

	this.showInfo = function() {
		if (this.resource.length) {
			document.getElementsByClassName('showInfo')[0].style.display = "block";
			document.getElementsByClassName('showInfo')[0].innerHTML = this.resource;
			document.getElementsByClassName('showInfo')[0].style.left = domMouse.x + 10 + 'px';
			document.getElementsByClassName('showInfo')[0].style.top = domMouse.y + 10 + 'px';
		} else {
			document.getElementsByClassName('showInfo')[0].style.display = "none";
		}
	}
}