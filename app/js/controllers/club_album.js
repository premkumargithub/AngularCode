app.controller('ClubAlbumController', function($scope, $http, $timeout, GroupService, $routeParams, $location) {
	$scope.createAlbumForm = false;
	$scope.clubAlbumLoading = true;
	$scope.clubAlbumFound = false;
	$scope.CreateAlbumStart = false;
	$scope.createSuccess = false;
	$scope.createError = false;
	$scope.groupId = $routeParams.clubId;
	$scope.groupType = $routeParams.clubType;
	//opts.group_type = $routeParams.clubType;
	$scope.listOfAlbums = function() { 
		var opts = {};
		opts.group_id = $scope.groupId;
		opts.limit_start = APP.clubAlbum_pagination.start;
		opts.limit_size = APP.clubAlbum_pagination.end;
		GroupService.getClubAlbum(opts, function(data) {
			if(data.code == 101) {
				$scope.clubAlbumData = data.data;
				$scope.clubAlbumLoading = false;
				$scope.clubAlbumFound = true;
			} else {
				$scope.clubAlbumLoading = false;
				$scope.clubAlbumFound = false;
			}
		});
	}

	$scope.listOfAlbums();

	$scope.showAlbumForm = function() {
		$scope.createAlbumForm = !$scope.createAlbumForm;
		$scope.CreateAlbum = {};
	}

	$scope.createClubAlbum = function() {
		$scope.CreateAlbumStart = true;
		var opts = {};
		opts.group_id = $routeParams.clubId;
		opts.album_name = $scope.CreateAlbum.albumName;
		opts.album_desc = $scope.CreateAlbum.description;
		GroupService.createClubAlbum(opts, function(data) {
			$scope.CreateAlbumStart = false;
			if(data.code == 101) {
				$scope.createSuccess = true;
				$scope.successMessage = "Album created successfully.";
				$timeout(function(){
					$scope.createSuccess = false;
					$scope.successMessage = '';
					$scope.showAlbumForm();
					$scope.listOfAlbums();
				}, 2000);
			} else {
				$scope.createError = true;
				$scope.errorMessage = "Something went wrong on server side.";
				$timeout(function(){
					$scope.createError = false;
					$scope.errorMessage ='';
				}, 2000);
			}
		});
	};

	$scope.deleteClubAlbum = function(albumId, id) {
		//$("#deleteStart-"+id).hide();
		//$("#deleteStartLoader-"+id).show();
		var opts = {};
		opts.group_id = $scope.groupId;
		opts.album_id = albumId;
		GroupService.deleteClubAlbum(opts, function(data) {
			if(data.code == 101) {
				//$("#deleteStart-"+id).show();
				//$("#deleteStartLoader-"+id).hide();
				$scope.listOfAlbums();
			} else {

			}
		});
	};

	$scope.redirectUrl = function(albumId, name) {
		$location.path("/album/club/view/"+$scope.groupId+"/"+albumId+"/"+$scope.groupType+"/"+name);
	};

});

