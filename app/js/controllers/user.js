app.controller('UserController', function($cookieStore, $rootScope, $scope, $http, $location, $timeout, $routeParams, UserService,saveUserPass) {


	$scope.loginStart = false;
	$scope.loginError = false;
	$scope.loginErrorMsg = false;
	$scope.signupStart = false;  
	$scope.sucessMessage = false;
	$scope.signUpSuccessMsg = "sucess";
	$scope.class = "sucess";
	$scope.isLoading = false;
	$scope.message = '';
	$scope.brokerloader = false;
	$scope.brokerMsg = '';
	$scope.brokerMsgerror = '';
	$scope.user = {};
	//login form submit: function service to get access_token and login success
	$scope.getLogin = function() {

		if($scope.user.userName == undefined || $scope.user.userName == ''){
			$scope.loginError = true;
			$scope.loginErrorMsg = "Please enter your email";
			return false;
		}else if($scope.user.password == undefined || $scope.user.password == ''){
			$scope.loginError = true;
			$scope.loginErrorMsg = "Password Should be of more than six digit";
			return false;
		}
		$scope.loginStart = true;
		$scope.loginError = false;
		var opts = {};
		opts = {
			reqObj: {
				client_id : APP.keys.client_id,
				client_secret : APP.keys.client_secret,
		        grant_type : APP.keys.grant_type,
				username : $scope.user.userName,
				password : $scope.user.password
			}
		};
		//call service to get access token
		UserService.getAccessToken(opts)
		.then(function(data) {
			APP.accessToken = data['access_token'];
			var postData = {
				reqObj: {
					username: $scope.user.userName, 
					password: $scope.user.password
				}
			};
            var method = 'POST';
	            $http({
				method : "POST",
				url : APP.service.logins+"?access_token="+data['access_token'],
				data : postData,
				headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
			})
            .success( function(data, header){
            	if(data.data && data.code != 100) {
					APP.currentUser = data.data;
					$cookieStore.put("loggedInUser", data.data);
					$cookieStore.put("access_token", APP.accessToken);
					$rootScope.currentUser = data.data;
					$rootScope.isLoggedIn = true;
					var opts3 = {};
					opts3.user_id = APP.currentUser.id;
					opts3.profile_type = 4;
					UserService.getBasicProfile(opts3, function(data) {
						if(data.code == 101)
							$rootScope.currentUser.basicProfile = data.data;
					});
					$scope.$parent.loggedIn = true;
					$location.path("/profile");
				} else {
					$scope.loginError = true;
					$scope.loginStart = false;
					$scope.loginErrorMsg = 'Invalid Username or Password';
				}
			})
			.error(function(data, status, header){
				$scope.loginError = true;
				$scope.loginStart = false;
				$scope.loginErrorMsg = 'Invalid Username or Password';
			});
		}, function(error) {
			if(error.error === 'invalid_grant'){
				$scope.loginError = true;
				$scope.loginStart = false;
				$scope.loginErrorMsg = 'Invalid Username or Password';
			} else {
				$scope.loginError = true;
				$scope.loginStart = false;
				$scope.loginErrorMsg = 'Server not responding, Error in to retrieve the access token';
			}
		});
	};


	$scope.go = function( path ) {
		$location.path( path );
	};
	//Registration User
	$scope.months = [
    { value: 1, name: 'January' },
    { value: 2, name: 'February' },
    { value: 3, name: 'March' },
    { value: 4, name: 'April' },
    { value: 5, name: 'May' },
    { value: 6, name: 'June' },
    { value: 7, name: 'July' },
    { value: 8, name: 'August' },
    { value: 9, name: 'September' },
    { value: 10, name: 'October' },
    { value: 11, name: 'November' },
    { value: 12, name: 'December' }
  ];
  	
  	$scope.monthChange = function(){
  		if($scope.user.month.value != ''){
	  		if($scope.user.month.value <= 7){
	  			if($scope.user.month.value % 2 != 0){
	  				$scope.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
	  			}else if($scope.user.month.value == 2){
	  				$scope.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28];
	  			}else{
	 				$scope.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
	  			}
	  		}else{
	  			if($scope.user.month.value % 2 == 0){
	  				$scope.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
	  			}else {
	 				$scope.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
	  			}
	  		}
	  	}
  	}
  	$scope.getyears = function() {
		var currentYear = new Date().getFullYear();
		$scope.years = [];
		for (var i = 1970; i <= currentYear ; i++){
			$scope.years.push(i);
		}
  	}
  	$scope.getyears();
  	$scope.countries = APP.countries;
	$scope.signUpSuccessMsg = "";
	$scope.showLoading = true;
	$scope.genderShow = false;
	// $scope.today = function() {
	// 	$scope.user.dob = new Date();
	// };
	//$scope.today();
	$scope.clear = function () {
		$scope.user.dob = null;
	};
	// Disable weekend selection
	$scope.disabled = function(date, mode) {
		return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
	};
	$scope.toggleMin = function() {
		$scope.minDate = $scope.minDate ? null : new Date();
	};
	$scope.toggleMin();
	$scope.formats = ['dd-MM-yyyy', 'dd-MM-yyyy', 'dd-MM-yyyy', 'shortDate'];
	$scope.format = $scope.formats[0];
	$scope.user.gender = 0;

  	$scope.registration = function(type) {
       	var opts = {};
       	
       	if($scope.user.firstName == undefined || $scope.user.firstName == '' ){
			$scope.signUpSuccessMsg = "Please enter the first name ";
			return false;
		}else if($scope.user.userEmail == undefined || $scope.user.userEmail == '' ){
			$scope.signUpSuccessMsg = "Please enter your email ";
			return false;
		}else if($scope.user.userPassword == undefined){
       		$scope.signUpSuccessMsg = "Password Should be of more than six digit";
       		return false;
       	}else if($scope.user.lastName == undefined || $scope.user.lastName == '' ){
			$scope.signUpSuccessMsg = "Please enter the last name  ";
			return false;
		}else if($scope.user.dob == undefined || $scope.user.dob == '' ){
			$scope.signUpSuccessMsg = "Please select your date of birth";
			return false;
		}else if($scope.user.gender == undefined || $scope.user.gender == 0){
			$scope.signUpSuccessMsg = "Please select the gender ";
			return false;
		}else if($scope.user.country.id == undefined || $scope.user.country.id == '' ){
			$scope.signUpSuccessMsg = "Please enter your country";
			return false;
		}
       	opts.firstname = $scope.user.firstName;
       	opts.email = $scope.user.userEmail;
		opts.password = $scope.user.userPassword;
		opts.lastname = $scope.user.lastName;
		opts.birthday = $("#userdob").val(); 
		opts.gender = $scope.user.gender;
		opts.country = $scope.user.country.id;
		if( type != '')
			opts.type = type;
		else
			opts.type = $routeParams.typeId;
		$scope.signupStart = true;
		$scope.showLoading = false;
		UserService.registration(opts, function(data) {
			if(data.code == 101 && data.message === 'success') {
				if(data.data.profile_type == 1){
					$scope.sucessMessage = true;
					$scope.signupStart = false;
					$scope.user.userName = $scope.user.userEmail;
					$scope.user.password = $scope.user.userPassword;
					$scope.getLogin();
				}else if(data.data.profile_type == 3){
					var userId = data.data.user_id;
					saveUserPass.saveUserPassword($scope.user.userEmail,$scope.user.userPassword)
					$scope.showLoading = true;
					$location.path( '/storeProfilestep/'+userId+'/3' );
				}else if(data.data.profile_type == 2){
					var userId = data.data.user_id;
					saveUserPass.saveUserPassword($scope.user.userEmail,$scope.user.userPassword)
					$scope.showLoading = true;
					$location.path( '/brokerprofilestep/'+userId+'/2' );
				}
			} else {
				$scope.signUpSuccessMsg  = data.message;
				$scope.showLoading = true;
			}
		});

	}

	//function to send token request for forget password
	$scope.forgotPassword = function () {
		var formData = {};
		$scope.isLoading = true;
		$scope.message = '';
		formData.username = $scope.email;
		//calling the services to sent forget password token
        UserService.forgotPassword(formData, function(data){
        	if(data.code == 107 || data.code == 105) {
            	$scope.message = data.message;
            	$scope.isLoading = false;
            	$location.path("/reset");
            }
            else {
                $scope.isLoading = false;
                $scope.message = data.message;
                $timeout(function(){
                	$scope.message = '';
                }, 2000);
            }
        });
	};

	//function to reset the password from the token
	$scope.resetPassword = function () {
		var formData = {};
		$scope.isLoading = true;
		$scope.message = {};
		formData.token = $scope.reset.token;
		formData.password = $scope.reset.password;
		//calling the services to sent forget password token
        UserService.resetPassword(formData, function(data){
        	if(data.code == 101) {
            	$scope.message = "Reset password successful";
            	$scope.reset = {};
            	$scope.isLoading = false;
            	$timeout(function(){
                	$scope.message = '';
                }, 2000);
            }
            else {
                $scope.isLoading = false;
                $scope.reset = {};
                $scope.message = "Could not reset password";
                $timeout(function(){
                	$scope.message = '';
                }, 2000);
            }
        });
	};

	//Registration Broker Multiprofile
	$scope.brokerloader = false;
    $scope.registerMultiProfile = function(){
    	//$scope.brokerloader = true;
        var opts = {};
        opts.user_id = $routeParams.userId;
        opts.phone = $scope.user.phone; 
        opts.iban = $scope.user.iban; 
		opts.type = $routeParams.typeId;
		if(opts.type == 3){
			if($scope.user.business_name == undefined || $scope.user.business_name == ''){
				$scope.brokerMsg = "Please enter the Business Name";
				return false
			} else if($scope.user.business_type == undefined || $scope.user.business_type == ''){
				$scope.brokerMsg = "Please enter the Business Type";
				return false
			} else if($scope.user.legal_status == undefined || $scope.user.legal_status == ''){
				$scope.brokerMsg = "Please enter the Legal Status";
				return false
			} else if($scope.user.phone == undefined || $scope.user.phone == '' || isNaN($scope.user.phone) == true){
				$scope.brokerMsg = "Please enter the valid Phone number" ;
				return false
			} else if($scope.user.email == undefined || $scope.user.email == ''){
				$scope.brokerMsg = "Please enter the Email";
				return false
			} else if($scope.user.country.id == undefined || $scope.user.country.id == ''){
				$scope.brokerMsg = "Please enter the country";
				return false
			} else if($scope.user.business_region == undefined || $scope.user.business_region == ''){
				$scope.brokerMsg = "Please enter the Business Region";
				return false
			} else if($scope.user.business_city == undefined || $scope.user.business_city == ''){
				$scope.brokerMsg = "Please enter the Business city";
				return false
			} else if($scope.user.zip == undefined || $scope.user.zip == ''){
				$scope.brokerMsg = "Please enter the Area zip";
				return false
			} else if($scope.user.province == undefined || $scope.user.province == ''){
				$scope.brokerMsg = "Please enter the province";
				return false
			} else if($scope.user.vat_number == undefined || $scope.user.vat_number == ''){
				$scope.brokerMsg = "Please enter the Vat Number";
				return false
			} else if($scope.user.iban == undefined || $scope.user.iban == ''){
				$scope.brokerMsg = "Please enter the Iban";
				return false
			} else if($scope.user.description == undefined || $scope.user.description == ''){
				$scope.brokerMsg = "Please enter the Description";
				return false
			} else if((document.getElementById("lat").value) == undefined || (document.getElementById("lat").value) == ''){
				$scope.brokerMsg = "Please enter the your area in google map ";
				return false
			} else if((document.getElementById("lon").value )== undefined || (document.getElementById("lon").value) == ''){
				$scope.brokerMsg = "Please enter the your area in google map ";
				return false
			} else if((document.getElementById("mapplace").value) == undefined || (document.getElementById("mapplace").value) == ''){
				$scope.brokerMsg = "Please enter the your area in google map ";
				return false
			}   
			opts.email = $scope.user.email;
			opts.description = $scope.user.description;
			opts.business_name = $scope.user.business_name;
			opts.legal_status = $scope.user.legal_status;
			opts.business_type = $scope.user.business_type;
			opts.business_country = $scope.user.country.id;
			opts.business_region = $scope.user.business_region;
			opts.business_city = $scope.user.business_city;
			opts.business_address = $scope.user.business_address;
			opts.zip = $scope.user.zip;
			opts.province = $scope.user.province;
			opts.vat_number = $scope.user.vat_number;
		}else{
			opts.vat_number = $scope.user.vat; 
			opts.fiscal_code = $scope.user.fiscal;
		}
			opts.latitude = document.getElementById("lat").value;
			opts.longitude = document.getElementById("lon").value;
			opts.map_place = document.getElementById("mapplace").value;
			$scope.brokerloader = true;
        	UserService.registerMultiProfile(opts, function(data){
        	if(data.code == 101) {
	        	$scope.brokerloader = false;
	        	$scope.brokerMsg = data.message;
	        	$scope.user.userName = saveUserPass.getUsername();
	        	$scope.user.password = saveUserPass.getPassword();
	        	saveUserPass.clearUserPass();
	        	$scope.getLogin();
            } else {
                $scope.brokerloader = false;
                $scope.brokerMsg = data.message;
            }
        });
    }

    

	//function to cancel from forgot password and redirecting to login page
	$scope.cancelForgotPassword = function () {
		$location.path("/");
	};
	//Displaying Map with lat long feature
/*	$scope.mapsection = function() {
		var mapLatitude;
		var mapLogitude;
        $scope.map = {center: {latitude: 40.1451, longitude: -99.6680 }, zoom: 4 }
        $scope.options = {scrollwheel: false};
        $scope.marker = {
            id:0,
            coords: {
                latitude: 40.1451,
                longitude: -99.6680
            },
            options: { draggable: true },
            events: {
                dragend: function (marker, eventName, args) {
                	document.getElementById("lat").value = marker.getPosition().lat();
                	document.getElementById("lon").value = marker.getPosition().lng();
                	mapLatitude = marker.getPosition().lat();
                	mapLogitude = marker.getPosition().lng();
                	$scope.maplocation(mapLatitude, mapLogitude);
                }
            }
        }
    }

    $scope.maplocation = function(mapLatitude, mapLogitude) {
    	var geocoder;
		geocoder = new google.maps.Geocoder();
  		var lat = parseFloat(mapLatitude);
  		var lng = parseFloat(mapLogitude);
  		var latlng = new google.maps.LatLng(lat, lng);
  		geocoder.geocode({'latLng': latlng}, function(results, status) {
    	if (status == google.maps.GeocoderStatus.OK) {
      		if (results[1]) {
       			$('#mapplace').val(results[1].formatted_address);
      		} else {
        	alert('No results found');
      		}
    	} else {
      	alert('Geocoder failed due to: ' + status);
    	}
  		});
    }

    $scope.mapsection();*/

    $scope.initialize = function () {
		var mapOptions = {
			center: new google.maps.LatLng(-33.8688, 151.2195),
			zoom: 13
		};
		var map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);

		var input = (document.getElementById('pac-input'));

		var types = document.getElementById('type-selector');
		map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
		map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

		var autocomplete = new google.maps.places.Autocomplete(input);
		autocomplete.bindTo('bounds', map);

		var infowindow = new google.maps.InfoWindow();
		var marker = new google.maps.Marker({
			map: map,
			anchorPoint: new google.maps.Point(0, -29)
		});

		google.maps.event.addListener(autocomplete, 'place_changed', function() {
			infowindow.close();
			marker.setVisible(false);
			var place = autocomplete.getPlace();
			if (!place.geometry) {
				return;
			}
			var countryPlace = autocomplete.getPlace();
			document.getElementById("lat").value = countryPlace.geometry.location.k;
			document.getElementById("lon").value = countryPlace.geometry.location.B;
			document.getElementById("mapplace").value = countryPlace.address_components[0].long_name;

			if (place.geometry.viewport) {
				map.fitBounds(place.geometry.viewport);
			} else {
				map.setCenter(place.geometry.location);
				map.setZoom(17);  
			}
			marker.setIcon(({
				url: place.icon,
				size: new google.maps.Size(71, 71),
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(17, 34),
				scaledSize: new google.maps.Size(35, 35)
			}));
			marker.setPosition(place.geometry.location);
			marker.setVisible(true);

			var address = '';
			if (place.address_components) {
				address = [
				(place.address_components[0] && place.address_components[0].short_name || ''),
				(place.address_components[1] && place.address_components[1].short_name || ''),
				(place.address_components[2] && place.address_components[2].short_name || '')
				].join(' ');
			}

			infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
			infowindow.open(map, marker);
		});

		function setupClickListener(id, types) {
			var radioButton = document.getElementById(id);
		}

		setupClickListener('changetype-all', []);
		setupClickListener('changetype-establishment', ['establishment']);
		setupClickListener('changetype-geocode', ['geocode']);
	}
	if($routeParams.userId != undefined){
	$timeout(function(){
		$scope.initialize();
	}, 1000);
	}

});


