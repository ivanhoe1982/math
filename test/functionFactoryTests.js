/**
 * Created by ivanhoe on 2/28/15.
 */
var should = require('should');

var functions = require('../api/functionFactory.js');

describe('functionFactory',function() {
    var functionFactory = functions.factory;
    var functionRegistry = functions.registry;

    describe('constructor', function () {

        it('should create functions given list of arguments and expression', function () {
            var functionA = functionFactory(["one", "two", "three"], 'one*2+two^2*three');

            functionA.should.be.a.Function;
            functionA.should.be.a.Function;
            functionA.should.not.be.a.String;

            functionA.should.not.have.property('parser');
            functionA.should.have.property('arguments');
        });

        it('should create functions with one or more arguments', function () {
            functionFactory.bind(null, ["one"], 'one').should.not.throw();
            functionFactory.bind(null, ["one", "two"], 'one*2+two^2').should.not.throw();
            functionFactory.bind(null, ["one", "two", "three"], 'one*2+two^2*three').should.not.throw();
        });

        it('should throw an error if arguments missing or of the wrong type', function () {
            functionFactory.bind(null, ["one", "two", "three"], 'one*2+two^2*three').should.not.throw();
            functionFactory.bind(null, ["one", "two", "three"], ["one", "two", "three"]).should.throw(/^Wrong arguments: second needs to be a string/);
            functionFactory.bind(null, ["one", "two", "three"], 55).should.throw(/^Wrong arguments: second needs to be a string/);
            functionFactory.bind(null, ["one", "two", "three"]).should.throw(/^Wrong arguments: requires two arguments: a list of arguments and an expression/);
            functionFactory.bind(null, null, ["one", "two", "three"]).should.throw(/^Wrong arguments: first argument needs to be an array of arguments/);
            functionFactory.bind(null, "three").should.throw(/^Wrong arguments: requires two arguments: a list of arguments and an expression/);
            functionFactory.bind(null, "three", 'one*2+two^2*three').should.throw(/^Wrong arguments: first argument needs to be an array of arguments/);
        });

        it('should throw an error if empty arguments passed', function () {
            functionFactory.bind(null, [], 'one*2+two^2*three').should.throw(/^Wrong arguments: array of arguments cannot be empty/);
            functionFactory.bind(null, ['one'], '').should.throw(/^Wrong arguments: expression empty/);
        });

        it('should throw if expression is not parsable and show parser exception', function () {
            functionFactory.bind(null, ["one", "two", "three"], 'one&two&three').should.throw(/^Expression cannot be parsed: one&two&three/);
        });

        it('should throw if some arguments are not present in the expression', function () {
            functionFactory.bind(null, ["one", "two", "three"], '1*3*4').should.throw(/^Arguments <strong>one, two, three<\/strong> are not in the expression. Check your expression or remove some arguments/);
            functionFactory.bind(null, ["one", "two", "three"], 'one*3*4').should.throw(/^Arguments <strong>two, three<\/strong> are not in the expression. Check your expression or remove some arguments/);
            functionFactory.bind(null, ["one", "two", "three"], 'one*three*4').should.throw(/^Arguments <strong>two<\/strong> are not in the expression. Check your expression or remove some arguments/);
        });
    });

    describe('creates generated functions that', function () {
        var functionA;
        var functionB;
        var functionC;
        beforeEach(function (done) {
            functionA = functionFactory(["one", "two", "three"], 'one*2+two^2*three');
            functionB = functionFactory(["one", "two"], 'one*2+two^2');
            functionC = functionFactory(["one"], 'one');
            done();
        });

        it('should throw if called with a different number of parameters than defined initially', function () {
            functionA.bind(null).should.throw(/^Incorrect number of arguments. Expected <strong>3<\/strong>/);
            functionA.bind(null, 1).should.throw(/^Incorrect number of arguments. Expected <strong>3<\/strong>/);
            functionA.bind(null, 1, 2).should.throw(/^Incorrect number of arguments. Expected <strong>3<\/strong>/);
            functionA.bind(null, 1, 2, 3).should.not.throw(/^Incorrect number of arguments. Expected <strong>3<\/strong>/);
            functionA.bind(null, 1, 2, 3, 4).should.throw(/^Incorrect number of arguments. Expected <strong>3<\/strong>/);
            functionA.bind(null, 1, 2, 3, 4).should.not.throw(/^Incorrect number of arguments. Expected <strong>5<\/strong>/);

            functionB.bind(null).should.throw(/^Incorrect number of arguments. Expected <strong>2<\/strong>/);
            functionB.bind(null, 1).should.throw(/^Incorrect number of arguments. Expected <strong>2<\/strong>/);
            functionB.bind(null, 1, 2).should.not.throw(/^Incorrect number of arguments. Expected <strong>2<\/strong>/);
            functionB.bind(null, 1, 2, 3).should.throw(/^Incorrect number of arguments. Expected <strong>2<\/strong>/);
            functionB.bind(null, 1, 2, 3).should.not.throw(/^Incorrect number of arguments. Expected <strong>4<\/strong>/);

            functionC.bind(null).should.throw(/^Incorrect number of arguments. Expected <strong>1<\/strong>/);
            functionC.bind(null, 1).should.not.throw(/^Incorrect number of arguments. Expected <strong>1<\/strong>/);
            functionC.bind(null, 1, 2).should.throw(/^Incorrect number of arguments. Expected <strong>1<\/strong>/);
            functionC.bind(null, 1, 2, 3).should.throw(/^Incorrect number of arguments. Expected <strong>1<\/strong>/);

        });

        it('should throw if any of the arguments is not a number', function () {
            functionA.bind(null, 1, 2, 'a').should.throw(/^Arguments have to be numbers or null. Incorrect argument <strong>a<\/strong>/);
            functionA.bind(null, 1, 2, 'b').should.throw(/^Arguments have to be numbers or null. Incorrect argument <strong>b<\/strong>/);
            functionA.bind(null, 'c', 2, 'a').should.throw(/^Arguments have to be numbers or null. Incorrect argument <strong>c<\/strong>/);
            functionA.bind(null, ['c'], 2, 'a').should.throw(/^Arguments have to be numbers or null. Incorrect argument <strong>c<\/strong>/);
            functionA.bind(null, 1, 2, 3).should.not.throw(/^Arguments have to be numbers or null. Incorrect argument <strong>a<\/strong>/);
        });

        it('should return a number for numeric arguments', function () {
            functionA.bind(null, 1, 2, 3).should.not.throw();
            functionA(1, 2, 3).should.equal(14);
            functionA(1, 1, 1).should.equal(3);

            functionC.bind(null, 1).should.not.throw();
            functionC(1).should.equal(1);
        });

        it('should handle special case of token "new"', function () {
            functionFactory.bind(null, ["new"], 'new').should.throw(/^Argument <strong>new<\/strong> is a reserved JavaScript keyword. Change it./);
            functionFactory.bind(null, ["instanceof"], 'instanceof').should.throw(/^Argument <strong>instanceof<\/strong> is a reserved JavaScript keyword. Change it./);
        });

        it('should register a with functionRegistry if functionFactory given third argument', function () {
            var functionA = functionFactory(["one", "two", "three"], 'one*2+two^2*three', 'sampleFunction');

        });

        it('if itself registered, calling it with some null parameters should start lookup in registered arguments in functionRegister"', function () {
            var args = {one: 1, two: 2};
            functionRegistry.registerBulk(args);
            functionRegistry.valueByName('one').should.equal(1);
            functionRegistry.valueByName('two').should.equal(2);

            var functionA = functionFactory(["one", "two", "three"], 'one*2+two^2*three', 's1');
            var result = functionA(null, null, 77);
            result.should.equal(1 * 2 + Math.pow(2, 2) * 77);

        });

        it('if itself registered, it should look for value in functionRegistry if argument name equals name of a registered function"', function () {
            //we will register a handful of arguments and call a function dependent on another function
            var args = {one: 1, two: 2, three: 3};
            functionRegistry.registerBulk(args);

            var functionA = functionFactory(["one", "two", "three"], 'one*2+two^2*three', 's1');
            var functionB = functionFactory(["one", "two", "s1"], 'one*2+two^2*s1', 's2');

            var res = functionB(1, 2, null);
            res.should.equal(1 * 2 + Math.pow(2, 2) * 14);
        });
        it('if itself registered, should look for value and throw if functionRegistry throws"', function () {
            var args = {one: 1, two: 2, three: 3};
            functionRegistry.registerBulk(args);

            var functionA = functionFactory(["one", "two", "three"], 'one*2+two^2*three', 's1');
            var functionB = functionFactory(["one", "two", "s3"], 'one*2+two^2*s3', 's2');

            var res = functionB.bind(null, 1, 2, null).should.throw(/^Entity not registered: <strong>s3<\/strong>/);
        });

    });
});

