/**
 * Created by ivanhoe on 2/28/15.
 */
var should = require('should');

describe('functionFactory',function() {
    var functionFactory=require('../api/functionFactory.js');

    describe('constructor',function() {

        it('should create functions given list of arguments and expression',function(){
            var functionA=functionFactory(["one","two","three"],'one*2+two^2*three');

            functionA.should.be.a.Function;
            functionA.should.be.a.Function;
            functionA.should.not.be.a.String;

            functionA.should.not.have.property('parser');
            functionA.should.have.property('arguments');
        });

        it('should create functions with one or more arguments',function(){
            functionFactory.bind(null,["one"],'one').should.not.throw();
            functionFactory.bind(null,["one","two"],'one*2+two^2').should.not.throw();
            functionFactory.bind(null,["one","two","three"],'one*2+two^2*three').should.not.throw();
        });

        it('should throw an error if arguments missing or of the wrong type',function() {
            functionFactory.bind(null,["one","two","three"],'one*2+two^2*three').should.not.throw();
            functionFactory.bind(null,["one","two","three"],["one","two","three"]).should.throw(/^Wrong arguments: second needs to be a string/);
            functionFactory.bind(null,["one","two","three"],55).should.throw(/^Wrong arguments: second needs to be a string/);
            functionFactory.bind(null,["one","two","three"]).should.throw(/^Wrong arguments: requires two arguments: a list of arguments and an expression/);
            functionFactory.bind(null,null,["one","two","three"]).should.throw(/^Wrong arguments: first argument needs to be an array of arguments/);
            functionFactory.bind(null,"three").should.throw(/^Wrong arguments: requires two arguments: a list of arguments and an expression/);
            functionFactory.bind(null,"three",'one*2+two^2*three').should.throw(/^Wrong arguments: first argument needs to be an array of arguments/);
        });

        it('should throw an error if empty arguments passed',function() {
            functionFactory.bind(null, [], 'one*2+two^2*three').should.throw(/^Wrong arguments: array of arguments cannot be empty/);
            functionFactory.bind(null, ['one'], '').should.throw(/^Wrong arguments: expression empty/);
        });

        it('should throw if expression is not parsable and show parser exception',function() {
            functionFactory.bind(null,["one","two","three"],'one&two&three').should.throw(/^Expression cannot be parsed: one&two&three/);
        });

        it('should throw if some arguments are not present in the expression',function() {
            functionFactory.bind(null,["one","two","three"],'1*3*4').should.throw(/^Arguments <strong>one, two, three<\/strong> are not in the expression. Check your expression or remove some arguments/);
            functionFactory.bind(null,["one","two","three"],'one*3*4').should.throw(/^Arguments <strong>two, three<\/strong> are not in the expression. Check your expression or remove some arguments/);
            functionFactory.bind(null,["one","two","three"],'one*three*4').should.throw(/^Arguments <strong>two<\/strong> are not in the expression. Check your expression or remove some arguments/);
        });
    });

    describe('generated functions',function() {
        var functionA;
        var functionB;
        beforeEach(function(done) {
            functionA=functionFactory(["one","two","three"],'one*2+two^2*three');
            functionB=functionFactory(["one","two"],'one*2+two^2');
            functionC=functionFactory(["one"],'one');
            done();
        });

        it('should throw if called with a different number of parameters than defined initially',function() {
            functionA.bind(null).should.throw(/^Incorrect number of arguments. Expected <strong>3<\/strong>/);
            functionA.bind(null,1).should.throw(/^Incorrect number of arguments. Expected <strong>3<\/strong>/);
            functionA.bind(null,1,2).should.throw(/^Incorrect number of arguments. Expected <strong>3<\/strong>/);
            functionA.bind(null,1,2,3).should.not.throw(/^Incorrect number of arguments. Expected <strong>3<\/strong>/);
            functionA.bind(null,1,2,3,4).should.throw(/^Incorrect number of arguments. Expected <strong>3<\/strong>/);
            functionA.bind(null,1,2,3,4).should.not.throw(/^Incorrect number of arguments. Expected <strong>5<\/strong>/);

            functionB.bind(null).should.throw(/^Incorrect number of arguments. Expected <strong>2<\/strong>/);
            functionB.bind(null,1).should.throw(/^Incorrect number of arguments. Expected <strong>2<\/strong>/);
            functionB.bind(null,1,2).should.not.throw(/^Incorrect number of arguments. Expected <strong>2<\/strong>/);
            functionB.bind(null,1,2,3).should.throw(/^Incorrect number of arguments. Expected <strong>2<\/strong>/);
            functionB.bind(null,1,2,3).should.not.throw(/^Incorrect number of arguments. Expected <strong>4<\/strong>/);

            functionC.bind(null).should.throw(/^Incorrect number of arguments. Expected <strong>1<\/strong>/);
            functionC.bind(null,1).should.not.throw(/^Incorrect number of arguments. Expected <strong>1<\/strong>/);
            functionC.bind(null,1,2).should.throw(/^Incorrect number of arguments. Expected <strong>1<\/strong>/);
            functionC.bind(null,1,2,3).should.throw(/^Incorrect number of arguments. Expected <strong>1<\/strong>/);

        });

        it('should throw if any of the arguments is not a number',function() {
            functionA.bind(null,1,2,'a').should.throw(/^Arguments have to be numbers. Incorrect argument <strong>a<\/strong>/);
            functionA.bind(null,1,2,'b').should.throw(/^Arguments have to be numbers. Incorrect argument <strong>b<\/strong>/);
            functionA.bind(null,'c',2,'a').should.throw(/^Arguments have to be numbers. Incorrect argument <strong>c<\/strong>/);
            functionA.bind(null,1,2,3).should.not.throw(/^Arguments have to be numbers. Incorrect argument <strong>a<\/strong>/);
        });

        it('should return a number for numeric arguments',function(){
            functionA.bind(null,1,2,3).should.not.throw();
            functionA(1,2,3).should.equal(14);
            functionA(1,1,1).should.equal(3);

            functionC.bind(null,1).should.not.throw();
            functionC(1).should.equal(1);


        });


    });

    describe('should throw if a reserved word is used as an argument name',function() {


        it.only('should handle special case of token "new"',function(){
            functionFactory.bind(null,["new"],'new').should.throw(/^Argument <strong>new<\/strong> is a reserved JavaScript keyword. Change it./);

        });
    });
});
