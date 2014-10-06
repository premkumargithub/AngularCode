app.service('AlbumService', function ($http, $q) {
    return {        
        createAlbum: function(opt, callback){
            var url = APP.service.createAlbum + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        uploadmediaAlbum: function(opt, file, callback){
            var url = APP.service.uploadmediaAlbum + "?access_token=" + APP.accessToken;
            doPostUploadWithMedia($http, url, opt, file, function(data) {
                callback(data);
            });
        },
        albumListing: function(opt, callback){
            var url = APP.service.albumListing + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        deleteAlbum: function(opt, callback){
            var url = APP.service.deleteAlbum + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        viewAlbum: function(opt, callback){
            var url = APP.service.viewAlbum + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        countPhoto: function(opt, callback){
            var url = APP.service.countPhoto + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        deleteMediaAlbum: function(opt, callback){
            var url = APP.service.deleteMediaAlbum + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
         setuserprofileimages: function(opt, callback){
            var url = APP.service.setuserprofileimages + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        }
    };
});
	

 
