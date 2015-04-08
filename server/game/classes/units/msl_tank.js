// The Missile Tank!
//
PUnit = require('../punit.js').PUnit;

exports.MissileTank = function(instanceId, tile) {
    PUnit.call(this, {
        attack : 3,
        range : 4,
        defense : 2,
        premove : 2,
        instanceId : instanceId,
        tile : tile,
        name : "Missile Tank",
        type : "ARMORED"
    }); //call superconstructor
};

exports.MissileTank.prototype = Object.create(PUnit.prototype);

