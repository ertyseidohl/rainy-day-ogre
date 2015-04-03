/*jshint expr: true*/

units = require('../../js/classes/');

ptests = require('../punit_test.js');

var should = require('should');

exports.MissileTank_Test = function(){
    ptests.PUnit_Test.call();
};

exports.MissileTank_Test.prototype = Object.create(ptests.PUnit_Test.prototype);


describe('MissleTank', function(){

    var tile = {i : 3, j : 2}; 
    var m = new units.MissileTank(tile);

    o = {attack : 3,
        range : 4,
        defense : 2,
        premove : 2,
        postmove : 0,
        tile : tile,
        name : "Missile Tank",
        type : "ARMORED" };

    t = new exports.MissileTank_Test();
    ptests.UnitTestRunner(t, m, o); 

});
