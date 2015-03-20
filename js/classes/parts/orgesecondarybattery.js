;(function(exports) {

    exports.OrgeSecondaryBattery = function() {
        var options = {
            type : "ORGE SECONDARY",
            name : "Orge Secondary Battery",
            range : 2,
            attack : 3,
            defense : 3,
        };
        exports.UnitPart.call(this, options);
    };

    exports.OrgeSecondaryBattery.prototype = Object.create(exports.UnitPart.prototype);
    exports.OrgeSecondaryBattery.constructor = exports.OrgeSecondaryBattery;

})(window);
