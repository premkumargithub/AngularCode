app.controller('FriendController', function($cookieStore, $rootScope, $scope, $http, $location, $timeout, $routeParams, MessageService, ProfileService, fileReader) {
	$scope.frieandListObject = [];    
	$scope.friendAllList = [];
    $scope.totalSize = 0;
    $scope.allRes = 1;
	$scope.friendListLoader = false;
    $scope.resultNotFound = false;
    $scope.getAllFriend = function() {
        var opts = {};
        var limit_start = $scope.friendAllList.length;
        opts.friend_name = ($scope.friendName === undefined) ? '' : ($scope.friendName);
        opts.user_id = APP.currentUser.id; 
        opts.limit_start = limit_start;
        opts.limit_size =  APP.friend_list_pagination.end;
        //console.log("Total= "+ $scope.totalSize + "start= "+ limit_start + "response= "+ $scope.allRes);
        if ((( $scope.totalSize > limit_start) || $scope.totalSize == 0 ) && $scope.allRes == 1) {
            $scope.friendListLoader = true;
            $scope.allRes = 0;
            MessageService.searchFriends(opts, function(data) {
                $scope.allRes = 1;
            	if(data.code == '101') {
                    $scope.totalSize = data.data.count;
            		$scope.friendListLoader = false;
                    $scope.frieandListObject =  $scope.friendAllList = $scope.friendAllList.concat(data.data.users);
                } else {
                    $scope.friendListLoader = false;
                    $scope.resultNotFound = true;
                }
            });
        }
    }

    $scope.getAllFriend();

    $scope.allList = function() {
        $scope.frieandListObject = [];
        $scope.friendAllList = [];
        $scope.friendName = '';
        $scope.getAllFriend();
    };

    $scope.loadMore = function() {
        $scope.getAllFriend();
    };

    $scope.searchFriend = function() {
        $scope.frieandListObject = [];
        $scope.friendAllList = [];
        $scope.getAllFriend();
    }
});

