;(function(exports){

    exports.UnitPart = function(options) {
        this.owner = null;
        exports.PUnit.call(this, options);
    };

    exports.UnitPart.prototype = Object.create(exports.PUnit.prototype);

    exports.UnitPart.prototype.assignToOwner = function(owner) {
        this.owner = owner;
    };

    exports.UnitPart.prototype.getTile = function() {
        if (this.owner === null) {
            return {i: -1, j : -1};
        }
        return this.owner.getTile();
    };

    exports.UnitPart.prototype.kill = function() {
        this.owner.partDestroy(this);
    };

})(window);
