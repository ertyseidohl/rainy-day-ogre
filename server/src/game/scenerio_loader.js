
var fs = require('fs');

exports.loadScenario = function(file){
    var data = JSON.parse(fs.readFileSync(file, {encoding : "utf8"}));
    if (typeof data.map == "string") {
        data.map = JSON.parse(fs.readFileSync(data.map, {encoding : "utf8"}));
    }
    return data;

};

exports.allScenarios = function(){
    return {
        "default" : exports.loadScenario("./src/data/scenario_default.json")
    };
};

