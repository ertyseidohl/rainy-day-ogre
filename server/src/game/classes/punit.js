/**
 * Contains the base unit javascript class prototype PUnit
 * @author mcverry
 */
require('util');
var maps = require('../map.js');
var damageTable = [
    ["NE", "NE", "NE", "NE", "D", "X"],
    ["NE", "NE", "D", "D", "X", "X"],
    ["NE", "D", "D", "X", "X", "X"],
    ["D", "D", "X", "X", "X", "X"],
    ["D", "X", "X", "X", "X", "X"],
    ["X", "X", "X", "X", "X", "X"]
];

/**
 * @memberof PUnit
 * @static
 *
 * @desc  this method rolls a 6 sided die to determine the which damage method
 * to be applied to the supplied unit using dmaageTable
 *
 * @param {PUnit} unit - the unit to apply the damage roll too
 * @param {int} ratio - the pre-calculated attack to defense ratio
 * @param {function} cb - the ux callback function
 * @returns {boolean}  true
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
 *  Creates a base PUnit by passing in an options object
 *  @class PUnit
 *  @classdesc  The PUnit is the base class of all units.
 *  units should subclass PUnit and override its public methods
 *  to produce desired functionality
 */
exports.PUnit = function(options) {
    if (options === null || options === undefined) { options = {};}

    this.instanceId = options.instanceId || -1;

    this.attack = options.attack || 0;
    this.range = options.range || 0;
    this.defense = options.defense || 0;
    this.premove = options.premove || 0;
    this.postmove = options.postmove || 0;
    this.passThruWalls = options.passThruWalls || false;

    this.name = options.name || "";
    this.type = options.type || "";
    this.tile = options.tile || {i : -1, j : -1};

    this.dead = false;
    // how many turn starts the unit is disabled for
    this.disabledTurns = 0;
    // how many times hs the unit moved this turn?
    this.moved = 0;
    // has the unit attacked?
    this.attacked = false;
};

/**
 *  Private method for reseting the unit at the start of
 *  its owners turn
 */
exports.PUnit.prototype.nextTurnReset = function() {
    this.moved = 0;
    this.attacked = false;

    if (this.disabledTurns > 0) {
        this.disabledTurns -= 1;
    }
};



/**
 *  Get the unit's name
 */
exports.PUnit.prototype.getName = function() {
    return this.name;
};

/**
 * Get the unit's type
 */
exports.PUnit.prototype.getType = function() {
    return this.type;
};

/*
 * Attack Effects
 */

/**
 *  This method should be overrided by subclasses to
 *  execute a noeffect attack result on this unit
 */
exports.PUnit.prototype.noEffect = function() {};

/**
 * The default behavior of a disable is to the disabledTurns to 2
 * which means the unit will be active again after 2 start of the
 * army's turns.
 * this method should be overrided by subclasses to modify
 * the behavior of a disable attack result.
 * @returns {boolean} - false to indicate the unit did not die
 *                      true if the unit did die
 */
exports.PUnit.prototype.disable = function() {
    this.disabledTurns = 2;
    return false;
};

/**
 * The default behavior of a kill attack effect is to mark
 * the unit as dead to be removed from the army at the end
 * of the turn
 * this method should be overrided by subclasses to modify
 * the behavior of a kill attack result.
 * @returns {boolean} - true to indicate the unit did die,
 *                      false otherwise
 */
exports.PUnit.prototype.kill = function() {
    this.dead = true;
    return true;
};

/**
 *  Get the attack strength of the unit
 *  @returns {int} - the attack points for this unit
 */
exports.PUnit.prototype.getAttack = function() {
    return this.attack;
};

/**
 * Get the defense strength of the unit
 * @returns {int} - the defense points for this unit
 */
exports.PUnit.prototype.getDefense = function() {
    return this.defense;
};

/**
 * Get the range for this unit
 * @returns {int} - number of tiles unit can attack
 */
exports.PUnit.prototype.getRange = function() {
    return this.range;
};

/**
 * Get the move distance prior to an attack
 * @returns {int} spaces to move before an attack
 */
exports.PUnit.prototype.getPreMovement = function() {
    return this.premove;
};

/**
 * Get the move distance after the unit attack's
 * @returns {int} spaces to move after an attack
 */
exports.PUnit.prototype.getPostMovement = function() {
    return this.postmove;
};

/**
 *  Get how many times the unit has moved this turn
 *  @returns {int} the number of times it moved this turn
 */
exports.PUnit.prototype.hasMoved = function() {
    return this.moved;
};

/**
 *  Get whether or not the unit is dead
 *  @returns {boolean} true if the unit is dead
 */
exports.PUnit.prototype.isDead = function() {
    return this.dead;
};

/**
 * Get whether of not the unit is disabled
 * @returns {boolean} true if the unit is disabled
 */
exports.PUnit.prototype.isDisabled = function() {
    return (this.disabledTurns > 0);
};

/**
 *  Get whether or not the unit has attacked this turn.
 *  @returns {boolean} ture if the unit has attacked this turn
 */