//Frined cover page controller
app.controller('FriendCoverProfileController', function($cookieStore, $rootScope, $scope, $route, $http, $location, $timeout, $interval, $routeParams, fileReader, ProfileService) {
    $rootScope.friendlineActive = 'about';
    var str = $location.path().replace("/", "");
    $scope.friendDetailId = str.split('/', 1)[0];
    var activeUrl = str.substring(str.lastIndexOf('/')+1);
    switch(activeUrl) {
        case 'friends' :  
        $rootScope.friendlineActive = 'friends'; break;
        case 'album' :  
        $rootScope.friendlineActive = 'album'; break;
        case 'club' :  
        $rootScope.friendlineActive = 'club'; break;
        case 'shope' :  
        $rootScope.friendlineActive = 'shope'; break;
        case 'about' :  
        $rootScope.friendlineActive = 'about'; break;
        default : 
        $rootScope.friendlineActive = 'about';
    }

    $scope.friendViewLoader = true;
    $scope.viewFriendProfile = function() {
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.friend_id = $scope.friendDetailId;
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

});

//Frined cover page controller
app.controller('FriendFriendController', function($cookieStore, $rootScope, $scope, $route, $http, $location, $timeout, $interval, $routeParams, MessageService) {
    $scope.frieandListObject = [];    
    $scope.friendAllList = [];
    $scope.totalSize = 0;
    $scope.allRes = 1;
    $scope.friendListLoader = false;
    $scope.resultNotFound = false;
    $scope.getAllFriend = function() {
        var opts = {};
        var limit_start = $scope.friendAllList.length;
        opts.friend_name = ($scope.friendName === undefined) ? '' : ($scope.friendName);
        opts.user_id = $routeParams.id; 
        opts.limit_start = limit_start;
        opts.limit_size =  APP.friend_list_pagination.end;
        //console.log("Total= "+ $scope.totalSize + "start= "+ limit_start + "response= "+ $scope.allRes);
        if ((( $scope.totalSize > limit_start) || $scope.totalSize == 0 ) && $scope.allRes == 1) {
            $scope.friendListLoader = true;
            $scope.allRes = 0;
            MessageService.searchFriends(opts, function(data) {
                $scope.allRes = 1;
                if(data.code == '101') {
                    $scope.totalSize = data.data.count;
                    $scope.friendListLoader = false;
                    $scope.frieandListObject =  $scope.friendAllList = $scope.friendAllList.concat(data.data.users);
                } else {
                    $scope.friendListLoader = false;
                    $scope.resultNotFound = true;
                }
            });
        }
    }

    $scope.getAllFriend();

    $scope.allList = function() {
        $scope.frieandListObject = [];
        $scope.friendAllList = [];
        $scope.friendName = '';
        $scope.getAllFriend();
    };

    $scope.loadMore = function() {
        $scope.getAllFriend();
    };

    $scope.searchFriend = function() {
        $scope.frieandListObject = [];
        $scope.friendAllList = [];
        $scope.getAllFriend();
    }
});

//To display the friends clubs 
app.controller('FriendClubController', function ($scope, $http, GroupService, $routeParams) {
    $scope.createGroupData = {};
    $scope.clubMyList = [];
    $scope.clubAllList = [];
    $scope.userGroupList = [];
    $scope.allRes = 1;
    $scope.myRes = 1;
    $scope.totalSize = 0;
    $scope.myTotalSize = 0;
    $scope.noContent = false; 
    $scope.groupPublicActive = 'current';
    $scope.groupMyClubActive = '';
    $scope.groupInvitActive = '';
    $scope.isLoading = true;

    $scope.myGroup = function(tab){
        //alert(tab);
        $scope.tab = tab;
        $scope.clubAllList = [];
        $scope.groupMyClubActive = 'current';
        $scope.groupPublicActive = '';
        var opts = {};
        
        var limit_start = $scope.clubMyList.length;
        opts.user_id = $routeParams.id;
        opts.group_owner_id = $routeParams.id;
        opts.limit_start = limit_start;
        opts.limit_size = APP.group_pagination.end;
        console.log(opts);
        console.log(APP.currentUser.id)
        //calling the services to get the group list
        if ((($scope.myTotalSize > limit_start) || $scope.myTotalSize == 0 ) && $scope.myRes == 1) {
            $scope.isLoading = true;
            $scope.myRes = 0;
            GroupService.getUserGroups(opts, function(data){
                if(data.code == 101) {
                    $scope.myTotalSize = data.data.size;
                    $scope.myRes = 1; 
                    $scope.userGroupList =  $scope.clubMyList = $scope.clubMyList.concat(data.data.groups);
                    $scope.isLoading = false;
                }
                else {
                    $scope.isLoading = false;
                }
                if ($scope.userGroupList.length == 0){
                    $scope.noContent = true; 
                } 
            });
        }; 
    };

    // $scope.searchPublicGroup = function(tab) {
    //     $scope.tab = tab;
    //     $scope.clubMyList = [];
    //     $scope.groupPublicActive = 'current';
    //     $scope.groupMyClubActive = '';
    //     var limit_start = $scope.clubAllList.length;
    //     var formData = {};
        
    //     formData.user_id = APP.currentUser.id;
    //     formData.group_name = ($scope.clubTitle === undefined ? '' :$scope.clubTitle);
    //     formData.limit_start = limit_start;
    //     formData.limit_size = APP.group_pagination.end;
    //     //calling the services to get the group list
    //     if ((($scope.totalSize > limit_start) || $scope.totalSize == 0 ) && $scope.allRes == 1) {
    //         $scope.allRes = 0;
    //         $scope.isLoading = true;
    //         GroupService.searchGroup(formData, function(data) {
    //             if (data.code == 101) {
    //                 $scope.totalSize = data.data.size;
    //                 $scope.allRes = 1; 
    //                 $scope.userGroupList =  $scope.clubAllList = $scope.clubAllList.concat(data.data.groups);
    //                 $scope.isLoading = false;

    //             } else {
    //                 $scope.allRes = 1; 
    //                 $scope.isLoading = false;
    //             }
    //             if ($scope.userGroupList.length == 0){
    //                 $scope.noContent = true; 
    //                 $scope.isLoading = false;
    //             }
    //         });
    //     };
    // }

    $scope.searchClub = function(tab) {
        $scope.tab = tab;
        $scope.clubMyList = [];
        $scope.groupPublicActive = 'current';
        $scope.clubAllList = [];
        $scope.userGroupList = [];
        $scope.clubMyList = [];
        $scope.searchPublicGroup('allclub');

    } 

    $scope.loadMore = function() { 
        if($scope.tab == 'myclub') {
            $scope.clubAllList = [];
            $scope.myGroup($scope.tab);
        } else {
            $scope.clubMyList = [];
            $scope.searchPublicGroup($scope.tab);
        }
    }

     $scope.myGroup('myclub');

});

//To display the friends clubs 
app.controller('FriendShopController', function ($scope, $http, GroupService, $routeParams) {
    console.log("friend shope controller")
});
