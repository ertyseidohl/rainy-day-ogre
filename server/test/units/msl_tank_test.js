/*jshint expr: true*/

units = require('../../js/classes/');
gtests = require('../getters_test.js');

var should = require('should');


describe('MissleTank', function(){

    var tile = {i : 3, j : 2}; 
    var m = new units.MissileTank(tile);

    o = {attack : 3,
        range : 4,
        defense : 2,
        premove : 2,
        postmove : 0,
        tile : tile,
        name : "Missile Tank",
        type : "ARMORED" };

    //describe('#getters', gtests.test_getters(o));  
});
