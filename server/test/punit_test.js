/*jshint expr: true*/ 
//temporary scoping hack
window = {};
require('../js/game.js');
Util = window.Util;

units = require('../js/classes/');

var should = require('should');

//common tests
gtests = require('./getters_test.js');

exports.PUnit_Test = function(){};


function shouldreturn(str){
    return "should return ".concat(str);
}


exports.PUnit_Test.prototype.getName_test = function(p, e){
    return function() {
        it(shouldreturn(e.name), function() {
            (p.getName()).should.be.exactly(e.name);
        });
    };
};

exports.PUnit_Test.prototype.hasMoved_test = function(p){
    return function() {
        it('should return 0 (for moving zero times)', function() {
            (p.hasMoved()).should.be.exactly(0).and.be.a.Number;
        });
    };
};

exports.PUnit_Test.prototype.isDead_test = function(p) {
    return function() {
        it('should return false', function() {
            (p.isDead()).should.be.exactly(false).and.be.a.Boolean;
        });
    };
};

exports.PUnit_Test.prototype.isDisabled_test = function(p) {
    return function() {
        it('should return false', function() {
            (p.isDisabled()).should.be.exactly(false).and.be.a.Boolean;
        });
    };
};

exports.PUnit_Test.prototype.hasAttacked_test = function(p) {
    
    return function() {
        it('should return false', function() {
            (p.hasAttacked()).should.be.exactly(false).and.be.a.Boolean;
        });
    };
};



exports.PUnit_Test.prototype.getTile_test = function(p) {
    
    return function() {
        it('should return false', function() {
            var t = p.getTile();
            (t).should.have.property('i', 5);
            (t).should.have.property('j', 6);
        });
    };
};

exports.UnitTestRunner = function(tests, unit, expected_stats){
    
    describe('#getName()', tests.getName_test(unit, expected_stats));

    describe('#hasMoved()', tests.hasMoved_test(unit)); 
    describe('#isDead()', tests.isDead_test(unit)); 
    describe('#isDisabled()', tests.isDisabled_test(unit)); 
    describe('#hasAttacked()', tests.hasAttacked_test(unit));
    describe('#getTile()', tests.getTile_test(unit));
};

describe('PUnit', function() {
    var o = {
        attack : 1,
        range : 1,
        defense : 1,
        premove : 1,
        postmove : 2,
        passThruWalls : true,
        name : "test",
        type : "tester",
        tile : {i : 5, j : 6}
    };

    var p = new PUnit(o);

    //run tests on getters
    describe('#getters', gtests.test_getters(p, o));  

    t = new exports.PUnit_Test();
    exports.UnitTestRunner(t, p, o);
    describe('#selectForAttack()', function() {
        it('should return [p]', function() {
            var a = p.selectForAttack();
            (a).should.be.an.instanceof(Array).and.have.lengthOf(1);
            (a[0]).should.be.an.instanceof(units.PUnit);
            (a[0]).should.be.exactly(p);
        });
    });

    //premovement of 1
    describe('#isValidPreMoveTarget()', function() {
        it('should return true', function() {
           (p.isValidPreMoveTarget({i : 6, j : 6})).should.be.exactly(true);
           (p.isValidPreMoveTarget({i : 4, j : 6})).should.be.exactly(true);
           (p.isValidPreMoveTarget({i : 5, j : 7})).should.be.exactly(true);
           (p.isValidPreMoveTarget({i : 5, j : 5})).should.be.exactly(true);
           (p.isValidPreMoveTarget({i : 4, j : 5})).should.be.exactly(true);
           (p.isValidPreMoveTarget({i : 6, j : 5})).should.be.exactly(true);
        });
        it('should return false', function() {
           (p.isValidPreMoveTarget({i : 6, j : 7})).should.be.exactly(false);
           (p.isValidPreMoveTarget({i : 4, j : 7})).should.be.exactly(false);
           
           (p.isValidPreMoveTarget({i : 50, j : 7})).should.be.exactly(false);
           (p.isValidPreMoveTarget({i : 5, j : 50})).should.be.exactly(false);
           (p.isValidPreMoveTarget({i : 0, j : 5})).should.be.exactly(false);
           (p.isValidPreMoveTarget({i : 6, j : 0})).should.be.exactly(false);
        });
    });

    //post movement of 2
    describe('#isValidPostMoveTarget()', function() {
        it('should return true', function() {
            (p.isValidPostMoveTarget({i : 6, j : 6})).should.be.exactly(true);
            (p.isValidPostMoveTarget({i : 4, j : 6})).should.be.exactly(true);
            (p.isValidPostMoveTarget({i : 5, j : 7})).should.be.exactly(true);
            (p.isValidPostMoveTarget({i : 5, j : 5})).should.be.exactly(true);
            (p.isValidPostMoveTarget({i : 4, j : 5})).should.be.exactly(true);
            (p.isValidPostMoveTarget({i : 6, j : 5})).should.be.exactly(true);
            
            (p.isValidPostMoveTarget({i : 6, j : 7})).should.be.exactly(true);
            (p.isValidPostMoveTarget({i : 4, j : 7})).should.be.exactly(true);
        });
        it('should return false', function() {
            (p.isValidPostMoveTarget({i : 6, j : 8})).should.be.exactly(false);
            (p.isValidPostMoveTarget({i : 4, j : 8})).should.be.exactly(false);
            
            (p.isValidPostMoveTarget({i : 50, j : 7})).should.be.exactly(false);
            (p.isValidPostMoveTarget({i : 5, j : 50})).should.be.exactly(false);
            (p.isValidPostMoveTarget({i : 0, j : 5})).should.be.exactly(false);
            (p.isValidPostMoveTarget({i : 6, j : 0})).should.be.exactly(false);
        });
    });

    var e1 = new units.PUnit({tile : {i:6, j:6}});
    var e2 = new units.PUnit({tile : {i:6, j:8}});
    describe('#isValidAttackTarget', function() {
        it('with tile should return true', function() {
            (p.isValidAttackTarget({i:6,j:6})).should.be.exactly(true);
        });
        it('with tile should return false', function() {
            (p.isValidAttackTarget({i:6,j:8})).should.be.exactly(false);
        });

        it('with unit should return true', function() {
            (p.isValidAttackTarget(e1)).should.be.exactly(true);
        });
        it('with unit should return false', function() {
            (p.isValidAttackTarget(e2)).should.be.exactly(false);
        });
    });

});
