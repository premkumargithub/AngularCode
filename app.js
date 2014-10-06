app = angular.module('SixthContinent', ['ngRoute', 'angularFileUpload', 'ngCookies', 'linkDirectives', 'google-maps', 'ui.bootstrap', 'infinite-scroll', 'perfect_scrollbar']);

app.controller('AppController', ['$cookieStore', '$rootScope', '$scope', '$location', '$timeout', 'UserService', 
	function ($cookieStore, $rootScope, $scope, $location, $timeout, UserService) {
	$scope.logoutLoader = false;
	$scope.siteTitle = APP.siteTitle;
	$rootScope.isLoggedIn = false;
	// Add $scope variable to store the user
	$scope.loggedInUser = $cookieStore.get("loggedInUser");
	if( !$cookieStore.get("loggedInUser") || !$cookieStore.get("access_token")) {
		$rootScope.currentUser = {};
		$scope.loggedIn = false;
		$location.path('/');
	} else {
		$scope.loggedIn = true;
		$rootScope.isLoggedIn = true;
		APP.currentUser = $cookieStore.get("loggedInUser");
		APP.accessToken = $cookieStore.get("access_token"); 
		$rootScope.currentUser = $cookieStore.get("loggedInUser");
		var opts = {};
		opts.user_id = APP.currentUser.id;
		opts.profile_type = 4;
		UserService.getBasicProfile(opts, function(data) {
			if(data.code == 101)
				$rootScope.currentUser.basicProfile = data.data;
			else
				$scope.logout();
		});
	}

	$scope.logout = function(){
		$scope.logoutLoader = true;
		var opts = {};
		opts.access_token = APP.accessToken;
		UserService.logout(opts, function(data){
			if (data.code == 101 && data.message === 'success') {
				APP.currentUser = {};
				$cookieStore.remove("loggedInUser");
				$cookieStore.remove("access_token");
				$scope.logoutLoader = false;
				window.location.reload();
				//$location.path('/');
			} else {
				console.log("Error in logout");
			}	
	});
	}

	$scope.logoutWithoutService = function(){
		$scope.logoutLoader = true;
		APP.currentUser = {};
		$scope.loggedIn = false;
		$cookieStore.remove("loggedInUser");
		$cookieStore.remove("access_token");
		$scope.logoutLoader = false;
		window.location.reload();
		$location.path('/');	
	}

}]);

