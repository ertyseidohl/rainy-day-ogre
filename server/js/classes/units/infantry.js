/*
 * Basic Infantry
 */
PUnit = require('../punit.js').PUnit;

exports.Infantry = function(tile, strength) {
    if (strength > 3) {
        strength = 3;
    } else if (strength < 1) {
        strength = 1;
    }

    PUnit.call(this, {
        attack : strength,
        range : 1,
        defense : strength,
        premove: 2,
        name : "Infantry " + strength,
        tile : tile,
        type : "INFANTRY",
        passThruWalls : true
    });
};

exports.Infantry.prototype = Object.create(PUnit.prototype);

exports.Infantry.prototype.disable = function(){
    this.attack -= 1;
    this.defense -= 1;
    this.name = "Infantry " + this.attack;
    this.disabledTurns = 2;
    if (this.attack === 0) {
        this.kill();
        return true;
    }
    return false;
};