/**
* Controller for Club Album all photos
*
*/
app.controller('ClubAlbumPhotoController', function($scope, $http, $timeout, GroupService, $routeParams, fileReader) {
	$scope.createAlbumForm = false;
	$scope.clubAlbumLoading = true;
	$scope.imageUploadStart = false;
	$scope.uploadSuccess = false;
	$scope.uploadError = false;
	$scope.deleteMediaStart = false;
	$scope.groupId = $routeParams.clubId;
	$scope.albumId = $routeParams.albumId;
	$scope.clubType = $routeParams.type;
	$scope.albumName = $routeParams.name;

	$scope.viewClubAlbumPhotos = function() {
		$scope.clubAlbumLoading = true;
		var opts = {};
		opts.group_id = $scope.groupId;
		opts.album_id = $scope.albumId;
		GroupService.viewClubAlbum(opts, function(data) {
			if(data.code == 101) {
				$scope.clubAlbumLoading = false;
				$scope.viewalbum = data.data;
			} else {

			}
		});
	};

	$scope.viewClubAlbumPhotos();
	$scope.UploadMediaInAlbum = function() {
		if($scope.postFiles == undefined || $scope.postFiles.length == 0){
			$scope.uploadError = true;
			$scope.uploadErrorMsg = "Please select the file first";
			$timeout(function(){
					$scope.uploadErrorMsg = "";
					$scope.uploadError = false;
			}, 2000);
			return false;
		}
		$scope.imageUploadStart = true;
		var opts = {};
		opts.group_id = $scope.groupId;
		opts.album_id = $scope.albumId;
		opts.group_media = $scope.postFiles;
		GroupService.uploadMediaInClubAlbum(opts, $scope.postFiles, function(data) {
			$scope.postFiles = [];
			$scope.imageSrc = [];
			if(data.code == 101) {
				$scope.imageUploadStart = false;
				$scope.uploadSuccess = true;
				$scope.uploadSuccessMsg = "Photos uploaded successfully."
				$("input[type='file']").val('');
				$timeout(function(){
					$scope.uploadSuccessMsg = "";
					$scope.viewClubAlbumPhotos();
				}, 2000);
			} else {
				$("input[type='file']").val('');
				$scope.imageUploadStart = false;
				$scope.uploadError = true;
				$scope.uploadErrorMsg = "Error in uploaded photos.";
				$timeout(function(){
					$scope.$scope.uploadErrorMsg = "";
					$scope.viewClubAlbumPhotos();
				}, 2000);
				$("input[type='file']").val('');
			}
		});
	};

    $scope.postFiles = [];
    $scope.imageSrc = [];
    $scope.fileNotValid = false;
    $scope.fileNotValidMsg = '';
     $scope.getFile = function () { 
        angular.forEach($scope.file, function(singleFile) {
        fileReader.readAsDataUrl(singleFile, $scope)
        .then(function(result) {
            console.log($scope);
            var imageType = singleFile['name'].substring(singleFile['name'].lastIndexOf(".") + 1);
            if (!(imageType == "gif" || imageType == "png" || imageType == "jpg" || imageType == "jpeg" || imageType == "GIF" || imageType == "PNG" || imageType == "JPG" || imageType == "JPEG")) {
                $scope.fileNotValid = true;
                $scope.fileNotValidMsg = 'Upload media file is not valid';
                return false;
            } else {
                $scope.postFiles.push(singleFile);
                $scope.imageSrc.push(result);
                $scope.fileNotValid = false;
            }
        });
        });
    };

    $scope.removeImage = function(index) {
        $scope.postFiles.splice(index, 1);
        $scope.imageSrc.splice(index, 1);
    };

	$scope.deleteClubAlbumMedia = function(mediaId, id) { 
		//$scope.deleteMediaStart = true;
		var opts = {};
		opts.group_id = $scope.groupId;
		opts.album_id = $scope.albumId;
		opts.media_id = mediaId;
		GroupService.deleteClubAlbumMedia(opts, function(data) {
			if(data.code == 101) {
				//$scope.deleteMediaStart = false;
				$scope.viewalbum.splice(id, 1);
			} else {
				$scope.deleteMediaStart = false;
			}
		});
	};

	//Set as profile image
    $scope.setClubProfileImage = function(m_id, id){
        $("#featuredloaderlink-"+id).hide();
        $("#featuredloader-"+id).show();
        $scope.featuredloader = true;
        var opts = {};
        opts.group_id = $scope.groupId;
        opts.media_id = m_id;
        GroupService.setClubProfileImage(opts, function(data){
            if(data.code == 101) {
            	$scope.uploadSuccess = true;
                $scope.uploadSuccessMsg = "Successfully Updated."
                $("#featuredloaderlink-"+id).show();
                $("#featuredloader-"+id).hide();
                $timeout(function() {
                        $scope.uploadSuccessMsg = '';
                }, 2000);
            } else {
            	$scope.uploadError = true;
            	scope.uploadSuccessMsg = "Not Updated Successfully Updated.";
                $("#featuredloaderlink-"+id).show();
                $("#featuredloader-"+id).hide();
                $timeout(function() {
                        $scope.uploadSuccessMsg = "";
                }, 2000);
            }
        });  
    }

});