// Draw sprite object on screen / could be sprite Tiles, etc.
function DrawSpriteObj(x, y, spriteArray, spriteW, spriteH) {
	this.x = x;
	this.y = y;
	this.w = spriteW;
	this.h = spriteH;
	this.sprite;
	this.resource;
	this.amount;
	this.randomValue = randomIntFromInterval(1, 150);
	this.foodCont = false;
	this.enemyCont = false;
	this.enemyType = "bug";

	if (this.randomValue == 30 || this.randomValue == 50 || this.randomValue == 90) {
		this.enemyCont = true;
		if (randomIntFromInterval(20, 40) == 24) {
			this.enemyType = "giantearthworm";
		} else if (randomIntFromInterval(20, 40) == 38) {
			this.enemyType = "diamondpest";
		}
	}

	if (this.randomValue == 70 || this.randomValue == 100) {
		this.foodCont = true;
	}

	// Generate sprite according to the randomValue and spriteArray
	if (this.randomValue == 67 || this.randomValue == 87) {
		this.sprite = spriteArray[1]; // gold
	} else if (this.randomValue == 89 || this.randomValue == 92 || this.randomValue == 127) {
		this.sprite = spriteArray[3]; // silver
	} else if (this.randomValue == 24 || this.randomValue == 99 || this.randomValue == 12 || this.randomValue == 123 || this.randomValue == 122 || this.randomValue == 111) {
		this.sprite = spriteArray[4]; // bomb
	} else if (this.randomValue == 10) {
		this.sprite = spriteArray[2] // diamond
	} else if (this.randomValue == 22 || this.randomValue == 150 || this.randomValue == 44 || this.randomValue == 45 || this.randomValue == 98 || this.randomValue == 65 || this.randomValue == 121 || this.randomValue == 26 || this.randomValue == 33) {
		this.sprite = spriteArray[5] // copper
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
	} else if (this.sprite.src.includes('copper')) {
		this.resource = 'Copper'
		this.amount = Math.ceil(Math.random() * 22);
	} else {
		this.resource = '';
	}

	this.draw = function() {
		c.drawImage(this.sprite, this.x, this.y);
		this.addObstacle();
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

	this.addObstacle = function() {
		var tileArr = gameWorld.tileArr;

		for (var i = 0; i < tileArr.length; i++) {
			for (var p = 0; p < tileArr[i].length; p++) {
				if (this.x == tileArr[i][p].x && this.y == tileArr[i][p].y) {
					tileArr[i][p].obstacle = true;
				}
			}	
		}
	}
}