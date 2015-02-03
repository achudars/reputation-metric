"use strict";

var app = angular.module("app",[
    "controllers",
    "services",
    "ngRoute",
    "ngResource",
    "ngSanitize"
    ]);

app.config(function ($locationProvider, $routeProvider){
    $locationProvider.html5Mode(true);
    $routeProvider.when("/",{
        templateUrl: "view.html"
    });
});