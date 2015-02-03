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
		spInput : [],
		slInput : [],
		spExpandedInput : [],
		slExpandedInput : [],
		spMetrics : [],
		slMetrics : [],
		spMetricDiffs : [],
		slMetricDiffs : []
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
	$scope.expand = function(arr){
		//var dataLength = $scope.toNumberArray($scope.model.data).length;
		//var dataElements = $scope.toNumberArray($scope.model.data);

		var dataLength = arr.length;
		var dataElements = arr;

		var expandedArray = new Array();

		for (var i = 0; i < dataLength; i++) {
			var times = dataElements[i];
			for (var j = 1; j <= times; j++) {
				expandedArray.push(i+1);
			};
		};
		return expandedArray;
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
		// must be Number(), otherwise will be a string
		// toFixed() regulates decimal places
		return Number((sum/arr.length).toFixed(2));
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


	$scope.transpose = function(a) {

	  // Calculate the width and height of the Array
	  var w = a.length ? a.length : 0,
	    h = a[0] instanceof Array ? a[0].length : 0;

	  // In case it is a zero matrix, no transpose routine needed.
	  if(h === 0 || w === 0) { return []; }

	  /**
	   * @var {Number} i Counter
	   * @var {Number} j Counter
	   * @var {Array} t Transposed data is stored in this array.
	   */
	  var i, j, t = [];

	  // Loop through every item in the outer array (height)
	  for(i=0; i<h; i++) {

	    // Insert a new row (array)
	    t[i] = [];

	    // Loop through every item per item in outer array (width)
	    for(j=0; j<w; j++) {

	      // Save transposed data.
	      t[i][j] = a[j][i];
	    }
	  }

	  return t;
	};






	/* STEP 1 */
	$scope.makeInputsWithAttacks = function(){
		// resetting
		$scope.model.spInput = {};
		$scope.model.slInput = {};

		var attackSize = $scope.model.max - $scope.model.min;

		for (var i = 0, votes = $scope.model.min; votes < $scope.model.max; i++, votes++) {
			var spData = new Array();
			var slData = new Array();

			    spData = $scope.toNumberArray($scope.model.data);
			    slData = $scope.toNumberArray($scope.model.data);
			    
			    spData[spData.length-1] += votes; // self-promoting votes
			    slData[0] += votes;				  // slandering votes	

			$scope.model.spInput[i] = spData;
			$scope.model.slInput[i] = slData;
		};

		console.log("================= STEP 1 =================");
		/*angular.forEach($scope.model.spInput, function(value, key) {
			console.log($scope.model.spInput[key]);
			console.log($scope.model.slInput[key]);
		});*/

	}

	/* STEP 2 */
	$scope.makeExpandedInputsWithAttacks = function(){

		$scope.makeInputsWithAttacks();

		angular.forEach($scope.model.spInput, function(value, key) {

		 	//$scope.model.expanded = $scope.expand();
		 	
		 	$scope.model.spExpandedInput[key] = $scope.expand($scope.model.spInput[key]);
		 	$scope.model.slExpandedInput[key] = $scope.expand($scope.model.slInput[key]);

		 	/*var mean = $scope.getMean($scope.model.expanded);
			var median = $scope.getMedian($scope.model.expanded);
			var trimFive = $scope.getTrimmedMean($scope.model.expanded,5);
			var trimTen = $scope.getTrimmedMean($scope.model.expanded,10);
			var winFive = $scope.getWinsorizedMean($scope.model.expanded,5);
			var winTen = $scope.getWinsorizedMean($scope.model.expanded,10);

		 	$scope.model.spExpandedInput[key] = [mean,median,trimFive,trimTen,winFive,winTen];
		 	$scope.model.spExpandedInput[key] = [mean,median,trimFive,trimTen,winFive,winTen];*/
		});
 
		console.log("================= STEP 2 =================");
		/*angular.forEach($scope.model.spExpandedInput, function(value, key) {
			console.log($scope.model.spExpandedInput[key]);
			console.log($scope.model.slExpandedInput[key]);
		});*/
	}

	/* STEP 3 */
	$scope.makeMetricsOnExpandedInputsWithAttacks = function(){

		$scope.makeExpandedInputsWithAttacks();

		angular.forEach($scope.model.spExpandedInput, function(value, key) {

		 	var spMean = $scope.getMean($scope.model.spExpandedInput[key]);
			var spMedian = $scope.getMedian($scope.model.spExpandedInput[key]);
			var spTrimFive = $scope.getTrimmedMean($scope.model.spExpandedInput[key],5);
			var spTrimTen = $scope.getTrimmedMean($scope.model.spExpandedInput[key],10);
			var spWinFive = $scope.getWinsorizedMean($scope.model.spExpandedInput[key],5);
			var spWinTen = $scope.getWinsorizedMean($scope.model.spExpandedInput[key],10);

			var slMean = $scope.getMean($scope.model.slExpandedInput[key]);
			var slMedian = $scope.getMedian($scope.model.slExpandedInput[key]);
			var slTrimFive = $scope.getTrimmedMean($scope.model.slExpandedInput[key],5);
			var slTrimTen = $scope.getTrimmedMean($scope.model.slExpandedInput[key],10);
			var slWinFive = $scope.getWinsorizedMean($scope.model.slExpandedInput[key],5);
			var slWinTen = $scope.getWinsorizedMean($scope.model.slExpandedInput[key],10);

		 	$scope.model.spMetrics[key] = [spMean,spMedian,spTrimFive,spTrimTen,spWinFive,spWinTen];
		 	$scope.model.slMetrics[key] = [slMean,slMedian,slTrimFive,slTrimTen,slWinFive,slWinTen];
		});
 
		console.log("================= STEP 3 =================");
		/*angular.forEach($scope.model.spMetrics, function(value, key) {
			console.log($scope.model.spMetrics[key]);
			console.log($scope.model.slMetrics[key]);
		});*/
	}

	/* STEP 4 */
	$scope.makeDiffsForMetrics = function(min,max){
		$scope.model.spMetricDiff = [];
		$scope.model.slMetricDiff = [];
		$scope.makeMetricsOnExpandedInputsWithAttacks();

		var size = $scope.model.spMetrics[0].length; // as we have 6 metrics, this will be 6

		var spMetricsTransposed = $scope.transpose($scope.model.spMetrics);
		var slMetricsTransposed = $scope.transpose($scope.model.slMetrics);

		angular.forEach(spMetricsTransposed, function(value, key) {
			var spTempArray = new Array();
			var slTempArray = new Array();

			for (var i = 0; i < (spMetricsTransposed[key].length-1); i++) {

				var spDiff = Number((spMetricsTransposed[key][i]-spMetricsTransposed[key][i+1]).toFixed(2));
				var slDiff = Number((slMetricsTransposed[key][i]-slMetricsTransposed[key][i+1]).toFixed(2));
				spTempArray.push(spDiff);
				slTempArray.push(slDiff);
			}
			$scope.model.spMetricDiff[key] = spTempArray; // 6 array with diffs
			$scope.model.slMetricDiff[key] = slTempArray; // 6 array with diffs
		});
 
		console.log("================= STEP 4 =================");
		/*angular.forEach($scope.model.spMetricDiff, function(value, key) {
			console.log($scope.model.spMetricDiff[key]);
			console.log($scope.model.slMetricDiff[key]);
		});*/
	}

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
	 	//$scope.model.expanded = $scope.expand();
	 	$scope.model.total = $scope.arraySize($scope.model.data);
	 	$scope.chartConfig.series[0].data = $scope.toNumberArray($scope.model.data);
	 	//$scope.makeSelfPromoting();
	 	//$scope.makeSlandering();
	 	//$scope.makeSelfPromotingMetrics();
	 	//$scope.makeSlanderingMetrics();
	 	//$scope.makeExpandedInputsWithAttacks();
	 	//$scope.makeMetricsOnExpandedInputsWithAttacks();
	 	$scope.makeDiffsForMetrics($scope.model.min,$scope.model.max);
	});
});

