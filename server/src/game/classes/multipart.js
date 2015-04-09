/**
 *  @file Contains the MultiPart class that serves as the
 *  base object for Ogres
 *
 *  @author mcverry
 */
;(function(exports){
    /**
     * @class
     * @classdef the base unit for multipart units like ogres
     * @augments PUnit
     * @param {UnitPart[]} parts - an array of part units
     * @param {Object} options - the options object
     */
    exports.MultiPart = function(parts, options){
        this.parts = {};
        for (var i in parts){
            elem = parts[i];
            try {
                this.parts[elem.getName()] = this.parts[elem.getName()].concat(elem);
            } catch(e) {
                this.parts[elem.getName()] = [elem];
            }
            elem.assignToOwner(this);
        }

        exports.PUnit.call(this, options);
    };

    exports.MultiPart.prototype = Object.create(exports.PUnit.prototype);

    /**
     * Removes a part from the MultiPart Unit's part manifest
     * @param {UnitPart} part - the part to be removed
     * @param {boolean} - returns true if an objected was removed, false otherwise
     */
    exports.MultiPart.prototype.partDestroy = function(part)  {
        return (this.parts[part.getName()].pop() && true);
    };

    /**
     *  selectForAttack is overrided to enable multipart units to work
     *  @return {UnitPart[]} an array of the unit's parts
     */
    exports.MultiPart.prototype.selectForAttack = function(){
        res = [];
        for (var x in this.parts) {
            if (x.length > 0){
                res = res.concat(this.parts[x][0]);
            }
        }

        //if there are no more parts, and the unit is not dead (implicitly)
        //   then return the unit.
        if (res.length === 0) {
            return [this];
        }
        return res;
    };

})(window);
