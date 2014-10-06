var linkDirectives = angular.module('linkDirectives', []);

//header directive
linkDirectives.directive('header', function() {
    return {
        templateUrl: 'app/views/header.html',
        restrict: 'E'
    };
});

linkDirectives.directive('confirmClick', function() {
    return {
        link: function (scope, element, attrs) {
            // setup a confirmation action on the scope
            scope.confirmClick = function(msg) {
               msg = msg || attrs.confirmClick || 'Are you sure you want to delete this item?';
                // return true/false to continue/stop the ng-click
                return confirm(msg);
            }
        }
    }
})

linkDirectives.directive('headerLogout', function() {
    return {
        //controller: 'LoginController',
        controller : 'UserController',
        templateUrl: 'app/views/headerLogout.html',
        restrict: 'E'
    };
});

linkDirectives.directive('footerLogout', function() {
    return {
        templateUrl: 'app/views/logout_footer.html',
        restrict: 'E'
    };
});

linkDirectives.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

//Displaying the group details: Directive
linkDirectives.directive('groupView', function() {
    return {
        templateUrl: 'app/views/group_detail.html',
        controller: 'GroupDetailController',
        restrict: 'E'
    };
});

//Displaying the profile notfication
linkDirectives.directive('allNotificationPanel', function() {
  return {
    templateUrl: 'app/views/all_notification.html',
    controller : 'AllNotiController',
    restrict: 'E'
  }
});

//Displaying the profile notfication
linkDirectives.directive('userCoverProfilePanel', function() {
  return {
    templateUrl: 'app/views/user_cover_profile.html',
    controller : 'UserCoverProfileController',
    restrict: 'E'
  }
});

//Displaying the friend profile notfication
linkDirectives.directive('friendCoverProfilePanel', function() {
  return {
    templateUrl: 'app/views/friend_cover_page.html',
    controller : 'FriendCoverProfileController',
    restrict: 'E'
  }
});

//Displaying the profile notfication
linkDirectives.directive('friendList', function() {
  return {
    templateUrl: 'app/views/friend_list.html',
    controller : 'FriendController',
    restrict: 'E'
  }
});

linkDirectives.directive('myRefresh',function($location,$route){ 
    return function(scope, element, attrs) {
        element.bind('click',function(){
            if(element[0] && element[0].href && element[0].href === $location.absUrl()){
                window.location.reload(true);
            }
        });
    }
}); 

//Displaying the store list: Directive
linkDirectives.directive('storeList', function() {
    return {
        templateUrl: 'app/views/store_list.html',
        restrict: 'E'
    };
});

//Displaying the store grid: Directive
linkDirectives.directive('storeGrid', function() {
    return {
        templateUrl: 'app/views/store_grid.html',
        restrict: 'E'
    };
});

//Displaying the profile notfication
app.directive('profileRightPanel', function() {
  return {
    restrict: 'E',
     templateUrl: 'app/views/profile_right_panel.html'
  }
});

//Displaying the profile notfication
app.directive('storeLeftPanel', function() {
  return {
    restrict: 'E',
     templateUrl: 'app/views/store_left_panel.html'
  }
});

//Displaying the profile notfication
app.directive('storeNotificationPanel', function() {
  return {
    restrict: 'E',
     templateUrl: 'app/views/store_notifications.html'
  }
});

//Displaying the profile notfication
app.directive('clubNotificationPanel', function() {
  return {
    restrict: 'E',
     templateUrl: 'app/views/club_notification.html'
  }
});

//Displaying the profile notfication
app.directive('clubSpecificNotificationPanel', function() {
  return {
    restrict: 'E',
     templateUrl: 'app/views/clubsnotification.html'
  }
});

//Displaying the group grid: Directive
linkDirectives.directive('groupGrid', function() {
    return {
        restrict: 'E',
        templateUrl: 'app/views/group_grid.html'
    }
});

//Displaying the group list: Directive
linkDirectives.directive('groupList', function() {
    return {
        restrict: 'E',
        templateUrl: 'app/views/group_list.html'
    }
});

//To post form on enter: Directive
linkDirectives.directive('submitEnter', function() {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.bind("keydown keypress", function(event) {
                if(event.which === 13) {
                    scope.$apply(function(){
                        scope.$eval(attrs.submitEnter);
                    });
                    event.preventDefault();
                }
            });
        }
    };
});

