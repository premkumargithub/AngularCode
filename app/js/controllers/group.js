app.controller('GroupController', function ($scope, $http, GroupService, fileReader) {
    $scope.groupTypes = APP.groupTypes;
    $scope.createGroupData = {};
    $scope.removeImage = false;
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
        $scope.tab = tab;
        $scope.clubAllList = [];
        $scope.groupMyClubActive = 'current';
        $scope.groupPublicActive = '';
        var formData = {};
        
        var limit_start = $scope.clubMyList.length;
        formData.user_id = APP.currentUser.id;
        formData.group_owner_id = APP.currentUser.id;
        formData.limit_start = limit_start;
        formData.limit_size = APP.group_pagination.end;
        //calling the services to get the group list
        if ((($scope.myTotalSize > limit_start) || $scope.myTotalSize == 0 ) && $scope.myRes == 1) {
            $scope.isLoading = true;
            $scope.myRes = 0;
            GroupService.getUserGroups(formData, function(data){
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

    $scope.searchPublicGroup = function(tab) {
        $scope.tab = tab;
        $scope.clubMyList = [];
        $scope.groupPublicActive = 'current';
        $scope.groupMyClubActive = '';
        var limit_start = $scope.clubAllList.length;
        var formData = {};
        
        formData.user_id = APP.currentUser.id;
        formData.group_name = ($scope.clubTitle === undefined ? '' :$scope.clubTitle);
        formData.limit_start = limit_start;
        formData.limit_size = APP.group_pagination.end;
        //calling the services to get the group list
        if ((($scope.totalSize > limit_start) || $scope.totalSize == 0 ) && $scope.allRes == 1) {
            $scope.allRes = 0;
            $scope.isLoading = true;
            GroupService.searchGroup(formData, function(data) {
                if (data.code == 101) {
                    $scope.totalSize = data.data.size;
                    $scope.allRes = 1; 
                    $scope.userGroupList =  $scope.clubAllList = $scope.clubAllList.concat(data.data.groups);
                    $scope.isLoading = false;

                } else {
                    $scope.allRes = 1; 
                    $scope.isLoading = false;
                }
                if ($scope.userGroupList.length == 0){
                    $scope.noContent = true; 
                    $scope.isLoading = false;
                }
            });
        };
    }

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

    $scope.searchPublicGroup('allclub');
    $scope.createGroupToggleTag = true;
    $scope.createGroupStart = false;
    $scope.createGroupToggle = function() {
        $scope.createGroupData.groupTypeID = 0;
        $scope.createGroupToggleTag = $scope.createGroupToggleTag === false ? true : false; 
    };

    $scope.cancelCreateGroupToggle = function() {
        $scope.createGroupData = {};
        $scope.files = '';
        $scope.myFile = '';
        $scope.imageSrc = '';
        $scope.createGroupToggle();
    };

    $scope.createGroup = function() {
        var opts = {};
        $scope.createGroupError = false;
        $scope.createGroupErrorMsg = 'Group can not created due to server error';
        $scope.createGroupStart = true;
        var groupStatusIdx = $scope.createGroupData.groupTypeID;
        var groupStatusData = $scope.groupTypes[groupStatusIdx];
        opts.user_id = APP.currentUser.id;
        opts.group_name = $scope.createGroupData.name;
        opts.group_status = groupStatusData.groupTypeID;

        if($scope.createGroupData.name === undefined ) {
            $scope.createGroupStart = false;
            $scope.createGroupErrorMsg = 'Please select the file first';
            $scope.createGroupError = true;
            return false;
        }
        opts.group_description = $scope.createGroupData.description;
        opts.group_media = '';

        //to make by default public group
        if(opts.group_status == 0) {
            opts.group_status = 1;
        }

        GroupService.createGroup(opts, $scope.myFile, function(data){
            if(data.code == 101) {
                $scope.createGroupStart = false;
                $scope.createGroupData = {};
                $scope.createGroupToggleTag = true;
                $scope.searchPublicGroup($scope.tab);
                $scope.removeImage = false;
            } else {
                $scope.createGroupStart = false;
                $scope.createGroupError = true;
            }
        });      
    };

    $scope.myFile = '';
    $scope.imageSrc = '';
    $scope.getFile = function () {
        $scope.progress = 0;
        fileReader.readAsDataUrl($scope.file, $scope)
        .then(function(result) {
            $scope.myFile = $scope.file;
            $scope.imageSrc = result;
            $scope.removeImage = true;
        });
    };

    $scope.removeClubDp = function(){
        $scope.myFile = "";
        $scope.imageSrc = "";
        $scope.imageSrc = false;
        $scope.removeImage = false;
    }

    //function to show two layout listing for the group
    $scope.listActive = 'active';
    $scope.changeView = function(layout){
        if(layout == 'grid'){
            $scope.gridActive = 'active'; 
            $scope.listActive = ''; 
        } else if(layout == 'list'){
            $scope.listActive = 'active'; 
            $scope.gridActive = '';
        }
    };

    //function to delete a user group
    $scope.deleteGroup = function(idx){ 
        var formData = {};
        $scope.isLoading = true;
        var groupData = $scope.userGroupList[idx];
        
        formData.user_id = APP.currentUser.id;
        formData.group_owner_id = groupData.owner_id;
        formData.group_id = groupData.group_id;
        // calling the services to delete the group
        GroupService.deleteGroup(formData, function(data){
            if(data.code == 101) {
                $scope.message = data.message;
                $scope.userGroupList.splice(idx, 1);
                $scope.isLoading = false;
            } else {
                $scope.message = data.message;
                $scope.isLoading = false;
            }
        });
    }

    $scope.requestMessage = "";
    $scope.showMessage = true;
    $scope.joinPublicGroups =function(groupId){
        $("#groupjoing"+groupId).hide();
        $("#joinloader"+groupId).show();
        $scope.requestMessage = "";
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.group_id = groupId;
        GroupService.joinPublicGroup(opts, function(data){
            if(data.code == 101 && data.message === "Success") {
                $("#requestsent"+groupId).show();
                $("#joinloader"+groupId).hide();
            } else if(data.code == 118){
                $("#requestpending"+groupId).show();
                $("#joinloader"+groupId).hide();
            }else {
                $("#groupjoing"+groupId).show();
                $("#joinloader"+groupId).hide();
            }
        });
    }

});

//controller to handle the post related operation
app.controller('PostController', function($scope, PostService) {

    //Function to create the post
   $scope.createPost = function() {
        var formData = {};
        formData.group_id = "53d8c8a48fd8cdb7c38b4567";
        formData.post_title = "post by postman";
        formData.post_desc = "description....";
        formData.user_id = 21;
        formData.youtube = "";
        //calling the create post service to create the post in the specific group
        PostService.createPost(formData, function(data){
            if(data.code == 101 && data.message === "success") {
                console.log('success')
            }
            else {
                console.log('failure')
            }
        });
    }

    //Function to list all the post
    $scope.listPosts = function() {
        var formData = {};
        formData.user_group_id = "53d8c8a48fd8cdb7c38b4567";
        formData.post_title = "post by postman";
        formData.post_desc = "description....";
        formData.user_id = 21;
        formData.group_type = 1;
        formData.limit_start = 0;
        formData.limit_size = 10;
        //calling the  post service to get all the post related to specific group
        PostService.listPosts(formData, function(data){
            if(data.code == 101 && data.message === "success") {
                console.log('success')
            }
            else {
                console.log('failure')
            }
        });
    }

    //Function to update the specific post
    $scope.updatePosts = function() {
        var formData = {};
        formData.user_group_id = "53d8c8a48fd8cdb7c38b4567";
        formData.post_title = "post by postman";
        formData.post_desc = "description....";
        formData.user_id = 21;
        formData.group_type = 1;
        formData.post_id = "53d8c9da8fd8cd82c68b4568";
        formData.youtube = "";
        //calling the  post service to update the post
        PostService.updatePosts(formData, function(data){
            if(data.code == 101 && data.message === "success") {
                console.log('success')
            }
            else {
                console.log('failure')
            }
        });
    }

    //function to delete the selected post
    $scope.deletePosts = function() {
        var formData = {};
        formData.user_id = 21;
        formData.post_id = "53d8f21a8fd8cdbb9f8b4586";
        //calling the  post service to delete the selected post
        PostService.deletePosts(formData, function(data){
            if(data.code == 101 && data.message === "success") {
                console.log('success')
            }
            else {
                console.log('failure')
            }
        });
    }
});

// Controller for handing the comment related operation
app.controller('CommentController', function($scope, CommentService) {

    //function to create the commment on certain post
    $scope.createComments = function() {
        var formData = {};
        formData.session_id = 21;
        formData.postid = "53d8f5838fd8cdbb9f8b4589";
        formData.body = "that's my name";
        //calling the create comment service to create the comment on the specific post
        CommentService.createComments(formData, function(data){
            if(data.code == 101 && data.message === "success") {
                console.log('success')
            }
            else {
                console.log('failure')
            }
        });
    }

    //function to list all the comment of the post
    $scope.commentLists = function() {
        var formData = {};
        formData.session_id = 21;
        formData.post_id = "53d8f5838fd8cdbb9f8b4589";
        formData.body = "that's my name";
        formData.limit_size = 20;
        formData.limit_start = 0;
        //calling the  comment service to list all the comment of the post
        CommentService.commentLists (formData, function(data){
            if(data.code == 101 && data.message === "success") {
                console.log('success')
            }
            else {
                console.log('failure')
            }
        });
    }

    //Function to update the selected comment 
    $scope.commentUpdates = function() {
        var formData = {};
        formData.session_id = 21;
        formData.comment_id = "53d8ca9e8fd8cdb7c38b456c";
        formData.body = "that's my name";
        //calling the  comment service to update the selected comment 
        CommentService.commentUpdates (formData, function(data){
            if(data.code == 101 && data.message === "success") {
                console.log('success')
            }
            else {
                console.log('failure')
            }
        });
    }

    //Function to delete the selected comment
    $scope.commentDeletes = function() {
        var formData = {};
        formData.session_id = 21;
        formData.comment_id = "53d8ca878fd8cd82c68b456d";
        //calling the comment service to delete the selected comment 
        CommentService.commentDeletes (formData, function(data){
            if(data.code == 101 && data.message === "success") {
                console.log('success')
            }
            else {
                console.log('failure')
            }
        });
    }
});

app.controller('ClubNotificationController', function ($scope, $http, GroupService) {
    $scope.getClubNotification = function() {
        $scope.NotificationFound = false;
        $scope.NotificationNotFound = false;
        opts = {};
        opts.user_id = APP.currentUser.id;
        GroupService.getAllClubNotifications(opts, function(data) {
            if(data.code == 101 && data.message === 'success') {
                if(data.data.length != 0) {
                    $scope.notifications = data.data;
                    $scope.NotificationFound = true;
                } else {
                    $scope.NotificationNotFound = true;
                }
            } else {
                $scope.NotificationNotFound = true;
            }
        });
    };

    $scope.getClubNotification();
    $scope.acceptRequest = function(senderId, requestId, groupId, groupType, id) {
        $("#noti-"+id).fadeOut(1000);
        opts = {};
        opts.user_id = APP.currentUser.id;
        opts.request_id = requestId;
        opts.sender_id = senderId;
        opts.group_id = groupId;
        if(groupType == 1)
            opts.request_type = 'admin';
        else
            opts.request_type = 'user';
        opts.response = 1;
        GroupService.responseClubNotification(opts, function(data) {
            if(data.code == 101 && data.message === 'success') { 
                $scope.getClubNotification();
            } else {

            }
        });
    };

    $scope.rejectRequest = function(senderId, requestId, groupId, groupType, id) { 
        $("#noti-"+id).fadeOut(1000);
        opts = {};
        opts.user_id = APP.currentUser.id;
        opts.request_id = requestId;
        opts.sender_id = senderId;
        opts.group_id = groupId;
        if(groupType == 1)
            opts.request_type = 'admin';
        else
            opts.request_type = 'user';
        opts.response = 2;
        GroupService.responseClubNotification(opts, function(data) {
            if(data.code == 101 && data.message === 'success') { 
                $scope.getClubNotification();
            } else {

            }
        });
    };
});

app.controller('ClubSpecificationNotification', function ($scope, $http, $routeParams, GroupService) {
    $scope.getClubNotification = function() { 
        $scope.NotificationFound = false;
        $scope.NotificationNotFound = false;
        opts = {};
        opts.user_id = APP.currentUser.id;
        opts.group_id = $routeParams.id;
        GroupService.getGroupNotifications(opts, function(data) {
            if(data.code == 101) {
                if(data.data.length != 0) {
                    $scope.notifications = data.data;
                    $scope.NotificationFound = true;
                } else {
                    $scope.NotificationNotFound = true;
                }
            } 
            else if(data.code == 500) {
                $scope.NotificationNotFound = true;
            }
            else {
                $scope.NotificationNotFound = true;
            }
        });
    };

    $scope.getClubNotification();
    $scope.acceptRequest = function(senderId, requestId, groupId, groupType, id) {
        $("#noti-"+id).fadeOut(1000);
        opts = {};
        opts.user_id = APP.currentUser.id;
        opts.request_id = requestId;
        opts.sender_id = senderId;
        opts.group_id = groupId;
        if(groupType == 1)
            opts.request_type = 'admin';
        else
            opts.request_type = 'user';
        opts.response = 1;
        GroupService.responseClubNotification(opts, function(data) {
            if(data.code == 101 && data.message === 'success') { 
                $scope.getClubNotification();
            } else {

            }
        });
    };

    $scope.rejectRequest = function(senderId, requestId, groupId, groupType, id) { 
        $("#noti-"+id).fadeOut(1000);
        opts = {};
        opts.user_id = APP.currentUser.id;
        opts.request_id = requestId;
        opts.sender_id = senderId;
        opts.group_id = groupId;
        if(groupType == 1)
            opts.request_type = 'admin';
        else
            opts.request_type = 'user';
        opts.response = 2;
        GroupService.responseClubNotification(opts, function(data) {
            if(data.code == 101 && data.message === 'success') { 
                $scope.getClubNotification();
            } else {

            }
        });
    };
});
