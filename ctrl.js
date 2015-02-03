"use strict";

var app = angular.module("controllers", []);

app.controller("appCtrl",
    ["$scope", "appServices", function($scope){
    
    // match_query examples: "prefix", "match_all", "match", etc.
    /*$scope.match_query = "prefix";

    $scope.search_query = "";

    $scope.search = "search..."; */

    // listens to any changes in search_query
    /*$scope.watch("[search_query]", function(){

        // example of a query
        $scope.withGuessing = 
        '{' +
            '"query" : {' +
                '"query_string" : {' +
                    '"default_field" : "meta_data",' +
                    '"fields" : ["title^10","code^100","maturity^15"],' +
                    '"boost" : "1",' +
                    '"query" : "' + $scope.search_query + '", ' +
                    '"default_operator" : "AND"' +
                '}' + 
            '}' + 
            ', "highlight" : {' + 
                '"pre_tags" : ["<strong>"],' + 
                '"post_tags" : ["</strong>"],' + 
                '"fields" : {' + 
                    '"*" : {}' + 
                '}' + 
            '}' + 
        '}';

    }, true);

    // listens to any changes in the query withGuessing
    // updates params accordingly on change
    $scope.watch('[withGuessing]', function(){
        $scope.params = {
            'host' : 'localhost',
            'port' : '9200',
            'query' : $scope.withGuessing,
            'method' : 'post',
            'path' : '_search'
        }
    }, true);

    $scope.isEmptyResult = function(){
        return !$scope.result;
    }

    $scope.isEmptyError = function(){
        return !$scope.resultError;
    }

    $scope.successCallback = function(data){
        $scope.result = data;
    }

    $scope.errorCallback = function(data){
        $scope.result = null;
        $scope.resultError = data;
    }

    $scope.send = function(){
        $scope.result = null;
        $scope.resultError = null;

        if($scope.params !== undefined){
            switch($scope.params.method){
                case "post":
                    Elastic.post(
                        $scope.params,
                        $scope.params.query,
                        $scope.successCallback,
                        $scope.errorCallback
                    );
                    break;

                case "delete":
                    Elastic.delete(
                        $scope.params,
                        $scope.successCallback,
                        $scope.errorCallback
                    );
                    break;

                default:
                    Elastic.get(
                        $scope.params,
                        $scope.successCallback,
                        $scope.errorCallback
                    );
                    break;
            }
        }

    }*/

}]);