;(function(exports) {

    exports.OrgeMissile = function() {
        var options = {
            type : "ORGE MISSILE",
            name : "Orge Missile",
            range : 5,
            attack : 6,
            defense : 3,
        };
        exports.UnitPart.call(this, options);
    };

    exports.OrgeMissile.prototype = Object.create(exports.UnitPart.prototype);
    exports.OrgeMissile.constructor = exports.OrgeMissile;

})(window);
