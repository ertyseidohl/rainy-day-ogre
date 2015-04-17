/*jshint expr: true */ 
var game = require('../../src/game/game.js');

var gs = require('../../src/gameserver.js');
var units = require('../../src/game/classes/');
var should = require('should');

var scenerio = require('../../src/game/scenerio_loader.js');
var allScenarios = scenerio.allScenarios();

describe('Game Test', function() {

    var g = null;
    var s = allScenarios.test;
    var o = {map : s.map, 
             armies : s.armies,
             users : { 10 : 0, 21 : 1 }
    };
    g = new game.Game(o);
    describe('test game inventory', function(){
        it('should have two players', function(){
            (Object.keys(g.users).length).should.be.exactly(2);            
        });
        it('should have two armies', function(){
            (g.armies.length).should.be.exactly(2);
        });
        it('army 1 should have 3 units', function(){
            (g.armies[0].units.length).should.be.exactly(3);
        });
    });
    describe('#whoseTurn', function(){
        it('should be first persons turn', function() {
            (g.whoseTurn()).should.be.exactly(g.armies[0]);
        });
    });
    describe('isItMyTurn', function(){
        it('should be first persons turn', function() {
            (g.isItMyTurn(10)).should.be.exactly(true);
        });
        it('should not be second persons turn', function() {
            (g.isItMyTurn(21)).should.be.exactly(false);
        });
    });
    describe('endTurn', function(){
        it('should return false',function(){
            (g.endTurn(21)).should.be.exactly(false);
        });
        it('should return true', function(){
            (g.endTurn(10)).should.be.exactly(true);
        });
        it('should return false', function(){
            (g.endTurn(10)).should.be.exactly(false);
        });
        it('should return true', function(){
            (g.endTurn(21)).should.be.exactly(true);
        });
        it('should be first persons turn', function(){
            (g.whoseTurn()).should.be.exactly(g.armies[0]);
        });
    });

    describe('attack', function(){
        it('attack should succeed',function(){
            var t = g.armies[1].units[0];
            var u = g.armies[0].units[0];
            (g.attack(10,t.instanceId,[u.instanceId], 0)[1].code).should.be.exactly('success');
            (u.hasAttacked()).should.be.exactly(true);
            (t.isDead()).should.be.exactly(false);
            (t.isDisabled()).should.be.exactly(false);
        });
        it('unit already attacked! attack should fail', function(){ 
            var t = g.armies[1].units[0].instanceId;
            var u = g.armies[0].units[0].instanceId;
            var x = g.attack(10,t,[u]);
            (x[1].code).should.be.exactly('UnitAlreadyAttacked');
        });
        it('next turn! attack should succeed', function(){ 
            g.endTurn(10); g.endTurn(21);
            var t = g.armies[1].units[0].instanceId;
            var u = g.armies[0].units[0].instanceId;
            var x = g.attack(10,t,[u],0);
            (x[1].code).should.be.exactly('success');
        });
        it('next turn! group attack should succeed and disable', function(){ 
            g.endTurn(10); g.endTurn(21);
            var t = g.armies[1].units[0];
            var u1 = g.armies[0].units[0];
            var u2 = g.armies[0].units[1];
            var x = g.attack(10,t.instanceId,[u1.instanceId, u2.instanceId], 0);
            (x[1].code).should.be.exactly('success');
            (u1.hasAttacked()).should.be.exactly(true);
            (u2.hasAttacked()).should.be.exactly(true);
            (t.isDead()).should.be.exactly(false);
            (t.isDisabled()).should.be.exactly(true);
        });
        it('opponents turn - no attacking with a disabled unit!', function() {
            g.endTurn(10);
            var t = g.armies[0].units[0].instanceId;
            var u = g.armies[1].units[0].instanceId;
            (g.attack(21,t,[u],5)[1].code).should.be.exactly('UnitIsDisabled');
        });
       it('next turn! group attack should succeed and kill', function(){ 
            g.endTurn(21);
            var t = g.armies[1].units[0];
            var u1 = g.armies[0].units[0];
            var u2 = g.armies[0].units[1];
            var x = g.attack(10,t.instanceId,[u1.instanceId, u2.instanceId], 5);
            (x[1].code).should.be.exactly('success');
            (u1.hasAttacked()).should.be.exactly(true);
            (u2.hasAttacked()).should.be.exactly(true);
            (t.isDead()).should.be.exactly(true);
        });
        it('opponents turn - no attacking with dead unit!', function() {
            g.endTurn(10);
            var t = g.armies[0].units[0].instanceId;
            var u = g.armies[1].units[0].instanceId;
            (g.attack(21,t,[u],5)[1].code).should.be.exactly('UnitIsDead');
        });
    });
});
