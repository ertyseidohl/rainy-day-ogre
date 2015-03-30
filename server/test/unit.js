require('../js/classes/unit.js');

describe('PUnit', function() {
    describe('#getAttack()', function() {
        it('should return 0', function() {
            var p = new PUnit();
            p.getAttack().should.equal(0);
        })
    })
})
