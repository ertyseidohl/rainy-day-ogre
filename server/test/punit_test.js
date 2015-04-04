/*jshint expr: true, loopfunc: true*/ 
//temporary scoping hack
window = {};
require('../js/game.js');
Util = window.Util;

var units = require('../js/classes/');
var should = require('should');

//base PUnit Object
exports.PUnit_Test = function(){};

function shouldreturn(prefix, str){
    return prefix + "should return " +str;
}


//Stats
exports.PUnit_Test.prototype.testStats = function(p, e){
    it(shouldreturn("name: ", e.name), function() {
        (p.getName()).should.be.exactly(e.name);
    });
    it(shouldreturn("type: ",e.type), function() {
        (p.getType()).should.be.exactly(e.type);
    });
    it(shouldreturn("attack: ",e.attack), function() {
        (p.getAttack()).should.be.exactly(e.attack).and.be.a.Number;
    });
    it(shouldreturn("range: ", e.range), function() {
        (p.getRange()).should.be.exactly(e.range).and.be.a.Number;
    });
    it(shouldreturn("defense: ", e.defense), function() {     
        (p.getDefense()).should.be.exactly(e.defense).and.be.a.Number;
    });
    it(shouldreturn("premove: ", e.premove), function() {
        (p.getPreMovement()).should.be.exactly(e.premove).and.be.a.Number;
    });
    it(shouldreturn("postmove: ", e.postmove), function() {
        (p.getPostMovement()).should.be.exactly(e.postmove).and.be.a.Number;
    });
};

// State
exports.PUnit_Test.prototype.testState = function(p, s) {
    it(shouldreturn('moves: ', s.moves), function() {
        (p.hasMoved()).should.be.exactly(s.moves).and.be.a.Number;
    });
    it(shouldreturn('dead: ', s.dead), function(){
        (p.isDead()).should.be.exactly(s.dead).and.be.a.Boolean;
    });
    it(shouldreturn('disabled: ', s.disabled), function() {
        (p.isDisabled()).should.be.exactly(s.disabled).and.be.a.Boolean;
    }); 
    it(shouldreturn('hasattacked: ', s.attacked), function() {
        (p.hasAttacked()).should.be.exactly(s.attacked).and.be.a.Boolean;
    });
};

//Location
exports.PUnit_Test.prototype.testLocation = function(p, e) {
    var t = p.getTile();
    for (var key in e) {
        it(shouldreturn('tile.' + key +': ', e[key]), function() {
            (t).should.have.property(key, e[key]);
        });
    }
};

exports.PUnit_Test.prototype.disable_test = function(p, e) {
    p.disable();
};

exports.PUnit_Test.prototype.newUnit = function(p) {
    return new PUnit(p);
};

exports.UnitTestRunner = function(tests, expected_stats){ 
    
    describe('stats', function(){
        var unit = tests.newUnit(expected_stats);
        tests.testStats(unit, expected_stats);
    });
    describe('location', function() {
        var unit = tests.newUnit(expected_stats);
        tests.testLocation(unit, expected_stats.tile);
    });

    expected_state = {
        disabled : false,
        dead : false,
        moves : 0,
        attacked : false
    };
    describe('state', function() {
        var unit = tests.newUnit(expected_stats);
        tests.testState(unit, expected_state);
    });
    
    describe('#disable()', function() {
        var unit = tests.newUnit(expected_stats);
        //tests.disable_test(unit, expected_state);
        unit.disable();
        it('disabled off turn?', function() {
            debugger;
            (unit.isDisabled()).should.be.exactly(true);  
        });
        unit.nextTurnReset();
        it('disabled on next turn?', function() {
            (unit.isDisabled()).should.be.exactly(true);
        });
        unit.nextTurnReset();
        it('disabled on 2nd turn?', function() {
            (unit.isDisabled()).should.be.exactly(false);  
        });
    });
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

    t = new exports.PUnit_Test();
    exports.UnitTestRunner(t, o);
/*
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
*/
});
