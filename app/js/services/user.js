app.service('UserService', function ($http, $q) {
    return {
        getAccessToken: function(opts) {
            return $http({
				method: 'POST',
				url: APP.service.getAccessToken,
				data: opts,
				headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
				}).then(function(response) {
                if (typeof response.data === 'object') {
                    return response.data;
                } else {
                    return $q.reject(response.data);
                }
                }, function(response) {
                    console.log(response);
                    return $q.reject(response.data);
            	});
        },
        getCurrentUser: function() {
        	return APP.currentUser;
        },
        isAuthenticated: function() {
        	return (Object.keys(APP.currentUser).length != 0 ) ? true : false;
        },
        logout: function(opt, callback){
            var url = APP.service.logout + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        forgotPassword: function(opt, callback){
            var url = APP.service.forgotPassword;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        resetPassword: function(opt, callback){
            var url = APP.service.resetPassword;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        registration: function(opt, callback){
            var url = APP.service.registration;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        registerMultiProfile: function(opt, callback){
            var url = APP.service.registerMultiProfile + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getBasicProfile: function(opt, callback) {
            var url = APP.service.viewMultiProfile + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        }
    };
});

app.service('CreateBrokerService', function($http) {

    //function to call the third party api
    return {
        createBroker: function(opt, callback){
            var url = APP.service.brokerMultiprofile + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        }
    };
});
	

app.service('saveUserPass', function() {
    var thisusername = "";
    var thispassword = "";
    return {
        saveUserPassword: function(username, password){
            thisusername = username;
            thispassword = password;
        },
        getUsername : function(){
            return thisusername;
        },
        getPassword : function(){
            return thispassword;
        },
        clearUserPass : function(){
            var thisusername = "";
            var thispassword = "";
        },
    };
});
