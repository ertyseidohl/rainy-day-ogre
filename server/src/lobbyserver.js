
var express = require('express'),
    bodyparser = require('body-parser'),
    fs = require('fs');

var request = require('request');

var app = express();
app.use(bodyparser.json());

var users = {};
var nextuser = 1;

var allScenarios = {
    "default" : loadScenarioData("./src/data/scenario_default.json")
};

var lobbies = {};
var nextlobby = 2;
lobbies[1] = newlobby(1);

function loadScenarioData(file) {
    var data = JSON.parse(fs.readFileSync(file, {encoding : "utf8"}));
    return {
        armies : data.armies.map(function(army) {
            return army.name;
        }),
        name : data.name
    };
}

function newlobby(lobbyid){
    return { lobbyid : lobbyid,
        users : [],
        usersready : [],
        state : "LOBBY",
        scenario : "default",
        scenarios : allScenarios
    };
}

function _newgamecb(error, response, body) {
    if (error){
        console.log(error);
    } else if (!error && response.statusCode == 200) {
        console.log("[LobbyServer] body: ", body);
        return true; 
    } else {
        console.log("response code: " + response.statusCode);
    }
    return false;
}

function _newgame(lobby){
    console.log("new game starting", lobby);
    request.post({
        url : 'http://localhost:8001/startgame',
        json : lobby }, function(error, response, body) {  
            if (_newgamecb(error, response, body)){
                lobby.gameserver = {
                   ip : body.ip,
                   port : body.port,
                   gameid : body.gameid
                };
                lobby.state = "START";
            }
        });
}


app.get('/', function(req, res){
    res.json({YAY : true});
});

app.get('/joinserver', function(req, res){

    var userid = nextuser++;
    users[userid] = {userid : userid, lobbies : []};
    res.json(users[userid]);

    var lobbyid = nextlobby++;
    lobbies[lobbyid] = newlobby(lobbyid);
});

app.post('/listlobbies', function(req, res){
    res.json(lobbies);
});

app.post('/joinlobby', function(req, res){

    var userid = req.body.userid;
    var lobbyid = req.body.lobbyid;

    if (!userid || !lobbyid) return res.status(404).end();

    var lobby = lobbies[lobbyid];
    if (lobby.users.length >= lobby.scenarios[lobby.scenario].armies.length){
        return res.status(405).send({error : "too many players in lobby"});
    }

    lobbies[lobbyid].users.push(userid);
    users[userid].lobbies.push(lobbyid);

    res.json(lobbies[lobbyid]);
});

app.post('/getgameserver', function(req, res){
    console.log(req.body); 
    var userid = req.body.userid,
    lobbyid = req.body.lobbyid,
    ret,
    lobby; 
    
    if (lobbyid === undefined || lobbyid === "") {
        return res.status(418).send({error : "missing param: lobbyid"});
    }

    if (lobbies[lobbyid] === undefined) {
        return res.status(418).send({error : "no such lobby"});
    }

    lobby = lobbies[lobbyid];

    if (lobby.users.indexOf(userid) < 0) {
        return res.status(402).send({ error : "user has not joined this lobby" });
    }

    if (lobby.state != "START") {
        return res.status(415).send({error : "Game Has Not Started"});
    }

    ret = {
        ip : "192.168.8.102",
        port : lobby.gameserver.port,
        gameid : lobby.gameserver.gameid
    };
    res.json(ret);
});

app.post('/setlobbystatus', function(req, res){

    var userid = req.body.userid,
    lobbyid = req.body.lobbyid,
    action = req.body.action,
    i,
    s,
    lobby;

    console.log('/setlobbystatus ' + action + ' ' +  userid + ' ', + lobbyid + ' ' + JSON.stringify(req.body));

    if (lobbies[lobbyid].users.indexOf(userid) < 0) {
        return res.status(402).send({ error : "user has not joined this lobby" });
    }

    if (lobbies[lobbyid] === undefined) {
        return res.status(418).send({error : "no such lobby"});
    }

    lobby = lobbies[lobbyid];

    //so not quite thread safe
    if (lobby.state != "LOBBY") {
        return res.status(415).send({error : "Game Started"});
    }

    action = action.trim();
    action = action.toLowerCase();

    switch(action){
        case "ready":
            if (lobby.usersready.indexOf(userid) < 0) {
                lobby.usersready.push(userid);
            }
            if (lobby.usersready.length == lobby.scenarios[lobby.scenario].armies.length) {
                console.log("ready to start new game" + lobby);
                lobby.state = "STARTING";
                _newgame(lobby);
            }
            break;
        case "unready":
            i = lobby.usersready.indexOf(userid);
            if (i >= 0) {
                lobby.usersready.splice(i, 1);
            }
            break;
        case "setscenario":
            //better unset the everyone's ready status
            lobby.usersready = [];
            //which scenario?
            s = req.body.scenario;
            s = s.trim();
            s = s.toLowerCase();
            //is it an avaiable scenario?
            if (! lobbies[lobbyid].scenarios.hasOwnProperty(s)) {
                console.log("\t no such scenario: " + s);
                return res.status(402).send({ error : "no such scenario: " + s});
            }
            //set the scenerio
            lobbies[lobbyid].scenario = s;
            break;
        case "leave":
            delete lobbies[lobbyid].users[userid];
            i = lobby.usersready.indexOf(userid);
            if (i >= 0) {
                lobby.usersready.splice(i, 1);
            }
            delete users[userid].lobbies[lobbyid];
            break;
        default:
            console.log("\t no such action " + action);
            return res.status(404).send({ error : "no such action: " + action});
    }

    return res.json(lobbies[lobbyid]);
});

app.post("/checklobbystatus", function(req, res){

    var userid = req.body.userid;
    var lobbyid = req.body.lobbyid;

    //console.log('/checklobbystatus ' +  userid + ' ', + lobbyid + ' ' + JSON.stringify(req.body));

    if (lobbies[lobbyid].users.indexOf(userid) < 0) {
        return res.status(402).send({ error : "user has not joined this lobby" });
    }

    return res.json(lobbies[lobbyid]);
});

console.log("lobby server at 8000");
app.listen(8000);
