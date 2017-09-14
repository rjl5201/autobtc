var siteApp = angular.module('siteApp', [ 'ngMaterial', 'ngRoute', 'firebase' ]);

siteApp.config(function($routeProvider) {

	$routeProvider
		.when('/', {
			templateUrl : 'chart.html',
			controller : 'chartController',
		})
		
		.when('/expense', {
			templateUrl : 'expense.html',
			controller : 'expenseController',
		})

        .when('/btc', {
            templateUrl : 'btc.html',
            controller : 'coinController',
        })

})



siteApp.controller('coinController',['$http', '$scope', function($http, $scope) {

	var textJson = '{"request": "/v1/order/new","nonce": 123454546,"client_order_id": "20150102-4738721","symbol": "btcusd","amount": "34.12","price": "622.13","side": "buy","type": "exchange limit","options": ["maker-or-cancel"]}';
	var gemPayload = btoa(textJson);
	var gemApiKey = 'dHFtbnqO2Pkzb3jA1CZ7';
	var gemApiSecret = '2wZUF8F74DHcXPW6ZnS6hPRyCozD';

    // var ciphertext = Crypt.HASH.sha384(gemPayload, gemApiSecret);
    // console.log(Crypt)
    // console.log(gemPayload)
    // console.log(ciphertext.toString())

    $http({
        method: 'POST',
        url: 'https://api.sandbox.gemini.com/v1/order/new',
        headers: {
            'X-GEMINI-PAYLOAD': gemPayload,
            'X-GEMINI-APIKEY': gemApiKey,
            // 'X-GEMINI-SIGNATURE': ciphertext.toString(),
             'X-GEMINI-SIGNATURE': '26d66d6483bf088531c4daf5be3f0e5444d7cbe193d8de64ddb46afe1d11ee43ade5114a82c61d6d40fc63f9965a0b57'
        },
    }).then(function successCallback(response) {
        console.log("SUCCESS!")
        console.log(response)
    }, function errorCallback(response) {
        //console.log("Something terrible has happened")
        console.log(response.data.message)
    });

    $http({
        method: 'GET',
        url: 'https://api.gemini.com/v1/pubticker/ethusd',
        headers: {'Access-Control-Allow-Origin': '*'}
    }).then(function successCallback(response) {
        $scope.btcPrice = response.data;
        //console.log($scope.btcPrice)
    }, function errorCallback(response) {
		console.log("Error")
    });
}]);





siteApp.controller('chartController',['$scope', '$firebaseArray', function($scope, $firebaseArray) {
	var applicationsRef = new Firebase("https://rlabossiere-6f2a5.firebaseio.com/applications");

	$scope.applications = $firebaseArray(applicationsRef);
	$scope.addFormShow = true;
	$scope.editFormShow = false;
	
	$scope.addApplication = function(){
/*		$scope.applications.$add($scope.application)
		delete $scope.application*/
		
		document.location.href = "#/expense";
	}
	$scope.editApplication = function(){
		var record = $scope.applications.$getRecord($scope.application);
		record = $scope.application;	
		$scope.applications.$save(record);
		delete $scope.application
	}
		
	$scope.removeApplication = function(application){
		$scope.applications.$remove(application)
	}
	
	$scope.showEditForm = function(application){
		$scope.addFormShow = false;
		$scope.editFormShow = true;	
		$scope.application = application;
	}	
	
	$scope.states = ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS ' +
		    'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI ' +
		    'WY').split(' ').map(function(state) {
		        return {abbrev: state};
		      });
	
}])


siteApp.controller('expenseController',['$scope', '$firebaseArray', function($scope, $firebaseArray) {
	  $scope.date = new Date();
	  
	  var applicationsRef = new Firebase("https://rlabossiere-6f2a5.firebaseio.com/applications");

	  $scope.applications = $firebaseArray(applicationsRef);
	  
	  $scope.application = {
								deptMileage : 0,
								deptMileCost : 0,
								returnMileage : 0,
								returnMileCost : 0,
								miscCost : 0,
								miscCost2 : 0,
								hotelCost : 0,
								totalMiscCost : 0,
								total : 0.00,
								miscExpenses : [],
							};

	    $scope.addfield = function () {
	        $scope.application.miscExpenses.push({})
	    }
		    
	    $scope.calculateSum = function (){
	      var sum = 0;
	      for (var i = 0; i <  $scope.application.miscExpenses.length; i++){
	        sum += $scope.application.miscExpenses[i].cost;
	      }
	      $scope.application.totalMiscCost = sum;
	    }

		
		$scope.addExpense= function() {
			$scope.application.miscExpenses.push()
		    };
		
		
	  
	  $scope.calcCost= function() {
		  $scope.application.deptMileCost = (parseFloat($scope.application.deptMileage) * parseFloat(.54)).toFixed(2);
		  $scope.application.returnMileCost = (parseFloat($scope.application.returnMileage) * parseFloat(.54)).toFixed(2);
		  
		  $scope.application.total = (parseFloat($scope.application.deptMileCost) + parseFloat($scope.application.returnMileCost) + parseFloat($scope.application.hotelCost) + parseFloat($scope.application.miscCost) + parseFloat($scope.application.miscCost2) + parseFloat($scope.application.totalMiscCost)).toFixed(2)
	    };
	  
	    $scope.submit= function() {
	    	console.log("submit")
	    	$scope.applications.$add($scope.application)
	    	
	    	delete $scope.application
	    	
	    	document.location.href = "#/";
		    };
	    
	    
	  
	  $scope.states = ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS ' +
			    'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI ' +
			    'WY').split(' ').map(function(state) {
			        return {abbrev: state};
			      });

}])