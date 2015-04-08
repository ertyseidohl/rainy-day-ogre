
//directions used for hexagonal map
var directions = [
    [ {i: +1, j: +1}, {i: +1, j: 0}, {i: 0, j: -1},
    {i: -1, j: 0}, {i: -1, j: +1}, {i: 0, j: +1} ],
    [ {i: 0, j: +1}, {i: +1, j: 0}, {i: +1, j: -1},
    {i: 0, j: -1}, {i: -1, j: -1}, {i: -1, j: 0} ]
];

exports.GameMap = function(options) {
	
        var walls = options.map.walls;
        var craters = options.map.craters;

        //Walls
		this.walls = {};
		for (var w in walls) {
			this.walls[walls[w]] = true;
		}

		//Craters
		this.craters = {};
		for (var c in craters) {
			this.craters[craters[c]] = true;
		}

		//Methods
		this.isWall = function(tileA, tileB) {
			return Util.getTileUniqueId(tileA) + Util.getTileUniqueId(tileB) in this.walls ||
				Util.getTileUniqueId(tileB) + Util.getTileUniqueId(tileA) in this.walls;
		};
		this.isCrater = function(tile) {
			return Util.getTileUniqueId(tile) in this.craters;
		};
		this.getNeighbors = function(tile, canClimbWalls) {
			var neighbors = [];
			for (var index = 0; index < 6; index++) {
				var parity = (tile.i & 1) ? 0 : 1;
				var dir = directions[parity][index];
				var newNeighbor = {
					i : tile.i + dir.i,
					j: tile.j + dir.j
				};
				if (newNeighbor.i > 0 &&
					newNeighbor.j > 0 &&
					(canClimbWalls || !map.isWall(tile, newNeighbor)) &&
					!map.isCrater(newNeighbor)) {
					neighbors.push(newNeighbor);
				}

			}
			return neighbors;
		};
		this.performSearch = function(origin, destination, canClimbWalls){
			var frontier, cameFrom, costSoFar, newCost, current, path, node, nextNeighbors, n, next;

			frontier = new PriorityQueue({
				comparator: function(a, b) { return a.cost - b.cost; }
			});

			origin.cost = 0;
			frontier.queue(origin);
			cameFrom = {};
			costSoFar = {};
			cameFrom[Util.getTileUniqueId(origin)] = null;
			costSoFar[Util.getTileUniqueId(origin)] = 0;

			while(frontier.length > 0) {
				if (frontier.length > 100) {
					return false;
				}
				current = frontier.dequeue();

				if (current.i == destination.i && current.j == destination.j) {
					path = [];
					node = cameFrom[Util.getTileUniqueId(current)];
					while(node) {
						path.push(node);
						node = cameFrom[Util.getTileUniqueId(node)];
					}
					return path;
				}

				nextNeighbors = this.getNeighbors(current, canClimbWalls);
				for (n in nextNeighbors){
					next = nextNeighbors[n];
					newCost = costSoFar[Util.getTileUniqueId(current)] + 1;
					if (!(Util.getTileUniqueId(next) in costSoFar) || newCost < costSoFar[Util.getTileUniqueId(next)]){
						costSoFar[Util.getTileUniqueId(next)] = newCost;
						next.cost = newCost + Util.getDistance(destination, next);
						frontier.queue(next);
						cameFrom[Util.getTileUniqueId(next)] = current;
					}
				}
			}
		};
	};

	exports.Util = {
		axialToCube : function(tile) {
			var coords = {
				x : tile.i,
				z : tile.j - (tile.i + (tile.i&1)) / 2
			};
			coords.y = -coords.x - coords.z;
			return coords;
		},
		cubeToAxial : function(tile) {
			return {
				i : tile.x,
				j : tile.z
			};
		},
		getUnitsInTile : function(tile) {
			var curr, unit;
			for (unit in this.units) {
				curr = this.units[unit].getTile();
				if (curr.x == tile.x && curr.y == tile.y) {
					return curr;
				}
			}
			return null;
		},
		getDistance : function(start, dest) {
			var startCube = this.axialToCube(start);
			var destCube = this.axialToCube(dest);
			return Math.max(Math.abs(startCube.x - destCube.x), Math.abs(startCube.y - destCube.y), Math.abs(startCube.z - destCube.z));
		},
		getTileUniqueId : function(tile) {
			var pad = function(number) {return number < 9 ? "0" + number : number.toString(); };
			return pad(tile.i) + pad(tile.j);
		}
	};

exports.Game = function(options){
    this.map = exports.GameMap({map : options.map});
    this.armies = options.armies;
    this.users = options.users;   //userid => index for this.armies  
};

exports.Game.prototype.getUsersArmy = function(userid) {
    return this.armies[this.users[userid]];
};


