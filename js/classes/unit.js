
// IIFE
// immediately invoked function expression
//
// things bound to exports are global (bound to window),
// everything else is scoped private
//
// appends
;(function(exports){

	var damageTable = [
		["NE", "NE", "NE", "NE", "D", "X"],
		["NE", "NE", "D", "D", "X", "X"],
		["NE", "D", "D", "X", "X", "X"],
		["D", "D", "X", "X", "X", "X"],
		["D", "X", "X", "X", "X", "X"],
	];

	/* Applies damage to a unit,
	 * cb is ux callback function
	 */
	var doDamage = function(unit, attack, cb){

		roll = Math.floor((Math.random() * 6));

		switch(damageTable[attack][roll]) {
			case "NE":
				unit.noEffect();
				cb("NE");
				break;
			case "D":
				unit.disable();
				cb("D");
				break;
			case "X":
				unit.kill();
				cb("X");
				break;
		}

		return true;
	};

    exports.PUnit = function() {
		this.tile = {i : -1, j : -1};
		this.dead = false;
		this.isDisabled = false;
		this.turnReset();
	};

	exports.PUnit.prototype.turnReset = function() {
		this.hasMoved = false;
		this.hasAttacked = false;
	};

	exports.PUnit.prototype.noEffect = function() {};
	exports.PUnit.prototype.disable = function() {};
	exports.PUnit.prototype.kill = function() {};
    
    //pretty sure these can simply be getters
    exports.PUnit.prototype.getAttack = function() { return 0; };
    exports.PUnit.prototype.getDefense = function() { return 0; };
	exports.PUnit.prototype.getRange = function() { return 0; };
	exports.PUnit.prototype.getPreMovement = function() { return 0; };
	exports.PUnit.prototype.getPostMovement = function() { return 0; };

	exports.PUnit.prototype.getTile = function() { return {i : -1, j : -1};};

	exports.PUnit.prototype.isValidPreMoveTarget = function(tile) {
		return Util.getDistance(this.getTile(), tile) <= this.getPreMovement();
	};

	exports.PUnit.prototype.isValidPostMoveTarget = function(tile) {
		return Util.getDistance(this.getTile(), tile) <= this.getPostMovement();
	};

	exports.PUnit.prototype.isValidMoveTarget = function(tile) {
		if (this.hasMoved) {
            return this.isValidPostMoveTarget();
		} else {
			return this.isValidPreMoveTarget();
		}
	};

	exports.PUnit.prototype.isValidAttackTarget = function(unitOrTile) {
        var tile = null;
        try{
            tile = unitOrTile.getTile();
        } catch (e)
        {
            if (e instanceof TypeError) {
                tile = unitOrTile;
            }
        }
        return Util.getDistance(this.getTile(), tile) <= this.getRange();
    };

    exports.PUnit.prototype.moveToTile = function(tile) {
        if (this.isValidMoveTarget(tile)){
            setTile(tile);
            return true;
        }
        return false;
    };

    exports.PUnit.prototype.setTile = function(tile) { return false;};

    exports.PUnit.prototype.takeDamage = function(attackerlist, cb ) {

        attack = attackerlist.reduce(function(accum, elem, index, array) {
            return accum + elem.getAttack();
        });

        def = this.getDefense();

        attack = Math.floor(attack / defense);
        if (attack > 5) { attack = 5;}
        doDamage(this, attack, cb);
    };


})(window);
