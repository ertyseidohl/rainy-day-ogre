;(function(exports) {

    /**
     * @class
     * @classdesc the Ogre unit's treads
     * @augments UnitPart
     */
    exports.OgreTreads = function(instanceId, cnt, dec) {
        var options = {
            instanceId : instanceId,
            type : "TREADS",
            name : "Ogre Treads",
            canattack : false,
        };

        this.treads =  cnt;
        this.dec = dec;

        exports.UnitPart.call(this, options);
    };

    exports.OgreTreads.prototype = Object.create(exports.UnitPart.prototype);

    /** A treads object has hp that reduce upon being "killed" */
    exports.OgreTreads.kill = function(){
        this.treads -= 1;
        if (this.treads % this.dec === 0) {
            this.owner.premovement -= 1;
        }
    };

})(window);
