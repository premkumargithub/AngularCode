app.controller('MessageController', function ($scope, $filter, $rootScope, $interval, $timeout, fileReader,MessageService, saveFriendId, threadAndPass) {

    $scope.user_id = 0;
    $scope.custom = false;
    $scope.loadMoreMessage = false;
    $scope.deleteImage = false;
    $scope.newMessageShow = function() {
        $scope.custom = true;
        $scope.recipientAddress = "";
    };

    $scope.MessageHide = function() {
        $scope.custom = false;
    };

    $scope.errorMessage = "";
    //Create Message
    $scope.createMessageshow = false; 
    $scope.createMessage = function(){
        var opts = {};
        opts.session_id = APP.currentUser.id;
        if($scope.user_id == undefined || $scope.user_id == ''){
            $scope.emptyMessageError = true;
            $scope.createMessageerror = "Please select the friend first";
            return false;
        }
        opts.recipient = $scope.user_id; 
        opts.title = "Post Title";
        if($scope.body == undefined || $scope.body == ''){
            $scope.emptyMessageError = true;
            $scope.createMessageerror = "Write the message first";
            return false;
        } 
        opts.body = $scope.body;
        if($scope.myFile === undefined || $scope.myFile == '') {
            opts.commentfile = "";
        }else {
            opts.commentfile = $scope.myFile;
            var imageType = $scope.myFile['name'].substring($scope.myFile['name'].lastIndexOf(".") + 1);
        }
       // Checking Extension
        if (!(imageType == "gif" || imageType == "png" || imageType == "jpg" || imageType == "jpeg" || imageType == "GIF" || imageType == "PNG" || imageType == "JPG" || imageType == "JPEG")) {
           $scope.errorMessage = 'Upload media file is not valid';
        }
        $scope.createMessageshow = true;
        $scope.sendMessage = MessageService.createMessage(opts, $scope.myFile, function(data){
            if(data.code == 101 && data.message === 'success') {
                $scope.custom = false;
                $scope.createMessageshow = false;
                $scope.messageInbox('');
                $scope.recipientAddress = "";
                $scope.body = "";
                $scope.myFile = "";
                $scope.imageSrc = "";
                $scope.deleteImage = false;
            }
            else {
                $scope.custom = false;
                $scope.createMessageshow = false;
            }
        });

    }

    $scope.myFile = '';
    $scope.imageSrc = '';
    $scope.getFile = function () {
        $scope.progress = 0;
        fileReader.readAsDataUrl($scope.file, $scope)
        .then(function(result) {
            $scope.myFile = $scope.file;
            $scope.imageSrc = result;
            $scope.deleteImage = true;
        });
    };

    $scope.removeImage = function(){
        $scope.imageSrc = '';
        $scope.myFile = "";
        $scope.deleteImage = false;
    }


    //Delete Message 
    $scope.deleteMessage = function(messageId, threadId){
        var formData = {};
        var r = confirm("Are you sure you want to dalete this message!");
        if (r == true) {
            formData.session_id = APP.currentUser.id;
            formData.message_id = messageId;
            $scope.delete = MessageService.deleteMessage(formData, function(data){ 
                if(data.code == 101 && data.message === 'success') {
                    $scope.listusermessages(saveFriendId.getFriendId() , threadId);
                }
                else {

                }
            });
        }
    }

    //Message Listing
    $scope.messageListing = function(){   
        var opts = {};
        opts.session_id = APP.currentUser.id;
        opts.limit_size = APP.message_list_pagination.end;
        opts.limit_start = APP.message_list_pagination.start;
        $scope.messageListing = MessageService.messageListing(opts, function(data){
            if(data.code == 101 && data.message === 'success') {
                $scope.messagelist = data.data;
            }else {

            }
        });
    }

  //Read Message 
    $scope.readMessage = function(threadId){   
        var opts = {};
        opts.session_id = APP.currentUser.id;
        opts.thread_id = threadId;
        $scope.read = MessageService.readMessage(opts, function(data){
            if(data.code == 101 && data.message === 'success') {
            }
            else {

            }
        });
    }

    //Reply Message 
    $scope.replyMessageShow = false;
    $scope.emptyMessageError = false;
    $scope.replyMessage = function(threadid){
        var opts = {};
        opts.session_id = APP.currentUser.id;
        opts.recipient = saveFriendId.getFriendId();
        if(threadid == undefined || threadid == '')
            threadid = saveFriendId.getThreadId();
        opts.message_id = threadid;
        
        if($scope.body == undefined || $scope.body === ''){
            $scope.emptyMessageError = true;
            return false;
        }
        opts.body = $scope.body;
        if($scope.myFile === undefined || $scope.myFile === '') {
            opts.commentfile = "";
        }else {
            opts.commentfile = $scope.myFile;
            var imageType = $scope.myFile['name'].substring($scope.myFile['name'].lastIndexOf(".") + 1);
        }
       // Checking Extension
        if (!(imageType == "gif" || imageType == "png" || imageType == "jpg" || imageType == "jpeg")) {
           $scope.emptyMessage = 'Upload media file is not valid';
        } $scope.replyMessageShow = true;
        $scope.reply = MessageService.replyMessage(opts, $scope.myFile,function(data){
            if(data.code == 101 && data.message === 'success') {
                $scope.emptyMessageError = false;
                $scope.replyMessageShow = false;
                $scope.body = "";
                $scope.myFile = "";
                $("#replyImage").val('');
                $scope.imageSrc = "";
                $scope.listusermessages(saveFriendId.getFriendId(), threadid);
                $scope.deleteImage = false;
            }else {
                $scope.body = "";
                $scope.myFile = "";
                //$scope.emptyMessageError = false;
                $scope.replyMessageShow = false;
                $scope.deleteImage = false;
            }
        });  
    }


    $scope.edit = true;
    $scope.model = {};
    $scope.model.updateBody = "";
    $scope.assignUpdate = function(data){
         $scope.model.updateBody = data;
    }

    //Update Message 
    $scope.updateMessage = function(messageId, threadId){
        var formData = {};
        formData.session_id = APP.currentUser.id;
        formData.message_id = messageId;
        formData.body = $scope.model.updateBody;
        if($scope.model.updateBody == ""){
            $scope.deleteMessage(messageId,threadId);
        }else{
            $scope.update = MessageService.updateMessage(formData, function(data){
                if(data.code == 101 && data.message === 'success') {
                    $scope.listusermessages(saveFriendId.getFriendId(), threadId);
                    $scope.edit = true;
                    $scope.model.updateBody = "";
                }
                else {
                 
                }
            });
        }
    }

    //Send Email Message 
    $scope.sendemailMessage = function(){   
        var formData = {};
        formData.session_id = APP.currentUser.id;
        formData.recipient = 50; //TODO
        formData.title = "Post Title"; //TODO
        formData.body = "body"; //TODO
        $scope.response = MessageService.sendemailMessage(formData, function(data){
            if(data.code == 101 && data.message === 'success') {

            }
            else {
             
            }
        });
    }

    $scope.loadUserMessage = "false";
    //Message Listing Inbox
    $scope.response = {};
    $scope.messageInbox = function(flag){  
        var opts = {};
        var thisThread = "";
        var thisFriend = "";
        $scope.loadUserMessage = "true";
        opts.user_id = APP.currentUser.id;
        opts.limit_start = APP.friend_list_pagination.start;
        opts.limit_size = APP.friend_list_pagination.end;     
        MessageService.messageInbox(opts, function(data) {  
            if(data.total != 0){
                $scope.response = data.data;
                $scope.userid = APP.currentUser.id;
                if(data.data[0].last_message != "")
                    $scope.senderid = data.data[0].last_message.sender_user.id;
                thisThread = threadAndPass.getThread();
                thisFriend = threadAndPass.getFriend();
                if(data.code == 100 && data.message === 'success') {
                    if(flag == ''){
                        if(thisThread == '' && thisFriend == ''){
                            $scope.loadUserMessage = "false";//alert(data.data.length)
                            $scope.readMessage(data.data[0].thread_id);
                            var small =$filter('date')(data.data[0].last_message.created_at, "yyyy-MM-dd h:mma");
                            var index = 0;
                            for(i=1;i< data.data.length;i++){
                                if(small < $filter('date')(data.data[i].last_message.created_at, "yyyy-MM-dd h:mma")){
                                    small = $filter('date')(data.data[i].last_message.created_at, "yyyy-MM-dd h:mma");
                                    index = i;
                                }
                            }
                            $scope.listusermessages(data.data[index].user_detail.id, data.data[index].thread_id);
                        $timeout(function(){
                                $('#list-'+data.data[index].thread_id).addClass('active');
                            }, 2000);
                        }else{
                            $scope.loadUserMessage = "false";
                            threadAndPass.clearThreadAndFriend();
                            //$scope.readMessage(thisThread);
                            $scope.listusermessages(thisFriend, thisThread);
                            $timeout(function(){
                                $('#list-'+thisThread).addClass('active');
                        }, 500);
                        }
                    } else {
                        $scope.loadUserMessage = "false";
                        $timeout(function(){
                                $('#list-'+saveFriendId.getThreadId()).addClass('active');
                        }, 500);
                    }
                } else {
                    $scope.loadUserMessage = "false";
                }
            }else{
                $scope.loadUserMessage = "false";
            }
        });
    }
    $scope.freezeRequest = 0;
    $scope.loadMessageUser = "false";
    $scope.loadMoreList = function(){
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.limit_start = $scope.response.length;
        opts.limit_size = APP.friend_list_pagination.end;
        $scope.loadMessageUser = "true";
        if($scope.freezeRequest == 0){
            $scope.freezeRequest = 1;
            MessageService.messageInbox(opts, function(data) {
            if(data.code == 100 && data.message === 'success') {   
                if(data.total != 0){  
                    $scope.freezeRequest = 0;
                    $scope.loadMessageUser = "false";
                    $scope.response = $scope.response.concat(data.data);
                } else {
                    $scope.loadMessageUser = "false";
                    $scope.freezeRequest = 0;
                }
            }else{
                    $scope.loadMessageUser = "false";
                    $scope.freezeRequest = 0;
                }
            });
        }
    }

    //Search User Thread
    $scope.searchUserThread = function(){  
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.firstname = $scope.nameSearch;
        opts.limit_start = APP.message_list_pagination.start;
        opts.limit_size = APP.message_list_pagination.end;     
        MessageService.searchUserThread(opts, function(data) { 
            $scope.response = data.data;
            if($scope.nameSearch == '') {
                $scope.messageInbox();
            }
            if(data.code == 101 && data.message === 'success') {                   
              //console.log(data.data);
            } else {

            }
        });
    }
    
    //List User Thread Messages
    $scope.showImage = false;
    $scope.loadMessage = false;
    $scope.listmessage = {};
    $scope.listusermessages = function(friendId, threadid){
        
        $scope.custom = false;
        $scope.loadMessage = true;
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.friend_id = friendId;
        opts.thread_id = threadid;
        opts.limit_start = APP.message_list_pagination.start;
        opts.limit_size = APP.message_list_pagination.end;
        saveFriendId.saveFriend(friendId);
        saveFriendId.saveTreadId(threadid);
        MessageService.listusermessages(opts, function(data) { //console.log(data.data)
            if(data.code == 100 && data.message === 'success') { 
                $scope.loadMessage = false;
                $scope.userid = APP.currentUser.id;
                $scope.listmessage = data.data;
                if(data.data.length > 0)
                    $scope.senderid = data.data[0].sender_user.id;
                stop = $interval(function() {
                $(".load-more-onscroll").scrollTop($('.load-more-onscroll').height()+100);
                }, 1000,2);
                
            } else {
                $scope.loadMessage = false;
            }
        });
    }
    $scope.canLoad = true;
    $scope.loadMore = function(threadId) {
        $scope.canLoad = true;
        $scope.loadmoremessages(threadId);
    };


    $scope.messageInbox('');
    //List User Thread Messages
    $scope.showImage = false;
    $scope.loadMoreMessage = false;
    $scope.listmessage = {};
    $scope.blockRequest = 0;
    $scope.loadmoremessages = function(threadid){
        //$scope.loadMessage = true;
        $scope.loadMoreMessage = true;
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.friend_id = saveFriendId.getFriendId();
        opts.thread_id = threadid;
        opts.limit_start = $scope.listmessage.length;
        opts.limit_size = APP.message_list_pagination.end-4;
        if($scope.blockRequest == 0){
            $scope.loadMoreMessage = true;
            $scope.blockRequest = 1;
            MessageService.listusermessages(opts, function(data) { //console.log(data.data)
                if(data.code == 100 && data.message === 'success' && data.data.length > 0) { 
                    $scope.blockRequest = 0;
                    $scope.loadMoreMessage = false;
                    $scope.userid = APP.currentUser.id;
                    $scope.listmessage = $scope.listmessage.concat(data.data);
                    if(data.data[0].last_message != "")
                        $scope.senderid = data.data[0].sender_user.id;
                    stop = $interval(function() {
/*                        $('.load-more-onscroll').height() - ($('.load-more-onscroll').height())/2
*/                        $(".load-more-onscroll").scrollTop(10);
                    }, 1000,2);
                } else {
                    $scope.loadMoreMessage = false;
                    $scope.blockRequest = 0;
                }
            });
        }else{

        }
    }


    //$scope.messageListing();
    $scope.names = [];
    $scope.cancelRequest = 0;
    //added by abhinav to test auto complete directive
    $scope.listFriend = function(){
        $scope.cancelRequest = 0;
        $scope.names = [];
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.friend_name = $scope.recipientAddress; 
        opts.limit_size =  APP.friend_list_pagination.end;
        opts.limit_start = APP.friend_list_pagination.start;
        MessageService.searchFriends(opts, function(data){
            if( $scope.cancelRequest == 0 ){
                $scope.names.splice(0, 10)
                if(data.code == 101 && data.message === 'success') {
                    angular.forEach(data.data.users,function(user) {
                        $scope.names.push(user);
                    })
                }else {
                        //console.log('failure')
                }
            }else{
                $scope.listfriend = [];
            }
        });
    }
    $scope.clearList = function(){
        stop = $interval(function() {
            $scope.cancelRequest = 1;
            //$scope.recipientAddress = "";
            $scope.names = [];
        }, 200,1);
    }


    $scope.selectFriend = function(firstName, lastName, user_id){
        $scope.names = [];
        $scope.user_id = 0;
        $scope.recipientAddress = firstName+' '+lastName;
        $scope.user_id = user_id;
    }
});
