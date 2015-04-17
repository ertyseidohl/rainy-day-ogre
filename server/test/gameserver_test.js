/*jshint expr: true */

var should = require('should');
var gs = require('../src/gameserver.js');


describe('GameServer', function() {

    describe('#_startgame', function(){
       it('should return game id 1', function(){
            (gs._startgame("default", [1 , 2])).should.be.exactly(1);
        });
        it('should return game id 2, then 3', function(){
            (gs._startgame("default", [1 , 2])).should.be.exactly(2);
            (gs._startgame("default", [1 , 2])).should.be.exactly(3);
        });
    });
    
    describe('#_actionswitch', function() {
        beforeEach(function() {
            gs._startgame('default', [1 , 2]);
        });
        describe('improper postdata', function() {
            it('should return a 400', function(){
                postobj = {};
                (gs._actionswitch(postobj)[0]).should.be.exactly(400);
            });
            it('should return a 400', function(){
                postobj = {gameid : null};
                (gs._actionswitch(postobj)[0]).should.be.exactly(400);
            });
            it('should return a 400', function(){
                postobj = {gameid : 1};
                (gs._actionswitch(postobj)[0]).should.be.exactly(400);
            });
            it('should return a 400', function(){
                postobj = {userid : 1};
                (gs._actionswitch(postobj)[0]).should.be.exactly(400);
            });
            it('should return a 400', function(){
                postobj = {userid : 1, gameid : 1};
                (gs._actionswitch(postobj)[0]).should.be.exactly(400);
            });
            it('should return a 400', function(){
                postobj = {userid : 1, gameid : 1, action : "fake", options : null};
                (gs._actionswitch(postobj)[0]).should.be.exactly(400);
            });
            it('should return a 400', function(){
                postobj = {userid : null, gameid : null, action : null, options : null};
                (gs._actionswitch(postobj)[0]).should.be.exactly(400);
            });
        });

        describe('no such action', function() {    //probably a bad test :P
            it('should return a 404', function(){
                postobj = {userid : 1, gameid : 1, action : "fake", options : {}};
                (gs._actionswitch(postobj)[0]).should.be.exactly(404);
            });
            it('should return NoSuchAction', function(){
                postobj = {userid : 1, gameid : 1, action : "fake", options : {}};
                (gs._actionswitch(postobj)[1].code).should.be.exactly("NoSuchAction");
            });
        });
    });

    describe('#_endTurn', function(){
        it('should return 400',function(){
            (gs._endTurn(gs._getGameById(1), 2)[0]).should.be.exactly(400);
        });
        it('should return 200', function(){
            (gs._endTurn(gs._getGameById(1), 1)[0]).should.be.exactly(200);
        });
        it('should return 400', function(){
            (gs._endTurn(gs._getGameById(1), 1)[0]).should.be.exactly(400);
        });
        it('should return 200', function(){
            (gs._endTurn(gs._getGameById(1), 2)[0]).should.be.exactly(200);
        });
    });

    describe('#_move', function() {
        var options = null; 
        beforeEach(function() {
            options = {
                unit : {instanceId : 3, tile : {i : 7, j : 5}},
                target : {i : 9, j : 5}
            }; 
        });
        it('should return a 400 - not your unit', function() { 
            (gs._move(gs._getGameById(1), 1,  options)[1].code).should.be.exactly("NotUsersUnit");
        });
        it('should return a 400 - not your turn', function() { 
            (gs._move(gs._getGameById(1), 2,  options)[1].code).should.be.exactly("NotUsersTurn");
        });
        it('should return a 200', function(){
            gs._endTurn(gs._getGameById(1), 1); 
            (gs._move(gs._getGameById(1), 2,  options)[1].code).should.be.exactly("success");
        });
    });

    describe('#_attack', function() {

        it('should return a 400 - bad target', function() {
            var o = {};
            (gs._attack(gs._getGameById(1), 1, o)[1].code).should.not.be.equal("success");
        });
    });

});

