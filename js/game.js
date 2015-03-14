;(function(exports) {

	var walls = [
		"01020203",
		"01030203"
		//todo add more
	];

	var craters = [
		"0303",
		"0107"
		//todo add more
	];

	var GameMap = function(options) {
		//Units
		this.units = [];

		//Walls
		this.walls = {};
		for (w in walls) {
			this.walls[walls[w]] = true;
		}

		//Craters
		this.craters = {};
		for (c in craters) {
			this.craters[craters[c]] = true;
		}

		//Methods
		this.isWall = function(tileA, tileB) {
			return Util.getTileUniqueId(tileA) + Util.getTileUniqueId(tileB) in this.walls ||
				Util.getTileUniqueId(tileB) + Util.getTileUniqueId(tileA) in this.walls;
		},
		this.isCrater = function(tile) {
			return Util.getTileUniqueId(tile) in this.craters;
		}
	};

	var map = new GameMap();

	exports.Util = {
		axialToCube : function(tile) {
			var coords = {
				x : tile.i,
				z : tile.j - (tile.i + (tile.i&1)) / 2
			}
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
			return cubeDist = Math.max(Math.abs(startCube.x - destCube.x), Math.abs(startCube.y - destCube.y), Math.abs(startCube.z - destCube.z));
		},
		getTileUniqueId : function(tile) {
			var pad = function(number) {return number < 9 ? "0" + number : number.toString()};
			return pad(tile.i) + pad(tile.j);
		}
	};

	exports.Game = function(options){
		this.map = map;
	};

})(window);
