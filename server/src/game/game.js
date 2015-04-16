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
                this.units[x.instanceId] = {"unit" : x, "army" : a};
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
exports.Game.prototype.getUnitByInstanceId = function(instanceid) {
    return this.units[instanceid].unit;
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

/**
 *  boolean function that determines if it is the army's turn
 *  @param {Army} army - the army to test
 *  @returns {boolean} true if it is the army's turn
 */
exports.Game.prototype.isItMyTurnByArmy = function(army){
    return (this.whoseTurn() === army);
};

/**
 *  boolean function that determines if it is the user's turn
 *  @param {Integer} userid - the user's id
 *  @returns {boolean} true if it is the user's turn
 */
exports.Game.prototype.isItMyTurn = function(userid){
    return this.isItMyTurnByArmy(this.getUsersArmy(userid));
};

exports.Game.prototype.getUnitsArmyByInstanceId = function(instanceId){
    return this.units[instanceId].army;
};

exports.Game.prototype.getUnitsArmy = function(instance){
    return this.units[instance.instanceId].army;
};

/**
 *  End the user's turn, if it is currently the user's turn
 *  @param {Integer} userid - the user's id
 *  @returns {boolean} true if it was the user's turn, false otherwise
 *  this is mutable function as it alters the game's state
 */
exports.Game.prototype.endTurn = function(userid) {
    if (this.isItMyTurn(userid)){
        this.getUsersArmy(userid).endTurn();
        this.turn++;
        if (this.turn >= this.armies.length) {
            this.turn = 0;
        }
        this.armies[this.turn].startTurn();
        return true;
    }
    return false;
};

/**
 *  Move the user's unit, if it is currently the user's turn and the unit
 *  is in range of its target tile, and the client knows where the unit is
 *  supposed to be
 *  @param {Integer} userid - the user's id
 *  @param {Integer} instanceid - the instanceid of the unit, 
 *  @param {Tile} from - the tile the client believes the unit is at
 *  @param {Tile} target - the target tile to move the unit to
 *  @returns {Array} boolean to indicate success/error, an object at the index[1] 
 *                  with a status code and an error string if applicable
 *  this is a mutable function that alters the game's state.
 */
exports.Game.prototype.move = function(userid, instanceid, from, target){

    var unit = this.getUnitByInstanceId(instanceid);
    var army = this.getUsersArmy(userid);
    var result = null;

    //must be your turn
    if (! this.isItMyTurn(userid)){
        return [false, {error : 'it is not your turn', code : 'NotUsersTurn'}];
    }
    //can only move your own unit
    if (this.getUnitsArmyByInstanceId(instanceid) !== army) {
        return [false, {error : 'can only move your own units', code : 'NotUsersUnit'}];
    }
    //make sure starting tile is synced (maybe unneeded)
    if (unit.tile.i != from.i || unit.tile.j != from.j){
        return [false, {error : "reference from-square is incorrect", code : "Unsync"}];
    }
    //try to move to the tile and return any errors
    result = unit.moveToTile(target);
    if (result === false){
        return [false, {error : 'target blocked or out of range', code : "TooFar"}]; 
    }
    //success!
    return [true, {code : "success"}];
};

/**
 *  attack with an array of units
 */
exports.Game.prototype.attack = function(userid, targetInstanceId, attackerIds, forcedRoll){
    var target = null,
        attackers = [],
        army = this.getUsersArmy(userid),
        i = 0,
        u = null,
        result = null;

    //make sure target exists
    target = this.getUnitByInstanceId(targetInstanceId);
    if (target === undefined){
        return [false, {error: 'no such target unit with id ' + targetInstanceId, code: "NoUnit"}];
    }
    //make sure we are not attacking our own unit
    if (this.getUnitsArmyByInstanceId(targetInstanceId) === army) {
        return [false, {error: 'you can not attack your own unit', code: 'BadInput'}];
    }

    result = army.attackSetTarget(target);
    if (!result[0]){
        return result;
    }

    for (i = 0; i < attackerIds.length; i++) {
        u = this.getUnitByInstanceId(attackerIds[i]);
        if (u === undefined){
            return [false, {error: 'no such attacking unit with id ' + attackerIds[i], code: "NoUnit"}];
        }

        if (this.getUnitsArmyByInstanceId(attackerIds[i]) !== army) {
            return [false, {error: 'you can only attack with your own units', code: 'NotUsersUnit'}];
        }

        result = army.attackWith(u);
        if (!result[0]){
            return result;
        }
    }

    return army.attackCommit(forcedRoll);
};