// Controller for handing the comment related operation
app.controller('CreateBrokerController', function($scope, $location, $timeout, CreateBrokerService, ProfileImageService) {

    ///Creater Broker in citizen Multiprofile 
    $scope.createBroker = function() {
    	if($scope.user.phone == undefined || $scope.user.phone == ''){
    		$scope.brokerMsg = "Please enter phone number";
    		return false;
    	}else if($scope.user.vat == undefined || $scope.user.vat == ''){
    		$scope.brokerMsg = "Please enter vat number";
    		return false;
    	}else if($scope.user.fiscal == undefined || $scope.user.fiscal == ''){
    		$scope.brokerMsg = "Please enter fiscal number";
    		return false;
    	}else if($scope.user.iban == undefined || $scope.user.iban == ''){
    		$scope.brokerMsg = "Please enter iban number";
    		return false;
    	}else if(document.getElementById('mapplace').value == undefined || document.getElementById('mapplace').value == ''){
    		$scope.brokerMsg = "Please enter mapplace";
    		return false;
    	}else if(document.getElementById('lon').value == undefined || document.getElementById('lon').value == ''){
    		$scope.brokerMsg = "Please enter longitude";
    		return false;
    	}else if(document.getElementById('lat').value == undefined || document.getElementById('lat').value == ''){
    		$scope.brokerMsg = "Please enter latitude";
    		return false;
    	}else 

    	$scope.brokerloader = true;
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.phone = $scope.user.phone; 
        opts.vat_number = $scope.user.vat; 
        opts.fiscal_code = $scope.user.fiscal;
        opts.iban = $scope.user.iban; 
        opts.map_place = document.getElementById('mapplace').value;
        opts.latitude = document.getElementById('lat').value; 
        opts.longitude = document.getElementById('lon').value; 
        opts.type = 2; 
        CreateBrokerService.createBroker(opts, function(data){
        	//$location.path('/profile');
            if(data.code == 101) {
            	$scope.brokerloader = false;
        		$scope.brokerMsg = "Successfully Registered as Broker";  
        		 $scope.viewmultiprofiles();
        		$timeout(function() {
        			$scope.brokerMsg = "";   
        			$location.path('/profile');
        		}, 2000);
            } else {
                $scope.brokerloader = false;
        		$scope.brokerMsgerror = data.message; 
            }
        });
    }


    $scope.viewmultiprofiles = function(){

        $scope.albloader = true; 
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.profile_type = 4; 
        ProfileImageService.viewmultiprofiles(opts, function(data){
            if(data.code == 101) {
                $scope.albloader = false; 
                $scope.picloader = false;
                $scope.propic = true; 
                $rootScope.currentUser.basicProfile = data.data;
            } else {                
                $scope.propic = true; 
                $scope.picloader = false;
                
            }
        });
    }


    $scope.initialize = function () {
		var mapOptions = {
			center: new google.maps.LatLng(-33.8688, 151.2195),
			zoom: 13
		};
		var map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);

		var input = (document.getElementById('pac-input'));

		var types = document.getElementById('type-selector');
		map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
		map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

		var autocomplete = new google.maps.places.Autocomplete(input);
		autocomplete.bindTo('bounds', map);

		var infowindow = new google.maps.InfoWindow();
		var marker = new google.maps.Marker({
			map: map,
			anchorPoint: new google.maps.Point(0, -29)
		});

		google.maps.event.addListener(autocomplete, 'place_changed', function() {
			infowindow.close();
			marker.setVisible(false);
			var place = autocomplete.getPlace();
			if (!place.geometry) {
				return;
			}
			var countryPlace = autocomplete.getPlace();
			document.getElementById("lat").value = countryPlace.geometry.location.k;
			document.getElementById("lon").value = countryPlace.geometry.location.B;
			document.getElementById("mapplace").value = countryPlace.address_components[0].long_name;

			if (place.geometry.viewport) {
				map.fitBounds(place.geometry.viewport);
			} else {
				map.setCenter(place.geometry.location);
				map.setZoom(17);  
			}
			marker.setIcon(({
				url: place.icon,
				size: new google.maps.Size(71, 71),
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(17, 34),
				scaledSize: new google.maps.Size(35, 35)
			}));
			marker.setPosition(place.geometry.location);
			marker.setVisible(true);

			var address = '';
			if (place.address_components) {
				address = [
				(place.address_components[0] && place.address_components[0].short_name || ''),
				(place.address_components[1] && place.address_components[1].short_name || ''),
				(place.address_components[2] && place.address_components[2].short_name || '')
				].join(' ');
			}

			infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
			infowindow.open(map, marker);
		});

		function setupClickListener(id, types) {
			var radioButton = document.getElementById(id);
		}

		setupClickListener('changetype-all', []);
		setupClickListener('changetype-establishment', ['establishment']);
		setupClickListener('changetype-geocode', ['geocode']);
	}
	$timeout(function(){
		$scope.initialize();
	}, 1000);

});

