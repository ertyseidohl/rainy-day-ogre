// The Missile Tank!
//
;(function(exports){
    exports.MissileTank = function(tile) {
        exports.PUnit.call(this, {
            attack : 3,
            range : 4,
            defense : 2,
            premove : 2,
            tile : tile,
            name : "Missile Tank",
            type : "ARMORED"
        }); //call superconstructor
    };

    exports.MissileTank.prototype = Object.create(exports.PUnit.prototype);

})(window);
