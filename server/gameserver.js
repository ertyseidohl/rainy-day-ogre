var express = require('express'),
    bodyparser = require('body-parser');

var app = express();
app.use(bodyparser.json());

var games = {};
var nextgame = 1;

var scenerio = require('./game/scenerio_loader.js');
var allScenarios = scenerio.allScenarios();

app.get('/', function(req, res){
    res.json({YAY : true});
});

app.get('/startgame', function(req, res){
    var scenario = allScenarios[req.body.scenario],
        users = req.body.users;

    var g = new game.Game({map : scenario.map, 
                            armies : scenario.armies, 
                            users : user
                          });
    var gameid = nextgame++;
    games[gameid] = g;

    res.json({
        server : "http://192.168.1.14:8001",
        gameid : gameid
    });
});

app.get('/action', function(req,res) {
    var gameid = req.body.gameid,
        userid = req.body.userid,
        action = req.body.action,
        options = req.body.options,
        game = games[gameid];
        army = null;

    if (game === undefined) {
        return rees.status(404).send({error : "No such game"});
    }
   
    army = game.getUsersArmy(userid);
    if (army === null || army === undefined){
        return res.status(404).send({error : "No user in game"});
    }

    switch (action) {
        case "move":
            //cannot move into a square containing an enemy (use ram instead)
            //only gevs can move after an attack has been made
            break;
        case "split":
            //split an infantry into multiple infantry units
            break;
        case "attack":
            //attack: [source1, source2, ... sourceN], target (part or unit)
            break;
        case "endturn":
            //includes recovery phase
            break;
        case "ram":
            //must ram into a square containing an enemy
            break;

    }
});


function move(game, unit, target){

    var tile = unit.tile;
    var sunit = null;
    var result = null;

    if (unit.id === undefined || typeof unit.id != "number") {
        return [false, "incorrectly formatted unit"];    
    } else if (! isATile(tile)) {
        return [false, "incorrectly formatted tile"];
    }

    sunit = game.getUnit(unit.id);

    if (sunit.tile != tile){
        return [false, "incorrect square"];
    }

    result = sunit.moveToTarget(target);

    //todo: return why?
    if (result === false) {
        return [false, "unit can't legally move to target square"];
    }

    return [true, ""];
}



app.get('/poll', function(req,res) {

});

app.listen(8001);
