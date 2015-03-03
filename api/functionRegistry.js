/**
 * Created by ivanhoe on 3/1/15.
 */

function merge(target, source) {
    if ( typeof target !== 'object' ) {
        target = {};
    }
    for (var property in source) {
        if ( source.hasOwnProperty(property) ) {
            var sourceProperty = source[ property ];
            if ( typeof sourceProperty === 'object' ) {
                target[ property ] = util.merge( target[ property ], sourceProperty );
                continue;
            }
            target[ property ] = sourceProperty;
        }
    }
    for (var a = 2, l = arguments.length; a < l; a++) {
        merge(target, arguments[a]);
    }
    return target;
};

module.exports =  {
    registeredEntities : {},

    register : function(uniquename,f) {
        this.registeredEntities[uniquename]=f;
    },

    //K/V style merge with priority
    registerBulk : function(args) {
        merge(this.registeredEntities,args);
    },

    //this will attempt to execute a function if called, primitives are returned by value
    valueByName : function(uniquename) {
        if (this.registeredEntities[uniquename] && typeof this.registeredEntities[uniquename] == 'function') {
            return this.registeredEntities[uniquename](); //execute the function with null arguments to coerce it to look in for args in other registeredentities
        } else if (this.registeredEntities[uniquename]) {
            return this.registeredEntities[uniquename];
        } else {
            throw new Error('Entity not registered: <strong>'+uniquename+'</strong>');
        }
    },

    //this will attempt to return a function if called, primitives are returned by value
    objectByName : function(uniquename) {
        if (this.registeredEntities[uniquename]) {
            return this.registeredEntities[uniquename];
        } else {
            throw new Error('Entity not registered: <strong>'+uniquename+'</strong>');
        }
    },

    deregister : function(uniquename) {
        if (this.registeredEntities[uniquename]) {
            delete this.registeredEntities[uniquename];
        }
    },

    //a bit of a cheat: normally exceptions should not be used for 'control flow'
    hasByName : function(uniquename) {
        try {
            this.objectByName(uniquename);
            return true;
        } catch(e) {
            return false;
        }
    },
    purge: function() {
        this.registeredEntities = {};
    }

};