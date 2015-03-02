/**
 * Created by ivanhoe on 3/1/15.
 */

//module globals


module.exports =  {
    registeredFunctions : {},
    registeredArguments : {},

    registerFunction : function(uniquename,f) {
        this.registeredFunctions[uniquename]=f;
        //console.log("function registered" + f);
    },
    functionByUniqueName : function(uniquename) {
        var r = this.registeredFunctions[uniquename];
        if (r) {
            return r;
        } else {
            throw new Error('Function not registered: <strong>'+uniquename+'</strong>');
        }
    },
    hasFunctionByUniqueName : function(uniquename) {
        //TODO: exception as control structure... remove?
        try {
            this.functionByUniqueName(uniquename);
            return true;
        } catch(e) {
            return false;
        }
    },
    functionValueInRegisteredContext: function(name) {
        if(this.registeredFunctions[name]) {
            var f = this.registeredFunctions[name];
            var res=f(); //execute without any arguments to coerce function to look in environment

            return res;

        } else {
            throw new Error('Function '+name+' not registered in current context');
        }
    },
    //K/V style
    registerArguments : function(args) {
        this.registeredArguments=args;
    },
    deregister : function(arg) {
        if (this.registeredArguments[arg]){
            delete this.registeredArguments[arg];
        }
        if (this.registeredFunctions[arg]){
            delete this.registeredFunctions[arg];
        }
    },
    argumentByName : function(name) {
        if (this.registeredArguments[name])
        {
            return this.registeredArguments[name];
        } else if(this.registeredFunctions[name])
        {
            try {
                var result = this.functionValueInRegisteredContext(name);
                return result;
            } catch(e) {
                throw e;
            }

        } else {
            throw new Error('Argument or function not registered: <strong>'+name+'</strong>');
        }

    }
};