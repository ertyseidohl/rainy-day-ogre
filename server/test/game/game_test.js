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
            var t = g.armies[1].units[0].instanceId;
            var u = g.armies[0].units[0].instanceId;
            (g.attack(10,t,[u])[1].code).should.be.exactly('success');
        });
        it('attack should fail', function(){ 
            var t = g.armies[1].units[0].instanceId;
            var u = g.armies[0].units[0].instanceId;
            (g.attack(10,t,[u])[1].code).should.be.exactly('UnitAlreadyAttacked');
        });
    });
});