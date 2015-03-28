;(function(exports) {

    /**
     * @class OgreMissile
     * @classdesc the long range missile part for Ogre objects
     *  @augments UnitPart
     */
    exports.OgreAntipersonnel = function() {
        var options = {
            type : "ANTIPERSONNEL",
            name : "Ogre Antipersonnel",
            range : 1,
            attack : 1,
            defense : 1,
        };
        exports.UnitPart.call(this, options);
    };

    exports.OgreMissile.prototype = Object.create(exports.UnitPart.prototype);

    exports.OgreAntipersonnel.protoytpe.isValidTarget = function(target) {
        return target.type === "INFANTRY";
    };

})(window);
