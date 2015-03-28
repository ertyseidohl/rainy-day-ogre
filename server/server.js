
var express = require('express');
var bodyparser = require('body-parser')

var app = express();
app.use(bodyparser.json());

var users = {};
var nextuser = 1;

var games = {};
var nextgame = 2;
games[1] = {gameid : 1, users : [], gamestate : "LOBBY"};

app.get('/', function(req, res){
    res.json({YAY : true});
});

app.get('/joinserver', function(req, res){

    var userid = nextuser++;
    users[userid] = {userid : userid, games : []};
    res.json(users[userid]);

    var gameid = nextgame++;
    games[gameid] = {gameid : gameid, users : [], gamestate : "LOBBY"};
});

app.post('/listgames', function(req, res){
    res.json(games);
});

app.post('/joingame', function(req, res){
    
    var userid = req.body.userid;
    var gameid = req.body.gameid;
    if (!userid || !gameid) return res.status(404).end();
    games[gameid].users.push(userid);
    users[userid].games.push(gameid);

    res.json(games[gameid]);
});

app.post('/update', function(req, res){


});

app.post('/poll', function(req, res){

});


app.listen(8000);

