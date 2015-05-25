/*jshint expr: true*/
require('should');
//require the units
var units = require('../../../src/game/classes/');
//require the parent unit_test
var ptests = require('../punit_test.js');

//Create the new test object,
//note new or overriden tests extend this object's prototype
exports.OgreMk3_Test = function(){
    ptests.PUnit_Test.call();
};
exports.OgreMk3_Test.prototype = Object.create(ptests.PUnit_Test.prototype);

exports.OgreMk3_Test.prototype.newUnit = function(stats) {
    return new units.OgreMk3(10, stats.tile);
};

//Test entry point
describe('OgreMk3', function(){
    var tile = {i : 3, j : 2};
    var o = {attack : 0,
        range : 0,
        defense : 0,
        premove : 3,
        postmove : 0,
        tile : tile,
        name : "Ogre Mk III",
        type : "OGRE"
    };

    var t = new exports.OgreMk3_Test();
    ptests.UnitTestRunner(t, o);

    var m = new units.OgreMk3(tile, 3);
});
