/** 
 * Contains the base unit javascript class prototype PUnit 
 * @author mcverry
 */

// IIFE
// immediately invoked function expression
// things bound to the "exports" variable are global (bound to window),
// everything else is scoped private
;(function(exports){

	var damageTable = [
		["NE", "NE", "NE", "NE", "D", "X"],
		["NE", "NE", "D", "D", "X", "X"],
		["NE", "D", "D", "X", "X", "X"],
		["D", "D", "X", "X", "X", "X"],
		["D", "X", "X", "X", "X", "X"],
        ["X", "X", "X", "X", "X", "X"]
	];


	/**
     * @function Apply a damage roll to a unit
	 * @member of PUnit
     * @static 
     *
     * @desc  this method rolls a 6 sided die to determine the which damage method
     * to be applied to the supplied unit using dmaageTable 
     *
     * @param {PUnit} - the unit to apply the damage roll too
     * @param {int} ratio - the pre-calculated attack to defense ratio
     * @param {function} cb - the ux callback function
     * @returns true
     */
	var doDamage = function(unit, ratio, cb){
		roll = Math.floor((Math.random() * 6));
		switch(damageTable[ratio][roll]) {
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

    /** 
     *  Creates a base PUnit
     *  @class PUnit
     */
    exports.PUnit = function(options) {
        if (options == null) { options = {};}
        /** @member {int} unit's base attack points,
         * access with getAttack() */
        this.attack = options.attack || 0;
        /** @member {int} unit's base range distance,
         * access with getRange() */
        this.range = options.range || 0;
        /** @member {int} unit's base defense points,
         * access with getDefense() */
        this.defense = options.defense || 0;
        /** @member {int} unit's base preattack move distance,
         * access with getPremove() */
        this.premove = options.premove || 0;
        /** @member {int} unit's base postattack move distance,
         * access with getPostmove() */
        this.postmove = options.postmove || 0;

        /** @member {boolean} can the unit pass through walls */ 
        this.passThruWalls = options.passThruWalls || false;
        
        /** @member {String} the unit's name */
        this.name = options.name || "";

        /** the unit's type (THESE ARE NOT WELL DEFINED) 
         * @member {String} 
         * @see getType */
        this.type = options.type || "";

        /** the unit's position, 
         * @member {Tile}
         * @see getTil
         * note that the position object, Tile, can be further abstracted :) */
		this.tile = options.tile || {i : -1, j : -1};

        /** stores if the unit dead (and should be removed)  
         * @member {boolean} 
         * @see isDead */
		this.dead = false;

        /** stores how many turns the unit is disabled for  
         * @member {int} 
         * @see isDisabled */
		this.disabledTurns = 0;
        
        /** how many times hs the unit moved this turn?
         * @member {int} 
         * @see hasMoved
         * @see timesMoved
         * */
	    this.moved = 0;
        
        /** stores if the unit attacked
         * @member {boolean} 
         * @see hasAttacked */
          this.attacked = false;
    };

    /**
     *
     */
	exports.PUnit.prototype.nextTurnReset = function() {
		this.moved = 0;
		this.attacked = false;
        
        if (this.disabledTurns > 0) {
            this.disabledTurns -= 1;
        }
	};

    /*
     * Attack Results
     */
	exports.PUnit.prototype.noEffect = function() {};
	
    /* @function disable
     * @returns {boolean} - false to indicate the unit did not die
     */
    exports.PUnit.prototype.disable = function() {
        return false;
    };

	exports.PUnit.prototype.kill = function() {
        this.dead = true;
        return true;
    };
    
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

    /** @function isDead
     *  @returns {boolean} returns if the unit is dead
     */
    exports.PUnit.prototype.isDead = function() {
        return this.dead;
    }

    /** @function isDisabled
     * @returns {boolean} if the unit is disabled this turn
     */
    exports.PUnit.prototype.isDisabled = function() {
        return (this.disabledTurns > 0);
    }

    /** @function hasAttacked 
     *  @returns {boolean} if the unit has attacked this turn
     */
    exports.PUnit.prototype.hasAttacked = function() {
        return this.attacked;
    }

    /** @function hasMoved 
     *  @returns {int} the number of times it moved this turn 
     */
    exports.PUnit.prototype.hasMoved = function() {
        return this.moved;
    }   

    /** @function getTile
     *  @returns {Tile} the unit's position
     */
	exports.PUnit.prototype.getTile = function() { 
        return this.tile;
    };

    /*
     * Generalized unit selection (enables multipart units to work)
     */
    exports.PUnit.prototype.selectForAttack = function() {
        return [this];
    }

	exports.PUnit.prototype.isValidPreMoveTarget = function(tile) {
        return Util.getDistance(this.getTile(), tile) <= this.getPreMovement();
	};

	exports.PUnit.prototype.isValidPostMoveTarget = function(tile) {
		return Util.getDistance(this.getTile(), tile) <= this.getPostMovement();
	};

	exports.PUnit.prototype.isValidMoveTarget = function(tile) {
		if (this.moved == 1) {
            return this.isValidPostMoveTarget(tile);
		} else if (this.moved == 0) {
			return this.isValidPreMoveTarget(tile);
		}
	};

    exports.PUnit.prototype.canAttack = function(unit){
        return !this.hasAttacked() && this.isValidAttackTarget(unit);
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
            this.moved += 1;
            return true;
        }
        return false;
    };

    //Get the ratio from an array of attacking units against this unit
    exports.PUnit.prototype.getDamageRatio = function(attackerlist) { 
        attackSum = attackerlist.reduce(function(accum, elem, index, array) {
            return accum + elem.getAttack();
        }, 0);
        def = this.getDefense();
        ratio = Math.floor(attackSum / this.getDefense());
        if (ratio > 5) {ratio = 5;}
        return ratio; 
    };

    //do damage to unit
    exports.PUnit.prototype.takeDamage = function(attackerlist, cb ) {
        ratio = this.getDamageRatio(attackerlist);
        return doDamage(this, ratio, cb);
    };


})(window);
