/*jshint expr: true*/
require('should');
//require the units
var units = require('../../../game/classes/');
//require the parent unit_test
var ptests = require('../punit_test.js');

//Create the new test object,
//note new or overriden tests extend this object's prototype
exports.Infantry_Test = function(){
    ptests.PUnit_Test.call();
};
exports.Infantry_Test.prototype = Object.create(ptests.PUnit_Test.prototype);

exports.Infantry_Test.prototype.disable_test = function(unit, expected){
   
    it('disabled off turn?', function() {
        unit.disable();
        (unit.isDisabled()).should.be.exactly(true);  
        (unit.getAttack()).should.be.exactly(2).and.be.a.Number;
    });
};


exports.Infantry_Test.prototype.newUnit = function(stats) {
    return new units.Infantry(stats.tile, stats.attack);
};

//Test entry point
describe('Infantry', function(){
    var tile = {i : 3, j : 2}; 
    var o = {attack : 3,
        range : 1,
        defense : 3,
        premove : 2,
        postmove : 0,
        tile : tile,
        name : "Infantry 3",
        type : "INFANTRY" };
 
    var t = new exports.Infantry_Test();
    ptests.UnitTestRunner(t, o); 

    var m = new units.Infantry(tile, 3);
    describe('create a too strong unit', function() {
        var m2 = new units.Infantry(tile, 4);
        it('should return 3', function(){
            (m2.getAttack()).should.be.exactly(3).and.be.a.Number;
            (m2.getDefense()).should.be.exactly(3).and.be.a.Number;
        });
    });

    describe('create a too weak unit', function() {
        var m2 = new units.Infantry(tile, -1);
        it('should return 1', function(){
            (m2.getAttack()).should.be.exactly(1).and.be.a.Number;
            (m2.getDefense()).should.be.exactly(1).and.be.a.Number;
        });
    });

});
