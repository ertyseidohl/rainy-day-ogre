/*jshint expr: true */ 
var game = require('../../src/game/game.js');

var gs = require('../../src/gameserver.js');
var units = require('../../src/game/classes/');
var should = require('should');

var scenerio = require('../../src/game/scenerio_loader.js');
var allScenarios = scenerio.allScenarios();

describe('Game Test', function() {

    beforeEach(function(){
        var s = allScenarios['default'];   
        var o = {map : s.map, 
                 armies : s.armies,
                 users : { 10 : 0, 21 : 1 }
        };
        var g = new game.Game(o);
    });

    describe('#whoseTurn', function(){
        (g.whoseTurn()).should.be.exactly(g.armies[0]);
    });
});