exports.PUnit.prototype.hasAttacked = function() {
    return this.attacked;
};

/**
 *  Get the unit's position
 *  @returns {Tile} the unit's position
 */
exports.PUnit.prototype.getTile = function() {
    return this.tile;
};

/**
 * Generalized unit selection (enables multipart units to work)
 * @returns {PUnit[]} [this]
 */
exports.PUnit.prototype.selectForAttack = function() {
    return [this];
};

/**
 *  Is the the tile within the range of the unit's premove distance.
 *  @param {Tile} tile - target tile to test
 *  @returns {boolean} - true if the tile is within range, false otherwise
 */
exports.PUnit.prototype.isValidPreMoveTarget = function(tile) {
    return maps.Util.getDistance(this.getTile(), tile) <= this.getPreMovement();
};

/**
 *  Is the the tile within the range of the unit's postmove distance.
 *  @param {Tile} tile - target tile to test
 *  @returns {boolean} - true if the tile is within range, false otherwise
 */
exports.PUnit.prototype.isValidPostMoveTarget = function(tile) {
    return maps.Util.getDistance(this.getTile(), tile) <= this.getPostMovement();
};

/**
 * Is the tile a valid move target, given the number of times the unit
 * has moved this turn. For PUnits, this method will return False after
 * the unit has moved once
 * @param {Tile} tile - target tile to test
 * @returns {boolean} - true if the the tile is within range
 */
exports.PUnit.prototype.isValidMoveTarget = function(tile) {
    if (this.moved == 1) {
        return this.isValidPostMoveTarget(tile);
    } else if (this.moved === 0) {
        return this.isValidPreMoveTarget(tile);
    }
};

/**
 * Move the unit to a new position, if the tile is within range
 * This method mutates the state of the unit
 * @param {Tile} tile - the tile to move to
 * @returns {Boolean} - was the move successful?
 */
exports.PUnit.prototype.moveToTile = function(tile) {
    if (this.isValidMoveTarget(tile)){
        this.tile = tile;
        this.moved += 1;
        return true;
    }
    return false;
};

/**
 *  can this unit attack the target unit?
 *  this method takes into account whether or not the unit has
 *  already attacked this turn
 *  @param {Unit} unit - the target unit
 *  @returns {boolean} true if we can attack the unit, false otherwise
 */
exports.PUnit.prototype.canAttack = function(unit){
    return !this.hasAttacked() && this.isValidAttackTarget(unit);
};

exports.PUnit.prototype.canAttackVerbose = function(unit){
    var result = null;

    if (this.hasAttacked()){
        return [false, {error: 'unit ' + this.instanceId + ' has already attacked', code : "UnitAlreadyAttacked"}];
    }

    result = this.isValidAttackTarget(unit);
    if (!result[0]){
        result[1].causes = {error: 'unit ' + this.instanceId + ' may not attack unit ' + unit.instanceId, code : "BadOperation"};
        return [false, result[1]];
    }
    
    return [true, {code: 'success'}];
};

/**
 *  is the target unit or tile within this unit's attack range?
 *  this method does not take into account whether this unit has attacked
 *  @param {Unit | Tile} unitOrTile - a target unit or tile.
 *  @returns {boolean} - true if the unit or tile is within range
 */
exports.PUnit.prototype.isValidAttackTarget = function(unitOrTile) {
    var tile = null;
    var d = 0;
    var result = null;
    
    try{
        tile = unitOrTile.getTile();
    } catch (e) {
        if (e instanceof TypeError) {
            tile = unitOrTile;
        }
    }

    d = maps.Util.getDistance(this.getTile(), tile); 
    result = (d <= this.getRange());
    if (result) {
        return [true, {code: 'success'}];
    } else {
        e = util.format("unit %d with range %d at %j can not target tile %j. distance %d", 
                this.instanceId, this.getRange(), this.getTile(), tile, d);
        return [false, {error: e, code: 'OutOfRange'}];
    }
};

/**
 * Get the ratio from an array of attacking units against this unit
 * @param {Unit[]} attackerlist - a list of attackers
 * @returns {int} the ratio
 */
exports.PUnit.prototype.getDamageRatio = function(attackerlist) {
    attackSum = attackerlist.reduce(function(accum, elem, index, array) {
        return accum + elem.getAttack();
    }, 0);
    def = this.getDefense();
    ratio = Math.floor(attackSum / this.getDefense());
    if (ratio > 5) {ratio = 5;}
    return ratio;
};

/**
 *  Attack with a list of attacking units and then apply the resulting damage ratio
 *  and resulting attack effect to the unit
 *  @param {Unit[]} attackerlist - the list of attackers
 *  @param {function()} a ux callback function
 *  @returns {boolean} if the attack was successfully applied to this unit
 */
exports.PUnit.prototype.takeDamage = function(attackerlist, cb ) {
    ratio = this.getDamageRatio(attackerlist);
    return doDamage(this, ratio, cb);
};