//To close form on escp: Directive
linkDirectives.directive('cancelEsc', function() {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.bind("keydown keypress", function(event) {
                if(event.which === 27) {
                    scope.$apply(function(){
                        scope.$eval(attrs.cancelEsc);
                    });
                    event.preventDefault();
                }
            });
        }
    };
});

//map directive
linkDirectives.directive('map', function() {
    return {
        templateUrl: 'app/views/map.html',
        restrict: 'E'
    };
});

linkDirectives.directive('autocompleteMap', function() {
    return {
        templateUrl: 'app/views/google_map.html',
        restrict: 'E'
    };
});


linkDirectives.directive('messageNotification', function() {
    return {
        restrict: 'E',
        templateUrl: 'app/views/message_notification.html',
        controller: 'MessageNotifiController',
    };
});


//Displaying the post form for store detail
app.directive('storePostForm', function() {
  return {
      restrict: 'E',
      templateUrl: 'app/views/store_post_form.html'
  }
});

//Displaying the post list for store detail
app.directive('storePostList', function() {
  return {
      restrict: 'E',
      templateUrl: 'app/views/store_post_list.html'
  }
});

//Displaying the comment post form for store detail
app.directive('storeCommentForm',['StoreCommentService', 'fileReader', function(StoreCommentService, fileReader) {
  return {
    restrict: 'E',
    templateUrl: 'app/views/store_comment_form.html',
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

        if (scope.commentText === undefined && filescount === 0) {
            scope.commentInProcess = false;
            scope.commentErrMsg = "Write something or add image to post";
            return false;
        } 

        var opts = {};
        opts.comment_author = APP.currentUser.id;
        opts.post_id = attrs.postId;
        opts.comment_text = scope.commentText;
        opts.youtube_url='';

        StoreCommentService.createComment(opts, scope.commentFiles, function(data){
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
          }
        });
      };
    }
  };
}]);

//Displaying the comment post form for store detail
app.directive('clickEdit',['$compile', function($compile) {
  return {
    restrict: 'E',
    link : function(scope, elem, attrs){
        elem.bind('click', function() {
        var newtemp;
        newtemp = angular.element('<edit-form></edit-form>');
        elem.parent().parent().find('.store-comment-profile-upload').html($compile(newtemp)(scope));
      });
    }
  }
}]);

//Displaying the comment post form for store detail
app.directive('editForm', function($compile) {
  return {
    restrict: 'E',
    templateUrl: 'app/views/store_post_editform.html'
  }
});

//Displaying the comment post form for store detail
app.directive('clickDelete',[function($compile) {
  return {
    restrict: 'A',
    scope:{
      deleteMethod:'&'
    },
    link : function(scope, elem, attrs){
        elem.bind('click', function() {
         scope.$apply(scope.deleteMethod); 
      });
    }
  }
}]);

app.directive('infiniteScrolls', [ "$window", function ($window) {
        return {
            link:function (scope, element, attrs) {
                var offset = parseInt(attrs.threshold) || 0;
                var e = element[0];

                element.bind('scroll', function () {
                    if (e.scrollTop  == 0) {
                        scope.$apply(attrs.infiniteScrolls);
                    }
                });
            }
        };
}]);

app.directive("ngFileSelect",function(){
  return {
    link: function($scope,el){
     el.bind("change", function(e){
        $scope.file = (e.srcElement || e.target).files[0];
        $scope.getFile();
      })
    }
  }
});

//directive for multifileselect
app.directive("ngMultiFileSelect",function(){
  return {
    link: function($scope,el){
     el.bind("change", function(e){
        $scope.file = (e.srcElement || e.target).files;
        $scope.getFile();
      })
    }
  }
});

// //directive for profile post section 
// //it is rediscribed because it the ngfileselect is override in profile view page
app.directive("ngProfileFileSelect",function(){
  return {
    link: function($scope,el){
     el.bind("change", function(e){
        $scope.files = (e.srcElement || e.target).files;
        $scope.inputEl = e.target;
        $scope.getProfileFile();
      })
    }
  }
});

//directive for multifileselect
app.directive("ngProfileCommentMultiFileSelect",function(){
  return {
    link: function($scope,el){
     el.bind("change", function(e){
        $scope.file = (e.srcElement || e.target).files[0];
        $scope.getFile();
      })
    }
  }
});