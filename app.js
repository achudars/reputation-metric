(function() {

    "use strict";

    var app = angular.module("app", [
        "ngRoute", "highcharts-ng", "app.controllers","ngResource"
        //"services",
        //"ngRoute",
        //"ngResource",
        //"ngSanitize"
    ]);

    /*App.config(function ($routeProvider) {
      $routeProvider
        .when('/view1', {
             templateUrl: 'view/view1.html'
        })
        .when('/view2', {
             templateUrl: 'view/view2.html'
        })
        .otherwise({redirectTo : 'view1'});
    });*/

    app.config(function($locationProvider, $routeProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
        $routeProvider.when("/", {
            templateUrl: "view.html"
        });
    });

}());