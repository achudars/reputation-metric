var app = angular.module("app", ['ngRoute','highcharts-ng']);

app.config(function ($routeProvider) {
	$routeProvider.when("/", {
		templateUrl: "view.html",
		controller: "AppCtrl"
	})
});

app.controller("AppCtrl", function ($scope) {

	/* data model */
	$scope.model = {
		data: "14,7,27,76,258",
		dataAsNumberArray: "14,7,27,76,258",
		min: 10,
		max: 25,
		expanded: [],
		total: 0
	}

	
	/* function to get the size of an array from the input */
	$scope.arraySize = function(data) {
		var numberArray = $scope.toNumberArray(data);
		// in case the string ends with a comma
		if (isNaN(numberArray[numberArray.length-1])){
			return (numberArray.length-1);
		}
		return numberArray.length;
	};

	/* function to tranform text string into a number array */
	$scope.toNumberArray = function(data){
		var numberArray = new Array();
		numberArray = data.split(",");
		for (a in numberArray ) {
		    numberArray[a] = parseInt(numberArray[a], 10);
		}
		return numberArray;
	}

	/* function to get numbered values for ngRepeat */
	$scope.getNumber = function(num) {
	    return new Array(num);   
	}

	/* function to expand the initial input into full distribution */
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

	/* function to return the sum of all values */
	$scope.getSumOfValues = function(arr){
		var total = 0;
		$.each(arr,function() {
	    	total += this;
		});
		return total;
	}
	

	/* function to get the mean */
	$scope.getMean = function(arr){
		console.log("arr: " + arr + " tyepof: " + typeof arr);
		arr = $scope.toNumberArray(arr);
		console.log("arr: " + arr + " tyepof: " + typeof arr);
		sum = $scope.getSumOfValues(arr);
		console.log("arr: " + arr + " tyepof: " + typeof arr);
		console.log("sum: " + sum + " tyepof: " + typeof sum);
		return (sum/arr.length).toFixed(2);
	}
	/* function to get the median */
	$scope.getMedian = function(arr){
		arr = $scope.toNumberArray(arr);
		arr.sort( function(a,b) {return a - b;} );

	    var half = Math.floor(arr.length/2);

	    if(arr.length % 2)
	        return arr[half];
	    else
	        return (arr[half-1] + arr[half]) / 2.0;
	}
	/* function to get the trimmed mean */
	/* function to get the winsorized mean */

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
			title: {text: 'values'}
		}
    }

    /* Watchers for changes */
    $scope.$watchCollection('model.data', function(newNames, oldNames) {
		$scope.model.dataAsNumberArray = $scope.toNumberArray($scope.model.data);
	 	$scope.model.expanded = $scope.expand();
	 	$scope.model.total = $scope.arraySize($scope.model.data);
	 	$scope.chartConfig.series[0].data = $scope.model.expanded;
	});
});

