window = {};
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

})
