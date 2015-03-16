

;(function(exports){


    exports.MissileTank = function() {
        exports.PUnit.call(this); //call superconstructor
    };

    exports.MissileTank.prototype = Object.create(exports.PUnit.prototype);
    exports.MissileTank.constructor = exports.MissleTank;

    exports.MissileTank.prototype.getAttack = function(){
        return 3;
    };

    exports.MissileTank.prototype.getRange = function() {
        return 4;
    };

    exports.MissileTank.prototype.getDefense = function() {
        return 2;
    };

    exports.MissileTank.prototype.getPreMovement = function() {
        return 2;
    };

    exports.MissileTank.prototype.getPostMovement = function(){
        return 0;
    };

})(window);
