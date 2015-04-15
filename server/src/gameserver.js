var express = require('express'),
    bodyparser = require('body-parser');

var app = express();
app.use(bodyparser.json());
var scenerio = require('./game/scenerio_loader.js');

var game = require('./game/game.js');

var allScenarios = scenerio.allScenarios();
var games = {};
var nextgame = 1;



app.get('/', function(req, res){
    res.json({YAY : true});
});

app.get('/startgame', function(req, res){
    var scenario = req.body.scenerio; 
        users = req.body.users;

    exports._startgame(scenario, users);

    res.json({
        server : "http://192.168.1.14:8001",
        gameid : gameid
    });
});

app.get('/action', function(req, res) {
    ret = exports._actionswitch(req.body);
    
    return res.status(200).send(ret[1]);
});

exports._actionswitch = function(postobj){
    var gameid = postobj.gameid,
        userid = postobj.userid,
        action = postobj.action,
        options = postobj.options,
        game = null,
        army = null,
        props = "";

    //friendly required param error message
    if (gameid === undefined || userid === undefined || 
            action === undefined || options === undefined ||
            gameid === null || userid === null || 
            action === null || options === null) {        
        props += (gameid === undefined || gameid === null) ? " gameid, " : "";
        props += (action === undefined || action === null) ? " action, " : "";
        props += (userid === undefined || userid === null) ? " userid, " : "";
        props += (options === undefined || options === null) ? " options, " : "";
        return [400, {error : "Missing properties :" + props}];
    }

    //get game
    game = games[gameid];
    if (game === undefined) {
        return [400, {error : "No such game: " + gameid, code : "NoSuchGame"}];
    }

    //check to see if user is in this game
    army = game.getUsersArmy(userid);
    if (army === null || army === undefined){
        return [400, {error : "No such user " + userid + " in game " + gameid, code : "NoSuchUser"}];
    }

    switch (action) {
        case "move":
            move(game, userid, options);
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
        default:
            return [404, {error : "No such action: " + action, code : "NoSuchAction"}];
    }

    return [200, {success : true}];

};

exports._startgame = function (scen, users){
    var s = allScenarios[scen];   
    var o = {map : s.map, 
            armies : s.armies
            };
    var i = 0;
    var u = {};

    for (i = 0; i < users.length; i++){
        u[users[i]] = i;
    }    
    o.users = u;

    var g = new game.Game(o);

    var gameid = nextgame++;
    games[gameid] = g;
    return gameid;
};

exports._getGameById = function(gameid) {
    return games[gameid];
};

function isATile(tile) {    
    return (tile.hasOwnProperty('i') && tile.hasOwnProperty('j'));
}

exports._attack = function(game, userid, options){
    var result = null;

    if (options.target === undefined ||
            options.target.instanceId === undefined || 
            typeof options.target.instanceId != "number"){
        return [400, {error : "incorrectly formatted target unit", code:"BadUnit"}];
    } else if (options.attackers === undefined ||
            Object.prototype.toString.call( options.attackers ) !== '[object Array]' ||
            optiosn.attackers.length === 0) {
        return [400, {error : "inccorectly formatted attacker array", code:"BadInput"}];
    }

    return [200, {code : "success"}];
};

exports._move = function(game, userid, options){
    var result = null;

    if (options.unit.instanceId === undefined || 
            typeof options.unit.instanceId != "number") {
        return [400, {error : "incorrectly formatted unit", code : "BadUnit"}];    
    } else if (! isATile(options.unit.tile)) {
        return [400, {error : "incorrectly formatted source tile", code : "BadTile"}];
    } else if (! isATile(options.target)) {
        return [400, {error : "incoorectly formatted target tile", code : "BadTile"}];
    }

    result = game.move(userid, options.unit.instanceId, options.unit.tile, options.target);
    if (result[0] === false) {
        return [400, result[1]]; 
    }

    return [200, {code : "success"}];
};

exports._endTurn = function(game, userid){
    if (game.endTurn(userid)) {
        return [200, {code : "success"}];
    } else {
        return [400, {error : "It's not your turn", code : "NotUsersTurn"}];
    }
};


app.get('/poll', function(req,res) {
});

app.listen(8001);
