

;(function(exports) {

    var turn = 0;
    var armies = []

    var Army = function(name, color){
        this.name = name;
        this.color = color;
        this.units = [];
    };

    Army.prototype.startTurn = function(){
        //reset units
        this.units.forEach(function(elem, ind, array){
            elem.nextTurnReset();
        }); 
    };

    Army.prototype.endTurn = function(){};

    Army.prototype.addUnit = function(unit){
        this.units = this.units.concat(unit);
        return true;
    };

    Army.prototype.getStats = function() {
        return {"units" : this.units.length};  
    };


    //API actions
    exports.endTurn = function() {

        //ensure this state machine is reset
        attackCleanup();

        armies[turn].endTurn();
        turn += 1;
        if (turn > armies.length) {
            turn = 0;
        }
        armies[turn].startTurn();
    
    };
    
    /*
     * function whoseTurn returns the Army of the current turn
     *
     * note:
     *    this could be scoped to private, but we need to decide
     *    how we want to pass out references to our armies
     */
    exports.whoseTurn = function() {
        return armies[turn];
    };


    //Attack logic: 
    //   choose a target (can't be whose turn)
    //   build an attack force
    //   check to see ratio against targets
    //   commit to a target or cancel
    attackForce = [];
    attackTarget = null;
    var attackCleanup = function() {
        attackForce = [];
        attackTarget = null;
    };

    //start an attack by setting the target
    exports.attackSetTarget = function(unit) {
        if (whoseTurn().units.indexOf(unit) >= 0) {
            return false;
        }
        if (attackForce.length > 0) {
            attackCleanup();
        }
        attackTarget = unit;
        return true;
    }

    //add a unit to the attacking cohort
    exports.attackWith = function(unit) {
        if (attackTarget == null) {
            return false;
        }

        if (whoseTurn().units.indexOf(unit) < 0){
            return false;
        }
        
        if (attackForce.indexOf(unit) >= 0){
            return false;
        }

        if (unit.canAttack(attackTarget)){
            attackForce.push(unit);
            return true;
        }
        return false;
    };

    //get the current attack:defense ratio
    exports.attackGetRatio = function() {
        if (attackTarget == null){
            return -1;
        }
        return attackTarget.getDamageRatio(attackForce);
    };

    //commit to the attack!
    exports.attackCommit = function() {
        attackTarget.takeDamage(attackForce, function(str){});
        attackForce.forEach(function(elem, ind, array){
            elem.hasAttacked = true;
        });
        attackCleanup();
        return true;
    };
    
    //returns a list of attackers (useful for ux)
    exports.attackGetAttackers = function(){
        return attackForce;
    };

    //cancel the attack
    exports.attackCancel = function(){
        attackCleanup();
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
            "silver", "teal", "white", "yellow"]

        if (index == null || index < 0 || index > armies.length) {
           index = armies.length; 
        }

        x = new Army(name,colors[armies.length]); 
        armies.splice(index, 0, x);
        return x;
    };
})(window);
