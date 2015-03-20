;(function(exports) {

    exports.OrgePrimaryBattery = function() {
        var options = {
            type : "ORGE PRIMARY",
            name : "Orge Primary Battery",
            range : 4,
            attack : 3,
            defense : 3,
        };
        exports.UnitPart.call(this, options);
    };

    exports.OrgePrimaryBattery.prototype = Object.create(exports.UnitPart.prototype);
    exports.OrgePrimaryBattery.constructor = exports.OrgePrimaryBattery;

})(window);
