/**
 * Created by ivanhoe on 3/1/15.
 */


module.exports =  {
    notify:function(){},
    registeredEntities : {},
    sortedEntities : [],
    cache: {},


    calculateSystem : function() {
        this.cache={};
        for (var i=0; i<this.sortedEntities.length; i++) {
            var n = this.sortedEntities[i].n;
            this.cache[n]= this.valueByName(n);
        };
        this.notify();
    },

    depends : function(args,uniquename) {
        //if root depends on new function
        return (args && args.indexOf(uniquename)>-1)

    },

    register : function(uniquename,f,args,bulk) {
        this.registeredEntities[uniquename]=f;

        var i = 0;
        while(this.sortedEntities[i] && this.sortedEntities[i].args && !this.depends(this.sortedEntities[i].args,uniquename)) {
            i++;
        }
        this.sortedEntities.splice(i,0,{n:uniquename,args:args});
        if (!bulk) {
            this.notify();
        }
    },

    //K/V style merge with priority
    registerBulk : function(args) {

        for (var k in args) {
            if (args.hasOwnProperty(k)) {
                this.register(k,args[k],[],true);
            }
        }

        this.notify();
    },

    //this will attempt to execute a function if called, primitives are returned by value
    valueByName : function(uniquename) {
        if(this.cache[uniquename]) {
            return this.cache[uniquename];
        }
        if (typeof this.registeredEntities[uniquename] === 'function') {
            return this.registeredEntities[uniquename](); //execute the function with null arguments to coerce it to look in for args in other registeredentities
        } else if (this.registeredEntities[uniquename] !== undefined) {
            return this.registeredEntities[uniquename];
        } else {
            throw new Error('Entity not registered: <strong>'+uniquename+'</strong>');
        }
    },

    //this will attempt to return a function if called, primitives are returned by value
    objectByName : function(uniquename) {
        if (this.registeredEntities[uniquename] !== undefined) {
            return this.registeredEntities[uniquename];
        } else {
            throw new Error('Entity not registered: <strong>'+uniquename+'</strong>');
        }
    },

    deregister : function(uniquename) {
        if (this.registeredEntities[uniquename]) {
            delete this.registeredEntities[uniquename];
            this.notify();
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
        this.sortedEntities = [];
        this.cache= {};
        this.notify();
    },

    onChange:function(n){
        this.notify=n;
    }

};