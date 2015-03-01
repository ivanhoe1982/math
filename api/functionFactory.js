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

var checkIfLegal= function(word) {
    var reservedKeywords = [
        'do','if','in','for','let','new','try','var','case','else','enum','eval','null','this','true','void','with','break',
        'catch','class','const','false','super','throw','while','yield','delete','export','import','public','return',
        'static','switch','typeof','default','extends','finally','package','private','continue','debugger','function',
        'arguments','interface','protected','implements','instanceof'];
    return reservedKeywords.indexOf(word.toLowerCase()) >-1;
}


var functionFactory = function(/*arguments,expression */) {
    var inner = function(params,exp) {
        var body =
            '    var params=["'+params.join('","')+'"];'+
            '    var expRepl="'+exp+'";'+
            '    for(i=0; i<arguments.length; i++) {'+
            '       expRepl = expRepl.split(params[i]).join(arguments[i]);'+
            '    };'+
            '    return expRepl;';
        //try {
            return new Function(params,body);
        //} catch(e) {
        //    console.log(e);
        //}

    };

    var expectedArguments = 0;
    if(arguments.length!=2) {
        throw new Error('Wrong arguments: requires two arguments: a list of arguments and an expression')
    }
    else {
        var args = arguments[0];
        var expr = arguments[1];

        if( Object.prototype.toString.call(args) != '[object Array]' ) {
            throw new Error('Wrong arguments: first argument needs to be an array of arguments')
        } else {
            if(args.length<=0) {
                throw new Error('Wrong arguments: array of arguments cannot be empty')
            } else {
                expectedArguments= args.length;
            }
        }
        if( Object.prototype.toString.call(expr) != '[object String]' ) {
            throw new Error('Wrong arguments: second needs to be a string')
        } else {
            if (expr.length<=0) {
                throw new Error('Wrong arguments: expression empty');
            }
        }

        //check if all arguments are legal words
        args.forEach(function(c) {
            //examine if each of the arguments is in expression
            if (checkIfLegal(c)) {
                throw new Error ('Argument <strong>'+c+'</strong> is a reserved JavaScript keyword. Change it.')
            }
        });

        var temp = new Array();

        args.forEach(function(c) {
        //examine if each of the arguments is in expression
            var i = expr.indexOf(c);
            if (i == -1) {
                temp.push(c);
            }
        });
        if (temp.length>0) {
            var msg = temp.join(', ');
            throw new Error('Arguments <strong>'+ msg +'</strong> are not in the expression. Check your expression or remove some arguments')
        }
    }

    //here we actually call the dynamic function constructor and get it into RES
    var res=inner.apply(null,arguments);

    //with res instantiation done, let's test it with simple substitution and in case the parser complains throw an exception
    //catching an exception
    try {
        var args = Array.apply(null, new Array(expectedArguments)).map(function(){return 1});
        var test = parser.parse(res.apply(null,args));
    }
    catch (e) {
        throw new Error('Expression cannot be parsed: '+arguments[1] + ' | Parser says: <strong>' +e.message + '</strong>');
    }

    return function() {
        if(arguments.length!=expectedArguments) {
            throw new Error('Incorrect number of arguments. Expected <strong>'+expectedArguments+'</strong>');
        } else {
            var args = Array.prototype.slice.call(arguments);
            args.forEach(function(a){
                if( typeof a !== "number" ) {
                    throw new Error('Arguments have to be numbers. Incorrect argument <strong>'+a+'</strong>')
                }
            });
        }
        var x = res.apply(null,arguments);
        console.log("|"+x+"|");
        return parser.parse(x);
    }
}

module.exports = functionFactory;
