app.service('StoreService', function ($http) {
    var stId = "";
    return {
    	getStore: function(opt, callback) { 
            var url = APP.service.getStore+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getAllStoreWithChild: function(opt, callback) { 
            var url = APP.service.getStoreWithChild+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        createStore: function(opt, callback) { 
            var url = APP.service.createStore+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        createChildStore: function(opt, callback) { 
            var url = APP.service.createChildStore+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        updateStore: function(opt, callback) { 
            var url = APP.service.updateStore+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getCountryList: function(opt, callback) { 
            var url = APP.service.getCountryList;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        deleteStore: function(opt, callback) { 
            var url = APP.service.deleteStore+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        searchStore: function(opt, callback) { 
            var url = APP.service.searchStore+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getStoreDetail: function(opt, callback) { 
            var url = APP.service.storeDetail+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getStoreNotifications: function(opt, callback) { 
            var url = APP.service.getStoreNotification+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        acceptDenyToStoreNotification: function(opt, callback) { 
            var url = APP.service.responseToStoreNoti+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getStoreOwnerId : function(opt) { 
           return stId;
        },
        setStoreOwnerId : function(opt) { 
            stId = opt.storeId;
        },
        setStoreProfileImage: function(opt, callback) { 
            var url = APP.service.setStoreProfileImage+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        uploadStoreProfileimage: function(opt, file, callback) { 
            var url = APP.service.uploadStoreProfileimage+"?access_token="+APP.accessToken;
            doUploadStoreProfilePost($http, url, opt, file, function(data) {
                callback(data);
            });
        },
        searchUser: function(opt, callback) { 
            var url = APP.service.searchUser+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        inviteUserOnStore: function(opt, callback) { 
            var url = APP.service.inviteUserOnStore+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        }
    };
});