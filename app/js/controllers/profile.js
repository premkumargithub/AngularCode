app.controller('ProfileController', function($cookieStore, $rootScope, $scope, $http, $location, $timeout, $interval, $routeParams, UserService, ProfileService, fileReader, threadAndPass, $sce) {
	//$('#retrieveFromDatabase').linkPreviewRetrieve();
   var latitudeMap = 0;
   var longitudeMap = 0;
   $('.nav li').removeClass('active');
   $('.home').addClass('active');

   $('.nav li').click(function() {
   		$('.nav li').removeClass('active');
   		$(this).addClass('active');
   });


	$scope.editUser = {};
	$scope.renderProfile = false;
	$scope.friendProfile = false;
	$scope.requestSend = true;
	$scope.alreadtSend = true;
	$scope.broker = 0;
	$scope.userDetails = "";
	
	$scope.getUserProfile = function(profileType){
		var opts = {};
		$scope.editMessage = "";
		opts.user_id = APP.currentUser.id;
		opts.profile_type = profileType;
		ProfileService.getProfile(opts, function(data) {
			$scope.userDetails = data.data;
			$scope.renderProfile = true;
		});
	}

	$scope.deleteProfile = function() {
		var opts = {};
		opts.user_id = APP.currentUser.id;
		ProfileService.deleteProfile(opts, function(data) {
			console.log(data)
		});
	};

	$scope.userList = [];
	$scope.cancelRequest = 0;
	$scope.showList = false;
	$scope.searchUser = function() {
		$scope.showList = true;
		$scope.cancelRequest = 0;
		var opts = {};
        
		if($scope.searchFrind.length >= 3){
			opts.user_id = APP.currentUser.id;
			opts.friend_name = $scope.searchFrind;
			opts.limit_start = APP.user_list_pagination.start;
			opts.limit_size = APP.user_list_pagination.end; 
			ProfileService.searchUser(opts, function(data) {
				if( $scope.cancelRequest == 0 ){
					$scope.userList = [];
            		if(data.code == 101 && data.message === 'success' && data.data.count != 0) {
						$scope.userList = [];
						$scope.userList = $scope.userList.concat(data.data.users);
					}else{

					}
				}else{

				}
			});
		}else{
				$scope.showList = false;
				$scope.userList = [];
				$scope.userList.slice();
				$scope.cancelRequest = 1;
		}
	};

	$scope.clearList = function(){
		stop = $interval(function() {
		$scope.cancelRequest = 1;
		$scope.showList = false;
		}, 1000,1);
	}

	//TODO: test
	$scope.searchFriend = function() {
		var opts = {};
		opts.user_id = APP.currentUser.id;
		opts.friend_name = "liju"; //TODO
		opts.limit_start = APP.user_list_pagination.start;
		opts.limit_size = APP.user_list_pagination.end; 
		ProfileService.searchFriend(opts, function(data) {
			console.log(data)
		});
	};

    $(".fancybox").fancybox();
}).filter('unsafe', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
});

//Controller to handle the profile related notifications
app.controller('ProfileNotiController', function($cookieStore, $scope, $http, $location, $timeout, ProfileService) {
	$scope.NotificationFound = false;
	$scope.NotificationNotFound = false;
	
	$scope.getNotification = function() {
		$scope.NotificationFound = false;
		$scope.NotificationNotFound = false;
		opts = {};
		opts.user_id = APP.currentUser.id;
		opts.limit_start = 0;
		opts.limit_size = 12;
		ProfileService.getPendingFreindReq(opts, function(data) {
			if(data.code == 101 && data.message === 'success') {
				if(data.data.length != 0) {
					$scope.FriendRequests = data.data;
					$scope.NotificationFound = true;
				} else {
					$scope.NotificationNotFound = true;
				}
			} else {
				$scope.NotificationNotFound = true;
			}
		});
	};

	$scope.getNotification();
	$scope.AcceptRequest = function(friendId) {
		opts = {};
		opts.user_id = APP.currentUser.id;
		opts.friend_id = friendId;
		opts.action = "1";
		ProfileService.acceptFriendRequest(opts, function(data) {
			if(data.code == 101 && data.message === 'success') {
				$scope.getNotification();
			} else {

			}
		});
	};

	$scope.RejectRequest = function(friendId, id) { 
		$("#noti-"+id).fadeOut(1000);
		opts = {};
		opts.user_id = APP.currentUser.id;
		opts.friend_id = friendId;
		opts.action = "0";
		ProfileService.rejectFriendRequest(opts, function(data) {
			if(data.code == 101 && data.message === 'success') {
				$scope.getNotification();
			} else {

			}
		});
	};
});

