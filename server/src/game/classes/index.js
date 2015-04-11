exports.PUnit = require('./punit').PUnit;
exports.MissileTank = require('./units/msl_tank').MissileTank;
exports.Infantry = require('./units/infantry').Infantry;


exports.unitFactory = function(shortname, id, tile){

    switch(shortname){
        case "infantry1" :
            return new exports.Infantry(id, tile, 1);
        case "infantry2" : 
            return new exports.Infantry(id, tile, 2);
        case "infantry3": 
            return new exports.Infantry(id, tile, 3);
        case "msltank": 
            return new exports.MissileTank(id, tile);
        default: 
            return null;
    }
};
