;(function(exports) {

    exports.OrgeTreads = function(cnt, dec) {
        var options = {
            type : "ORGE Treads",
            name : "Orge Treads",
            canattack : false,
        };

        this.treads =  cnt;
        this.dec = dec;

        exports.UnitPart.call(this, options);
    };

    exports.OrgeTreads.prototype = Object.create(exports.UnitPart.prototype);
    exports.OrgeTreads.constructor = exports.OrgeTreads;

    exports.OrgeTreads.kill = function(){

        this.treads -= 1;
        if (this.treads % this.dec == 0) {
            this.owner.premovement -= 1;
        }
    }

})(window);
