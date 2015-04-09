var maps = require('./map');
var army = require('./army');
var units = require('./classes');

/**
 *  constructs the Game object
 *  @class Game
 *  @param {object} options - a javascript object with the following keys
 *     "map" , "users" , "armies"
 *  @classdesc the object that represents a game being played on the gameserver
 */ 
exports.Game = function(options){
    var i = 0,
        j = 0,
        a = null,
        ar = null,
        x = null;
        u = null;
        k = 1;
    //instance variables
    this.map = maps.GameMap({map : options.map});
    this.users = options.users;   //userid => index for this.armies  
    this.armies = []; 
    this.units = {};
    this.turn = 0;

    for (i = 0; i < options.armies.length; i++){
        ar = options.armies[i];
        a = new army.Army(ar.name, i);
        for (j = 0; j < ar.units.length; j++){
            x = units.unitFactory(ar.units[j].id, k, 
                 maps.Util.parseTile(ar.units[j].location));
            if (x !== null){
                a.addUnit(x);
                this.units[x.instanceId] = x;
                k++;
            }
        }
        this.armies = this.armies.concat(a);
    }
};

/**
 *   returns the army object associated with the userid for this game
 *   @param {integer} - the userid 
 *   @returns {Army|undefined} - undefined if there is not army mapped to to this userid
 */
exports.Game.prototype.getUsersArmy = function(userid) {
    return this.armies[this.users[userid]];
};

/**
 *  returns the PUnit with the associated instanceid for this game
 *  @param {integer} - the instanceid
 *  @returns {PUnit|undefined} - undefined if there is no such unit with with the
 *      given instanceid
 */
exports.Game.prototype.getUnitById = function(instanceid) {
    return this.units[instanceid];
};


/**
 * whoseTurn returns the Army of the current turn
 * @returns {Army} - the Army whose turn it currently is. 
 * note:
 *    this could be scoped to private, but we need to decide
 *    how we want to pass out references to our armies
 */
exports.Game.prototype.whoseTurn = function() {
    return this.armies[this.turn];
};
