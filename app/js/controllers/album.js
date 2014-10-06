app.controller('AlbumController', function ($scope, $rootScope, AlbumService, $location, $routeParams, $timeout, ProfileImageService, fileReader) {

    $scope.myValue = false;
    $scope.albloader = false;
    $scope.noAlbums = false;
    $scope.noPhotos = false;
    $scope.uploadloader = false;
    $scope.albumResponse = "";
    $scope.listload = false;
    $scope.listAlbum = [];
    $scope.totalSize = 0;
    $scope.allRes = 1;
    $scope.viewalbum = [];
    $scope.totalSizeImg = 0;
    $scope.allResImg = 1;
    //Create Album 
    $scope.createAlbum = function(){
        $scope.albloader = true; 
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.album_name = $scope.user.albumname; 
        opts.album_desc = $scope.user.albumdesc; 
        AlbumService.createAlbum(opts, function(data){
            
            if(data.code == 101) {
                $scope.listAlbum.length = 0;
                $scope.albumListing('listing');
                $scope.user = null;   
                $timeout(function() {
                        $scope.albumResponse = '';
                }, 2000);
            } else {
                $scope.albumResponse = "Something Went Wrong";
                $timeout(function() {
                        $scope.albumResponse = '';
                }, 2000);
            }
        });
    }
    //Upload media 
    $scope.uploadmediaAlbum = function(){
        if($scope.postFiles == undefined || $scope.postFiles.length == 0){
            $scope.fileNotValid = true;
            $scope.fileNotValidMsg = "Please select the image first";
            $timeout(function(){
                    $scope.fileNotValidMsg = "";
                    $scope.fileNotValid = false;
            }, 2000);
            return false;
        } 
        $scope.uploadloader = true;
        $('#addbutton').hide();
        var albumId = $routeParams.album_id;
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.album_id = albumId;
        opts.user_media = $scope.postFiles;

        AlbumService.uploadmediaAlbum(opts, $scope.postFiles, function(data){ 
           if(data.code == 101) {
                $scope.uploadloader = false;
                $('#addbutton').show();
                $scope.viewalbum.length = 0;
                $scope.totalSizeImg = 0;
                $scope.allResImg = 1;
                $scope.viewAlbum('upload');
                $timeout(function() {
                    $scope.albumResponse = '';
                }, 2000);
                $("input[type='file']").val('');
                $scope.postFiles = [];
                $scope.imageSrc = [];
           } else {
                $scope.uploadloader = false;
                $('#addbutton').show();
                $scope.albumResponse = data.message;
                $timeout(function() {
                    $scope.albumResponse = '';
                }, 2000);
           }
        });
    }

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
    
    //Album Listing
    $scope.albumListing = function(type){
 
        var limit_start = $scope.listAlbum.length;
        if(type == 'delete') {
            $scope.albloader = false;      
        } else if(type === 'listing') {
            $scope.albloader = false;
        } else {
            $scope.albloader = true;
        }
        var limit_start = $scope.listAlbum.length;         
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.limit_start = limit_start; 
        opts.limit_size = 8; 
        if ((( $scope.totalSize > limit_start) || $scope.totalSize == 0 ) && $scope.allRes == 1) {
            $scope.listload = true;
            $scope.allRes = 0;
        AlbumService.albumListing(opts, function(data){
            if(data.code == 101) {
                if(type == 'create') {
                    $scope.albumResponse = "Album Created Successfully";
                } else if(type == 'delete') {
                    $scope.albumResponse = "Album Deleted Successfully";
                } else {
                   $scope.albumResponse = "";
                }
                 $('.album-option').removeClass('album-blank');
                $scope.noAlbums = true;    
                $scope.albloader = false;  
                $scope.totalSize = data.data.size;
                $scope.allRes = 1;
                $scope.listAlbum = $scope.listAlbum.concat(data.data.albums);   
                $scope.listload = false;   
            }else {
                $scope.albloader = false; 
                $scope.listload = false; 
            }
        });
    }
}
//infinite scroll loadmore
$scope.loadMore = function() {     
        $scope.albumListing('listing');
    };
    $scope.loadMoreImage = function() {     
        $scope.viewAlbum('listing');
    };

    //Delete Album 
    $scope.deleteAlbum = function(id){  
     //$scope.albloader = true; 
        
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.album_id = id;
        AlbumService.deleteAlbum(opts, function(data){
            
            if(data.code == 101) {
                $scope.listAlbum.length = 0;
                $scope.totalSize = 0;
                $scope.allRes = 1;
                $scope.albumListing('delete');
                //$scope.albumResponse = data.message;
                $timeout(function() {
                        $scope.albumResponse = '';
                }, 2000);
            } else {
             
            }
        });
    }
    //View Album 
    $scope.viewAlbum = function(type){
        var limit_start = $scope.viewalbum.length;
        if(type == 'delete') {
            $scope.albloader = false; 
        } else if(type === 'listing') {

            $scope.albloader = false;
        } else if(type === 'upload') {

            $scope.albloader = false;
        } else {
           $scope.albloader = true;          
        }
        var albumId = $routeParams.album_id;
        $scope.albumname = $routeParams.album_name;
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.album_id = albumId;
        opts.limit_start = limit_start;
        opts.limit_size = 8;
        if ((( $scope.totalSizeImg > limit_start) || $scope.totalSizeImg == 0 ) && $scope.allResImg == 1) {
            $scope.listload = true;
            $scope.allResImg = 0;
        AlbumService.viewAlbum(opts, function(data){

            if(data.code == 101) {
                $('.album-option').removeClass('album-blank');
                $scope.albloader = false;
                $scope.noPhotos = true;
                if(type == 'upload') {
                    $scope.albumResponse = "Successfully Uploaded";
                } else if(type == 'delete') {
                    $scope.albumResponse = "Successfully Deleted";
                } else {
                   $scope.albumResponse = "";
                }

                $scope.totalSizeImg = data.data.size;
                $scope.allResImg = 1;
                $scope.viewalbum = $scope.viewalbum.concat(data.data.media);   
                $scope.listload = false; 
            } else {
                $scope.albloader = false;
                $scope.noPhotos = true;
                $scope.listload = false; 
            }
        });  
    }
    }
    //Count Number of images 
    $scope.countPhoto = function(){
        var albumId = $routeParams.album_id;
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.album_id = Album_id;
        AlbumService.countPhoto(opts, function(data){
            if(data.code == 101) {
           
            } else {
             
            }
        });  
    }
    //Delete Images from Album
    $scope.deleteMediaAlbum = function(m_id){
        //$scope.albloader = true;
        var albumId = $routeParams.album_id;
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.album_id = albumId;
        opts.media_id = m_id;
        AlbumService.deleteMediaAlbum(opts, function(data){
            
            if(data.code == 101) {
                //$scope.albumResponse = data.message;
                $scope.viewalbum.length = 0;
                $scope.totalSizeImg = 0;
                $scope.allResImg = 1;
                $scope.viewAlbum('delete');
                $timeout(function() {
                        $scope.albumResponse = '';
                }, 2000);
            } else {
             
            }
        });  
    }

    //Set as profile image
    $scope.setuserprofileimages = function(m_id, id){
        $("#featuredloaderlink-"+id).hide();
        $("#featuredloader-"+id).show();
        $scope.featuredloader = true;
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.media_id = m_id;
        AlbumService.setuserprofileimages(opts, function(data){
            if(data.code == 101) {
                
                $("#featuredloaderlink-"+id).show();
                $("#featuredloader-"+id).hide();
                $timeout(function() {
                        $scope.albumResponse = '';
                }, 2000);
                $scope.viewmultiprofiles();
            } else {
                $scope.albumResponse = data.message;
                $("#featuredloaderlink-"+id).show();
                $("#featuredloader-"+id).hide();
                $timeout(function() {
                        $scope.albumResponse = '';
                }, 2000);
            }
        });  
    }

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
                $scope.albumResponse = "Profile Pic Updated";
            } else {                
                $scope.propic = true; 
                $scope.picloader = false;
                
            }
        });
    }
    //show form
    $scope.showAlbumForm = function() {
        $scope.myValue = true;
    }
    //Hide form
    $scope.closeForm = function() {
        $scope.myValue = false;
    }

    $scope.albumListing('all'); //initialization of album listing function
    $scope.viewAlbum(); //initialization of Images listing function
    $(".fancybox").fancybox(); //Image Pop Up Plugin
    //image upload Page 
    $scope.redirectUrl = function(album_id, album_name) {
        $location.path("/album/images/"+album_id+"/"+album_name);
    }
});