app.controller('StoreAlbumController', function ($scope, StoreAlbumService, $location, $routeParams,StoreService, $timeout, fileReader) {
    $scope.myValue = false;
    $scope.albloader = false;
    $scope.noAlbums = false;
    $scope.noPhotos = false;
    $scope.albumResponse = "";
    $scope.storeId = $routeParams.id;
    //$scope.currentUser = APP.currentUser.id;
    $scope.storeOwnerId = StoreService.getStoreOwnerId();
    $scope.uploadloader = false;
    //Create Store Album 
    $scope.createstorealbums = function(){
        
        $scope.albloader = true; 
        var opts = {};
        opts.store_id = $scope.storeId; //todo
        opts.album_name = $scope.user.albumname; 
        opts.album_desc = $scope.user.albumdesc; 
        StoreAlbumService.createstorealbums(opts, function(data){
            if(data.code == 101) {
                //$scope.albumResponse = "Album Created Successfully";
                $timeout(function() {
                        $scope.albumResponse = '';
                }, 2000);
                $scope.storealbumlists('create');
                $scope.user = null;
                $scope.myValue = false; 
            } else {
                $scope.albumResponse = "Something Went Wrong";
                $timeout(function() {
                        $scope.albumResponse = '';
                }, 2000);
            }
        });
    }
    //Upload Store media 
    $scope.uploadstoremediaalbums = function(){
        if( $scope.postFiles == undefined ||  $scope.postFiles.length == 0 ){
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
        opts.store_id = $scope.storeId;
        opts.album_id = albumId;
        opts.user_media = $scope.postFiles;
        StoreAlbumService.uploadstoremediaalbums(opts, $scope.postFiles, function(data){ 
           if(data.code == 101) {
                $scope.uploadloader = false;
                $('#addbutton').show();
                $scope.postFiles = [];
                $scope.imageSrc = [];
                $timeout(function() {
                    $scope.albumResponse = '';
                }, 2000);
                $scope.viewstorealbums('upload');
                 $("input[type='file']").val('');
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
    //Album Store Listing
    $scope.storealbumlists = function(type){
        if(type == 'delete') {
            $scope.albloader = false;
        } else {
            $scope.albloader = true;
        }  
            
        var opts = {};
        opts.store_id = $scope.storeId;
        opts.limit_start = 0; 
        opts.limit_size = 20; 
        StoreAlbumService.storealbumlists(opts, function(data){

            if(data.code == 101) {
                $scope.listAlbum = data.data;
                //$scope.noAlbums = true;    
                $scope.albloader = false;  
                if(type == 'create') {
                    $scope.albumResponse = "Album Created Successfully";
                } else if(type == 'delete') {
                    $scope.albumResponse = "Album Deleted Successfully";
                } else {
                   $scope.albumResponse = "";
                }  
            }else {
                $scope.albloader = false; 
            }
        });
    }
    //Album Store Listing
    $scope.storepagealbumlists = function(){  

        $scope.albloader = true;
        var opts = {};
        opts.store_id = $scope.storeId;
        opts.limit_start = 0; 
        opts.limit_size = 20; 
        StoreAlbumService.storealbumlists(opts, function(data){

            if(data.code == 101) {
                $scope.listPageAlbum = data.data;
                $scope.noAlbums = true;    
                $scope.albloader = false;    
            }else {
                $scope.albloader = false; 
            }
        });
    }
    //Delete Store Album 
    $scope.deletestorealbums = function(id){  
        //$scope.albloader = true; 
        var opts = {};
        opts.store_id = $scope.storeId; //todo
        opts.album_id = id;
        StoreAlbumService.deletestorealbums(opts, function(data){

            $scope.storealbumlists('delete');  
            if(data.code == 101) {
                
                //$scope.albumResponse = data.message;
                $timeout(function() {
                        $scope.albumResponse = '';
                }, 2000);
            } else {
             
            }
        });
    }
    //View Store Album 
    $scope.viewstorealbums = function(type){
        if(type == 'delete') {
            $scope.albloader = false;  
        } else {
             $scope.albloader = true; 
        }
        
        var albumId = $routeParams.album_id;
        $scope.albumname = $routeParams.album_name;
        var opts = {};
        opts.store_id = $scope.storeId; //todo
        opts.album_id = albumId;
        StoreAlbumService.viewstorealbums(opts, function(data){

            if(data.code == 101) {
                $scope.albloader = false;
                $scope.viewalbum = data.data;
                $scope.noPhotos = true; 
                if(type == 'upload') {
                    $scope.albumResponse = "Successfully Uploaded";
                } else if(type == 'delete') {
                    $scope.albumResponse = "Successfully Deleted";
                } else {
                   $scope.albumResponse = "";
                }
            } else {
                $scope.albloader = false;
                $scope.noPhotos = true;
            }
        });  
    }
    //Delete Store Images from Album
    $scope.deletealbummedias = function(m_id){
        //$scope.albloader = true;
        var albumId = $routeParams.album_id;
        var opts = {};
        opts.store_id = $scope.storeId; //todo
        opts.album_id = albumId;
        opts.media_id = m_id;
        StoreAlbumService.deletealbummedias(opts, function(data){

            if(data.code == 101) {
                //$scope.albumResponse = data.message;
                $timeout(function() {
                        $scope.albumResponse = '';
                }, 2000);
                $scope.viewstorealbums('delete');
            } else {
             
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
    //$scope.storepagealbumlists();
    $scope.storealbumlists(); //initialization of album listing function
    $scope.storepagealbumlists(); //initialization of album listing function
    $scope.viewstorealbums();
    $(".fancybox").fancybox();
    //image upload Page 
    $scope.redirectUrl = function(album_id, album_name) {
        $location.path("/album/shope/image/"+album_id+"/"+album_name+"/"+$scope.storeId);
    }

    /**
    * Function to set image as store profile image 
    */  
    $scope.setStoreProfileimage = function(id, imageId) { 
        $("#setStoreImageSubmit-"+id).hide();
        $("#setStoreImageloader-"+id).show();
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.store_id = $scope.storeId;
        opts.media_id = imageId;
        StoreService.setStoreProfileImage(opts, function(data) {
            if(data.code == 101) {
                $("#setStoreImageSubmit-"+id).show();
                $("#setStoreImageloader-"+id).hide();
                $scope.albumResponse = "Successfully Updated";
            } else {
                $("#setStoreImageSubmit-"+id).show();
                $("#setStoreImageloader-"+id).hide();
            }
        });
    };
    
});
