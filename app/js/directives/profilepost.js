  //Displaying the comment post form for store detail
  app.directive('profileCommentForm',['ProfileService', 'fileReader', '$http', '$timeout', '$interval', function(ProfileService, fileReader, $http, $timeout, $interval) {
    return {
      restrict: 'E',
      templateUrl: 'app/views/profile_comment_form.html',
      scope : true,
      link : function(scope, elem, attrs){
        scope.commentFiles = [];
        scope.commentImgLoader = [];
        scope.comment_id = '';
        scope.imgSrc = [];
        scope.image_id = [];
        scope.showPreview = false;
        scope.showImgSelect = true;
        scope.getFile = function () {
          scope.showPreview = true;
          scope.showImgSelect = false;
          var tempopts = {};
          scope.image_id = [];
          tempopts.user_id = APP.currentUser.id;
          tempopts.postid = attrs.postId;
          tempopts.body = 'comment image test';
          tempopts.comment_type = '0';
          tempopts.image_id = '';
          tempopts.comment_id = "";
          scope.commentErrMsg = '';
          var imgFileCount = scope.file.length;
          if(imgFileCount != 0) {
            var imageType = scope.file[0]['name'].substring(scope.file[0]['name'].lastIndexOf(".") + 1).toLowerCase();
            if (!(imageType == "gif" || imageType == "png" || imageType == "jpg" || imageType == "jpeg")) {
              scope.commentErrMsg = 'Upload media file is not valid';
            } else {
              scope.commentFiles.push(scope.file[0]);
              ProfileService.createDashboardCommentImage(tempopts, scope.file[0], function(data){
                if(data.code == 101) {
                  scope.imgSrc.push(data.data);
                  scope.image_id.push(data.data.media_id);
                  scope.comment_id = data.data.id;
                  if(imgFileCount > 1 && scope.comment_id != "") {
                    for(var i = 1; i < imgFileCount; i++) {
                        tempopts.comment_id = scope.comment_id;
                        var imageType = scope.file[i]['name'].substring(scope.file[i]['name'].lastIndexOf(".") + 1).toLowerCase();
                        if (!(imageType == "gif" || imageType == "png" || imageType == "jpg" || imageType == "jpeg")) {
                          scope.commentErrMsg = 'Upload media file is not valid';
                        } else {
                          scope.commentFiles.push(scope.file);
                          ProfileService.createDashboardCommentImage(tempopts, scope.file[i], function(data){
                            if(data.code == 101) {
                              scope.imgSrc.push(data.data);
                              scope.image_id.push(data.data.media_id);
                            }else{
                              scope.commentErrMsg = '';
                              scope.file[i] = null;
                            }
                          });
                        }
                    };
                  }
                }                
              });
              scope.commentErrMsg = '';
              scope.file[0] = null;
            }
          }
        };

      //remove iamge from preview array
      scope.removeImage = function(index) {
        var tempMedia = scope.image_id[index];
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.postid = attrs.postId;
        opts.image_id = tempMedia;
        ProfileService.deleteDashboardMediaComments(opts, function(data){
          if(data.code == 101) {
            scope.imgSrc.splice(index, 1);
            scope.image_id.splice(index, 1);
            if(scope.imgSrc.length == 0){
              scope.showImgSelect = true;
              scope.showPreview = false;
            }
          } else {

          }
        });
      };
      scope.addComment = function(){
        scope.postIndx = attrs.postIndx;
        scope.comments = attrs.loadComment;
        scope.createCommentInProcess = true;
        scope.commentErrMsg = "";
        var filescount = scope.commentFiles.length;

        if ((scope.commentText == undefined  || scope.commentText == '') && filescount == 0) {
          scope.createCommentInProcess = false;
          scope.commentErrMsg = "Please write something or photo to update your status.";
          $timeout(function(){
            scope.commentErrMsg = '';
          }, 4000);
          return false;
        }
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.postid = attrs.postId;
        opts.body = scope.commentText;
        opts.media_id = [];
        opts.comment_id = "";
        if(scope.image_id.length != 0){
          opts.media_id = scope.image_id;
        }
        if(scope.comment_id != ''){
          opts.comment_id = scope.comment_id;  
        }
        opts.comment_type = '1';

        ProfileService.createDashboardCommentFinal(opts, function(data){
          if(data.code == 101) {
            scope.commentText = '';
            scope.post.comments.push(data.data);
            scope.commentsShowLimit[0]+1;
            scope.createCommentInProcess = false;
            scope.commentErrMsg = '';
            scope.commentText = '';
            scope.commentFiles = [];
            scope.imgSrc = [];
          } else {
            scope.createCommentInProcess = false;
            scope.commentErrMsg = 'Comment could not be post';
            $timeout(function(){
              scope.commentErrMsg = '';
            }, 4000);
            scope.commentFiles = [];
            scope.imgSrc = [];
          }
        });
      };
    }
  };
}]);

  //Displaying the post form for store detail
  app.directive('profilePostList', function() {
    return {
      restrict: 'E',
      templateUrl: 'app/views/profile_post_list.html'
    }
  });

  //Displaying the post form for store detail
  app.directive('profilePostForm', function() {
    return {
      restrict: 'E',
      link: function (scope, iElement, iAttrs) {
        $($('#lp1').linkPreview()).appendTo(iElement[0]);
      },
      templateUrl: 'app/views/profile_post_form.html'
    }
  });

  //Displaying the loading image form for store detail
  app.directive('showProgress', function() {
    return {
      restrict: 'E',
      template: '<img src="app/assets/images/proceed.gif" alt="processing..." />'
    }
  });