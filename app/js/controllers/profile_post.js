app.controller('ProfilePostController', function($scope, $timeout, ProfileService, FileUploader, $sce) {
//function to create post for dashboard
$scope.postErrMsg = '';
$scope.postContentStart = false;
$scope.showComments = [];
$scope.commentsShowLimit = [];
$scope.commentsLength = []

    $scope.createPost = function() {
        var link_type;
        $scope.postContentStart = true;
        $scope.postContentLoader = true;
        var opts = {};
        $scope.postErrMsg = '';
        var filescount = $scope.imagePrvSrc.length;

        /*Link Preview feature*/
        var descval = $("#preview_lp1").html();
        var href = $('#previewUrl_lp1').html();
        var textarea = $('#text_lp1').val();
        if(href == '') {
            var description = textarea;
            link_type = "0";

        } else {
            var description = '<a class="sitelink" href="'+href+'">'+href+"</a><br/>"+descval;
            link_type = "1";
        }

        if ((description == undefined || description == '') && filescount == 0) {
            $scope.postErrMsg = "Please write something or attach a link or photo to update your status.";
            $scope.postContentStart = false;
            return false;
        }

        opts.user_id = APP.currentUser.id;
        opts.title = "Not in use on frontend"; //This dummy data as currently there is no field to accept the posttitle
        opts.description = description;
        opts.youtube_url = '';
        opts.to_id = APP.currentUser.id;
        opts.link_type = link_type;
        opts.post_id = $scope.tempPostId;
        opts.post_type = "1";
        opts.media_id = [];
        angular.forEach($scope.imagePrvSrc, function(file) {
            opts.media_id.push(file.media_id);
        });
        ProfileService.dashboardPost(opts, function(data){
            if(data.code == 101) {
                var targetObject = {};
                targetObject = data.data;
                $scope.userPostList.unshift(targetObject);
                $scope.postErrMsg = '';
                $scope.imagePrvSrc = [];
                $scope.postProfileFiles = [];
                $timeout(function(){
                    $scope.postErrMsg = '';
                }, 4000);
                uploader.data.post_id={};
                while(uploader.queue.length) {
                   uploader.queue[0].remove();
                }
                $scope.tempPostId='';
                $scope.postContentStart = false;
                $scope.postContentLoader = false;
                $scope.postText = '';
                $scope.isImage = false;
                $scope.imgUpload = false;
                $scope.uploadBox = false;
                $('#text_lp1').val('');
                $('#closePreview_lp1').trigger('click');

            } else {
                $scope.postErrMsg = "Could not post the comment. Some error occured";
                $timeout(function(){
                    $scope.postErrMsg = '';
                }, 4000);
                $scope.imagePrvSrc = [];
                $scope.postProfileFiles = [];
                $scope.postText = undefined; 
                $scope.postContentLoader = false;
                $scope.isImage = false;
                $scope.imgUpload = false;
                $scope.uploadBox = false;
            }
        });
    };


    <!-- //function to add image preview while posting imag-->
    $scope.imagePrvSrc = [];
    $scope.postProfileFiles = [];
    $scope.imgProgress = [];
    $scope.postImgLoader = [];
    $scope.progress = [];
    $scope.tempPostId = '';
    
    var uploader = $scope.uploader = new FileUploader({
        url: APP.service.dashboardpost+"?access_token="+APP.accessToken,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'method': 'POST'
            /*'Accept': 'text/json'*/
        },
        data:{
            'user_id': APP.currentUser.id,
            'title':"Not in use on frontend", //This dummy data as currently there is no field to accept the posttitle
            'description':'',
            'youtube_url':'',
            'to_id': APP.currentUser.id,
            'link_type':"0",
            'post_type':"0",
            'post_id': $scope.tempPostId,
        },
        dataObjName:'reqObj',
        formDataName:'postfile[]'
    });

    // FILTERS
    uploader.filters.push({
        name: 'postfile[]',
        fn: function(item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    });

    uploader.onAfterAddingFile = function(fileItem) {
        $scope.postContentStart = true;
        uploader.data.post_id=$scope.tempPostId;
        var queueLen = uploader.queue.length-1;
        if(uploader.queue.length != 0){
            $scope.uploadBox = false;
            $scope.imgUpload = true;
        }
        $scope.postImgLoader[queueLen] = true;
        uploader.uploadItem(fileItem);
    };

    uploader.onSuccessItem = function(fileItem, response, status, headers) {
        var index = uploader.getIndexOfItem(fileItem);
        if(response.code == 101){
            $scope.imagePrvSrc[index] = response.data;
            $scope.postImgLoader[index] = false;
            $scope.tempPostId = response.data.id;
            uploader.data.post_id=response.data.id;
        }
    };

    uploader.onCompleteAll = function() {
        $scope.postContentStart = false;
    }

    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
        $timeout(function(){
            $scope.postErrMsg = 'Upload media file is not valid';
        }, 4000);
    };


    
<!--// file upload end---------------->

    //remove iamge from preview array
    $scope.removeImage = function(index) {
        var tempImg = $scope.imagePrvSrc[index];
        $scope.imagePrvSrc.splice(index, 1);
        var item = $scope.uploader.queue[index];
        item.remove();
        var formData = {};
        formData.user_id = APP.currentUser.id;
        formData.post_media_id = tempImg.media_id;

        //calling the service to delete the selected post 
        ProfileService.deletePostMedia(formData, function(data){
            if(data.code == 101) {
                
            } else {
                $scope.imagePrvSrc[index] = tempImg;
                $scope.postErrMsg = data.message;
                $scope.userPostList;
            }
        });
    };

    //funciton to list user post on dashboard
    //TODO: infinite scoller is remaining
    $scope.listUserPost = function() {
        var opts = {};
        var limit_start = $scope.userPostList.length;
        opts.user_id = APP.currentUser.id;
        opts.limit_start = limit_start;
        opts.limit_size = APP.dashbord_pagination.end;

        //calling the services to get the user post list
        if ($scope.totalSize >= limit_start) {
            ProfileService.listDashboardPost(opts, function(data){
                if(data.code == 100) {
                    var items = data.data.post;
                    for (var i = 0; i < items.length; i++) {
                        $scope.userPostList.push(items[i]);
                    }
                    $scope.totalSize = data.data.count;
                    $scope.isLoading = false;
                } else {
                    $scope.isLoading = false;
                    $scope.userPostList;
                }
                if ($scope.userPostList.length == 0){
                    $scope.noContent = true; 
                } 
            });
        } else {
            $scope.isLoading = false;
            if ($scope.userPostList.length == 0){
                $scope.noContent = true; 
            } 
            $scope.userPostList;
        }
    };

    //function to call initial loading
    $scope.showUserPostList = function(){
        $scope.isLoading = true;
        $scope.userPostList = [];
        $scope.totalSize = 0;
        $scope.noContent = false; 
        $scope.listUserPost();
    };
    $scope.showUserPostList();

    // function to get the post and comment of the post
    $scope.commentLoading = [];
    $scope.getComments = function(postIndx) {
        var post = $scope.userPostList[postIndx];
        $scope.userPostList[postIndx].comments = [];
        var opts = {};
        opts.post_id = post.id;
        opts.limit_start = 0;
        opts.limit_size = 20;

        // This service's function returns post
        ProfileService.getDashboardComments(opts, function(data){
            if(data.code == 100)
            {
                $scope.userPostList[postIndx].comments = data.data.comment;
                $scope.commentLoading[postIndx] = false;
                $scope.showComments[postIndx] = false;
                $scope.commentsShowLimit[postIndx] = 4;
                $scope.commentsLength[postIndx] = $scope.userPostList[postIndx].comments.length;
                if($scope.userPostList[postIndx].comments.length  != 0 ) {
                    $scope.noComment = true;
                }
            } else {
                $scope.commentLoading[postIndx] = false;
            }
        });
    };

    $scope.showAllComments = function(postIndx) {
        $scope.showComments[postIndx] = true;
    };

    $scope.pageSize = 4;
    //function to show limited comment of the post
    $scope.showLimitedComment = function(postIndx) {
        $scope.commentInProcess = true;
        var post = $scope.posts[postIndx];
        var opts = {};
        opts.post_id = post.post_id;
        opts.user_id = $scope.currentUser.id;
        $scope.getComments(opts, postIndx);
    };


    //funciton to delete single post
    $scope.deleteErrMsg = [];
    $scope.isDeletePost = [];
    $scope.deletePost = function(postIndx) {
        var postData = {};
        postData = $scope.userPostList[postIndx];
        $scope.isDeletePost[postIndx] = true;
        var formData = {};
        formData.user_id = APP.currentUser.id;
        formData.post_id = postData.id;

        //calling the service to delete the selected post 
        ProfileService.deleteDashboardPost(formData, function(data){
            if(data.code == 101) {
                $scope.userPostList.splice(postIndx, 1);
                $scope.isDeletePost[postIndx] = false;
            } else {
                $scope.deleteErrMsg[postIndx]= data.message;
                $scope.isDeletePost[postIndx] = false;
            }
        });
    };

    //function to create post
    $scope.editPostErrorMsg = [];
    $scope.updatePostInProcess = [];
    $scope.saveUpdatePost = function(postIndx) {
        var opts = {};
        $scope.updatePostInProcess[postIndx] = true;
        var editPostText = $scope.updateBody[postIndx]; 
        var post = $scope.userPostList[postIndx];

        if(editPostText == undefined || editPostText == '') {
            $scope.updatePostInProcess = false;
            $scope.editPostErrorMsg[postIndx] = "Can not save empty status";
            return false;
        } 
        opts.user_id = APP.currentUser.id;
        opts.post_id = post.id;
        opts.title = post.title; //This dummy data as currently there is no field to accept the posttitle
        opts.description = editPostText;
        opts.to_id = post.to_id; 
        opts.youtube_url = '';
        opts.post_type = '1';
        var myFile = '';

        ProfileService.updateDashboardPost(opts, function(data){
            if(data.code == 101) {
                $scope.updatePostInProcess[postIndx] = false;
                $scope.editPostErrorMsg[postIndx] = '';
                $scope.userPostList[postIndx].description = editPostText;
                $scope.editPostText = '';
                $scope.activeEdit[postIndx] = false;
            } else {
                $scope.updatePostInProcess[postIndx] = false;
                $scope.activeEdit[postIndx] = false;
                $scope.editPostErrorMsg[postIndx] = 'Post could not save';
            }
        });
    };

    $scope.updateBody = [];
    $scope.activeEdit = [];
    //funtion to open form to update post
    $scope.updatePost = function(postIndx) {
        $scope.editPostErrorMsg[postIndx]='';
        var post = $scope.userPostList[postIndx];
        $scope.updateBody[postIndx] = post.description;
        $scope.activeEdit[postIndx] = true;
    };

    // close the edit form on cancel
    $scope.cancelPost = function(postIndx) {
        $scope.updateBody[postIndx] = '';
        $scope.activeEdit[postIndx] = false;
    };


    //function to delete the comment of a post
    //funciton to delete single comment
    $scope.deleteComment = function(postIndx,comment) {

        var indx = $scope.userPostList[postIndx].comments.indexOf(comment);
        var commentData = {};
        commentData = $scope.userPostList[postIndx].comments[indx];
        $scope.deleteCommentIndx = commentData.id;
        var formData = {};
        formData.user_id = APP.currentUser.id;
        formData.comment_id = commentData.id;

        //calling the comment service to delete the selected comment 
        ProfileService.deleteDashboardComment(formData, function(data){
            if(data.code == 101) {
                $scope.userPostList[postIndx].comments.splice(indx, 1);
                $scope.deleteCommentIndx = '';
            }
            else {
                $scope.deleteCommentIndx = '';
                $scope.userPostList;
            }
        });
    }

    $scope.editCommentText = [];
    $scope.activeCommentEdit = [];
    $scope.isEditComment = [];
    $scope.commentErrorMsg = [];
    $scope.commentInProcess = [];
    //funtion to open form to update comment
    $scope.updateComment = function(postIndx, comment) {
        $("#commentBoxId-"+postIndx).hide();
        $scope.commentInProcess[postIndx] = true;
        $scope.commentErrorMsg[postIndx] = '';
        var indx = $scope.userPostList[postIndx].comments.indexOf(comment);
        var comment = $scope.userPostList[postIndx].comments[indx];
        $scope.isEditComment[postIndx] = false;
        $scope.activeCommentEdit[postIndx] = comment.id
        $scope.editCommentText[postIndx]=comment.comment_text;
    };

    //function to edit a comment
    $scope.editComment = function(postIndx, comment) {
        var opts = {};
        $scope.commentErrorMsg[postIndx]= '';
        var indx = $scope.userPostList[postIndx].comments.indexOf(comment);
        var comment = $scope.userPostList[postIndx].comments[indx];
        var newText = $scope.editCommentText[postIndx];
        $scope.isEditComment[postIndx] = true;

        if(newText == undefined || newText == '') {
            $scope.isEditComment[postIndx]= false;
            $scope.commentErrorMsg[postIndx] = "Can not save empty comment";
            return false;
        } 

        opts.user_id = APP.currentUser.id;
        opts.comment_id = comment.id;
        opts.comment_text = newText;

        ProfileService.updateDashboardComment(opts, function(data){
            if(data.code == 101) {
                $scope.commentInProcess[postIndx] = false;
                $scope.activeCommentEdit[postIndx] = '';
                $scope.commentErrorMsg[postIndx] = '';
                $scope.editCommentText[postIndx] = '';
                $scope.userPostList[postIndx].comments[indx].comment_text = newText;
                $scope.isEditComment[postIndx] = false;
                $("#commentBoxId-"+postIndx).show();
            } else {
                $scope.activeCommentEdit[postIndx] = '';
                $scope.commentInProcess[postIndx] = false;
                $scope.isEditComment[postIndx] = false;
                $scope.commentErrorMsg[postIndx]= 'Comment could not be post';
                $scope.editCommentText[postIndx] = '';
                $("#commentBoxId-"+postIndx).show();
            }
        });
    };

    //funtion to open form to update comment
    $scope.cancelEditComment = function(postIndx, indx) {
        $scope.commentInProcess[postIndx] = false;
        $scope.activeCommentEdit[postIndx] = '';
        $scope.commentErrorMsg[postIndx] = '';
        $scope.editCommentText[postIndx] = '';
        $scope.isEditComment[postIndx] = false;
        $("#commentBoxId-"+postIndx).show();
    };

    //function to delete the media file of post
    $scope.deletePostMedia = function(indx) {
        var postData = {};
        postData = $scope.userPostList[indx];
        var formData = {};
        formData.user_id = APP.currentUser.id;
        formData.post_media_id = postData.media_info[0].id;

        //calling the service to delete the selected post 
        ProfileService.deletePostMedia(formData, function(data){
            if(data.code == 101) {
                $scope.userPostList[indx].media_info.splice(0, 1);
            }
            else {
                $scope.message = data.message;
                $scope.userPostList;
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
        $scope.imagePrvSrc = [];
        $scope.postProfileFiles = [];
    };
    $scope.addPost = function() { 
        $scope.isImage = false;
        $scope.imgUpload = false;
        $scope.uploadBox = false;
        $scope.isPost = true;
        $scope.imagePrvSrc = [];
        $scope.postProfileFiles = [];
    };

$(".fancybox").fancybox();

}).filter('unsafe', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
});