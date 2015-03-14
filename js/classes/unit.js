
// IIFE 
// immediately invoked function expression
//
// things bound to exports are global (bound to window),
// everything else is scoped private
//
// appends 
;(function(exports){

    var damageTable = [
                    ["NE", "NE", "NE", "NE", "D", "X"],
                    ["NE", "NE", "D", "D", "X", "X"],
                    ["NE", "D", "D", "X", "X", "X"],
                    ["D", "D", "X", "X", "X", "X"],
                    ["D", "X", "X", "X", "X", "X"],
                ]

    /* Applies damage to a unit, 
     * cb is ux callback function
     */
    var doDamage = function(unit, attack, cb){

        roll = Math.floor((Math.random() * 6));

        switch(damageTable[attack][roll]) {
            case "NE":
                unit.noEffect();
                cb("NE");
                break;
            case "D":
                unit.disable();
                cb("D");
                break;
            case "X":
                unit.kill();
                cb("X");
                break;
        }

        return true;
    }

    exports.CreateUnit = function(clas) {
        obj = new clas();
        obj.prototype = P_Unit;  
        obj.prototype.init();
        return obj;
    }

    exports.P_Unit = {

        init : function(){
            this.tile = {i : -1, j : -1};
            this.dead = false;
            this.isDisabled = false;
            this.turnReset();
        },

        turnReset : function() {
            this.hasMoved = false;
            this.hasAttacked = false;
        },

        noEffect : function() { },
        disable : function() { },
        kill : function() { },

        getAttack : function() { return 0; },
        getDefense : function() { return 0; },
        getRange : function() { return 0; },
        getPreMovement : function() { return 0; },
        getPostMovement : function() { return 0; },

        getTile : function() { return {i : -1, j : -1};},

        isValidPreMoveTarget : function(tile) {
            return Util.getDistance(this.getTile(), tile) <= this.getPreMovement(); 
        },

        isValidPostMoveTarget : function(tile) {
            return Util.getDistance(this.getTile(), tile) <= this.getPostMovement();
        },

        isValidMoveTarget : function(tile) {
            if (this.hasMoved) {
                return this.isValidPostMoveTarget();
            } else {
                return this.isValidPreMoveTarget();
            }
        },

        isValidAttackTarget : function(unitOrTile) {

            var tile = null
            try{
                tile = unitOrTile.getTile();
            } catch (e)
            {
                if (e instanceof TypeError) {
                    tile = unitOrTile;
                }
            }
            return Util.getDistance(this.getTile(), tile) <= this.getRange(); 
        },

        moveToTile : function(tile) {
            if (this.isValidMoveTarget(tile)){
                setTile(tile);
                return true;
            }
            return false;
        },

        setTile : function(tile) { return false;}, 

        takeDamage : function( attackerlist, cb ) {

            attack = attackerlist.reduce(function(accum, elem, index, array) {
                return accum + elem.getAttack();
            });

            def = this.getDefense();

            attack = Math.floor(attack / defense);
            if (attack > 5) { attack = 5;}
            doDamage(this, attack, cb);
        }
    }

})(window);
