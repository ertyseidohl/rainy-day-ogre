/* jshint expr: true */

require('should');

function shouldreturn(str){
    return "should return ".concat(str);
}

exports.test_getters = function(o) {

    describe(o.cname, function() {            
        describe('#getName()', function() {
            it(shouldreturn(o.name), function() {
                (p.getName()).should.be.exactly(o.name);
            });
        });

        describe('#getType()', function() {
            it(shouldreturn(o.type), function() {
                (p.getType()).should.be.exactly(o.type);
            });
        });

        describe('#getAttack()', function() {
            it(shouldreturn(o.attack), function() {
                (p.getAttack()).should.be.exactly(o.attack).and.be.a.Number;
            });
        });

        describe('#getRange()', function() {
            it(shouldreturn(o.range), function() {
                (p.getRange()).should.be.exactly(o.range).and.be.a.Number;
            });
        });

        describe('#getDefense()', function() {
            it(shouldreturn(o.defense), function() {
                (p.getDefense()).should.be.exactly(o.defense).and.be.a.Number;
            });
        });

        describe('#getPreMovement()', function() {
            it(shouldreturn(o.premove), function() {
                (p.getPreMovement()).should.be.exactly(o.premove).and.be.a.Number;
            });
        });

        describe('#getPostMovement()', function() {
            it(shouldreturn(o.postmove), function() {
                (p.getPostMovement()).should.be.exactly(o.postmove).and.be.a.Number;
            });
        });
    });
};