// app.controller('LoginController', function($cookieStore, $rootScope, $scope, $http, $location, $timeout, UserService) {
// 	//check if user already loggedIn
// 	if(UserService.isAuthenticated()) 
// 		$location.path('/profile');

// 	$scope.loginStart = false;
// 	$scope.loginError = false;
// 	$scope.loginErrorMsg = false;
// 	$scope.signupStart = false;  
// 	$scope.sucessMessage = false;
// 	$scope.signUpSuccessMsg = "sucess";
// 	$scope.class = "sucess";
// 	$scope.isLoading = false;
// 	$scope.message = '';
// 	//login form submit: function service to get access_token and login success
// 	$scope.getLogin = function() { 
// 		$scope.loginStart = true;
// 		$scope.loginError = false;
// 		var opts = {};
// 		opts = {
// 			reqObj: {
// 				client_id : APP.keys.client_id,
// 				client_secret : APP.keys.client_secret,
// 		        grant_type : APP.keys.grant_type,
// 				username : $scope.user.userName,
// 				password : $scope.user.password
// 			}
// 		};
// 		//call service to get access token
// 		UserService.getAccessToken(opts)
// 		.then(function(data) {
// 			APP.accessToken = data['access_token'];
// 			var postData = {
// 				reqObj: {
// 					username: $scope.user.userName, 
// 					password: $scope.user.password
// 				}
// 			};
//             var method = 'POST';
// 	            $http({
// 				method : "POST",
// 				url : APP.service.logins+"?access_token="+data['access_token'],
// 				data : postData,
// 				headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
// 			})
//             .success( function(data, header){
//             	//console.log(data.data)
//             	if(data.data) {
// 					APP.currentUser = data.data;
// 					$cookieStore.put("loggedInUser", data.data);
// 					$cookieStore.put("access_token", APP.accessToken);
// 					$rootScope.currentUser = data.data;
// 					$rootScope.isLoggedIn = true;
// 					$scope.$parent.loggedIn = true;
// 					$location.path("/profile");
// 				}
// 			})
// 			.error(function(data, status, header){
// 				console.log('in faile');
// 			});
// 		}, function(error) {
// 			if(error.error === 'invalid_grant'){
// 				$scope.loginError = true;
// 				$scope.loginStart = false;
// 				$scope.loginErrorMsg = 'Invalid Username or Password';
// 			} else {
// 				$scope.loginError = true;
// 				$scope.loginStart = false;
// 				$scope.loginErrorMsg = 'Server not responding, Error in to retrieve the access token';
// 			}
// 		});
// 	};
// });

