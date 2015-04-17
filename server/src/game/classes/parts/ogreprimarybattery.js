/** The grand Primary Battery Part of the ogre
 */
UnitPart = require('../unitpart').UnitPart;

/**
 *  @class
 *  @classdesc the primary battery for Ogre's
 *  @augments UnitPart
 */
exports.OgrePrimaryBattery = function(instanceId) {
    var options = {
        instanceId : instanceId,
        type : "PRIMARY",
        name : "Ogre Primary Battery",
        range : 4,
        attack : 3,
        defense : 3,
    };
    UnitPart.call(this, options);
};

exports.OgrePrimaryBattery.prototype = Object.create(UnitPart.prototype);

