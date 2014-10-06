app.controller('StorePostController', function ($scope, StorePostService, $location, $timeout, $routeParams, StoreService, StoreCommentService, fileReader) {
    $scope.storeId = $routeParams.id;
    $scope.currentUser = APP.currentUser;
    $scope.storeOwnerId = StoreService.getStoreOwnerId();
    $scope.noComment = false;
    $scope.postErrMsg = '';
    $scope.postFileErrorMsg = 'this is no';
    $scope.postContentStart = false;
    $scope.showComments = [];
    $scope.commentsShowLimit = [];

    //Create Store post 
    $scope.createPost = function(){
        var link_type;
        $scope.postContentStart = true;
        var filescount = $scope.postFiles.length;

        if (($scope.postText === undefined || $scope.postText == '') && filescount === 0) {
            $scope.postContentStart = false;
            $scope.postErrMsg = "Write something or select image to post";
            return false;
        }

        var opts = {};
        opts.store_id = $scope.storeId; //todo
        opts.post_title = 'currently Not in used from frontend'; 
        opts.post_desc = $scope.postText; 
        opts.user_id = $scope.currentUser.id; 
        opts.youtube = '';
        
        StorePostService.createPost(opts, $scope.postFiles, function(data){
            if(data.code == 101) {
                var newpost = {};
                newpost = data.data;
                $scope.posts.unshift(newpost);
                $scope.postErrMsg = "";
                $scope.postText = undefined; 
                $scope.isImage = false;
                $scope.imgUpload = false;
                $scope.uploadBox = false;
                $scope.imageSrc = [];
                $scope.postFiles = [];
                $timeout(function(){
                    $scope.postErrMsg = '';
                }, 2000);
                $scope.postContentStart = false;
            } else {
                $scope.postErrMsg = "Server is not responding";
                $timeout(function(){
                    $scope.postErrMsg = '';
                }, 2000);
                $scope.isImage = false;
                $scope.imgUpload = false;
                $scope.uploadBox = false;
                $scope.imageSrc = [];
                $scope.postFiles = [];
                $scope.postContentStart = false;
            }
        });
    }
   

    // function to get the post and comment of the post
    $scope.getPosts = function() {
        $scope.isLoading = true;
        $scope.noContent = false;
        $scope.posts = [];
        var opts = {};
        opts.store_id = $scope.storeId;
        opts.user_id = $scope.currentUser.id;
        opts.limit_start = APP.store_list_pagination.start;
        opts.limit_size = APP.store_list_pagination.end;

        // This service's function returns post
        StorePostService.listPost(opts, function(data){
            if(data.code == 101)
            {
                $scope.posts =  data.data;
                $scope.isLoading = false;
                if($scope.posts.length == 0){
                    $scope.noContent = true;
                }
            } else {
                $scope.noContent = true;
                $scope.posts = [];
            }
        });
    };
    // calling get post function on controller load
    $scope.getPosts();

    // function to get the post and comment of the post
    $scope.comments = [];
    $scope.getComments = function(opts, postIndx) {
        $scope.comments[postIndx] = [];
        
        // This service's function returns post
        StoreCommentService.listComment(opts, function(data){
            if(data.code == 100)
            {
                $scope.comments[postIndx] = data.data.comment;
                $scope.commentLoading[postIndx] =  false;
                $scope.showComments[postIndx] = false;
                $scope.commentsShowLimit[postIndx] = 4;
                $scope.commentInProcess = false;
                    if($scope.comments[postIndx].length  != 0 ) {
                        $scope.noComment = true;
                    }
            } else {
                $scope.commentInProcess = false;
            }
        });
    };

    //function to show all comment of the post
    $scope.showAllComment = function(postIndx) {
        $scope.commentInProcess = true;
        var post = $scope.posts[postIndx];
        var opts = {};
        opts.post_id = post.post_id;
        opts.user_id = $scope.currentUser.id;
        $scope.showLimitedComment(opts, postIndx);
    };

    $scope.showAllComments = function(postIndx) {
        $scope.showComments[postIndx] = true;
    };

    //function to show limited comment of the post
    $scope.commentLoading = [];
    $scope.showLimitedComment = function(postIndx) {
        $scope.commentLoading[postIndx] =  true;
        var post = $scope.posts[postIndx];
        var opts = {};
        opts.post_id = post.post_id;
        opts.user_id = $scope.currentUser.id;
        $scope.getComments(opts, postIndx);
    };

    //funciton to delete single comment
    $scope.deleteComment = function(postIndx, comment) {
        var indx = $scope.comments[postIndx].indexOf(comment);
        var commentData = comment;
        var comments = [];
        $scope.deleteCommentIndx = commentData.id;
        var post = $scope.posts[postIndx];

        var formData = {};
        formData.user_id = $scope.currentUser.id;
        formData.comment_id = commentData.id;

        //calling the comment service to delete the selected comment 
        StoreCommentService.deleteComment(formData, function(data){
            if(data.code == 101) {
                $scope.deleteCommentIndx = -1;
                var opts = {};
                opts.post_id = post.post_id;
                opts.user_id = $scope.currentUser.id;
                $scope.comments[postIndx].splice(indx,1);
            }
            else {
                $scope.deleteCommentIndx = -1;
                $scope.posts;
            }
        });
    }

    //funciton to delete single post
    $scope.deletePost = function(indx) {
        $scope.deletePostIndx = indx;
        var postData = {};
        postData = $scope.posts[indx];
        var formData = {};
        formData.user_id = $scope.currentUser.id;
        formData.post_id = postData.post_id;
        
        //calling the service to delete the selected post 
        StorePostService.deletePost(formData, function(data){
            if(data.code == 101) {
                $scope.posts.splice(indx, 1);
            } else {
                $scope.posts;
            }
        });
    };

    //function to add image on user post
    $scope.isImage = false;
    $scope.imgUpload = false;
    $scope.uploadBox = false;
    $scope.addImage = function() { 
        $scope.isImage = true;
        $scope.imgUpload = false;
        $scope.uploadBox = true;
        $scope.imageSrc = [];
        $scope.postFiles = [];
    };
    $scope.addPost = function() { 
        $scope.isImage = false;
        $scope.imgUpload = false;
        $scope.uploadBox = false;
        $scope.isPost = true;
        $scope.imageSrc = [];
        $scope.postFiles = [];
    };

    //funciton to delete single comment
    $scope.deleteMediaComment = function(comment, postIndx, mediaIndx) {
        //TODO:: media index need to be come dynamic for multiple medias
        var commentData = comment;
        var post = $scope.posts[postIndx];
        $scope.deleteCommentIndx = commentData.id;
        
        var formData = {};
        formData.user_id = $scope.currentUser.id;
        formData.comment_id = commentData.id;
        formData.comment_media_id = commentData.comment_media_info[0].id;

        //calling the comment service to delete the selected comment 
        StoreCommentService.deleteMediaComment(formData, function(data){
            if(data.code == 101) {
                $scope.deleteCommentIndx = -1;
                var opts = {};
                opts.post_id = post.post_id;
                opts.user_id = $scope.currentUser.id;
                $scope.getComments(opts, postIndx);
            }
            else {
                $scope.deleteCommentIndx = -1;
                $scope.posts;
            }
        });
    };

    //funciton to delete media of post 
    $scope.deleteMediaPost = function(postIndx,mediaIndx) {
        $scope.deletePostIndx = postIndx;
        var post = $scope.posts[postIndx];

        var opts = {};
        opts.user_id = $scope.currentUser.id;
        opts.post_id = post.post_id;
        opts.media_id = post.media_info[mediaIndx].id;

        //calling the post service to delete media of the selected post 
        StorePostService.deleteMediaPost(opts, function(data){
            if(data.code == 101) {
                $scope.deletePostIndx = -1;
                $scope.posts[postIndx].media_info.splice(mediaIndx, 1);
            }
            else {
                $scope.deletePostIndx = -1;
                $scope.posts;
            }
        });
    };

    //function to create post
    $scope.saveUpdatePost = function(postIndx) {
        var opts = {};
        $scope.updatePostInProcess[postIndx] = true;
        var editPostText = $scope.updateBody[postIndx]; 
        var post = $scope.posts[postIndx];
        
        if (editPostText == undefined || editPostText == '') {
            $scope.updatePostInProcess[postIndx] = false;
            $scope.postErrMsg = "Can not save empty status";
            return false;
        } 
        opts.user_id = $scope.currentUser.id;
        opts.store_id = $scope.storeId;
        opts.post_id = post.post_id;
        opts.post_title = post.store_post_title; //This dummy data as currently there is no field to accept the posttitle
        opts.post_desc = editPostText;
        opts.youtube = '';
        var myFile = '';
        
        StorePostService.updatePost(opts, myFile, function(data){
            if(data.code == 101) {
                $scope.updatePostInProcess[postIndx] = false;
                $scope.editpostErrorMsg = '';
                $scope.posts[postIndx].store_post_desc = editPostText;
                $scope.editPostText = '';
                $scope.activeEdit[postIndx] = false;
            } else {
                $scope.updatePostInProcess[postIndx] = false;
                $scope.activeEdit[postIndx] = false;
                $scope.editpostErrorMsg = 'Post could not be sent';
            }
        });
    };

    $scope.updateBody = [];
    $scope.activeEdit = [];
    $scope.updatePostInProcess = [];
    $scope.editPostErrorMsg = [];
    //funtion to open form to update post
    $scope.updatePost = function(postIndx) {
        $scope.editPostErrorMsg[postIndx]='';
        var post = $scope.posts[postIndx];
        $scope.updateBody[postIndx] = post.store_post_desc;
        $scope.activeEdit[postIndx] = true;
    }
    // close the edit form on cancel
    $scope.cancelPost = function(postIndx) {
        $scope.updateBody[postIndx] = '';
        $scope.activeEdit[postIndx] = false;
    };

    <!-- //function to add image preview while posting imag-->
    $scope.imageSrc = [];
    $scope.postFiles = [];
    $scope.getFile = function () {
        $scope.postErrMsg = '';
        $scope.uploadBox = false;
        $scope.imgUpload = true;
        fileReader.readAsDataUrl($scope.file, $scope)
        .then(function(result) {
            //Allow some images types for uploading
            var imageType = $scope.file['name'].substring($scope.file['name'].lastIndexOf(".") + 1).toLowerCase();
            if (!(imageType == "gif" || imageType == "png" || imageType == "jpg" || imageType == "jpeg")) {
                $scope.postErrMsg = 'Upload media file is not valid';
                $scope.file = null;
            } else {
                $scope.postErrMsg = '';
                $scope.postFiles.push($scope.file);
                $scope.imageSrc.push(result);
                $scope.file = null;
            }
        });
    };
    // TODO: show progress before showing image preview
    $scope.$on("fileProgress", function(e, progress) {
        $scope.progress = progress.loaded / progress.total;
    });

    //remove iamge from preview array
    $scope.removeImage = function(index) {
        $scope.postFiles.splice(index, 1);
        $scope.imageSrc.splice(index, 1);
        if($scope.imageSrc.length == 0){
            $scope.imgUpload = false;
            $scope.isImage = false;
            $scope.uploadBox = false;
        }
    };
    <!--//end image preview section-->

    $scope.editCommentText = [];
    $scope.activeCommentEdit = [];
    $scope.isEditComment = [];
    //funtion to open form to update comment
    $scope.updateComment = function(postIndx, comment) {
        $("#commentBoxId-"+postIndx).hide();
        $scope.commentErrorMsg = [];
        var comment = comment;
        var indx = $scope.comments.indexOf(comment);
        $scope.activeCommentEdit[postIndx]= comment.id;
        $scope.isEditComment[postIndx] = false;
        $scope.editCommentText[postIndx]=comment.comment_text;
    }

        //function to edit a comment
    $scope.editComment = function(postIndx, comment) {
        var opts = {};
        var post = $scope.posts[postIndx];
        var comment = comment;
        var newText = $scope.editCommentText[postIndx];
        var indx = $scope.comments[postIndx].indexOf(comment);
        $scope.isEditComment[postIndx] = true;
        
        if(newText == undefined || newText == '') {
            $scope.isEditComment[postIndx]= false;
            $scope.commentErrorMsg[postIndx] = "Can not save empty comment";
            return false;
        } 

        opts.user_id = $scope.currentUser.id;
        opts.post_id = post.post_id;
        opts.comment_id = comment.id;
        opts.comment_author = comment.comment_author;
        opts.youtube_url = comment.youtube_url;
        opts.comment_text = newText;
        
        StoreCommentService.updateComment(opts, function(data){
            if(data.code == 101) {
                $scope.comments[postIndx][indx].comment_text = newText;
                $scope.activeCommentEdit[postIndx] = '';
                $scope.commentErrorMsg[postIndx] = '';
                $scope.editCommentText[postIndx] = '';
                $("#commentBoxId-"+postIndx).show();
                $scope.isEditComment[postIndx] = false;
            } else {
                $scope.isEditComment[postIndx] = false;
                $scope.activeCommentEdit[postIndx] = '';
                $scope.commentErrorMsg[postIndx] = '';
                $scope.editCommentText[postIndx] = '';
                $scope.commentErrorMsg[postIndx]= 'Comment could not be post';
                $("#commentBoxId-"+postIndx).show();
            }
        });
    };

    //funtion to close the edit form to cancel comment
    $scope.cancelEditComment = function(postIndx, indx) {
        $scope.commentInProcess = [];
        $scope.commentInProcess[postIndx] = false;
        $scope.activeCommentEdit[postIndx] = [];
        $scope.activeCommentEdit[postIndx][indx] = -1;
        $scope.editCommentText[postIndx]='';
        $("#commentBoxId-"+postIndx).show();
    };
    
    $(".fancybox").fancybox();

});
