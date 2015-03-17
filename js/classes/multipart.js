/*
 *  MultiPart unit is the base object for Orges
 */
;(function(exports){
    
    //  parts is an array of part units
    exports.MultiPart = function(tile, parts, options){

        this.parts = {}
        
        for (i in parts){ 
            elem = parts[i] 
            try {
                this.parts[elem.type] = this.parts[elem.type].concat(elem);
            } catch(e) {
                this.parts[elem.type] = [elem];
            }
        }

        exports.PUnit.call(this, options); 
    }

    exports.MultiPart.prototype = Object.create(exports.PUnit.prototype);
    exports.MultiPart.constructor = exports.MultiPart;

    //removes a part from this unit
    exports.MultiPart.prototype.partDestroy = function(part)  {
        this.parts[part.type].pop();    
    }
    
    /*
     * selectForAttack is overrided to enable multipart units to work
     *    we return an array of the unit's parts
     */
    exports.MultiPart.prototype.selectForAttack = function(){ 
        res = [];
        for (x in this.parts) {
            if (x.length > 0){
                res = res.concat(this.parts[x][0]);
            }
        }
        
        //if there are no more parts, and the unit is not dead (implicitly)
        //   then return the unit. 
        if (res.length == 0) {
            return [this];
        }
        return res;
    }

})(window);
