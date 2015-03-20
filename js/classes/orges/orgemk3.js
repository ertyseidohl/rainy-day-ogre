/*
 * Orge
 */
;(function(exports){
    
    exports.Orge = function(tile) {

        var options = {
            tile : tile,
            type : "ORGE",
            name : "Orge Mach III",
            premove : 3
        };

        /*
        parts = [
            new exports.Treads(this, 30, 10), 
            new OrgeMissile(this),
            new OrgePrimaryBattery(this),
        
            new OrgeSecondaryBattery(this),
            new OrgeSecondaryBattery(this),
            new OrgeSecondaryBattery(this),
            new OrgeSecondaryBattery(this),
            
            new OrgeAntiPersonnel(this),
            new OrgeAntiPersonnel(this),
            new OrgeAntiPersonnel(this),
            new OrgeAntiPersonnel(this),
            
            new OrgeAntiPersonnel(this),
            new OrgeAntiPersonnel(this),
            new OrgeAntiPersonnel(this),
            new OrgeAntiPersonnel(this),
        ]; */

        
        parts = [new OrgeTreads(30, 10),
                 new OrgeMissile(), 
                 new OrgePrimaryBattery(),
                 
                 new OrgeSecondaryBattery(),
                 new OrgeSecondaryBattery(),
                 new OrgeSecondaryBattery(),
                 new OrgeSecondaryBattery()
                 ];
       
        exports.MultiPart.call(this, parts, options);
    };

    exports.Orge.prototype = Object.create(exports.MultiPart.prototype);
    exports.Orge.constructor = exports.Orge;


})(window);

