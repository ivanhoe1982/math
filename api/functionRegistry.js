/**
 * Created by ivanhoe on 3/1/15.
 */

//module globals
var registeredFunctions={};
var registeredArguments={};

module.exports =  {
    registerFunction : function(uniquename,f) {
        registeredFunctions[uniquename]=f;
        //console.log("function registered" + f);
    },
    functionByUniqueName : function(uniquename) {
        var r = registeredFunctions[uniquename];
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
        if(registeredFunctions[name]) {
            var f = registeredFunctions[name];
            var res=f(); //execute without any arguments to coerce function to look in environment

            return res;

        } else {
            throw new Error('Function '+name+' not registered in current context');
        }
    },
    registerArguments : function(args) {
        registeredArguments=args;
    },
    argumentByName : function(name) {
        if (registeredArguments[name])
        {
            return registeredArguments[name];
        } else if(registeredFunctions[name])
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