app.controller('passwordChangeController', function($cookieStore, $scope, $http, $location, $timeout, $interval, $routeParams, ProfileService) {
	$scope.changeLoder = true;
	$scope.changePassword = function(){
		var opts = {};
		if($scope.oldPassword == undefined || $scope.oldPassword == ''){
			$scope.changeMessage = "New password should be of greater then six digit";
			return false;
		} else if($scope.newPassword == undefined || $scope.newPassword == '') {
			$scope.changeMessage = "Re-type password should be of greater then six digit";
			return false;
		} else if($scope.newPassword  !== $scope.oldPassword){
			$scope.changeMessage = "Password mismatch";
			return false;
		}
		opts.user_id = APP.currentUser.id;
		opts.password1 = $scope.oldPassword;
		opts.password2 = $scope.newPassword;
		$scope.changeLoder = false;
		ProfileService.changePassword(opts, function(data) {
			if(data.code == 101){
				$scope.changeLoder = true;
				$scope.changeMessage = "Password Updated Successfully"
			}else {
				$scope.changeLoder = true;
				$scope.changeMessage = data.message;
			}
		});
	}
	$scope.go = function( path ) {
		$location.path( path );
	};
});

/**
* Controller to display the friends profile detail
*
*/
app.controller('FriendProfile', function($cookieStore, $scope, $http, $location, $timeout, $interval, $routeParams, ProfileService) {
	$scope.friendViewLoader = true;
	$scope.sendFriendRequestLoader = false;
	$scope.viewFriendProfile = function() {
		var opts = {};
		opts.user_id = APP.currentUser.id;
		opts.friend_id = $routeParams.friendId;
		ProfileService.friendProfileView(opts, function(data) {
			if(data.code == 101 && data.message === 'success') {
				if(data.data.user_id == APP.currentUser.id) {
					$location.path('about');
				}
				$scope.friendProfile = data.data;
				$scope.friendViewLoader = false;
			} else {
				$scope.friendViewLoader = false;
			}
		});
	};

	$scope.viewFriendProfile();

	$scope.sendFriendRequests = function(frindRequestId) { 
		$scope.sendFriendRequestLoader = true;
		var opts = {};
		opts.user_id = APP.currentUser.id;
		opts.friend_id = $routeParams.friendId;
		opts.msg = "Friend Request";
		ProfileService.sendFriendRequests(opts, function(data) {
			if(data.code == 101){
				$scope.friendProfile.is_friend = 2;
				$scope.sendFriendRequestLoader = false;
			}else if(data.code == 109){
				$scope.friendProfile.is_friend = 1;
				$scope.sendFriendRequestLoader = false;
			}
		});
	};

	$scope.removeFriend = function(friendId) { 
		$scope.sendFriendRequestLoader = true;
		opts = {};
		opts.user_id = APP.currentUser.id;
		opts.friend_id = friendId;
		opts.action = 0;
		ProfileService.rejectFriendRequest(opts, function(data) {
			if(data.code == 101 && data.message === 'success') {
				$scope.friendProfile.is_friend = 0;
				$scope.sendFriendRequestLoader = false;
			} else {
				$scope.friendProfile.is_friend = 0;
				$scope.sendFriendRequestLoader = false;
			}
		});

	};
});


/**
* Controller to display the friend's album
*
*/
app.controller('friendAlbumController', function ($scope, ProfileService, $location, $routeParams, $timeout) {
//Album Listing
    $scope.friendAlbumListing = function(){ 
    	$scope.friendId = $routeParams.friendId;
    	$scope.userId = $routeParams.id;
        $scope.albloader = true;  
        var opts = {};
        opts.user_id = $routeParams.id;
        opts.limit_start = 0; 
        opts.limit_size = 20; 
        ProfileService.friendAlbumListing(opts, function(data){
              
            if(data.code == 101) {
                $scope.listAlbum = data.data;
                $scope.noAlbums = true;    
                $scope.albloader = false;    
            }else {
                $scope.albloader = false; 
            }
        });
    }
    $scope.friendAlbumListing();

    //View friend Album Images 
    $scope.friendAlbumImage = function(){
        $scope.albloader = true;
        var albumId = $routeParams.id;
        $scope.albumname = $routeParams.name;
        $scope.frndUserId = $routeParams.userId;
        var opts = {};
        opts.user_id = $routeParams.userId;
        opts.album_id = albumId;
        ProfileService.friendAlbumImage(opts, function(data){
            
            if(data.code == 101) {
                $scope.albloader = false;
                $scope.viewalbum = data.data;
                $scope.noPhotos = true;
            } else {
                $scope.albloader = false;
                $scope.noPhotos = true;
            }
        });  
    }
    $scope.friendAlbumImage();
    $(".fancybox").fancybox(); //Image Pop Up Plugin
    $scope.redirectUrl = function(album_id, album_name, userId) {
        $location.path("/friend/image/"+album_id+"/"+album_name+"/"+userId);
    }
});

