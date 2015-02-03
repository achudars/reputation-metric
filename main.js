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
		dataAsNumberArray: [14,7,27,76,258],
		min: 10,
		max: 25,
		expanded: [],
		total: 0,
		selfPromoting : [],
		slandering : [],
		selfPromotingMetrics : [],
		slanderingMetrics : []
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
		var sum = $scope.getSumOfValues(arr);
		return (sum/arr.length).toFixed(2);
	}
	/* function to get the median */
	$scope.getMedian = function(arr){
		arr.sort( function(a,b) {return a - b;} );

	    var half = Math.floor(arr.length/2);

	    if(arr.length % 2)
	        return arr[half];
	    else
	        return (arr[half-1] + arr[half]) / 2.0;
	}

	$scope.trimArray = function(arr,percent){

		var size = arr.length;
		var percent = percent * 0.01;
		var trim = Math.round(size * percent);

		if(trim !== 0){
			// remove from the end of the array
			arr = arr.slice(0,-trim);
			// remove from the start of the array
			arr = arr.splice(trim);
		}
		return arr;
	}

	/* function to get the trimmed mean */
	$scope.getTrimmedMean = function(arr,percent){
		return $scope.getMean($scope.trimArray(arr,percent));
	}

	/* function to get the winsorized mean */
	$scope.getWinsorizedMean = function(arr,percent){

		var trimmedArr = $scope.trimArray(arr,percent);
		var first = trimmedArr[0];
		var last = trimmedArr[trimmedArr.length-1];
		var margin = (arr.length - trimmedArr.length)/2;

		for (var i = margin - 1; i >= 0; i--) {
			trimmedArr.unshift(first);
			trimmedArr.push(last);
		};
		
		return $scope.getMean(trimmedArr);
	}


	/* function to get an object containing array changes */
	$scope.makeSelfPromoting = function(){
		// resetting
		$scope.model.selfPromoting = [];

		var attackSize = $scope.model.max - $scope.model.min;

		for (var i = 0, vote = $scope.model.min; vote < $scope.model.max; i++, vote++) {
			var data = new Array();
			data = $scope.toNumberArray($scope.model.data);
			data[data.length-1] += vote; // + 10, +11, +12, ..., +25 for LAST VALUE
			$scope.model.selfPromoting.push({ i : data});
		};

	}

	/* function to get an object containing array changes */
	$scope.makeSlandering = function(){
		// resetting
		$scope.model.slandering = [];

		var attackSize = $scope.model.max - $scope.model.min;

		for (var i = 0, vote = $scope.model.min; vote < $scope.model.max; i++, vote++) {
			var data = new Array();
			data = $scope.toNumberArray($scope.model.data);
			data[0] += vote; // + 10, +11, +12, ..., +25 for FIRST VALUE
			$scope.model.slandering.push({ i : data});
		};
	}


	/* function to get an object containing array changes */
	$scope.makeSelfPromotingMetrics = function(){

		$scope.makeSelfPromoting();
		console.log("=================");
		angular.forEach($scope.model.selfPromoting, function(value, key) {

		 	console.log($scope.model.selfPromoting[key].i);
		 	$scope.model.expanded = $scope.expand();
		 	
		 	var mean = $scope.getMean($scope.model.expanded);
			var median = $scope.getMedian($scope.model.expanded);
			var trimFive = $scope.getTrimmedMean($scope.model.expanded,5);
			var trimTen = $scope.getTrimmedMean($scope.model.expanded,10);
			var winFive = $scope.getWinsorizedMean($scope.model.expanded,5);
			var winTen = $scope.getWinsorizedMean($scope.model.expanded,10);

		 	$scope.model.selfPromotingMetrics.push({ key : [mean,median,trimFive,trimTen,winFive,winTen]});
		});
		console.log("=================");
		angular.forEach($scope.model.selfPromotingMetrics, function(value, key) {
			console.log($scope.model.selfPromotingMetrics[key].key);
		});
	}

	/* function to get an object containing array changes */
	$scope.makeSlanderingMetrics = function(){

		$scope.makeSlandering();
		console.log("-----------------");
		angular.forEach($scope.model.slandering, function(value, key) {

		 	console.log($scope.model.slandering[key].i);
		 	$scope.model.expanded = $scope.expand();

		 	var mean = $scope.getMean($scope.model.expanded);
			var median = $scope.getMedian($scope.model.expanded);
			var trimFive = $scope.getTrimmedMean($scope.model.expanded,5);
			var trimTen = $scope.getTrimmedMean($scope.model.expanded,10);
			var winFive = $scope.getWinsorizedMean($scope.model.expanded,5);
			var winTen = $scope.getWinsorizedMean($scope.model.expanded,10);
			
		 	$scope.model.slanderingMetrics.push({ key : [mean,median,trimFive,trimTen,winFive,winTen]});
		});
		console.log("-----------------");
		angular.forEach($scope.model.slanderingMetrics, function(value, key) {
			console.log($scope.model.slanderingMetrics[key].key);
		});
	}

	/*angular.forEach($scope.model.selfPromoting, function(value, key) {
	  console.log($scope.model.selfPromoting[key]);
	});*/

	// before an attack
	/*var mean = $scope.getMean($scope.model.expanded);
	var median = $scope.getMedian($scope.model.expanded);
	var trimFive = $scope.getTrimmedMean($scope.model.expanded,5);
	var trimTen = $scope.getTrimmedMean($scope.model.expanded,10);
	var winFive = $scope.getWinsorizedMean($scope.model.expanded,5);
	var winTen = $scope.getWinsorizedMean($scope.model.expanded,10);*/


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
	 	//$scope.makeSelfPromoting();
	 	//$scope.makeSlandering();
	 	$scope.makeSelfPromotingMetrics();
	 	$scope.makeSlanderingMetrics();
	});
});

