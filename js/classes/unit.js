
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

    exports.PUnit = function(options) {
        if (options == null) { options = {};}
        this.attack = options.attack || 0;
        this.range = options.range || 0;
        this.defense = options.defense || 0;
        this.premove = options.premove || 0;
        this.postmove = options.postmove || 0;

		this.tile = options.tile || {i : -1, j : -1};
		this.dead = false;
		this.isDisabled = false;
	    this.hasMoved = false;
        this.hasAttacked = false;
    };

	exports.PUnit.prototype.turnReset = function() {
		this.hasMoved = false;
		this.hasAttacked = false;
	};

	exports.PUnit.prototype.noEffect = function() {};
	exports.PUnit.prototype.disable = function() {};
	exports.PUnit.prototype.kill = function() {};
    
    exports.PUnit.prototype.getAttack = function() {
        return this.attack; 
    };

    exports.PUnit.prototype.getDefense = function() {
        return this.defense; 
    };
	
    exports.PUnit.prototype.getRange = function() { 
        return this.range; 
    };

	exports.PUnit.prototype.getPreMovement = function() { 
        return this.premove; 
    };
	exports.PUnit.prototype.getPostMovement = function() { 
        return this.postmove; 
    };

	exports.PUnit.prototype.getTile = function() { 
        return this.tile;
    };

	exports.PUnit.prototype.isValidPreMoveTarget = function(tile) {
        return Util.getDistance(this.getTile(), tile) <= this.getPreMovement();
	};

	exports.PUnit.prototype.isValidPostMoveTarget = function(tile) {
		return Util.getDistance(this.getTile(), tile) <= this.getPostMovement();
	};

	exports.PUnit.prototype.isValidMoveTarget = function(tile) {
		if (this.hasMoved) {
            return this.isValidPostMoveTarget(tile);
		} else {
			return this.isValidPreMoveTarget(tile);
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
            this.tile = tile;
            return true;
        }
        return false;
    };

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
