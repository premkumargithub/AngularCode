app.controller('BrokerProfileController', function ($scope, BrokerProfileService, $location) {

    $scope.countries = APP.countries;
    //Registration Broker Multiprofile 
    $scope.brokerMultiprofile = function(){
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.phone = $scope.user.albumname; 
        opts.vat_number = $scope.user.albumdesc; 
        opts.fiscal_code = APP.currentUser.id;
        opts.iban = $scope.user.albumname; 
        opts.type = 2; 
        BrokerProfileService.brokerMultiprofile(opts, function(data){
            
            if(data.code == 101) {
               
            } else {
                
            }
        });
    }
   
});
