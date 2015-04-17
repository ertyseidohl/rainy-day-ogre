PUnit = require('./punit').PUnit;
/**
 *  @class
 *  @classdesc A unit weapon or tread (for Ogres!)
 */
exports.UnitPart = function(options) {
    this.owner = null;
    PUnit.call(this, options);
};

exports.UnitPart.prototype = Object.create(PUnit.prototype);

/**
* @param {PUnit} target The target you are trying to attack
* @return {boolean} the target is valid
*/
exports.UnitPart.isValidTarget = function(target) {
    return true;
};

exports.UnitPart.prototype.assignToOwner = function(owner) {
    this.owner = owner;
};

exports.UnitPart.prototype.getTile = function() {
    if (this.owner === null) {
        return {i: -1, j : -1};
    }
    return this.owner.getTile();
};

exports.UnitPart.prototype.kill = function() {
    this.owner.partDestroy(this);
};
