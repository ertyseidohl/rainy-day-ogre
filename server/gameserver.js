var express = require('express'),
    bodyparser = require('body-parser'),
    fs = require('fs');

var app = express();
app.use(bodyparser.json());

var users = {};
var nextuser = 1;

var allScenarios = {
    "default" : loadScenario("./data/scenario_default.json")
};

function loadScenario(file) {
    var data = JSON.parse(fs.readFileSync(file, {encoding : "utf8"}));
    if (typeof data.map == "string") {
        data.map = JSON.parse(fs.readFileSync(data.map, {encoding : "utf8"}));
    }
    return data;
}

app.get('/', function(req, res){
    res.json({YAY : true});
});

app.get('/startgame', function(req, res){
    var scenario = allScenarios[req.body.scenario],
        users = req.body.users;
    //todo
    res.json({
        server : "http://192.168.1.14:8001"
    });
});

app.listen(8001);
