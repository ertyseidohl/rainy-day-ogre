;(function(exports){
   
    /**
     * @class
     * @classdesc the lowly Ogre 
     * @augments MultiPart
     */
    exports.OgreMk3 = function(tile) {

        var options = {
            tile : tile,
            type : "OGRE",
            name : "Ogre Mach III",
            premove : 3
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
       
        exports.MultiPart.call(this, parts, options);
    };

    exports.OgreMk3.prototype = Object.create(exports.MultiPart.prototype);
    exports.OgreMk3.constructor = exports.OgreMk3;

})(window);
