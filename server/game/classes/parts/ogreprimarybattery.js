;(function(exports) {

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
        exports.UnitPart.call(this, options);
    };

    exports.OgrePrimaryBattery.prototype = Object.create(exports.UnitPart.prototype);

})(window);
