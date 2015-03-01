/**
 * Created by Lukasz Lewandowski on 2/26/15.
 */
//'use strict';

var parser = require('./pegjs/math.js');


/**
 * Dynamically creates a function based on list of arguments and parsable expression in a set PEGJS grammar.
 *
 * @constructor
 * @param {array} arguments - array of strings representing arguments of the returned function
 * @param {string} expression - PEGJS grammar compliant expression
 */

var functionFactory = function(/*arguments,expression */) {
    var inner = function(params,exp) {
        var body =
            '    var params=["'+params.join('","')+'"];'+
            '    var expRepl="'+exp+'";'+
            '    for(i=0; i<arguments.length; i++) {'+
            '       expRepl = expRepl.replace(params[i],arguments[i]);'+
            '    };'+
            '    return expRepl;';

        return new Function(params,body);
    };

    var expectedArguments = 0;
    if(arguments.length!=2) {
        throw new Error('Wrong arguments: requires two arguments: a list of arguments and an expression')
    }
    else {
        var a = arguments[0];
        var b = arguments[1];

        if( Object.prototype.toString.call(a) != '[object Array]' ) {
            throw new Error('Wrong arguments: first argument needs to be an array of arguments')
        } else {
            if(a.length<=0) {
                throw new Error('Wrong arguments: array of arguments cannot be empty')
            } else {
                expectedArguments= a.length;
            }
        }
        if( Object.prototype.toString.call(b) != '[object String]' ) {
            throw new Error('Wrong arguments: second needs to be a string')
        } else {
            if (b.length<=0) {
                throw new Error('Wrong arguments: expression empty');
            }
        }
        var eres = new Array();

        a.forEach(function(c) {
        //examine if each of the arguments and check if it is in the expression
            var i = b.indexOf(c);
            if (i == -1) {
                eres.push(c);
            }
        });
        if (eres.length>0) {
            var msg = eres.join(', ');
            throw new Error('Arguments <em>'+ msg +'</em> are not in the expression. Check your expression or remove some arguments')
        }
    }

    var res=inner.apply(null,arguments);
    //definition fine, let's test it with simple substitution and in case the parser complains throw an exception
    //catching an exception
    try {
        var args = Array.apply(null, new Array(expectedArguments)).map(function(){return 1});
        var test = parser.parse(res.apply(null,args));
    }
    catch (e) {
        throw new Error('Expression cannot be parsed: '+arguments[1] + ' | Parser says: <em>' +e.message + '</em>');
    }

    return function() {
        if(arguments.length!=expectedArguments) {
            throw new Error('Incorrect number of arguments. Expected <em>'+expectedArguments+'</em>');
        } else {
            var args = Array.prototype.slice.call(arguments);
            args.forEach(function(a){
                if( typeof a !== "number" ) {
                    throw new Error('Arguments have to be numbers. Incorrect argument <em>'+a+'</em>')
                }
            });
        }
        var x = res.apply(null,arguments);
        console.log("|"+x+"|");
        return parser.parse(x);
    }
}

module.exports = functionFactory;
