/**
 * Created by ivanhoe on 2/28/15.
 */
'use strict';

var angular   = require('angular');
var functions = require('../../api/functionFactory.js');

var functionFactory  = functions.factory;
var functionRegistry = functions.registry;

// Create your app
var app = angular.module('mathapp',[]);

app.controller('testsController', ['$scope', function($scope) {
    $scope.addSharedArgument = function() {
        if(!$scope.sharedArguments) {
            $scope.sharedArguments=[];
        }
        $scope.sharedArguments.push({key:'some',value:1});
    };

    $scope.removeSharedArgument = function(sharedArgument) {
        $scope.sharedArguments.splice($scope.sharedArguments.indexOf(sharedArgument), 1);
    };

    $scope.addFormula = function() {
        if(!$scope.formulas) {
            $scope.formulas=[];
        }
        $scope.formulas.push({arguments:[],expression:""});
    };

    $scope.removeFormula = function(formula) {
        $scope.formulas.splice($scope.formulas.indexOf(formula), 1);
    };

    $scope.$watch('sharedArguments', function (sa,oldVal,s) {
        console.log('shared arguments changed');
        var ret = {};
        Array.apply(null, $scope.sharedArguments)
            .map(function(a){
                ret[a.key] = a.value;
            });
        functionRegistry.registerArguments(ret);
    },true);

}]);

app.controller('formulaController', ['$scope','$sce', function($scope,$sce) {

    $scope.addArgument = function(formula) {
        if(!formula.arguments) {
            formula.arguments=[];
        }
        formula.arguments.push({name:'new',value:1});
    };

    $scope.removeArgument = function(argument) {
        var i = $scope.$parent.formula.arguments.indexOf(argument);
        if(i>-1) {
            $scope.$parent.formula.arguments.splice(i, 1);
        }
    };

    $scope.$watch('formula', function (formula,oldVal,s) {
        console.log('watch on formula');
        console.log(formula);

        var newFun;
        var newRes;
        try {
            //TODO: formula names have to be unique, registry updates by default, so it cannot track it
            functionRegistry.deregister(oldVal.name);
            var argNames = Array.apply(null, formula.arguments).map(function(a){return a.name});
            newFun = functionFactory(argNames,formula.expression,formula.name);

            var argValues = Array.apply(null, formula.arguments).map(function(a){return a.nullify ?  null : a.value});
            newRes = newFun.apply(this,argValues); //apply needed given variable number of arguments
            formula.style = 'alert-success';
            formula.message = $sce.trustAsHtml("= " + newRes.toString());
            //formula.function=newFun;

        } catch (e) {
            formula.style = 'alert-danger';
            formula.message =  $sce.trustAsHtml(e.message.toString());
            //formula.function='';
        }
    },true);
}]);

module.exports = app.name;