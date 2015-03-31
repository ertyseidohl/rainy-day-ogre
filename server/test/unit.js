window = {};

//temporary scoping hack
require('../js/game.js');
Util = window.Util;

require('../js/classes/unit.js');
var should = require('should');

describe('PUnit', function() {
    var p = new window.PUnit({
        attack : 1,
        range : 1,
        defense : 1,
        premove : 1,
        postmove : 2,
        passThruWalls : true,
        name : "test",
        type : "tester",
        tile : {i : 5, j : 6},
    });

    describe('#getName()', function() {
        it('should return test', function() {
            (p.getName()).should.be.exactly('test');
        })
    })

    describe('#getType()', function() {
        it('should return tester', function() {
            (p.getType()).should.be.exactly('tester');
        })
    })

    describe('#getAttack()', function() {
        it('should return 1', function() {
            (p.getAttack()).should.be.exactly(1).and.be.a.Number;
        })
    })

    describe('#getRange()', function() {
        it('should return 1', function() {
            (p.getRange()).should.be.exactly(1).and.be.a.Number;
        })
    })

    describe('#getDefense()', function() {
        it('should return 1', function() {
            (p.getDefense()).should.be.exactly(1).and.be.a.Number;
        })
    })

    describe('#getPreMovement()', function() {
        it('should return 1', function() {
            (p.getPreMovement()).should.be.exactly(1).and.be.a.Number;
        })
    })

    describe('#getPostMovement()', function() {
        it('should return 2', function() {
            (p.getPostMovement()).should.be.exactly(2).and.be.a.Number;
        })
    })


    describe('#hasMoved()', function() {
        it('should return 0 (for moving zero times)', function() {
            (p.hasMoved()).should.be.exactly(0).and.be.a.Number;
        })
    })

    describe('#isDead()', function() {
        it('should return false', function() {
            (p.isDead()).should.be.exactly(false).and.be.a.Boolean;
        })
    })

    describe('#isDisabled()', function() {
        it('should return false', function() {
            (p.isDisabled()).should.be.exactly(false).and.be.a.Boolean;
        })
    })

    describe('#hasAttacked()', function() {
        it('should return false', function() {
            (p.hasAttacked()).should.be.exactly(false).and.be.a.Boolean;
        })
    })

    describe('#getTile()', function() {
        it('should return false', function() {
            var t = p.getTile();
            (t).should.have.property('i', 5);
            (t).should.have.property('j', 6);
        })
    })

    describe('#selectForAttack()', function() {
        it('should return [p]', function() {
            var a = p.selectForAttack();
            (a).should.be.an.instanceof(Array).and.have.lengthOf(1);
            (a[0]).should.be.an.instanceof(window.PUnit);
            (a[0]).should.be.exactly(p);
        })
    })

    //premovement of 1
    describe('#isValidPreMoveTarget()', function() {
        it('should return true', function() {
           (p.isValidPreMoveTarget({i : 6, j : 6})).should.be.exactly(true);
           (p.isValidPreMoveTarget({i : 4, j : 6})).should.be.exactly(true);
           (p.isValidPreMoveTarget({i : 5, j : 7})).should.be.exactly(true);
           (p.isValidPreMoveTarget({i : 5, j : 5})).should.be.exactly(true);
           (p.isValidPreMoveTarget({i : 4, j : 5})).should.be.exactly(true);
           (p.isValidPreMoveTarget({i : 6, j : 5})).should.be.exactly(true);
        })
        it('should return false', function() {
           (p.isValidPreMoveTarget({i : 6, j : 7})).should.be.exactly(false);
           (p.isValidPreMoveTarget({i : 4, j : 7})).should.be.exactly(false);
           
           (p.isValidPreMoveTarget({i : 50, j : 7})).should.be.exactly(false);
           (p.isValidPreMoveTarget({i : 5, j : 50})).should.be.exactly(false);
           (p.isValidPreMoveTarget({i : 0, j : 5})).should.be.exactly(false);
           (p.isValidPreMoveTarget({i : 6, j : 0})).should.be.exactly(false);
        })
    })

    //post movement of 2
    describe('#isValidPostMoveTarget()', function() {
        it('should return true', function() {
            (p.isValidPostMoveTarget({i : 6, j : 6})).should.be.exactly(true);
            (p.isValidPostMoveTarget({i : 4, j : 6})).should.be.exactly(true);
            (p.isValidPostMoveTarget({i : 5, j : 7})).should.be.exactly(true);
            (p.isValidPostMoveTarget({i : 5, j : 5})).should.be.exactly(true);
            (p.isValidPostMoveTarget({i : 4, j : 5})).should.be.exactly(true);
            (p.isValidPostMoveTarget({i : 6, j : 5})).should.be.exactly(true);
            
            (p.isValidPostMoveTarget({i : 6, j : 7})).should.be.exactly(false);
            (p.isValidPostMoveTarget({i : 4, j : 7})).should.be.exactly(false);
            })
        })
        it('should return false', function() {
            (p.isValidPostMoveTarget({i : 6, j : 8})).should.be.exactly(false);
            (p.isValidPostMoveTarget({i : 4, j : 8})).should.be.exactly(false);
            
            (p.isValidPostMoveTarget({i : 50, j : 7})).should.be.exactly(false);
            (p.isValidPostMoveTarget({i : 5, j : 50})).should.be.exactly(false);
            (p.isValidPostMoveTarget({i : 0, j : 5})).should.be.exactly(false);
            (p.isValidPostMoveTarget({i : 6, j : 0})).should.be.exactly(false);
        })
    })


})
