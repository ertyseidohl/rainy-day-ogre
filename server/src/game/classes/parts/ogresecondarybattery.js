;(function(exports) {

    /**
     * @class
     * @classdesc the secondary battery for Ogre units
     * @augments UnitPart
     */
    exports.OgreSecondaryBattery = function(instanceId) {
        var options = {
            instanceId : instanceId,
            type : "SECONDARY",
            name : "Ogre Secondary Battery",
            range : 2,
            attack : 3,
            defense : 3,
        };
        exports.UnitPart.call(this, options);
    };

    exports.OgreSecondaryBattery.prototype = Object.create(exports.UnitPart.prototype);

})(window);
