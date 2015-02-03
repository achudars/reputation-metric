var app = angular.module("app", ['ngRoute','highcharts-ng']);

app.config(function ($routeProvider) {
	$routeProvider.when("/", {
		templateUrl: "view.html",
		controller: "AppCtrl"
	})
});

app.controller("AppCtrl", function ($scope) {

	$scope.model = {
		data: "14,7,27,76,258",
		dataAsNumberArray: "14,7,27,76,258",
		min: 10,
		max: 25,
		expanded: [],
		total: 0
	}

	

	$scope.arraySize = function(data) {
		
		var numberArray = $scope.toNumberArray(data);

		// in case the string ends with a comma
		if (isNaN(numberArray[numberArray.length-1])){
			return (numberArray.length-1);
		}

		return numberArray.length;

	};

	$scope.toNumberArray = function(data){

		var numberArray = new Array();

		numberArray = data.split(",");

		for (a in numberArray ) {
		    numberArray[a] = parseInt(numberArray[a], 10);
		}

		return numberArray;
	}


	$scope.getNumber = function(num) {
	    return new Array(num);   
	}

	

	$scope.expand = function(){
		var dataLength = $scope.toNumberArray($scope.model.data).length;
		var dataElements = $scope.toNumberArray($scope.model.data);
		var testArray = new Array();

		for (var i = 0; i < dataLength; i++) {
			var times = dataElements[i];
			for (var j = 1; j <= times; j++) {
				testArray.push(i+1);
			};
		};

		return testArray;
	}


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
			title: {text: 'values'}
		}
    }

    $scope.$watchCollection('model.data', function(newNames, oldNames) {
		$scope.model.dataAsNumberArray = $scope.toNumberArray($scope.model.data);
	 	$scope.model.expanded = $scope.expand();
	 	$scope.model.total = $scope.arraySize($scope.model.data);
	 	//$scope.chartConfig.series[0].data = $scope.toNumberArray($scope.model.data);
	 	$scope.chartConfig.series[0].data = $scope.model.expanded;
	});
});

