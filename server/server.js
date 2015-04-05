
var express = require('express'),
    bodyparser = require('body-parser'),
    fs = require('fs');

var app = express();
app.use(bodyparser.json());

var users = {};
var nextuser = 1;

var lobbies = {};
var nextlobby = 2;
lobbies[1] = newlobby(1);

function loadScenario(file) {
    var data = JSON.parse(fs.readFileSync(file));
    if (typeof data.map == "string") {
        data.map = fs.readFileSync(data.map);
    }
    return data;
}

var allScenarios = [
    loadScenario("./data/scenario_default.json")
];

function newlobby(lobbyid){
    return { lobbyid : lobbyid,
        users : [],
        usersready : {},
        lobbystate : "LOBBY",
        scenario : allScenarios[0],
        scenarios : allScenarios
    };
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

app.post('/setlobbystatus', function(req, res){

    var userid = req.body.userid;
    var lobbyid = req.body.lobbyid;
    var action = req.body.action;

    console.log('/setlobbystatus ' + action + ' ' +  userid + ' ', + lobbyid + ' ' + JSON.stringify(req.body));

    if (lobbies[lobbyid].users.indexOf(userid) < 0) {
        return res.status(402).send({ error : "user has not joined this lobby" });
    }

    var lobby = lobbies[lobbyid];

    //so not quite thread safe
    if (lobby.state != "LOBBY") {
        return res.status(415).send({error : "Game Started"});
    }

    action = action.trim();
    action = action.toLowerCase();

    switch(action){
        case "ready":
            lobby.usersready[userid] = true; 
            
            if (lobby.usersready.length == lobby.scenarios[lobby.scenario].armies.length) {
                lobby.state = "START";
            }
            break;
        case "unready":
            delete lobby.usersready[userid];
            break;
        case "setscenario":
            //better unset the everyone's ready status
            lobby.usersready = {};
            //which scenario?
            var s = req.body.scenario;
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
            delete lobbies[lobbyid].usersready[userid];
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

    console.log('/checklobbystatus ' +  userid + ' ', + lobbyid + ' ' + JSON.stringify(req.body));

    if (lobbies[lobbyid].users.indexOf(userid) < 0) {
        return res.status(402).send({ error : "user has not joined this lobby" });
    }

    return res.json(lobbies[lobbyid]);
});

app.listen(8000);
