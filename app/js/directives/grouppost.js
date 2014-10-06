//Displaying the comment post form for store detail
app.directive('groupCommentForm',['CommentService', 'fileReader', function(CommentService, fileReader) {
  return {
    restrict: 'E',
    templateUrl: 'app/views/group_comment_form.html',
    scope: {
      loadComment: "&loadComment"
    },
    link : function(scope, elem, attrs){
      scope.commentFiles = [];
      scope.imgSrc = [];
      scope.getFile = function () {
        scope.commentErrMsg = '';
        fileReader.readAsDataUrl(scope.file, scope)
        .then(function(result) {
          //Allow some images types for uploading
          var imageType = scope.file['name'].substring(scope.file['name'].lastIndexOf(".") + 1).toLowerCase();
          if (!(imageType == "gif" || imageType == "png" || imageType == "jpg" || imageType == "jpeg")) {
            scope.commentErrMsg = 'Upload media file is not valid';
            scope.file = null;
          } else {
            scope.commentErrMsg = '';
            scope.commentFiles.push(scope.file);
            scope.imgSrc.push(result);
            scope.file = null;
          }
        });
      };
      //remove iamge from preview array
      scope.removeImage = function(index) {
          scope.commentFiles.splice(index, 1);
          scope.imgSrc.splice(index, 1);
      };
      scope.addComment = function(){
        scope.postIndx = attrs.postIndx;
        scope.commentInProcess = true;
        scope.commentErrMsg = "";
        var filescount = scope.commentFiles.length;

        if ((scope.commentText === undefined || scope.commentText === '') && filescount === 0) {
            scope.commentInProcess = false;
            scope.commentErrMsg = "Write something or add image to post";
            return false;
        }  

        var opts = {};
        opts.session_id = APP.currentUser.id;
        opts.postid = attrs.postId;
        opts.body = scope.commentText;
        opts.youtube_url='';

        CommentService.createComment(opts, scope.commentFiles, function(data){
          if(data.code == 101) {
            scope.commentInProcess = false;
            scope.commentErrorMsg = '';
            scope.commentText = '';
            scope.loadComment(attrs.postId);
            scope.commentFiles = [];
            scope.imgSrc = [];
          } else {
            scope.commentInProcess = false;
            scope.commentErrorMsg = 'Comment could not be post';
            scope.commentFiles = [];
            scope.imgSrc = [];
          }
        });
      };
    }
  };
}]);

//Displaying the post form for store detail
app.directive('groupPostList', function() {
  return {
      restrict: 'E',
      templateUrl: 'app/views/group_post_list.html'
  }
});

//Displaying the post form for store detail
app.directive('groupPostForm', function() {
  return {
      restrict: 'E',
      templateUrl: 'app/views/group_post_form.html'
  }
});