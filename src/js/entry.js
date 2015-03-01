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
        {  name : 'example function A',
            arguments : ['one','two','three'],
            expression : 'one*two*three',
            result:123},
        //addArgument : addArgument},
        {  name : 'example function B',
            arguments : ['one','two','three'],
            expression : 'one*two*three'},
        {  name : 'example function C',
            arguments : ['one','two','three'],
            expression : 'one*two*three'}
    ];

    $scope.addFormula = function() {
        $scope.formulas.push({  name : 'example function C',
            arguments : ['one','two','three'],
            expression : 'one*two*three'});
    };

    $scope.addArgument = function(f) {
        f.arguments.push('new');
    };
}]);

app.controller('formulaController', ['$scope', function($scope) {

    $scope.$watch('f', function (formula) {
        console.log('watch on formula'); //TODO: probably not needed
    },true);

    $scope.$watch('f.arguments', function (formula) {
        console.log('watch on arguments'); //TODO: can't capture changes
    },true);

    $scope.$watch('f.expression', function (formula) {
        console.log('watch on expression');
    });
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