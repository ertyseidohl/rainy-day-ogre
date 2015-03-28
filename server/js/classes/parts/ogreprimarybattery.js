;(function(exports) {

    /**
     *  @class
     *  @classdesc the primary battery for Ogre's
     *  @augments UnitPart
     */
    exports.OgrePrimaryBattery = function() {
        var options = {
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
