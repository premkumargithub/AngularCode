app.controller('UserCoverProfileController', function($cookieStore, $rootScope, $scope, $route, $http, $location, $timeout, $interval, $routeParams, fileReader, ProfileService) {
	$scope.coverImageUploadStart = false;
	$rootScope.timelineActive = 'timeline';
	var activeUrl = $location.path().replace("/", "");
	switch(activeUrl) {
		case 'friends' :  
		$rootScope.timelineActive = 'friends'; break;
		case 'album' :  
		$rootScope.timelineActive = 'album'; break;
		case 'club' :  
		$rootScope.timelineActive = 'club'; break;
		case 'shope' :  
		$rootScope.timelineActive = 'shope'; break;
        case 'about' :  
        $rootScope.timelineActive = 'about'; break;
		default : 
		$rootScope.timelineActive = 'timeline';
	}

    $scope.myFile = '';
    $scope.invalidCoverImage = false;
    $scope.invalidCoverImageMgs = 'Please choose an image that is at least 400 pixels wide and at least 200 pixels tall.';
    $scope.getFile = function () { 
        $scope.progress = 0;
        fileReader.readAsDataUrl($scope.file, $scope)
        .then(function(result) {
            $scope.myFile = $scope.file;
            $scope.readImage($scope.myFile, function(data){
                if(data.length != 0 && data.width >= 400 && data.height >= 200){
                    $scope.uploadProfileCover(); 
                }
                else { 
                    $("#invalidCoverImage").show();
                    $timeout(function(){
                        $("#invalidCoverImage").hide();
                    }, 2000);
                }
            });
        });
    };

    //function to check upload image dimenstions
    $scope.readImage = function(file, callback) {
    var reader = new FileReader();
    var image  = new Image();
    reader.readAsDataURL(file);  
    reader.onload = function(_file) {
        var filedata = {};
        image.src    = _file.target.result;
        image.onload = function() {
            var w = this.width,
                h = this.height,
                t = file.type,                     
                n = file.name,
                s = ~~(file.size/1024) +'KB';
                filedata['width'] = w;
                filedata['height'] = h;
                callback(filedata);
        };
        image.onerror= function() {
            callback(filedata);
        };      
    };

}

    $scope.uploadProfileCover = function() {
    	$scope.coverImageUploadStart = true;
    	var opts = {};
    	opts.user_id = APP.currentUser.id;
    	opts.user_media = $scope.myFile;
    	ProfileService.uploadCoverPhoto(opts, $scope.myFile, function(data) {
    		if(data.code == '101') {
                $rootScope.currentUser.basicProfile.profile_cover_img = {"original":data.data.user_info.cover_image, "thumb":data.data.user_info.cover_image_thumb};
    			$rootScope.currentUser.basicProfile.profile_cover_img.thumb = data.data.user_info.cover_image_thumb;
    			$rootScope.currentUser.basicProfile.profile_cover_img.original = data.data.user_info.cover_image;
                $scope.coverImageUploadStart = false;
    		} else {
                $scope.coverImageUploadStart = false;
    		}
    	});
    }
});	
	