"use strict";

var app = angular.module("services",[]);

app.factory("appService", function($resource, $http){
    var Factory = function(){}

    /*Elastic.prototype.get = function(params, successCallback, errorCallback) {
        $resource(
            "http://" + params.host + "::port" + "/" + params.path,
            { port: params.port },
            {
                get: {
                    method: "GET"
                }
            }
        ).get({}, successCallback, errorCallback);
    }

    Elastic.prototype.post = function(params, data, successCallback, errorCallback){
        // post(url, data, [config])
        var postRequest = $http.post(
            "http://" + params.host + ":" + params.port + "/" + params.path,    // url
            data || {},                                                         // data
            {
                headers: {
                    "Content-Type":"application/x-www-form-urlencoded"       // [config]
                }
            }
        );

        postRequest.success(successCallback).error(errorCallback);

    }

    Elastic.prototype.delete = function(params, successCallback, errorCallback){
        // delete(url, [config])
        var deleteRequest = $http.delete(
            "http://" + params.host + ":" + params.host + "/" + params.path, // url
            {
                headers: {
                    "Content-Type":"text/plain"
                },
                data: {}
            }
        );

        deleteRequest.success(successCallback).error(errorCallback);
    }*/

    return new factory();

});