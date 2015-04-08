/*jshint expr: true*/
require('should');
//require the units
units = require('../../../game/classes/');
//require the parent unit_test
ptests = require('../punit_test.js');

//Create the new test object,
//note new or overriden tests extend this object's prototype
exports.MissileTank_Test = function(){
    ptests.PUnit_Test.call(this);
};
exports.MissileTank_Test.prototype = Object.create(ptests.PUnit_Test.prototype);

exports.MissileTank_Test.prototype.newUnit = function(stats){
    return new units.MissileTank(stats.tile);
};

//Test entry point
describe('MissleTank', function(){
    var tile = {i : 3, j : 2}; 
    var m = new units.MissileTank(tile);
    var o = {attack : 3,
        range : 4,
        defense : 2,
        premove : 2,
        postmove : 0,
        tile : tile,
        name : "Missile Tank",
        type : "ARMORED" };
    var t = new exports.MissileTank_Test();
    ptests.UnitTestRunner(t, o); 
});
