(function() {

    "use strict";

    var app = angular.module("app.controllers", []);

    app.controller("ChartCtrl", ["$scope", function($scope) {
        /* Highcharts Config */
        $scope.chartConfig = {
            options: {
                chart: {
                    type: 'column'
                }
            },
            series: [{
                data: $scope.toNumberArray($scope.model.data)
            }],
            title: {
                text: 'Hello'
            },
            xAxis: {
                minRange: 1,
                startOnTick: false,
                title: {
                    text: 'values'
                }
            }
        }
    }]);

}());