describe('functionRegistry',function() {
    var functionFactory = functions.factory;
    var functionRegistry = functions.registry;

    it('should return a function by name',function(){
        var functionA=functionFactory(["one","two","three"],'one*2+two^2*three','sampleFunction');
        var functionB=functionFactory(["one","two","three"],'one*2+two^2*three','sampleFunction2');

        functionRegistry.objectByName('sampleFunction').should.be.exactly(functionA);
        functionRegistry.objectByName('sampleFunction').should.not.be.exactly(functionB);
    });

    it('should throw if trying to get an unknown function by name',function(){
        var functionA=functionFactory(["one","two","three"],'one*2+two^2*three','sampleFunction');
        functionRegistry.objectByName.bind(functionRegistry,'dupa').should.throw(/^Entity not registered: <strong>dupa<\/strong>/);
    });

    it('should confirm if it has a function by name',function(){
        var functionA=functionFactory(["one","two","three"],'one*2+two^2*three','sampleFunction');

        functionRegistry.hasByName('sampleFunction').should.be.exactly(true);
        functionRegistry.hasByName('sampleFunction2').should.not.be.exactly(false);
    });

    it('should accept a dictionary of arguments for a system of functions',function(){
        var args = {first: 1, second: 2};
        functionRegistry.registerBulk(args);
        functionRegistry.objectByName('first').should.equal(1);
        functionRegistry.objectByName('second').should.equal(2);
    });

    it('registerBulk shoud overwrite previously registered variable', function () {
        var args = {one: 5, two: 6, three: 7};
        functionRegistry.registerBulk(args);
        functionRegistry.valueByName('one').should.equal(5);
        functionRegistry.valueByName('two').should.equal(6);
        functionRegistry.valueByName('three').should.equal(7);

        var args = {one: 8, two: 9, three: 10};
        functionRegistry.registerBulk(args);
        functionRegistry.valueByName('one').should.equal(8);
        functionRegistry.valueByName('two').should.equal(9);
        functionRegistry.valueByName('three').should.equal(10);

    });


    it('should throw if trying to get an unknown argument by name',function(){
        var args = {first: 1, second: 2};
        functionRegistry.registerBulk(args);
        functionRegistry.objectByName.bind(functionRegistry,'second').should.not.throw();
    });

    it('should throw if function evaluated more than N times in one computation chain',function(){
        var args = {one: 1, two: 2, three: 3};
        functionRegistry.register(args);

        var functionA=functionFactory(["one","two","s2"],'one*2+two^2*s2','s1');
        var functionB=functionFactory(["one","two","s1"],'one*2+two^2*s1','s2');

        var res = functionB.bind(null,1,2,null).should.throw(/^Cyclical computation: 2000 iterations limit reached/);
    });

    it('should have the ability to register functions and arguments by name',function(){
        var args = {first: 1, second: 2};
        functionRegistry.register(args);
        functionRegistry.deregister('second');
        functionRegistry.objectByName.bind(functionRegistry,'second').should.throw(/^Entity not registered: <strong>second<\/strong>/);

        functionFactory(["one","two"],'one*2+two^2*two','s1');
        functionFactory(["one","two"],'one*2+two^2*two','s2');
        functionRegistry.deregister('s1');
        functionRegistry.objectByName.bind(functionRegistry,'s1').should.throw(/^Entity not registered: <strong>s1<\/strong>/);
    });

     it('should explain which arguments are unused by functions in the system');
    //it('should explain which arguments are unused so far',function(){
    //
    //});
});

