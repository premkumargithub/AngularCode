app.controller('ProfileImageController', function ($scope, $rootScope, ProfileImageService, $location, $routeParams, $timeout, fileReader) {
    $scope.albloader = false;
    $scope.propic = false;
    $scope.picloader = false;
    $scope.successMsg = "";
    //Upload media 
    $scope.uploaduserprofileimages = function(){
        if($scope.myFile == undefined || $scope.myFile == ''){
            $scope.fileNotValid = true;
            $scope.fileNotValidMsg = "Please select image first";
            $timeout(function(){
                    $scope.fileNotValidMsg = "";
                    $scope.fileNotValid = false;
            }, 2000);
            return false;
        }
        $scope.albloader = true;
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.user_media = $scope.myFile;
        //Allow some images types for uploading
        var imageType = $scope.myFile['name'].substring($scope.myFile['name'].lastIndexOf(".") + 1);
        // Checking Extension
        if (!(imageType == "gif" || imageType == "png" || imageType == "jpg" || imageType == "jpeg" || imageType == "GIF" || imageType == "PNG" || imageType == "JPG" || imageType == "JPEG")) {
            $scope.albloader = false;
            $scope.fileNotValid = true;
            $scope.fileNotValidMsg = 'Upload media file is not valid';
            return false;
        } else {
            ProfileImageService.uploaduserprofileimages(opts, $scope.myFile, function(data){    
               if(data.code == 101) {
                    $scope.albloader = false;
                    $scope.successMsg = data.message;
                    $timeout(function() {
                        $scope.successMsg = '';
                    }, 2000);
                    $scope.viewmultiprofiles();
                    $('#addPhoto').show();
                    $("input[type='file']").val('');
                    $scope.postFiles = '';
                    $scope.imageSrc = '';
                    $scope.myFile = '';
               } else {
                    $scope.albloader = false;
                    $('#addPhoto').show();
               }
            });
        }
    }

    $scope.myFile = '';
    $scope.imageSrc = '';
    $scope.fileNotValid = false;
    $scope.fileNotValidMsg = '';
    $scope.getFile = function () {
        $scope.progress = 0;
        fileReader.readAsDataUrl($scope.file, $scope)
        .then(function(result) {
            $scope.myFile = $scope.file;
            $scope.imageSrc = result;
            var imageType = $scope.myFile['name'].substring($scope.myFile['name'].lastIndexOf(".") + 1);
            //Checking Extension
            if (!(imageType == "gif" || imageType == "png" || imageType == "jpg" || imageType == "jpeg" || imageType == "GIF" || imageType == "PNG" || imageType == "JPG" || imageType == "JPEG")) {
                $scope.fileNotValid = true;
                $scope.fileNotValidMsg = 'Upload media file is not valid';
            } else {
                 $scope.fileNotValid = false;
            }
        });
    };

    $scope.removeImage = function() {
        $scope.postFiles = '';
        $scope.imageSrc = '';
        $("input[type='file']").val('');
    };

    $scope.viewmultiprofiles = function(){

        $scope.albloader = true; 
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.profile_type = 4; 
        ProfileImageService.viewmultiprofiles(opts, function(data){
            if(data.code == 101) {
                $scope.albloader = false; 
                $scope.picloader = false;
                $scope.propic = true; 
                $rootScope.currentUser.basicProfile = data.data;
            } else {                
                $scope.propic = true; 
                $scope.picloader = false;
                
            }
        });
    }
});
