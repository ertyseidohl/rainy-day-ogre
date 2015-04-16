
var fs = require('fs');

exports.loadScenario = function(file){
    console.log("loading " + file);
    var data = JSON.parse(fs.readFileSync(file, {encoding : "utf8"}));
    if (typeof data.map == "string") {
        data.map = JSON.parse(fs.readFileSync(data.map, {encoding : "utf8"}));
    }
    return data;

};

exports.allScenarios = function(){
    return {
        "default" : exports.loadScenario("./src/data/scenario_default.json"),
        "test" : exports.loadScenario("./src/data/scenario_test.json")
    };
};

