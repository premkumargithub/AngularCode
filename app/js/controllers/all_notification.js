app.controller('AllNotiController', function($cookieStore, $scope, $rootScope, $http, $location, $timeout, UserService, ProfileService) {
	$scope.NotificationFound = false;
	$scope.NotificationNotFound = false;
	$rootScope.showNotificationList = false;
	$scope.loadNotification = false;

	$scope.showAllNotification = function() {
		$rootScope.showNewMessageList = false;
		$rootScope.showNotificationList = !$rootScope.showNotificationList;
		$rootScope.getAllNotification();
	};	

	$rootScope.getAllNotification = function() {
		$scope.loadNotification = true;
		$scope.NotificationFound = false;
		$scope.NotificationNotFound = false;
		opts = {};
		opts.user_id = APP.currentUser.id;
		opts.limit_start = 0;
		opts.limit_size = 12;
		ProfileService.getPendingFreindReq(opts, function(data) {
			if(data.code == 101 && data.message === 'success') {
				$scope.loadNotification = false;
				$scope.FriendRequests = data.data;
				$scope.NotificationFound = true;
			} else {
				$scope.NotificationFound = false;
			}
		});
	};

	if(UserService.isAuthenticated()) {
		$rootScope.getAllNotification();
	}
	$scope.AcceptRequest = function(friendId, id) {
		$("#top-request-" + id).fadeOut(1000);
		opts = {};
		opts.user_id = APP.currentUser.id;
		opts.friend_id = friendId;
		opts.action = 1;
		ProfileService.acceptFriendRequest(opts, function(data) {
			if(data.code == 101 && data.message === 'success') {
				$("#top-request-" + id).hide();
				$rootScope.getAllNotification();
			} else {
				$("#top-request-" + id).show();
			}
		});
	};

	$scope.RejectRequest = function(friendId, id) {
		$("#top-request-" + id).fadeOut(1000);
		opts = {};
		opts.user_id = APP.currentUser.id;
		opts.friend_id = friendId;
		opts.action = 0;
		ProfileService.rejectFriendRequest(opts, function(data) {
			if(data.code == 101 && data.message === 'success') {
				$("#top-request-" + id).hide();
				$rootScope.getAllNotification();
			} else {
				$("#top-request-" + id).hide();
			}
		});
	};
});