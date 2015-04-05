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

app.get('/action', function(req,res) {
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

app.get('/poll', function(req,res) {

});

app.listen(8001);
