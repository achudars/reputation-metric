var app = angular.module("app", ["ngRoute","highcharts-ng"]);

app.config(function ($routeProvider) {
	$routeProvider.when("/", {
		templateUrl: "view.html"
	})
});

app.controller("AppCtrl", function ($scope) {

	/* data model */
	$scope.model = {
		data: "4,30,200,706,60",
		dataAsNumberArray: [4,30,200,706,60],
		magnitude: {},
		expanded: [],
		metricsOfExpanded: [],
		total: 0,
		spInput : [],
		slInput : [],
		spExpandedInput : [],
		slExpandedInput : [],
		spMetrics : [],
		slMetrics : [],
		spMetricDiff : [],
		slMetricDiff : []
	}

	$scope.magnitudes = [
		{ name: "small (5 - 10)",       min: 5,   max: 10    },
		{ name: "medium (20 - 40)",     min: 20,  max: 40    },
		{ name: "large (100 - 200)",    min: 100, max: 200   },
		{ name: "extreme (10 - 10000)", min: 10,  max: 10000 }
	];

	$scope.uploaded = "";
	
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
		// toFixed(6) regulates decimal places
		return Number((sum/arr.length).toFixed(4));
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

	/* function to transpose arrays; used for easier visualisation of data */
	$scope.transpose = function(arr) {

	  // Calculate the width and height of the Array
	  var w = arr.length ? arr.length : 0,
		h = arr[0] instanceof Array ? arr[0].length : 0;

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
		  t[i][j] = arr[j][i];
		}
	  }

	  return t;
	};

	$scope.makeMetricsOfExpanded = function(){
		$scope.model.metricsOfExpanded = [];
		$scope.model.expanded = $scope.expand($scope.toNumberArray($scope.model.data));
		var mean = $scope.getMean($scope.model.expanded);
		var median = $scope.getMedian($scope.model.expanded);
		var trimFive = $scope.getTrimmedMean($scope.model.expanded,5);
		var trimTen = $scope.getTrimmedMean($scope.model.expanded,10);
		var winFive = $scope.getWinsorizedMean($scope.model.expanded,5);
		var winTen = $scope.getWinsorizedMean($scope.model.expanded,10);
		$scope.model.metricsOfExpanded.push(mean,median,trimFive,trimTen,winFive,winTen);
	}


	/* STEP 1 */
	$scope.makeInputsWithAttacks = function(){
		// resetting
		$scope.model.spInput = {};
		$scope.model.slInput = {};

		for (var i = 0, votes = $scope.model.magnitude.min; votes <= $scope.model.magnitude.max; i++, votes++) {
			var spData = new Array();
			var slData = new Array();

				spData = $scope.toNumberArray($scope.model.data);
				slData = $scope.toNumberArray($scope.model.data);
				
				spData[spData.length-1] += votes; // self-promoting votes
				slData[0] += votes;				  // slandering votes	

			$scope.model.spInput[i] = spData;
			$scope.model.slInput[i] = slData;
		};

		//console.log("================= STEP 1 =================");
		/*angular.forEach($scope.model.spInput, function(value, key) {
			console.log($scope.model.spInput[key]);
			console.log($scope.model.slInput[key]);
		});*/

	}

	/* STEP 2 */
	$scope.makeExpandedInputsWithAttacks = function(){

		$scope.makeInputsWithAttacks();

		angular.forEach($scope.model.spInput, function(value, key) {
			$scope.model.spExpandedInput[key] = $scope.expand($scope.model.spInput[key]);
			$scope.model.slExpandedInput[key] = $scope.expand($scope.model.slInput[key]);
		});
 
		//console.log("================= STEP 2 =================");
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
 
		//console.log("================= STEP 3 =================");
		/*angular.forEach($scope.model.spMetrics, function(value, key) {
			console.log($scope.model.spMetrics[key]);
			console.log($scope.model.slMetrics[key]);
		});*/
	}

	/* STEP 4 */
	$scope.makeDiffsForMetrics = function(min,max){
		
		// RESET DATA
		$scope.model.spInput = [];
		$scope.model.slInput = [];
		$scope.model.spExpandedInput = [];
		$scope.model.slExpandedInput = [];
		$scope.model.spMetrics = [];
		$scope.model.slMetrics = [];
		$scope.model.spMetricDiff = [];
		$scope.model.slMetricDiff = [];

		$scope.makeMetricsOnExpandedInputsWithAttacks();

		var size = $scope.model.spMetrics[0].length; // as we have 6 metrics, this will be 6

		var spMetricsTransposed = $scope.transpose($scope.model.spMetrics);
		var slMetricsTransposed = $scope.transpose($scope.model.slMetrics);

		angular.forEach(spMetricsTransposed, function(value, key) {
			var spTempArray = new Array();
			var slTempArray = new Array();

			for (var i = 0; i < (spMetricsTransposed[key].length); i++) {
				
				var spDiff = Number((spMetricsTransposed[key][i]-$scope.model.metricsOfExpanded[key]).toFixed(4));
				var slDiff = Number((slMetricsTransposed[key][i]-$scope.model.metricsOfExpanded[key]).toFixed(4));

				spTempArray.push(spDiff);
				slTempArray.push(slDiff);
			}
			$scope.model.spMetricDiff[key] = spTempArray; // 6 arrays with diffs
			$scope.model.slMetricDiff[key] = slTempArray; // 6 arrays with diffs
		});

		//console.log("================= STEP 4 =================");
		/*angular.forEach($scope.model.spMetricDiff, function(value, key) {
			console.log($scope.model.spMetricDiff[key]);
			console.log($scope.model.slMetricDiff[key]);
		});*/
	}

	$scope.printResults = function(){
		var numberOfAttacks = $scope.model.magnitude.min;
		console.clear();
		console.log("_______________________________________________");
		console.log($scope.model.total + "," + $scope.model.data);
		console.log($scope.model.magnitude.min + "," + $scope.model.magnitude.max);
		console.warn("" + $scope.model.metricsOfExpanded);
		console.dir("Self-promoting [ i, δ1, δ2, δ3, δ4, δ5, δ6 ]: ");

		angular.forEach($scope.model.spMetrics, function(value, key) {
			var spTempArray = new Array();
			for (var i = 0; i < ($scope.model.spMetrics[key].length); i++) {
				var spDiff = Number(($scope.model.spMetrics[key][i]-$scope.model.metricsOfExpanded[i]).toFixed(4));
				spTempArray.push(spDiff.toFixed(4));
			}
			console.info("[ " + numberOfAttacks++ + "," + spTempArray + " ]");
		});

		var numberOfAttacks = $scope.model.magnitude.min;
		console.dir("Slandering [ i, δ1, δ2, δ3, δ4, δ5, δ6 ]: ");
		angular.forEach($scope.model.slMetrics, function(value, key) {
			var slTempArray = new Array();
			for (var i = 0; i < ($scope.model.slMetrics[key].length); i++) {
				var slDiff = Number(($scope.model.slMetrics[key][i]-$scope.model.metricsOfExpanded[i]).toFixed(4));
				slTempArray.push(slDiff.toFixed(4));
			}
			console.info("[ " + numberOfAttacks++ + ", " + slTempArray + " ]");
		});
	}

	
	$scope.chartTypes = [
		{chart: {type: "column"},tooltip: "disabled"},
		{chart: {type: "area"},tooltip: "disabled"},
		{chart: {type: "line"},tooltip: "disabled"}

		//,{chart: {type: "scatter"}}
	];
	$scope.chartOptions = $scope.chartTypes[0];

	$scope.xAxis = { gridLineWidth: 1, allowDecimals: false, startOnTick: false,title: {text: "number of attacks"}},
	$scope.yAxis = { title: {text: "change to rating"}}

	/* Highcharts Config */
	$scope.chartConfig01 = { //
		series: [{ name: "mean: self-promoting", data: 0 },{ name: "mean: slandering", data: 0 }],
		title: {text: "mean"},
		xAxis: $scope.xAxis,
		yAxis: $scope.yAxis,
		tooltip: null
	}
	$scope.chartConfig02 = { //
		series: [{ name: "median: self-promoting", data: 0 },{ name: "median: slandering", data: 0 }],
		title: {text: "median"},
		xAxis: $scope.xAxis,
		yAxis: $scope.yAxis,
		tooltip: null
	}
	$scope.chartConfig03 = { //
		series: [{ name: "trimmed at 5%: self-promoting", data: 0 },{ name: "trimmed at 5%: slandering", data: 0 }],
		title: {text: "trimmed at 5%"},
		xAxis: $scope.xAxis,
		yAxis: $scope.yAxis,
		tooltip: null
	}
	$scope.chartConfig04 = { //
		series: [{ name: "trimmed at 10%: self-promoting", data: 0 },{ name: "trimmed at 10%: slandering", data: 0 }],
		title: {text: "trimmed at 10%"},
		xAxis: $scope.xAxis,
		yAxis: $scope.yAxis,
		tooltip: null
	}
	$scope.chartConfig05 = { //
		series: [{ name: "winsorized at 5%: self-promoting", data: 0 },{ name: "winsorized at 5%: slandering", data: 0 }],
		title: {text: "winsorized at 5%"},
		xAxis: $scope.xAxis,
		yAxis: $scope.yAxis,
		tooltip: null
	}
	$scope.chartConfig06 = { //
		series: [{ name: "winsorized at 10%: self-promoting", data: 0 },{ name: "winsorized at 10%: slandering", data: 0 }],
		title: {text: "winsorized at 10%"},
		xAxis: $scope.xAxis,
		yAxis: $scope.yAxis,
		tooltip: null
	}

	$scope.updatePlots = function(){
		/* update chart type */
		$scope.chartConfig01.options = $scope.chartOptions;
		$scope.chartConfig02.options = $scope.chartOptions;
		$scope.chartConfig03.options = $scope.chartOptions;
		$scope.chartConfig04.options = $scope.chartOptions;
		$scope.chartConfig05.options = $scope.chartOptions;
		$scope.chartConfig06.options = $scope.chartOptions;

		/* update chart data */
		$scope.chartConfig01.series[0].data = $scope.model.spMetricDiff[0];
		$scope.chartConfig01.series[1].data = $scope.model.slMetricDiff[0];

		$scope.chartConfig02.series[0].data = $scope.model.spMetricDiff[1];
		$scope.chartConfig02.series[1].data = $scope.model.slMetricDiff[1];

		$scope.chartConfig03.series[0].data = $scope.model.spMetricDiff[2];
		$scope.chartConfig03.series[1].data = $scope.model.slMetricDiff[2];

		$scope.chartConfig04.series[0].data = $scope.model.spMetricDiff[3];
		$scope.chartConfig04.series[1].data = $scope.model.slMetricDiff[3];

		$scope.chartConfig05.series[0].data = $scope.model.spMetricDiff[4];
		$scope.chartConfig05.series[1].data = $scope.model.slMetricDiff[4];

		$scope.chartConfig06.series[0].data = $scope.model.spMetricDiff[5];
		$scope.chartConfig06.series[1].data = $scope.model.slMetricDiff[5];
	}
	/* Watchers for changes */
	$scope.$watchGroup(["model.data","model.magnitude.min","model.magnitude.max","model.total","chartOptions"], function(newNames, oldNames) {

		console.log(typeof $scope.model.data);
		$scope.model.total = $scope.arraySize($scope.model.data);

		if ($scope.model.magnitude.min >= $scope.model.magnitude.max) {
			$scope.model.magnitude.max += 1;
		}

		$scope.model.dataAsNumberArray = $scope.toNumberArray($scope.model.data);
		$scope.makeMetricsOfExpanded();
			
		$scope.makeDiffsForMetrics($scope.model.magnitude.min,$scope.model.magnitude.max);

		$scope.updatePlots();

		$scope.printResults();

	});

	// handle upload
	$scope.handleUploadedFile = function(){
		try {
			console.log($scope.uploaded);
			// replace plus or minus with a comma; escape newline and space; keep only digits
			var removedText = $scope.uploaded.replace(/\+|\-/, ',').replace(/\t\s\r\n+/, '');
			// set test to array
			removedText = $scope.toNumberArray(removedText);
			// remove first number (that denotoes the number of star range, e.g., 5 meaning from 1 to 5 stars)
			removedText.shift();
			// update model
			var max = removedText.pop();
			var min = removedText.pop();
			// tell the user that magnitude is custom
			$scope.magnitudes[4] = { name: "custom ( "+min+" - "+max+" )", min: min, max: max};
			$scope.model.magnitude = $scope.magnitudes[4];

			$scope.model.data = String(removedText);

		} catch(err) {
			console.log("No file uploaded or bad file. Details: " + err);
		}
	}
	// watch for upload
	$scope.$watch('uploaded', function(newValue, oldValue) {
		if ($scope.uploaded.length > 0){
			$scope.handleUploadedFile();
		}	
	});

});



app.directive("uploaded", [function () {
	return {
		scope: {
			uploaded: "="
		},
		link: function (scope, element, attributes) {
			element.bind("change", function (changeEvent) {
				var reader = new FileReader();
				reader.onload = function (loadEvent) {
					scope.$apply(function () {
						scope.uploaded = loadEvent.target.result;
					});
				}
				reader.readAsText(changeEvent.target.files[0]);
			});
		}
	}
}]);
