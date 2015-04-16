//first "API" functions for army control

/**
 *  constructs an Army object
 *  @class Army
 *  @classdesc the Army object represents a collection of units
 *  controlled by a player
 */
exports.Army = Army = function(name, color){
    this.name = name;
    this.color = color;
    this.units = [];
    this.attackForce = [];
    this.attackTarget = null;
};

/**
 * turns should not be started by an API client...
 * this guard ensures that an army's can start their turn
 * iff the global state says it's their turn
 *
 * @retuns {boolean} true if the turn was started, false otherwise  
 */
Army.prototype.startTurn = function(){
    //reset units
    this.units.forEach(function(elem, ind, array){
        elem.nextTurnReset();
    });
    return true;
};

Army.prototype.endTurn = function(){
    this._attackCleanup();
};

Army.prototype.addUnit = function(unit){
    this.units = this.units.concat(unit);
    return true;
};

Army.prototype.getStats = function() {
    return {"units" : this.units.length};
};

//Attack logic:
//   choose a target (can't be in the current turn's army)
//   build an attack force
//   check to see ratio against targets
//   commit to a target or cancel
Army.prototype._attackCleanup = function() {
    attackForce = [];
    attackTarget = null;
};

//start an attack by setting the target
Army.prototype.attackSetTarget = function(unit, part) {
    var sel = null;
    this._attackCleanup();

    sel = unit.selectForAttack();
    if (sel.length > 1) {
        if (part === null || sel.indexOf(part) < 0) {
            return [false,  
                {
                    error: "must choose a part to attack",
                    code: "MultipartError",
                    parts: sel
                }];
        }
        this.attackTarget = part;
    } else {
        this.attackTarget = unit;
    }
    return [true, {code: "success"}];
};

//add a unit to the attacking cohort
Army.prototype.attackWith = function(unit) {
    var result = null;

    if (this.attackTarget === null) {
        return [false, {error: "you must select an attack target first", code: "BadOperation"}];
    }

    if (this.units.indexOf(unit) < 0){
        return [false, {error: "you can only attack with your own units", code: "NotUsersUnit"}]; 
    }

    if (this.attackForce.indexOf(unit) >= 0){
        return [false, {error: "already attacking with unit", code: "BadOperation"}];
    }

    result = unit.canAttackVerbose(this.attackTarget);
    if (result[0]) {
        this.attackForce.push(unit);
    }
    return result;
};

//get the current attack:defense ratio
Army.prototype.attackGetRatio = function() {
    if (this.attackTarget === null){
        return -1;
    }
    return attackTarget.getDamageRatio(attackForce);
};

//commit to the attack!
Army.prototype.attackCommit = function() {
    this.attackTarget.takeDamage(attackForce, function(str){});
    this.attackForce.forEach(function(elem, ind, array){
        elem.attacked = true;
    });
    this._attackCleanup();
    return true;
};

//returns a list of attackers (useful for ux)
Army.prototype.attackGetAttackers = function(){
    return this.attackForce;
};

//cancel the attack
Army.prototype.attackCancel = function(){
    this._attackCleanup();
};


//inserts a new army with the given name at the turn
//position index.
//if index is not provided or less than 0 or greater
//than the number of players, then the index is set to
//be the number of players
exports.addArmy = function(name, index) {

    var colors = ["aqua", "black", "blue", "fuchsia",
        "gray", "green", "lime", "maroon", "navy",
        "olive", "orange", "purple", "red",
        "silver", "teal", "white", "yellow"];

    if (index === undefined || index < 0 || index > armies.length) {
       index = armies.length;
    }

    x = new Army(name,colors[armies.length]);
    armies.splice(index, 0, x);
    return x;
};
