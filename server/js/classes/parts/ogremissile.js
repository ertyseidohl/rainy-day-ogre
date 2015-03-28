;(function(exports) {

    /**
     * @class OgreMissile
     * @classdesc the long range missile part for Ogre objects
     *  @augments UnitPart
     */
    exports.OgreMissile = function() {
        var options = {
            type : "ARTILLERY",
            name : "Ogre Missile",
            range : 5,
            attack : 6,
            defense : 3,
        };
        exports.UnitPart.call(this, options);
    };

    exports.OgreMissile.prototype = Object.create(exports.UnitPart.prototype);
    exports.OgreMissile.constructor = exports.OgreMissile;

})(window);