app.config(function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl:'app/views/registration.html'
		})
		.when('/profile', {
			controller: 'ProfileController',
			templateUrl:'app/views/profile.html'
		})
		.when('/timeline/:userId', {
			templateUrl:'app/views/user_timeline.html'
		})
		.when('/friends', {
			templateUrl:'app/views/friends_list.html'
		})
		.when('/edit_profile', {
			controller: 'EditProfileController',
			templateUrl:'app/views/edit_profile.html'
		})
		.when('/notification', {
			controller: 'NotificationController',
			template:'<input type="button" value="sendEmailNotification" ng-click="sendEmailNotification()">'
			+'<input type="button" value="getEmailNotification" ng-click="getEmailNotification()">'
			+'<input type="button" value="readUnreadEmailNotifications" ng-click="readUnreadEmailNotifications()">'
			+'<input type="button" value="deleteEmailNotifications" ng-click="deleteEmailNotifications()">'
			+'<input type="button" value="searchEmailNotifications" ng-click="searchEmailNotifications()">'
		})
		.when('/changepassword', {
			controller: 'passwordChangeController',
			templateUrl:'app/views/change_password.html'
		})
		.when('/comment', {
			controller: 'CommentController',
			template:'<input type="button" value="createComments" ng-click="createComments()">'
			+ '<input type="button" value="commentLists" ng-click="commentLists()">'
			+ '<input type="button" value="commentUpdates" ng-click="commentUpdates()">'
			+ '<input type="button" value="commentDeletes" ng-click="commentDeletes()">'

		})
		.when('/post', {
			controller: 'PostController',
			template:'<input type="button" value="createPost" ng-click="createPost()">'
			+ '<input type="button" value="listPosts" ng-click="listPosts()">'
			+ '<input type="button" value="updatePosts" ng-click="updatePosts()">'
			+ '<input type="button" value="deletePosts" ng-click="deletePosts()">'

		})
		.when('/password/forgot', {
			controller: 'UserController',
			templateUrl:'app/views/forgot_password.html'
		})
		.when('/reset', {
			controller: 'UserController',
			templateUrl:'app/views/reset_password.html'
		})
		.when('/registration', {
			controller: 'UserController',
			templateUrl:'app/views/registration.html'
		})
		.when('/message', {
			controller: 'MessageController',
			templateUrl:'app/views/message.html'
		})
		.when('/club', {
			templateUrl:'app/views/group.html'
		})
		.when('/club/view/:id/:status', {
			templateUrl:'app/views/group_view.html'
		})
		.when('/album', {
			controller: 'AlbumController',
			templateUrl:'app/views/album.html'
		})
		.when('/albumimgupload', {
			controller: 'AlbumController',
			templateUrl:'app/views/albumimgupload.html'
		})
		.when('/album/images/:album_id/:album_name', {
			controller: 'AlbumController',
			templateUrl:'app/views/albumimgupload.html'
		})
		.when('/shope', {
			controller: 'StoreController',
			templateUrl:'app/views/store.html'
		})
		.when('/shope/create', {
			controller: 'CreateStoreController',
			templateUrl:'app/views/store_create.html'
		})
		.when('/shope/view/:id', {
			templateUrl:'app/views/store_detail.html'
		})
		.when('/viewfriend/:friendId', {
			controller: 'FriendProfile',
			templateUrl:'app/views/friend_profile.html'
		})
		.when('/storealbum', {
			controller: 'StoreAlbumController',
			templateUrl:'app/views/storealbum.html'
		})
		.when('/album/shope/:id', {
			controller: 'StoreAlbumController',
			templateUrl:'app/views/storealbum.html'
		})
		.when('/storealbumimgupload', {
			controller: 'StoreAlbumController',
			templateUrl:'app/views/storealbumimgupload.html'
		})
		.when('/album/shope/image/:album_id/:album_name/:id', {
			controller: 'StoreAlbumController',
			templateUrl:'app/views/storealbumimgupload.html'
		})
		.when('/register/:typeId', {
			controller: 'UserController',
			templateUrl:'app/views/registration-step-one.html'
		})
		.when('/brokerprofilestep/:userId/:typeId', {
			controller: 'UserController',
			templateUrl:'app/views/brokerprofilestep.html'
		})
		.when('/storeProfilestep/:userId/:typeId', {
			controller: 'UserController',
			templateUrl:'app/views/storeProfilestep.html'
		})
		.when('/createbrokerprofile', {
			controller: 'CreateBrokerController',
			templateUrl:'app/views/createbrokerprofile.html'
		})
		.when('/create/child/shope/:id', {
			templateUrl:'app/views/create_child_store.html'
		})
		.when('/profileimgupload', {
			controller: 'ProfileImageController',
			templateUrl:'app/views/profileimgupload.html'
		})
		.when('/friend/album/:id/:friendId', {
			controller: 'friendAlbumController',
			templateUrl:'app/views/friend_album.html'
		})
		.when('/friend/image/:id/:name/:userId', {
			controller: 'friendAlbumController',
			templateUrl:'app/views/friend_image.html'
		})
		.when('/album/club/:clubId/:clubType', {
			controller: 'ClubAlbumController',
			templateUrl:'app/views/club_album.html'
		})
		.when('/album/club/view/:clubId/:albumId/:type/:name', {
            controller: 'ClubAlbumPhotoController',
            templateUrl:'app/views/club_album_photos.html'
        })
		.when('/cos_e_e_come_funziona', {
			templateUrl:'app/views/cos_e_e_come_funziona.html'
		})
		.when('/diventa_manager', {
			templateUrl:'app/views/diventa_manager.html'
		})
		.when('/market', {
			//controller: 'ClubAlbumPhotoController',
			templateUrl:'app/views/market.html'
		})
		.when('/progetti_sociali', {
			//controller: 'ClubAlbumPhotoController',
			templateUrl:'app/views/progetti_sociali.html'
		})
		.when('/negozi_e_imprese', {
			//controller: 'ClubAlbumPhotoController',
			templateUrl:'app/views/negozi_e_imprese.html'
		})
		.when('/redditi', {
			//controller: 'ClubAlbumPhotoController',
			templateUrl:'app/views/redditi.html'
		})
		.when('/momosy', {
			//controller: 'ClubAlbumPhotoController',
			templateUrl:'app/views/momosy.html'
		})
		.when('/about', {
			templateUrl:'app/views/user_about.html'
		})
		.when('/change_language', {
			templateUrl:'app/views/change_language.html'
		})
		.when('/:id/friends', {
			controller: 'FriendFriendController',
			templateUrl:'app/views/friend_friend.html'
		})
		.when('/:id/shops', {
			controller: 'FriendShopController',
			templateUrl:'app/views/friend_shops.html'
		})
		.when('/:id/clubs', {
			controller: 'FriendClubController',
			templateUrl:'app/views/friend_clubs.html'
		})
		.otherwise({redirectTo: '/'});
});

app.run(function($rootScope, $location, UserService) {
   $rootScope.$watch(function() { 
      return $location.path(); 
    },
    function(url){
		if(UserService.isAuthenticated() && ($rootScope.hasOwnProperty('getAllNotification') || $rootScope.hasOwnProperty('listUnReadMessages'))) {
			$rootScope.getAllNotification(); 
    		$rootScope.listUnReadMessages();
		} 
		if(UserService.isAuthenticated() && (url === '/' || url === '/password/forgot' || url === '/reset')) {
			$location.path('/profile');
		}
    });
});

