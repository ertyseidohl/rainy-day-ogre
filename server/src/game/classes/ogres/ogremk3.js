MultiPart = require('../multipart').MultiPart;
/**
 * @class
 * @classdesc the lowly Ogre
 * @augments MultiPart
 */
exports.OgreMk3 = function(instanceId, tile) {

    var options = {
        instanceId : instanceId,
        tile : tile,
        type : "OGRE",
        name : "Ogre Mk III",
        premove : 3,
        id : "ogremk3"
    };
    //missing 8 AntiPersonnel
    parts = [new OgreTreads(30, 10),
             new OgreMissile(),
             new OgrePrimaryBattery(),

             new OgreSecondaryBattery(),
             new OgreSecondaryBattery(),
             new OgreSecondaryBattery(),
             new OgreSecondaryBattery()
             ];

    MultiPart.call(this, parts, options);
};
exports.OgreMk3.prototype = Object.create(MultiPart.prototype);
