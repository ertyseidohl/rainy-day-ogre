/*jshint expr: true */

var should = require('should');
var gs = require('../gameserver.js');


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

    describe('#_move', function() {
        
        it('should_return a 200', function() {
            options = {
                unit : {instanceId : 2, tile : {i : 7, j : 5}},
                target : {i : 9, j : 5}
            };
            (gs._move(gs._getGameById(1), options)[1].code).should.be.exactly("success");
        });

    });

});

