MultiPart = require('../multipart').MultiPart;
Parts = require('../parts');
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
    parts = [new Parts.OgreTreads(30, 10),
             new Parts.OgreMissile(),
             new Parts.OgrePrimaryBattery(),

             new Parts.OgreSecondaryBattery(),
             new Parts.OgreSecondaryBattery(),
             new Parts.OgreSecondaryBattery(),
             new Parts.OgreSecondaryBattery()
             ];

    MultiPart.call(this, parts, options);
};
exports.OgreMk3.prototype = Object.create(MultiPart.prototype);