app.controller('EditProfileController', function($cookieStore, $rootScope, $scope, $http, $location, $timeout, $interval, $routeParams, ProfileService, threadAndPass) {

$scope.months = [
    { value: 0, name: 'January' },
    { value: 1, name: 'February' },
    { value: 2, name: 'March' },
    { value: 3, name: 'April' },
    { value: 4, name: 'May' },
    { value: 5, name: 'June' },
    { value: 6, name: 'July' },
    { value: 7, name: 'August' },
    { value: 8, name: 'September' },
    { value: 9, name: 'October' },
    { value: 10, name: 'November' },
    { value: 11, name: 'December' }
  ];

  	$scope.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
  	$scope.monthChange = function(){
  		if($scope.editUser.month.value <= 6){
  			if($scope.editUser.month.value % 2 == 0){
  				$scope.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
  			}else if($scope.editUser.month.value == 1){
  				$scope.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28];
  			}else{
 				$scope.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
  			}
  		}else{
  			if($scope.editUser.month.value % 2 != 0){
  				$scope.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
  			}else {
 				$scope.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
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
  	$scope.loadEditProfile = true;
	$scope.basicProfile = function(){
		var opts = {};
		opts.user_id = APP.currentUser.id;
		opts.profile_type = 4;
		//$scope.editUser = {};
		ProfileService.viewMultiProfile(opts, function(data) {
			if(data.code == 101 && data.message === 'success'){
				//$scope.loadEditProfile = false;
				$scope.editUser.firstName = data.data.firstname;
				$scope.editUser.lastName = data.data.lastname;
				$scope.editUser.gender = data.data.gender;
				for(var i=0; i < APP.countries.length; i++){ 
					if(data.data.country.code == APP.countries[i].id){
						$scope.editUser.country = APP.countries[i];
					}
				}
				$scope.broker = data.data.broker_profile;
				$rootScope.currentUser.basicProfile = data.data;
				var currVal = data.data.date_of_birth.date;
				currVal = currVal.substring(0,10);
				var dtArray = currVal.split("-");
				var dtDay = parseInt(dtArray[2]);
				var dtMonth = parseInt(dtArray[1]);
				var dtYear = parseInt(dtArray[0]);
				$scope.editUser.year = dtYear;
				$scope.editUser.day = dtDay;
				
				$scope.editUser.month = $scope.months[dtMonth-1];



			}else{

			}
		});
	}

	//$scope.basicProfile();

	$scope.viewMultiProfile = function(profileType){
		var opts = {};
		$scope.editUser = {};
		$scope.editMessage = "";
		opts.user_id = APP.currentUser.id;
		opts.profile_type = profileType;
		ProfileService.viewMultiProfile(opts, function(data) {
			if(data.code == 101 && data.message === 'success'){
				if(profileType == 1){
					$scope.userDetails = data.data;
					$scope.renderProfile = true; 
					$scope.editUser.region = data.data.region;
					$scope.editUser.zip = parseInt(data.data.zip, 10);
					$scope.editUser.city = data.data.city;
					$scope.editUser.address = data.data.address;
					$scope.editUser.latitude = data.data.latitude;
					$scope.editUser.longitude = data.data.longitude;
					$scope.editUser.place = data.data.map_place;
					$scope.basicProfile();
					$scope.loadEditProfile = false;
					latitudeMap = data.data.latitude;
					longitudeMap = data.data.longitude;
					$timeout(function(){
						$scope.initialize();
					}, 1000)
				}else {
					$scope.editUser.phone = parseInt(data.data.phone, 10);
					$scope.editUser.vatnumber = data.data.vat_number;
					$scope.editUser.fiscalcode  = data.data.fiscal_code;
					$scope.editUser.iban  = data.data.iban;
					$scope.editUser.place = data.data.map_place;
					$scope.editUser.latitude = data.data.latitude;
					$scope.editUser.longitude = data.data.longitude;
					latitudeMap = data.data.latitude;
					longitudeMap = data.data.longitude;
					/*$timeout(function(){
						$scope.initializesecond();
					}, 1000);*/
				}
			}else{
				$scope.basicProfile();

			}
		});
	}
	//$scope.getUserProfile(1);
	if(JSON.stringify(APP.currentUser) != "{}"){
		$scope.viewMultiProfile(1);
		$scope.viewMultiProfile(2);
	};

	$scope.edit = true;
	$scope.brokerprofile = false;
	$scope.showTab = function(tab){
		if(tab === "edit1") {
			$('.profile-tab-container ul li').removeClass('active');
			$('.profile-tab-container ul li').eq( 0 ).addClass('active');
		}else if(tab === "edit") {
			$('.profile-tab-container ul li').removeClass('active');
			$('.profile-tab-container ul li').eq( 0 ).addClass('active');
			$scope.edit = true;
			$scope.brokerprofile = false;
			$timeout(function(){
				$scope.initialize();
			}, 1000);
		}else if(tab === "brokerprofile") {
			$('.profile-tab-container ul li').removeClass('active');
			$('.profile-tab-container ul li').eq( 1 ).addClass('active');
			$scope.edit = false;
			$scope.brokerprofile = true;
			$timeout(function(){
				$scope.initializesecond();
			}, 1000);
		}
	}
	$scope.showTab('edit1');
	$scope.editMessage = "";
	$scope.showloading = false;
	$scope.editProfile = function(profileType) {

		var opts = {};
		opts.user_id = APP.currentUser.id;
		opts.type = profileType;
		if($scope.editUser.gender == undefined){
			$scope.editMessage = "Please select the gender";
			return false;
       	}
		if(profileType == 1){
			opts.firstname = $scope.editUser.firstName ; 
			opts.lastname = $scope.editUser.lastName ;
			opts.birthday = $scope.editUser.day + '-' + $scope.editUser.month.name  +'-' +$scope.editUser.year;
			opts.gender = $scope.editUser.gender;
			opts.country = $scope.editUser.country.id;
			opts.region = $scope.editUser.country.country;
			opts.map_place = document.getElementById("mapplace").value;
			opts.zip = $scope.editUser.zip;
			opts.city = $scope.editUser.city;
			opts.address = $scope.editUser.address;
			opts.latitude = document.getElementById("lat").value;
			opts.longitude = document.getElementById("lon").value;
		}else if(profileType == 2){
			opts.phone = $scope.editUser.phone;
			opts.vat_number = $scope.editUser.vatnumber;
			opts.fiscal_code = $scope.editUser.fiscalcode;
			opts.iban = $scope.editUser.iban;
			opts.map_place = document.getElementById("mapplace1").value;
			opts.latitude = document.getElementById("lat1").value;
			opts.longitude = document.getElementById("lon1").value;
		}
		$scope.showloading = true;
		ProfileService.editProfileDetail(opts, function(data) {
			if(data.code == 101 && data.message === 'success'){
				$scope.editMessage = data.message;
				$scope.showloading = false;
				if(profileType == 1){
					$scope.basicProfile();
				}
			}else{
				$scope.editMessage = data.message;
				$scope.showloading = false;
			}
		});
	};
	$scope.initialize = function () {
		var mapOptions = {
			center: new google.maps.LatLng(latitudeMap, longitudeMap),
			zoom: 8
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
	$scope.initializesecond = function () {
		var mapOptions = {
			center: new google.maps.LatLng(latitudeMap, longitudeMap),
			zoom: 8
		};
		var map2 = new google.maps.Map(document.getElementById('map-canvas-second'),mapOptions);

		var input = (document.getElementById('pac-input'));

		var types = document.getElementById('type-selector');
		map2.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
		map2.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

		var autocomplete = new google.maps.places.Autocomplete(input);
		autocomplete.bindTo('bounds', map2);

		var infowindow = new google.maps.InfoWindow();
		var marker2 = new google.maps.Marker({
			map2: map2,
			anchorPoint: new google.maps.Point(0, -29)
		});

		google.maps.event.addListener(autocomplete, 'place_changed', function() {
			infowindow.close();
			marker2.setVisible(false);
			var place = autocomplete.getPlace();
			if (!place.geometry) {
				return;
			}
			var countryPlace = autocomplete.getPlace();
			document.getElementById("lat1").value = countryPlace.geometry.location.k;
			document.getElementById("lon1").value = countryPlace.geometry.location.B;
			document.getElementById("mapplace1").value = countryPlace.address_components[0].long_name;

			if (place.geometry.viewport) {
				map2.fitBounds(place.geometry.viewport);
			} else {
				map2.setCenter(place.geometry.location);
				map2.setZoom(17);  
			}
			marker2.setIcon(({
				url: place.icon,
				size: new google.maps.Size(71, 71),
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(17, 34),
				scaledSize: new google.maps.Size(35, 35)
			}));
			marker2.setPosition(place.geometry.location);
			marker2.setVisible(true);

			var address = '';
			if (place.address_components) {
				address = [
				(place.address_components[0] && place.address_components[0].short_name || ''),
				(place.address_components[1] && place.address_components[1].short_name || ''),
				(place.address_components[2] && place.address_components[2].short_name || '')
				].join(' ');
			}

			infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
			infowindow.open(map2, marker2);
		});

		function setupClickListener(id, types) {
			var radioButton = document.getElementById(id);
		}

		setupClickListener('changetype-all', []);
		setupClickListener('changetype-establishment', ['establishment']);
		setupClickListener('changetype-geocode', ['geocode']);
	}


});
