/**
 * Created by Lukasz Lewandowski on 2/26/15.
 */
var parser = require('./pegjs/math.js');

//this will hold all registered formulas
var functionRegistry=require('./functionRegistry.js');

var cyclical=0;
var MAXCYCLICAL=2000; //can be changed with setMaxDepth

/**
 * Dynamically creates a function based on list of arguments and parsable expression in a set PEGJS grammar.
 * @function
 * @param word - word to check
 */
function checkIfLegal(word) {
    var reservedKeywords = [
        'do','if','in','for','let','new','try','var','case','else','enum','eval','null','this','true','void','with','break',
        'catch','class','const','false','super','throw','while','yield','delete','export','import','public','return',
        'static','switch','typeof','default','extends','finally','package','private','continue','debugger','function',
        'arguments','interface','protected','implements','instanceof'];
    return reservedKeywords.indexOf(word.toLowerCase()) ==-1
};

/**
 * Dynamically creates a function based on list of arguments and parsable expression in a set PEGJS grammar.
 *
 * @constructor
 * @param {array} arguments - array of strings representing arguments of the returned function
 * @param {string} expression - PEGJS grammar compliant expression
 */

var functionFactory = function(args, expr, uniquename) {
    ////read variable arguments
    //var args = arguments[0];
    //var expr = arguments[1];
    //var uniquename = arguments[2];

    var expectedArguments = args ? args.length : 0; //count of 'numerical' arguments later on, i.e. args.length used to
                                                    // validate final factored functions' inputs

    <!--factory arguments validation block-->
    if(!(arguments.length>=2 && arguments.length<=3)) {
        throw new Error('Wrong arguments: requires two arguments: a list of arguments and an expression')
    }
    else {

        if( Object.prototype.toString.call(args) != '[object Array]' ) { //oddly the safest type checking method in JS...
            throw new Error('Wrong arguments: first argument needs to be an array of arguments');
        } else if(args.length<=0) {
            throw new Error('Wrong arguments: array of arguments cannot be empty');
        }

        if( Object.prototype.toString.call(expr) != '[object String]' ) {
            throw new Error('Wrong arguments: second needs to be a string');
        } else if (expr.length<=0) {
            throw new Error('Wrong arguments: expression empty');
        }

        //check if all arguments are legal words
        args.forEach(function(c) {
                        if (!checkIfLegal(c)){
                            throw new Error ('Argument <strong>'+c+'</strong> is a reserved JavaScript keyword. Change it.')
                        }
                    }
        );

        var temp = [];

        //put all arguments that cannot be found in the expression into temp
        args.forEach(function(c) {
            i = expr.indexOf(c);
            if (i == -1) {
                temp.push(c);
            }
        });
        if (temp.length>0) {
            throw new Error('Arguments <strong>'+ temp.join(', ') +'</strong> are not in the expression. Check your expression or remove some arguments')
        }
    }
    <!--END factory arguments validation block-->

    <!--final function factory block-->

    //this handles the substitution in expression by numerical arguments
    //e.g f(1,2) with expr = a*b returns 1*2
    //declared in-line to keep "args" from scope
    //it also looks up NULL argument values in the functionRegistry for globally defined arguments
    var substitutionFunction = function() {
        if (cyclical>MAXCYCLICAL){
            cyclical=0;
            throw new Error('Cyclical computation: '+MAXCYCLICAL+' iterations limit reached');
        };
        var expRepl = expr;
        for(var i=0; i<arguments.length; i++) {
            //if argument given is null or "", try lookup a value in the registry by its name
            if(!arguments[i]) {
                try {
                    cyclical=cyclical+1;
                    arguments[i]=functionRegistry.valueByName(args[i]);
                    cyclical=cyclical-1;
                } catch (e)
                {
                    throw e;
                }
            }
            expRepl = expRepl.split(args[i]).join(arguments[i]);
        };
        return expRepl;
    };

    //checking validity of the syntax by using  substitutionFunction for simple set arguments stubArgs=[1,1,1,...]
    //and doing a one time parse, in case the parser complains throw an exception containing parser exception message
    // included
    try {
        var stubArgs = Array.apply(null, new Array(expectedArguments)).map(function(){return 1});
        parser.parse(substitutionFunction.apply(null,stubArgs ));
    }
    catch (e) {
        throw new Error('Expression cannot be parsed: '+arguments[1] + ' | Parser says: <strong>' +e.message + '</strong>');
    }


    //this is the final factored function
    //it deals with variable arguments of correct number and type (Number or NULL allowed)
    //it uses substitution and parser, returning parsed (computed) results
    var finalFunc = function() {

        if(arguments.length!=expectedArguments) {
            if (uniquename && arguments.length==0) { //if it has unique name (=isRegistered) and NOTHING was supplied, try to execute by suppling blanks for registry value lookup
                someargs = Array.apply(null, new Array(expectedArguments)).map(function(){return null});
                return parser.parse(substitutionFunction.apply(null,someargs));
            } else {
                throw new Error('Incorrect number of arguments. Expected <strong>'+expectedArguments+'</strong>');
            }

        } else { //else it is the expected number of arguments, check types
            Array.prototype.slice.call(arguments).forEach(function(a){
                if ( !(typeof a == "number" || a === null) ) {
                    throw new Error('Arguments have to be numbers or null. Incorrect argument <strong>'+a+'</strong>')
                }
            });
            return parser.parse(substitutionFunction.apply(null,arguments));
        }
    };

    //if we got until here, this means we had no exceptions, function is OK we can safely register "finalFunc" with functionRegistry
    // it as long as we gave "uniquename" argument as the third parameter
    if(uniquename) {
        functionRegistry.register(uniquename,finalFunc,args);
    }

    <!--END final function factory block-->

    return finalFunc;
};

module.exports = {
    factory: functionFactory,
    registry: functionRegistry,
    setMaxDepth: function(m) {
        MAXCYCLICAL=m;
    }
};



