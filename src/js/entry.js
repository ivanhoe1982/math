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

    //$scope.formulas = [
    //    {
    //        name: 'example function A',
    //        arguments: ['one', 'two', 'three'],
    //        expression: 'one*two*three'
    //    },
    //    {  name : 'example function B',
    //        arguments : ['one','two','three'],
    //        expression : 'one*two*three'
    //    },
    //
    //    {  name : 'example function C',
    //        arguments : ['one','two','three'],
    //        expression : 'one*two*three'
    //    }
    //];

    $scope.addFormula = function() {
        if(!$scope.formulas) {
            $scope.formulas=[];
        }
        $scope.formulas.push({arguments:[],argumentValues:[],expression:""});
        //$scope.formulas.push({  name : 'example function C',
        //    arguments : ['one','two','three'],
        //    expression : 'one*two*three'});
    };

    $scope.removeFormula = function(formula) {
        $scope.formulas.splice($scope.formulas.indexOf(formula), 1);
    };

}]);

app.controller('formulaController', ['$scope','$sce', function($scope,$sce) {


    $scope.addArgument = function(formula) {
        if(!formula.arguments) {
            formula.arguments=[];
        }
        if(!formula.argumentValues) {
            formula.argumentValues=[];
        }
        formula.arguments.push('new');
        formula.argumentValues.push(1);

    };

    $scope.removeArgument = function(argument) {
        var i = $scope.$parent.formula.arguments.indexOf(argument);
        if(i>-1) {
            $scope.$parent.formula.arguments.splice(i, 1);
            $scope.$parent.formula.argumentValues.splice(i, 1);
        }
    };

    $scope.$watch('formula', function (formula,oldVal,s) {
        console.log('watch on formula'); //TODO: probably not needed
        console.log(formula);

        var newFun;
        var newRes;
        try {
            newFun = functionFactory(formula.arguments,formula.expression);
            if(!formula.argumentValues) {
                formula.argumentValues = Array.apply(null, new Array(formula.arguments.length)).map(function(){return 1});

            };
            newRes = newFun.apply(this,formula.argumentValues); //apply needed given variable number of arguments
            formula.style = 'alert-success';
            formula.message = $sce.trustAsHtml(newRes.toString());

        } catch (e) {
            formula.style = 'alert-danger';
            formula.message =  $sce.trustAsHtml(e.message.toString());
        }
    },true);
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