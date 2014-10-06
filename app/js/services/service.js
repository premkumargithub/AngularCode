//common function to call the post services
function doPost($http, url, opt, callback){
    $http({
        method: "POST",
        url: url,
        data    : {reqObj: opt},
        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
    })
    .success( function(data){
        callback(data);
    })
    .error(function(data){
        if(!checkTokenNotExpired(data)) {
            callback(data);
        }
    });
}

//common function to call the post services with file object
function doPostWithFile($http, url, opt, file, callback){
    var fd = new FormData();
    fd.append('group_media', file);
    fd.append('reqObj', angular.toJson(opt));
    
    $http({
        method: "POST",
        url: url,
        data    : fd,
        headers: {'Content-Type': undefined},                 
        transformRequest: angular.identity,
    })
    .success( function(data){
        callback(data);
    })
    .error(function(data){
        if(!checkTokenNotExpired(data)) {
            callback(data);
        }
    });
}

//common function to call the post services with file object
function doPostUploadWithMedia($http, url, opt, files, callback) {
    var fd = new FormData();
    angular.forEach(files, function(file) {
        fd.append('user_media[]', file);
    });
    fd.append('reqObj', angular.toJson(opt));
    
    $http({
        method: "POST",
        url: url,
        data    : fd,
        headers: {'Content-Type': undefined},                 
        transformRequest: angular.identity,
    })
    .success( function(data){
        callback(data);
    })
    .error(function(data){
        if(!checkTokenNotExpired(data)) {
            callback(data);
        }
    });

}

//common function to call the post services with file object
function doPostUploadProfileMedia($http, url, opt, file, callback) {
    var fd = new FormData();
    fd.append('user_media', file);
    fd.append('reqObj', angular.toJson(opt));
    
    $http({
        method: "POST",
        url: url,
        data    : fd,
        headers: {'Content-Type': undefined},                 
        transformRequest: angular.identity,
    })
    .success( function(data){
        callback(data);
    })
    .error(function(data){
        if(!checkTokenNotExpired(data)) {
            callback(data);
        }
    });

}

//common function to call the post services with file object for store album and store post with image
function doPostUploadWithStoreMedia($http, url, opt, files, callback) {
    var fd = new FormData();
    angular.forEach(files, function(file) {
        fd.append('store_media[]', file);
    });
    fd.append('reqObj', angular.toJson(opt));
    
    $http({
        method: "POST",
        url: url,
        data    : fd,
        headers: {'Content-Type': undefined},                 
        transformRequest: angular.identity,
    })
    .success( function(data){
        callback(data);
    })
    .error(function(data){
        if(!checkTokenNotExpired(data)) {
            callback(data);
        }
    });

}

//common function to call the post services with file object
function doPostReplyWithMedia($http, url, opt, file, callback){
    var fd = new FormData();
    fd.append('commentfile[]', file);
    fd.append('reqObj', angular.toJson(opt));
    
    $http({
        method: "POST",
        url: url,
        data    : fd,
        headers: {'Content-Type': undefined},                 
        transformRequest: angular.identity,
    })
    .success( function(data){
        callback(data);
    })
    .error(function(data){
        if(!checkTokenNotExpired(data)) {
            callback(data);
        }
    });
}

//common function to call the group post services with file object
function doPostPostOnGroupWithFile($http, url, opt, files, callback){
    var fd = new FormData();
    angular.forEach(files, function(file) {
        fd.append('post_media[]', file);
    });
    fd.append('reqObj', angular.toJson(opt));
    
    $http({
        method: "POST",
        url: url,
        data    : fd,
        headers: {'Content-Type': undefined},                 
        transformRequest: angular.identity,
    })
    .success( function(data){
        callback(data);
    })
    .error(function(data){
        if(!checkTokenNotExpired(data)) {
            callback(data);
        }
    });
}

//common function to call the group comment services with file object
function doPostCommentOnGroupWithFile($http, url, opt, files, callback){
    var fd = new FormData();
    angular.forEach(files, function(file) {
        fd.append('commentfile[]', file);
    });
    fd.append('reqObj', angular.toJson(opt));
    
    $http({
        method: "POST",
        url: url,
        data    : fd,
        headers: {'Content-Type': undefined},                 
        transformRequest: angular.identity,
    })
    .success( function(data){
        callback(data);
    })
    .error(function(data){
        console.log('error' + data);
        callback(data);
    });
}

// not in use because the images are uploading separatly
//function to call the post media file of dashboard post
// function doDashboardPostWithFile($http, url, opt, files, callback){
//     var fd = new FormData();
//     angular.forEach(files, function(file) {
//         fd.append('postfile[]', file);
//     });
//     fd.append('reqObj', angular.toJson(opt));
//     $http({
//         method: "POST",
//         url: url,
//         data    : fd,
//         headers: {'Content-Type': undefined},                 
//         transformRequest: angular.identity,
//     })
//     .success( function(data){
//         callback(data);
//     })
//     .error(function(data){
//         if(!checkTokenNotExpired(data)) {
//             callback(data);
//         }
//     });
// }

//function to call the post media file for store profile
function doUploadStoreProfilePost($http, url, opt, file, callback){
    var fd = new FormData();
    fd.append('store_media', file);
    fd.append('reqObj', angular.toJson(opt));
    $http({
        method: "POST",
        url: url,
        data    : fd,
        headers: {'Content-Type': undefined},                 
        transformRequest: angular.identity,
    })
    .success( function(data){
        callback(data);
    })
    .error(function(data){
        if(!checkTokenNotExpired(data)) {
            callback(data);
        }
    });
}

//function to call the comment media
//common function to call the store comment services with file object
function doPostCommentOnStoreWithFile($http, url, opt, files, callback){
    var fd = new FormData();
    angular.forEach(files, function(file) {
        fd.append('commentfile[]', file);
    });
    fd.append('reqObj', angular.toJson(opt));
    $http({
        method: "POST",
        url: url,
        data    : fd,
        headers: {'Content-Type': undefined},                 
        transformRequest: angular.identity,
    })
    .success( function(data){
        callback(data);
    })
    .error(function(data){
        console.log('error' + data);
        callback(data);
    });
}

function doPostWithClubAlbumMedia($http, url, opt, files, callback) {
    var fd = new FormData();
    angular.forEach(files, function(file) {
        fd.append('group_media[]', file);
    });
    fd.append('reqObj', angular.toJson(opt));
    
    $http({
        method: "POST",
        url: url,
        data    : fd,
        headers: {'Content-Type': undefined},                 
        transformRequest: angular.identity,
    })
    .success( function(data){
        callback(data);
    })
    .error(function(data){
        if(!checkTokenNotExpired(data)) {
            callback(data);
        }
    });
}

//function to call the comment media
//common function to call the store comment services with file object
function doPostCommentOnDashboardWithFile($http, url, opt, file, callback){
    var fd = new FormData();
    fd.append('commentfile[]', file);
    fd.append('reqObj', angular.toJson(opt));
    $http({
        method: "POST",
        url: url,
        data    : fd,
        headers: {'Content-Type': undefined},                 
        transformRequest: angular.identity,
    })
    .success( function(data){
        callback(data);
    })
    .error(function(data){
        if(!checkTokenNotExpired(data)) {
            callback(data);
        }
    });
}

function checkTokenNotExpired(data) {
    if( data.hasOwnProperty('error') ) {
        angular.element(document.getElementById('AppController')).scope().logoutWithoutService();
    } else {
        return false;
    }
}