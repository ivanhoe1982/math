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


var Root = function() {
    return {
        //TODO: change this into an sorted array to remove the last limit
        dependsOn : function(uniquename,f,newargs) {

            //if root depends on new function
            if(this.args && this.args.indexOf(uniquename)>-1) { //uniquename is in args
                //replace root with the new function, and make current root a dependency
                return {n:uniquename, func:f,args:newargs,dep:[this]};
            } else if(!this.dep) {
                //we got to the bottom, put this as dependency, stop
                this.dep = {n:uniquename, func:f,args:newargs,dep:null,dependsOn:this.dependsOn};
                return this;
            } else {
                var newF = this.dep.dependsOn(uniquename,f,newargs);
                this.dep = newF;
                return this;
            }
        },
        n:null,
            func:null, //object
        args:[],
        dep:null  //dependencies
    }
};

module.exports =  {
    registeredEntities : {},
    root: new Root(),
    cache: {},

    calculateSystem : function() {
        this.cache={};
        var x = this.root.dep;
        while(x) {
            //cache by uniquename
            this.cache[x.n]= this.valueByName(x.n);
            x= x.dep;
        }
    },

    register : function(uniquename,f,args) {
        this.registeredEntities[uniquename]=f;

        this.root = this.root.dependsOn(uniquename,f,args);

    },

    //K/V style merge with priority
    registerBulk : function(args) {
        for (var k in args) {
            if (args.hasOwnProperty(k)) {
                this.register(k,args[k],[]);
            }
        }
    },

    //this will attempt to execute a function if called, primitives are returned by value
    valueByName : function(uniquename) {
        if(this.cache[uniquename]) {
            return this.cache[uniquename];
        }
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
        this.root = new Root();
        this.cache= {};
    }

};