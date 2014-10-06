app.service('ProfileService', function ($http) {
    return {
    	getProfile: function(opt, callback) { 
            var url = APP.service.getProfile+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        viewMultiProfile: function(opt, callback) { 
            var url = APP.service.viewMultiProfile+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        editProfileDetail: function(opt, callback) { 
            var url = APP.service.editProfile+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        deleteProfile: function(opt, callback) { 
            var url = APP.service.deleteProfile+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        searchUser: function(opt, callback) { 
            var url = APP.service.searchUser+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        searchFriend: function(opt, callback) { 
            var url = APP.service.searchFriend+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        friendProfileView: function(opt, callback) { 
            var url = APP.service.friendProfile+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        dashboardPost: function(opt, callback) { 
            var url = APP.service.dashboardpost+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getPendingFreindReq: function(opt, callback) {
            var url = APP.service.getPendingFriendRequest + "?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        acceptFriendRequest: function(opt, callback) {
            var url = APP.service.acceptDenyFriendReq + "?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        rejectFriendRequest: function(opt, callback) {
            var url = APP.service.acceptDenyFriendReq + "?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        sendFriendRequests : function(opt, callback) {
            var url = APP.service.sendFriendRequests + "?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        listDashboardPost: function(opt, callback) { 
            var url = APP.service.listDashboardPost+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        deleteDashboardPost: function(opt, callback) { 
            var url = APP.service.deleteDashboardPost+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        updateDashboardPost: function(opt, callback) {
            var url = APP.service.updateDashboardPost+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        createDashboardCommentImage: function(opt,file, callback) { 
            var url = APP.service.createDashboardComment+"?access_token="+APP.accessToken;
            doPostCommentOnDashboardWithFile($http, url, opt, file, function(data) {
                callback(data);
            });
        },
        createDashboardCommentFinal: function(opt, callback) { 
            var url = APP.service.createDashboardComment+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        changePassword : function(opt,callback){
            var url = APP.service.changePassword+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        deleteDashboardComment: function(opt, callback) { 
            var url = APP.service.deleteDashboardComment+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        updateDashboardComment: function(opt, callback) { 
            var url = APP.service.updateDashboardComment+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        deletePostMedia: function(opt, callback) { 
            var url = APP.service.deletePostMedia+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        deleteDashboardMediaComments: function(opt, callback) { 
            var url = APP.service.dashboardMediaDeleteComments+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        friendAlbumListing: function(opt, callback) { 
            var url = APP.service.albumListing+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        friendAlbumImage: function(opt, callback){
            var url = APP.service.viewAlbum + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        listUnReadMessages: function(opt, callback){
            var url = APP.service.listunreadmessages + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getDashboardComments: function(opt, callback) { 
            var url = APP.service.getDashboardComments+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        readMessage: function(opt, callback){
            var url = APP.service.readMessage + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        uploadCoverPhoto: function(opt, file, callback){
            var url = APP.service.setUserProfileCover + "?access_token=" + APP.accessToken;
            doPostUploadProfileMedia($http, url, opt, file, function(data) {
                callback(data);
            });
        },
    };
});