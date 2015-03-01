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
    var functionA=functionFactory(["one","two","three"],'one*2+two^2*three');
    alert(functionA(1,2,3));
}]);

module.exports = app.name;