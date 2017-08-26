// A* algorithm
function pathfind(start, end) {
	// First clear the previous
	for (var i = 0; i < gameWorld.tileArr.length; i++) {
		for (var p = 0; p < gameWorld.tileArr[i].length; p++) {
			gameWorld.tileArr[i][p].previous = null;
		}
	}

	var closedSet = [];
	var openSet = [];

	openSet.push(start);

	while(openSet.length > 0) {
		var current = 0;

		for (var i = 0; i < openSet.length; i++) {
			if (openSet[i].f < openSet[current].f) {
				current = i;
			}
		}

		var thisOne = openSet[current];

		if (thisOne == end) {
			// Found the end
			var path = [];

			var temp = thisOne;
			path.push(temp);
			while(temp.previous) {
				path.push(temp.previous);
				temp = temp.previous;
			}

			return path;
		}

		openSet.splice(openSet.indexOf(thisOne), 1);
		closedSet.push(thisOne);

		var neighbors = thisOne.neighbors;

		for (var i = 0; i < neighbors.length; i++) {
			var neighbor = neighbors[i];

			if (!closedSet.includes(neighbor) && !neighbor.obstacle) {
				var tempG = thisOne.g + 1;	

				if (openSet.includes(neighbor)) {
					if (tempG < neighbor.g) {
						neighbor.g = tempG;
					}
				} else {
					neighbor.g = tempG;
					openSet.push(neighbor);
				}

				neighbor.heu = heuristic(neighbor, end);

				neighbor.f = neighbor.g + neighbor.heu;

				neighbor.previous = thisOne;
			}
		}
	}
}