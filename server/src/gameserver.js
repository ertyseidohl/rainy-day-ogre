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

/**
 *  GET /createdevgame
 *
 *  creates a game with the default scenario with 2 players (users 1 and 2)
 */
app.get('/createdevgame', function(req, res){
    var scenario = "Default",
        users = [1,2],
        gameid;

    gameid = exports._startgame(scenario, users);
    console.log("[GameServer : Started Game in dev mode with gameid, ", gameid); 
    
    res.json({ 
        ip : "192.168.1.14",
        port : "8001",
        gameid : gameid
    });
});

app.post('/startgame', function(req, res){
    var lobby = req.body,
    scenario,
    users,
    gameid;

    console.log("[GameServer] : Start a New Game! ", lobby);
    
    scenario = lobby.scenario;
    users = lobby.users;

    gameid = exports._startgame(scenario, users);
    console.log("[GameServer] : Game Started with id: ", gameid);
    res.json({
        ip : "192.168.1.14",
        port : "8001",
        gameid : gameid
    });
});

/**
 *  POST /joingame
 *  @param gameid,
 *  @param userid,
 */ 
app.post('/joingame', function(req, res){
    var gameid = req.body.gameid,
        userid = req.body.userid,
        ret,
        game,
        army;

    ret = exports._getGameByGameidAndUserid(gameid, userid);

    if (isOkay(ret)){
        game = getGame(ret);
        army = getArmy(ret);
    } else {
        return res.status(ret[0]).json(ret);
    } 

    return res.status(200).json({game : game, army : army});
});

/**
 * POST /getgamestaus
 * @param gameid,
 * @param userid,
 */
app.post('/getgamestatus', function(req, res){
    var gameid = req.body.gameid,
        userid = req.body.userid,
        ret,
        game,
        army;

    ret = exports._getGameByGameidAndUserid(gameid, userid);

    if (isOkay(ret)){
        game = getGame(ret);
        army = getArmy(ret);
    } else {
        return res.status(ret[0]).json(ret);
    } 

    return res.status(200).json({game : game, army : army});
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

//the return array functions
isOkay = exports._isOkay = function(ret){
    if (ret[0] !== 200) {
        return false;
    }
    return true;
};

getGame = exports._getGame = function(ret){
    return ret[1].game;
};

getArmy = exports._getArmy = function(ret){
    return ret[1].army;
};

exports._getGameByGameidAndUserid = function(gameid, userid) {

    if (gameid === undefined || userid === undefined || gameid === null || userid === null){
        props = [];
        estring = "missing params: ";
        if (gameid === undefined || gameid === null){
            props.push("gameid");
            estring += " gameid, ";
        }
        if (userid === undefined || userid === null) {
            props.push("userid");
            estring += " userid, ";
        }
        
        return [400, {error : estring, params : props}];   
    }

    //get game
    game = games[gameid];
    if (game === undefined) {
        return [400, { 
            error : "No such game: " + gameid, 
            code : "NoSuchGame"
        }];
    }

    //check to see if user is in this game
    army = game.getUsersArmy(userid);
    if (army === null || army === undefined){
        return [400, { 
            error : "No such user " + userid + " in game " + gameid, 
            code : "NoSuchUser"
        }];
    }
 
    return [200, {game : game, army : army}];
};

exports._startgame = function (scen, users){
    console.log("[GameServer]: Scenerio" + scen + " users " + users);
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

console.log("port: 8001");
app.listen(8001);
