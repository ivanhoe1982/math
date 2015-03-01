/**
 * Created by ivanhoe on 2/28/15.
 */
//<script src="js/math.min.js">
//<script src="js/should.min.js">
//<script src="js/mocha.min.js">
//<script>mocha.setup('bdd')</script>
//<script src="js/tests.js"></script>
//<script>
//mocha.run();
//</script>
'use strict';

var angular             = require('angular');

//var mocha           = require('../../bower_components/mocha/mocha.js'); //does not work with browserify
var mathparse           = require('../../api/pegjs/math.js');
var functionFactory     = require('../../api/functionFactory.js');
//var tests           = require('../../test/functionFactoryTests.js');



// Create your app
var app = angular.module('mathapp',[]);

app.controller('testsController', ['$scope', function($scope) {

    $scope.formulas = [
        {
            name: 'example function A',
            arguments: ['one', 'two', 'three'],
            expression: 'one*two*three'
        },
        {  name : 'example function B',
            arguments : ['one','two','three'],
            expression : 'one*two*three'
        },

        {  name : 'example function C',
            arguments : ['one','two','three'],
            expression : 'one*two*three'
        }
    ];

    $scope.addFormula = function() {
        $scope.formulas.push({  name : 'example function C',
            arguments : ['one','two','three'],
            expression : 'one*two*three'});
    };

}]);

app.controller('formulaController', ['$scope','$sce', function($scope,$sce) {


    $scope.addArgument = function(formula) {
        formula.arguments.push('new');
    };

    var evaluate = function(formula, update) {
        var newFun;
        var newRes;
        try {
            newFun = functionFactory(formula.arguments,formula.expression);
            if(!formula.argumentValues) {
                formula.argumentValues = Array.apply(null, new Array(formula.arguments.length)).map(function(){return 1});

            };
            newRes = newFun.apply(this,formula.argumentValues); //apply needed given variable number of arguments
            formula.message = newRes;

        } catch (e) {
            formula.message =  e.message;
        }
        update(formula);
    };


    $scope.$watch('formula', function (formula,oldVal,s) {
        console.log('watch on formula'); //TODO: probably not needed
        console.log(formula);
        evaluate(formula,function(f) {
            //$scope.apply(function() {
                $scope.$parent.formula.argumentValues = f.argumentValues;
                $scope.$parent.formula.message = $sce.trustAsHtml(f.message.toString());

            //$scope.$parent.apply();
            //});
        });
    },true);
    //
    //$scope.$watch('argument', function (argument,oldVal,s) {
    //    console.log('watch on argument'); //TODO: can't capture changes
    //    console.log(argument);
    //    //evaluate(s.$parent.formula,function(formula) {
    //    //    //s.apply(function() {
    //    //        s.$parent.formula.argumentValues = formula.argumentValues;
    //    //        s.$parent.formula.message = formula.message;
    //    //        s.$parent.formula.result = formula.result;
    //    //    //});
    //    //});
    //},true); //deep watch
    ////
    //$scope.$watch('expression', function (expression,oldVal,s) {
    //    console.log('watch on expression');
    //    console.log(expression);
    //    //evaluate(s.$parent.f,function(formula) {
    //    //    s.apply(function() {
    //    //        s.$parent.f.argumentValues=formula.argumentValues;
    //    //        s.$parent.f.message=formula.message;
    //    //        s.$parent.f.result=formula.result;
    //    //    });
    //    //});
    //});
}]);






//var addArgument = function(formula) {
//    $scope.formulas($scope.formulas.indexOf(formula)).arguments.push({});
//    //$scope.apply(function(){
//    //
//    //});
//};
//    [
//    functionFactory(["one","two","three"],'one*2+two^2*three'),
//    functionFactory(["one","two","three"],'one*2+two^2*three'),
//    functionFactory(["one","two","three"],'one*2+two^2*three')
//];
//alert(functionA(1,2,3));
module.exports = app.name;