app.controller('GroupPostController', function ($scope, PostService, $location, $timeout, $routeParams, CommentService, fileReader) {
    $scope.currentUser = APP.currentUser;
    $scope.noComment = false;
    $scope.postErrMsg = '';
    var groupId = $routeParams.id;
    var groupStatus = $routeParams.status;
    $scope.postContentStart = false;
    
    //Create Group post 
    $scope.createPost = function() {
        var opts = {};
        $scope.postInProcess = true;
        $scope.postContentStart = true;
        var filescount = $scope.postFiles.length;
        if (($scope.postText === undefined || $scope.postText == '') && filescount === 0) {
            $scope.postInProcess = false;
            $scope.postErrMsg = "Write something or select image to post";
            $scope.postContentStart = false;
            return false;
        } 
        
        opts.user_id = APP.currentUser.id;
        opts.group_id = $scope.groupDetail.id;
        opts.post_title = "Not in use on frontend"; //This dummy data as currently there is no field to accept the posttitle
        opts.post_desc = $scope.postText;
        opts.youtube = '';
        opts.post_media = '';
        
        PostService.createPost(opts, $scope.postFiles, function(data){
            if(data.code == 101) {
                var newpost = {};
                newpost = data.data;
                $scope.posts.unshift(newpost);
                $scope.postInProcess = false;
                $scope.multipleImg = true;
                $scope.postErrMsg = "";
                $timeout(function(){
                    $scope.postErrMsg = '';
                }, 2000);
                $scope.imageSrc = [];
                $scope.postFiles = [];
                $scope.postText = undefined;
                $scope.isImage = false;
                $scope.isUpload = false;
                $scope.uploadBox = false;
                $scope.postContentStart = false;
            } else {
                $scope.postInProcess = false;
                $scope.multipleImg = true;
                $scope.postErrMsg = "You must join the group before sending post";
                $scope.imageSrc = [];
                $scope.postFiles = [];
                $scope.isImage = false;
                $scope.isUpload = false;
                $scope.uploadBox = false;
                $timeout(function(){
                    $scope.postErrMsg = '';
                }, 2000);
                $scope.postContentStart = false;
            }
        });
    };
   

    // function to get the post and comment of the post
    $scope.getPosts = function() {

        $scope.isLoading = true;
        $scope.noContent = false;
        $scope.posts = [];
        var opts = {};
        opts.user_group_id = groupId;
        opts.user_id = APP.currentUser.id;
        opts.group_type = groupStatus;
        opts.limit_start = APP.group_pagination.start;
        opts.limit_size = APP.group_pagination.end;

        // This service's function returns post
        PostService.listPost(opts, function(data){
            if(data.code == 101)
            {
                $scope.posts =  data.data;
                $scope.isLoading = false;
                if($scope.posts.length == 0){
                    $scope.noContent = true;
                }
            } else {
                $scope.noContent = true;
                $scope.isLoading = false;
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
        CommentService.listComment(opts, function(data){
            if(data.code == 100)
            {
                $scope.comments[postIndx] = data.data.comments;
                $scope.commentInProcess = false;
                    if($scope.comments[postIndx].length != 0 ) {
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
        opts.session_id = $scope.currentUser.id;
        opts.limit_size = null;
        opts.limit_start = 0;
        $scope.getComments(opts, postIndx);
    };

    //function to show limited comment of the post
    $scope.showLimitedComment = function(postIndx) {
        $scope.commentInProcess = true;
        var post = $scope.posts[postIndx];
        var opts = {};
        opts.post_id = post.post_id;
        opts.session_id = $scope.currentUser.id;
        opts.limit_size = APP.group_pagination.end;
        opts.limit_start = APP.group_pagination.start;
        $scope.getComments(opts, postIndx);
    };

    //funciton to delete single comment
    $scope.deleteComment = function(postIndx, indx) {
        var commentData = $scope.comments[postIndx][indx];
        $scope.deleteCommentIndx = commentData.id;
        var post = $scope.posts[postIndx];

        var formData = {};
        formData.session_id = $scope.currentUser.id;
        formData.comment_id = commentData.id;

        //calling the comment service to delete the selected comment 
        CommentService.deleteComment(formData, function(data){
            if(data.code == 101) {
                $scope.deleteCommentIndx = -1;
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
        PostService.deletePost(formData, function(data){
            if(data.code == 101) {
                $scope.posts.splice(indx, 1);
            } else {
                $scope.posts;
            }
        });
    };

    <!-- //function to add image preview while posting imag-->
    $scope.imageSrc = [];
    $scope.postFiles = [];
    $scope.getFile = function () {
        $scope.postErrMsg = '';
        $scope.uploadBox = false;
        $scope.isUpload = true;
        fileReader.readAsDataUrl($scope.file, $scope)
        .then(function(result) {
            //Allow some images types for uploading
            var imageType = $scope.file['name'].substring($scope.file['name'].lastIndexOf(".") + 1);
            if (!(imageType == "gif" || imageType == "png" || imageType == "jpg" || imageType == "jpeg")) {
                $scope.postErrMsg = 'Upload media file is not valid';
                $scope.file = null;
            } else {
                $scope.postErrMsg = '';
                $scope.postFiles.push($scope.file);
                if($scope.postFiles.length > 0){
                    $scope.multipleImg = false;
                }
                $scope.imageSrc.push(result);
                $scope.file = null;
            }
        });
    };

    //function to add image on user post
    $scope.isImage = false;
    $scope.isUpload = false;
    $scope.uploadBox = false;
    $scope.addImage = function() { 
        $scope.isImage = true;
        $scope.imageSrc = [];
        $scope.postFiles = [];
        $scope.uploadBox = true;
        $scope.isUpload = false;
    };
    $scope.addPost = function() { 
        $scope.isImage = false;
        $scope.isUpload = false;
        $scope.uploadBox = false;
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
        CommentService.deleteMediaComment(formData, function(data){
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

    //function to create post
    $scope.saveUpdatePost = function(indx) {
        var opts = {};
        $scope.updatePostInProcess = true;
        var editPostText = $scope.updateBody[indx]; 
        var post = $scope.posts[indx];
        
        if (editPostText === undefined) {
            $scope.updatePostInProcess = false;
            $scope.postErrMsg = "Write something to post";
            return false;
        } 
        opts.user_id = $scope.currentUser.id;
        opts.user_group_id = groupId;
        opts.group_type = $scope.groupDetail.group_status;
        opts.post_id = post.post_id;
        opts.post_title = post.post_title; //This dummy data as currently there is no field to accept the posttitle
        opts.post_desc = editPostText;
        opts.youtube = '';
        var myFile = '';
        
        PostService.updatePost(opts, myFile, function(data){
            if(data.code == 101) {
                $scope.updatePostInProcess = false;
                $scope.editpostErrorMsg = '';
                $scope.posts[indx].post_description = editPostText;
                $scope.editPostText = '';
                $scope.activeEdit[indx] = false;
            } else {
                $scope.updatePostInProcess = false;
                $scope.activeEdit[indx] = false;
                $scope.editpostErrorMsg = 'Post could not be sent';
            }
        });
    };

    $scope.updateBody = [];
    $scope.activeEdit = [];
    //funtion to open form to update post
    $scope.updatePost = function(indx) {
        var post = $scope.posts[indx];
        $scope.updateBody[indx] = post.post_description;
        $scope.activeEdit[indx] = true;
    }
    // close the edit form on cancel
    $scope.cancelPost = function(indx) {
        $scope.updateBody[indx] = '';
        $scope.activeEdit[indx] = false;
    };

    <!-- //function to add image preview while posting imag-->
    $scope.imageSrc = [];
    $scope.postFiles = [];
    $scope.getFile = function () {
        $scope.postErrMsg = '';
        $scope.isUpload = true;
        $scope.uploadBox = false;
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
            $scope.isUpload = false;
            $scope.isImage = false;
            $scope.uploadBox = false;
        }
    };
    <!--//end image preview section-->

    $scope.editCommentText = [];
    $scope.activeCommentEdit = [];
    //funtion to open form to update comment
    $scope.updateComment = function(postIndx, indx, comment) {
        $("#commentBoxId-"+postIndx).hide();
        $scope.commentInProcess = [];
        var post = $scope.posts[postIndx];
        var comment = comment;
        $scope.activeCommentEdit[postIndx] = [];
        $scope.activeCommentEdit[postIndx][indx] = indx;
        $scope.editCommentText[postIndx]=comment.comment_text;
    }

        //function to edit a comment
    $scope.editComment = function(postIndx, indx, comment) {
        var opts = {};
        var post = $scope.posts[postIndx];
        var commentData = $scope.comments[postIndx][indx];
        var newText = $scope.editCommentText[postIndx];
        
        //TODO:: image uploading on comment edit
        
        opts.session_id = $scope.currentUser.id;
        opts.post_id = post.post_id;
        opts.comment_id = commentData.id;
        opts.comment_author = commentData.comment_author;
        opts.youtube_url = commentData.youtube_url;
        opts.body = newText;
        var myFile = '';
        //TODO:: image uploading on comment edit

        CommentService.updateComment(opts, myFile, function(data){
            if(data.code == 101) {
                $scope.commentInProcess[postIndx] = false;
                $scope.activeCommentEdit[postIndx][indx] = -1;
                $scope.postErrMsg = '';
                $scope.comments[postIndx][indx].comment_text = $scope.editCommentText[postIndx];
                $("#commentBoxId-"+postIndx).show();
                
            } else {
                $scope.activeCommentEdit[postIndx][indx] = -1;
                $scope.commentInProcess[postIndx] = false;
                $scope.postErrMsg = 'Comment could not be post';
                $scope.editCommentText[postIndx] = '';
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