app.controller('MessageNotifiController', function($cookieStore, $rootScope, $scope, $http, $location, $timeout, $interval, ProfileService, UserService, threadAndPass) {
	$rootScope.showNewMessageList = false;
    $scope.newMessageShow = false;
	$scope.messageNoti = [];
	$scope.cancelUnreadRequest = 0;
	$scope.loadingUnreadMssage = false;
	$scope.count = 0;
	$scope.noMesasge = true;
	$rootScope.listUnReadMessages = function(){
		$scope.newMessageShow = false;
		$scope.loadingUnreadMssage = true;
		var opts = {};
		opts.user_id = APP.currentUser.id;
		opts.limit_start = "";
		opts.limit_size = "10";
		ProfileService.listUnReadMessages(opts, function(data){
            if(data.code == 100	&& data.message === 'success') {
        		$scope.cancelUnreadRequest = 1;
            	$scope.messageNoti = data.data;
            	$scope.newMessageShow = true;
            	$scope.loadingUnreadMssage = false;
            	var count = $scope.messageNoti.length;
            	if(count > 0){
            		$scope.count = count;
            	}else {
            	//	$scope.messageNoti = {No message}
            		$scope.noMesasge = false;
            	}
            }else {
            	$scope.newMessageShow = true;
            	$scope.loadingUnreadMssage = false;
            }
        });
	}

	$scope.showAllMessage = function() {
		//$rootScope.showNotificationList = false;
		$rootScope.showNewMessageList = !$rootScope.showNewMessageList;
		$rootScope.listUnReadMessages();
	};

	if(UserService.isAuthenticated()) {
		$rootScope.listUnReadMessages();
	}

	$scope.closeDrop = function(){
		$rootScope.showNewMessageList = !$rootScope.showNewMessageList;
	}

	$scope.markReadAllMessages = function(){
		var opts = {};
		opts.user_id = APP.currentUser.id;
		MessageService.markReadAllMessages(opts, function(data){
            if(data.code == 100	&& data.message === 'success') {
  				$scope.newMessageShow = false;
            } else {
            
            }
        });
	}

	$scope.readMessage = function(threadId){   
        var opts = {};
        opts.session_id = APP.currentUser.id;
        opts.thread_id = threadId;
        ProfileService.readMessage(opts, function(data){
            if(data.code == 101 && data.message === 'success') {
            }
            else {
            }
        });
    }

	$scope.storeThreadAndFriendId = function(threadId, friendId){
		//var opts = {};
		//if(threadId != 0){
			threadAndPass.saveThreadAndFriend(threadId, friendId);
		/*} else {
			 threadAndPass.saveThreadAndFriend(messageId, friendId);
		}*/
	}
});