describe('performance',function(){
    var functionFactory = functions.factory;
    var functionRegistry = functions.registry;

    it('should allow creating 1000 functions in less than a second', function(){
        functionRegistry.purge();
        for(var i=0;i<1000;i++) {
            functionFactory(['a','b','c','d','e','f','g'],'a*b*c*d*e*f*g','f'+i);
        };
        Object.keys(functionRegistry.registeredEntities).length.should.be.equal(1000);
    });

    it('should allow creating 3000 functions in less than a second', function(){
        functionRegistry.purge();
        for(var i=0;i<3000;i++) {
            functionFactory(['a','b','c','d','e','f','g'],'a*b*c*d*e*f*g','f'+i);
        };
        Object.keys(functionRegistry.registeredEntities).length.should.be.equal(3000);
    });

    //it.only('should allow calculating dependent functions in less than a second', function(){
    it('should allow calculating dependent functions in less than a second', function(){
        functionRegistry.purge();
        var f;

        functionRegistry.registerBulk({a:1,b:1,c:1,d:1,e:1,f:1,g:1});
        functionFactory(['a','b','c','d','e','f','g'],'a+b+c+d+e+f+g','g0');
        var iterations=2280; //2280
        functions.setMaxDepth(iterations);

        for(var i=1;i<=iterations;i++) {
            //make each subsequent function dependent on the result of previous one, starting with g0
            f = functionFactory(['a','b','c','d','e','f','g'+(i-1)],'a+b+c+d+e+f+g'+(i-1),'g'+i);
        };
        Object.keys(functionRegistry.registeredEntities).length.should.be.equal(iterations+8);
        //execute the last one, cascading dependencies on every single one before
        var res;
        res=f(); //calling without arguments should force the function to look for arguments in registry
        res.should.be.equal(13687);

    });

});