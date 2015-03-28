
var express = require('express');
var bodyParser = require('body-parser')

var app = express();

var jsonParser = bodyParser.json()

var users = []
var games = [{gameid : 0, users : [], gamestate : "LOBBY"}];

app.get('/', jsonParser, function(req, res){
    res.json({YAY : true});
});

app.get('/joinserver', jsonParser, function(req, res){

    var userid = users.length;
    users.push({userid : userid, games : [], gamestate : "LOBBY"});
    res.json(users[userid]);

    games.push({gameid : games.length, users : []});
});

app.post('/listgames', jsonParser, function(req, res){
   res.json(games);
});

app.post('/joingame', jsonParser, function(req, res){

    console.log(req.body);
});

app.post('/update', jsonParser, function(req, res){


});

app.post('/poll', jsonParser, function(req, res){

});


app.listen(8000);

