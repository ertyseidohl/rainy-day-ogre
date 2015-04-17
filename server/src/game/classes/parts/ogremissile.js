/** The grand OgreMissile Part
 */
UnitPart = require('../unitpart').UnitPart;

/**
 * @class OgreMissile
 * @classdesc the long range missile part for Ogre objects
 *  @augments UnitPart
 */
exports.OgreMissile = function(instanceId) {
    var options = {
        instanceId : instanceId,
        type : "ARTILLERY",
        name : "Ogre Missile",
        range : 5,
        attack : 6,
        defense : 3,
    };
    UnitPart.call(this, options);
};

exports.OgreMissile.prototype = Object.create(UnitPart.prototype);
