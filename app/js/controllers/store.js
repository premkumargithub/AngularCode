app.controller('StoreController', function ($scope, $http, StoreService) {
    $scope.storeListObject = [];
    $scope.storeMyList = [];
    $scope.storeAllList = [];
    $scope.totalSize = 0;
    $scope.myTotalSize = 0;
    $scope.storeLoading = true;
    $scope.viewAllActive = 'current';
    $scope.myStoreActive = '';
    $scope.tab = 'viewAll';
    $scope.notFound = false;
    $scope.allRes = 1;
    $scope.myRes = 1;

    $scope.showStoreList = function(tab) {
        $scope.storeMyList = [];
        $scope.tab = tab;
        $scope.viewAllActive = 'current';
        $scope.myStoreActive = '';
    	var opts = {};
        var limit_start = $scope.storeAllList.length;
    	opts.user_id = APP.currentUser.id;
        opts.store_type = 1; 
        opts.limit_start = limit_start;
        opts.limit_size = APP.store_list_pagination.end; 
        if ((( $scope.totalSize > limit_start) || $scope.totalSize == 0 ) && $scope.allRes == 1) {
            $scope.storeLoading = true;
            $scope.allRes = 0;
            StoreService.getStore(opts, function(data) {
                if(data.code == 101 && data.message === 'success') {
                    $scope.allRes = 1;
                    $scope.totalSize = data.data.size;
                    $scope.storeListObject =  $scope.storeAllList = $scope.storeAllList.concat(data.data.stores);
                    $scope.storeLoading = false;
                    $scope.notFound = false;
                } else if(data.code == 121) {
                    $scope.storeListObject =  [];
                    $scope.notFound = true;
                    $scope.storeLoading = false;
                }
                else {
                    $scope.storeListObject =  [];
                    $scope.notFound = true;
                    $scope.storeLoading = false;
                }
            });
        }
    };

    $scope.showStoreList($scope.tab);

    $scope.listActive = 'active';
    $scope.changeView = function(layout) {
        if(layout == 'grid'){
            $scope.gridActive = 'active'; 
            $scope.listActive = ''; 
        } else if(layout == 'list'){
            $scope.listActive = 'active'; 
            $scope.gridActive = '';
        }
    };

    $scope.myStoreList = function(tab) { 
        $scope.storeAllList = [];
        $scope.tab = tab; 
        $scope.viewAllActive = '';
        $scope.myStoreActive = 'current';
        var opts = {};
        var limit_start = $scope.storeMyList.length;

        opts.user_id = APP.currentUser.id;
        opts.store_type = 2; 
        opts.limit_start = limit_start;
        opts.limit_size = APP.store_list_pagination.end;
        if ((($scope.myTotalSize > limit_start) || $scope.myTotalSize == 0 ) && $scope.myRes == 1) {
            $scope.storeLoading = true;
            $scope.myRes = 0; 
            StoreService.getStore(opts, function(data) {
                if(data.code == 101 && data.message === 'success') {
                    $scope.myTotalSize = data.data.size;
                    $scope.myRes = 1; 
                    $scope.storeListObject = $scope.storeMyList = $scope.storeMyList.concat(data.data.stores);
                    $scope.storeLoading = false;
                } else if(data.code == 121) {
                    $scope.storeListObject =  [];
                    $scope.notFound = true;
                    $scope.storeLoading = false;
                } else {
                    $scope.storeListObject =  [];
                    $scope.notFound = true;
                    $scope.storeLoading = false;
                    
                }
            });
        }
    };

    $scope.loadMore = function() {
        if($scope.tab == 'myStore') {
            $scope.storeAllList = [];
            $scope.myStoreList($scope.tab);
        } else {
            $scope.storeMyList = [];
            $scope.showStoreList($scope.tab);
        }
    };

    $scope.searchStore = function() {
        $scope.storeLoading = true;
        $scope.viewAllActive = 'current';
        $scope.myStoreActive = '';
        var opts = {};
        opts.user_id = APP.currentUser.id;
        $scope.tab = 'viewAll';
        if($scope.searchTitle === undefined || $scope.searchTitle === '') {
            $scope.allRes = 1;
            $scope.storeMyList = [];
            $scope.storeAllList = [];
            $scope.showStoreList($scope.tab);
        }
        opts.business_name = ($scope.searchTitle === undefined ? '' : $scope.searchTitle); 
        opts.limit_start = APP.store_list_pagination.start;
        opts.limit_size = APP.store_list_pagination.end;
        StoreService.searchStore(opts, function(data) {
            if(data.code == 101) {
                $scope.storeListObject =  data.data;
                $scope.storeLoading = false;
                $scope.notFound = false;
            } else if(data.code == 121) {
                $scope.storeListObject =  [];
                $scope.notFound = true;
                $scope.storeLoading = false;
            }
            else {
                $scope.storeListObject =  [];
                $scope.notFound = true;
                $scope.storeLoading = false;
            }
        });
    };

    $scope.deleteStore = function(id, parentId) { 
        $("#store" + id).hide();
        $("#storedelete" + id).show();
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.store_id = id;
        opts.store_type = (parentId) ? 2 : 1;
        StoreService.deleteStore(opts, function(data) {
            if(data.code == 101 && data.message === 'success') {
                $(".storecoverid" + id).hide();
            } else {
                $("#store" + id).show();
                $("#storedelete" + id).hide();
            }
        });
    };

    $scope.deleteStoreGrid = function(id, parentId) { 
        $("#store" + id).hide();
        $("#storedelete" + id).show();
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.store_id = id;
        opts.store_type = (parentId) ? 2 : 1;
        StoreService.deleteStore(opts, function(data) {
            if(data.code == 101 && data.message === 'success') {
                /*var index = 0;
                angular.forEach($scope.storeListObject, function(idx) {
                    if(idx.id != id){
                        index = index + 1;
                    }else{
                        $scope.storeListObject.splice(index, 1);
                    }
                });*/
                $(".storecoverid" + id).hide();
                //$scope.storeListObject.splice(id, 1);
            } else {
                $("#store" + id).show();
                $("#storedelete" + id).hide();
            }
        });
    };

});

//Create Store controller here
app.controller('CreateStoreController', function ($scope, $http, $location, $timeout, StoreService) {
    $scope.createStoreLoader = false;
    $scope.createStoreError = false;
    $scope.createStoreErrorMgs = "Store can not be created due to server error";
    $scope.store = {};

    var opts1 = {};
    StoreService.getCountryList(opts1, function(data) {
        if(data.code == 101) {
            $scope.countryList = data.data;
        }
    });
    //function to create the Store
    $scope.createStore = function() {
        $scope.createStoreLoader = true;
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.business_name = $scope.store.business_name;
        opts.legal_status = $scope.store.legal_status;
        opts.business_type = $scope.store.business_type;
        opts.phone = $scope.store.phone;
        opts.email = $scope.store.email;
        opts.business_country = $scope.store.business_country;
        opts.business_region = $scope.store.business_region;
        opts.business_city = $scope.store.business_city;
        opts.business_address = $scope.store.business_address;
        opts.zip = $scope.store.zip;
        opts.province = $scope.store.province;
        opts.vat_number = $scope.store.vat_number;
        opts.iban = $scope.store.iban;
        opts.description = $scope.store.description;
        opts.map_place = document.getElementById("mapplace").value;
        opts.latitude = document.getElementById("latitude").value; 
        opts.longitude = document.getElementById("longitude").value;
        StoreService.createStore(opts, function(data) {
            if(data.code == 101 && data.message === 'success') {
                $scope.createStoreLoader = true;
                $location.path("/shope");
            } else {
                $scope.createStoreLoader = false;
                $scope.createStoreError = true;
            }
        });
    };

    $scope.resetStoreObject = function() {
        document.getElementById("mapplace").value = '';
        document.getElementById("latitude").value = ''; 
        document.getElementById("longitude").value = '';
        $scope.store = {};
    };

    $scope.loadMap = function() {
        $scope.map = {center: {latitude: 40.1451, longitude: -99.6680 }, zoom: 4 }
        $scope.options = {scrollwheel: false};
        $scope.marker = {
            id:0,
            coords: {
                latitude: 40.1451,
                longitude: -99.6680
            },
            options: { draggable: true },
            events: {
                dragend: function (marker, eventName, args) {
                    document.getElementById("latitude").value = marker.getPosition().lat();
                    document.getElementById("longitude").value = marker.getPosition().lng();
                    $scope.mapLocation(marker.getPosition().lat(), marker.getPosition().lng());
                }
            }
        }
    }

    $scope.mapLocation = function(mapLatitude, mapLogitude) {
        var geocoder;
        geocoder = new google.maps.Geocoder();
        var latlng = new google.maps.LatLng(parseFloat(mapLatitude), parseFloat(mapLogitude));
        geocoder.geocode({'latLng': latlng}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[1]) {
                $('#mapplace').val(results[1].formatted_address);
            } else {
                alert('No results found');
            }
        } else {
            alert('Geocoder failed due to: ' + status);
        }
        });
    };
    $scope.loadMap();

        $scope.initialize = function () {
        var mapOptions = {
            center: new google.maps.LatLng(-33.8688, 151.2195),
            zoom: 13
        };
        var map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);

        var input = (document.getElementById('pac-input'));

        var types = document.getElementById('type-selector');
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', map);

        var infowindow = new google.maps.InfoWindow();
        var marker = new google.maps.Marker({
            map: map,
            anchorPoint: new google.maps.Point(0, -29)
        });

        google.maps.event.addListener(autocomplete, 'place_changed', function() {
            infowindow.close();
            marker.setVisible(false);
            var place = autocomplete.getPlace();
            if (!place.geometry) {
                return;
            }
            var countryPlace = autocomplete.getPlace();
            document.getElementById("latitude").value = countryPlace.geometry.location.k;
            document.getElementById("longitude").value = countryPlace.geometry.location.B;
            document.getElementById("mapplace").value = countryPlace.address_components[0].long_name;

            if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport);
            } else {
                map.setCenter(place.geometry.location);
                map.setZoom(17);  
            }
            marker.setIcon(({
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(35, 35)
            }));
            marker.setPosition(place.geometry.location);
            marker.setVisible(true);

            var address = '';
            if (place.address_components) {
                address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
                ].join(' ');
            }

            infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
            infowindow.open(map, marker);
        });

        function setupClickListener(id, types) {
            var radioButton = document.getElementById(id);
        }

        setupClickListener('changetype-all', []);
        setupClickListener('changetype-establishment', ['establishment']);
        setupClickListener('changetype-geocode', ['geocode']);
    }
    $timeout(function(){
        $scope.initialize();
    }, 1000);
});

//Create Store controller here
app.controller('DeatilStoreController', function ($scope, $http, $routeParams, $location, $timeout, StoreService, fileReader) {
    
    var latitudeMap = 0;
    var longitudeMap = 0;
    $scope.loadDetails = function() {
        $scope.storeLoading = true;
        $scope.updateStart = false;
        $scope.createStoreError = false;
        $scope.createStoreErrorMgs = "Store can not be grabbed due to server error";
        $scope.showEditForm = false;
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.store_id = $routeParams.id;
        StoreService.getStoreDetail(opts, function(data) {
            if(data.code == 101 && data.message === 'success') {
                $scope.storeDetail = data.data;
                $scope.storeLoading = false;
                latitudeMap = data.data.latitude;
                longitudeMap = data.data.longitude;
                var storeData = {};
                storeData.storeId = $scope.storeDetail.owner_id;
                StoreService.setStoreOwnerId(storeData, function(data) {            
                });
            } else {
                $scope.storeLoading = false;
                $scope.createStoreError = true;
            }
        });
    }
    $scope.loadDetails();

    $scope.editStore = function() {
        $scope.createStoreLoader = false;
        $scope.store = $scope.storeDetail;
        $scope.showEditForm = true;
        var opts = {};
        StoreService.getCountryList(opts, function(data) {
            if(data.code == 101) {
                $scope.countryList = data.data;
            }
        });
    };

    $scope.updateStore = function() {
        $scope.updateStart = true;
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.store_id = $scope.store.id;
        opts.business_name = $scope.store.business_name;
        opts.parent_store_id = $scope.store.parent_store_id;
        opts.legal_status = $scope.store.legal_status;
        opts.business_type = $scope.store.business_type;
        opts.phone = $scope.store.phone;
        opts.email = $scope.store.email;
        opts.business_country = $scope.store.business_country;
        opts.business_region = $scope.store.business_region;
        opts.business_city = $scope.store.business_city;
        opts.business_address = $scope.store.business_address;
        opts.zip = $scope.store.zip;
        opts.province = $scope.store.province;
        opts.vat_number = $scope.store.vat_number;
        opts.iban = $scope.store.iban;
        opts.description = $scope.store.description;
        opts.map_place = document.getElementById("mapplace").value;
        opts.latitude = document.getElementById("latitude").value; 
        opts.longitude = document.getElementById("longitude").value; 
        opts.allow_access = $scope.store.is_allowed; 
        StoreService.updateStore(opts, function(data) {
            if(data.code == 101 && data.message === 'success') {
                $scope.updateStart = false;
                $scope.showEditForm = false;
                $scope.createStoreLoader = true;
                $location.path("/shope/view/"+$scope.store.id);
            } else {    
                $scope.updateStart = false;
                $scope.createStoreLoader = false;
                $scope.createStoreError = true;
            }
        });
    };

    $scope.cancelEdit = function() {
        $scope.showEditForm = false;
        $scope.store = {};
    };

    $scope.loadEditMap = function() { 
        $scope.map = {center: {latitude: 40.1451, longitude: -99.6680 }, zoom: 4 }
        $scope.options = {scrollwheel: false};
        $scope.marker = {
            id:0,
            coords: {
                latitude: 40.1451,
                longitude: -99.6680
            },
            options: { draggable: true },
            events: {
                dragend: function (marker, eventName, args) {
                    document.getElementById("latitude").value = marker.getPosition().lat();
                    document.getElementById("longitude").value = marker.getPosition().lng();
                    $scope.mapLocation(marker.getPosition().lat(), marker.getPosition().lng());
                }
            }
        }
    }
    $scope.loadEditMap();
    /*$scope.mapLocation = function(mapLatitude, mapLogitude) {
        var geocoder;
        geocoder = new google.maps.Geocoder();
        var latlng = new google.maps.LatLng(parseFloat(mapLatitude), parseFloat(mapLogitude));
        geocoder.geocode({'latLng': latlng}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[1]) {
                $('#mapplace').val(results[1].formatted_address);
            } else {
                alert('No results found');
            }
        } else {
            alert('Geocoder failed due to: ' + status);
        }
        });
    };*/
    $scope.initialize = function () {
        var mapOptions = {
            center: new google.maps.LatLng(latitudeMap, longitudeMap),
            zoom: 8
        };
        var map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);

        var input = (document.getElementById('pac-input'));

        var types = document.getElementById('type-selector');
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', map);

        var infowindow = new google.maps.InfoWindow();
        var marker = new google.maps.Marker({
            map: map,
            anchorPoint: new google.maps.Point(0, -29)
        });

        google.maps.event.addListener(autocomplete, 'place_changed', function() {
            infowindow.close();
            marker.setVisible(false);
            var place = autocomplete.getPlace();
            if (!place.geometry) {
                return;
            }
            var countryPlace = autocomplete.getPlace();
            document.getElementById("latitude").value = countryPlace.geometry.location.k;
            document.getElementById("longitude").value = countryPlace.geometry.location.B;
            document.getElementById("mapplace").value = countryPlace.address_components[0].long_name;

            if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport);
            } else {
                map.setCenter(place.geometry.location);
                map.setZoom(17);  
            }
            marker.setIcon(({
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(35, 35)
            }));
            marker.setPosition(place.geometry.location);
            marker.setVisible(true);

            var address = '';
            if (place.address_components) {
                address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
                ].join(' ');
            }

            infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
            infowindow.open(map, marker);
        });

        function setupClickListener(id, types) {
            var radioButton = document.getElementById(id);
        }

        setupClickListener('changetype-all', []);
        setupClickListener('changetype-establishment', ['establishment']);
        setupClickListener('changetype-geocode', ['geocode']);
    }
    $scope.initializeWait = function(){
        $timeout(function() {
            $scope.initialize();
        }, 1000);
    }

    $scope.showInvite = false;
    $scope.toggleInvite = function(){
        $scope.uploadProfileImage = false;
        $scope.showInvite = !$scope.showInvite;
    }

    $scope.uploadProfileImage = false;
    $scope.toggleUploadImage = function() {
        $scope.showInvite = false;
        $scope.uploadProfileImage = !$scope.uploadProfileImage;
    };

    $scope.uploadStoreProfile = false;
    $scope.uploadProfileerror = false;
    $scope.uploadStoreProfileImage = function() { 
        $scope.uploadStoreProfile = true;
        var imageType = $scope.myFile['name'].substring($scope.myFile['name'].lastIndexOf(".") + 1);
        // Checking Extension
        if (!(imageType == "gif" || imageType == "png" || imageType == "jpg" || imageType == "jpeg")) {
            $scope.uploadProfileErrorMsg = 'Upload image file is not valid';
            $scope.uploadStoreProfile = false;
            $scope.uploadProfileerror = true;
        } else {
            var opts = {};
            opts.user_id = APP.currentUser.id;
            opts.store_id = $scope.storeDetail.id;
            StoreService.uploadStoreProfileimage(opts, $scope.myFile, function(data) {
                if(data.code == 101) {
                    $scope.uploadProfileImage = false;
                    $scope.uploadStoreProfile = false;
                    $scope.storeDetail.cover_image_path = data.data.cover_image_path;
                    $scope.storeDetail.profile_image_original = data.data.original_image_path;
                    //$scope.loadDetails();
                } else {
                    $scope.uploadStoreProfile = false;
                }

            });
        }

    };

    $scope.myFile = '';
    $scope.imageSrc = '';
    $scope.invalidCoverImage = false;
    $scope.invalidCoverImageMgs = 'Please choose an image that is at least 400 pixels wide and at least 200 pixels tall.';
    $scope.getFile = function () {
        $scope.progress = 0;
        fileReader.readAsDataUrl($scope.file, $scope)
        .then(function(result) {
            $scope.myFile = $scope.file;
            $scope.imageSrc = result;
            var imageType = $scope.myFile['name'].substring($scope.myFile['name'].lastIndexOf(".") + 1);
            if (!(imageType == "gif" || imageType == "png" || imageType == "jpg" || imageType == "jpeg")) {
                $scope.uploadProfileErrorMsg = 'Upload image file is not valid';
                $scope.uploadStoreProfile = false;
                $scope.uploadProfileerror = true;
            } else {
                $scope.uploadStoreProfile = false;
                $scope.uploadProfileerror = false;

                $scope.readImage($scope.myFile, function(data){
                if(data.length != 0 && data.width >= 400 && data.height >= 200){
                    $scope.uploadStoreProfileImage();
                }
                else { 
                    $("#invalidCoverImage").show();
                    $timeout(function(){
                        $("#invalidCoverImage").hide();
                    }, 4000);
                }
            });
            }
        });
    };

    //function to check upload image dimenstions
    $scope.readImage = function(file, callback) {
    var reader = new FileReader();
    var image  = new Image();
    reader.readAsDataURL(file);  
    reader.onload = function(_file) {
        var filedata = {};
        image.src    = _file.target.result;
        image.onload = function() {
            var w = this.width,
                h = this.height,
                t = file.type,                     
                n = file.name,
                s = ~~(file.size/1024) +'KB';
                filedata['width'] = w;
                filedata['height'] = h;
                callback(filedata);
        };
        image.onerror= function() {
            callback(filedata);
        };      
    };
}

    $scope.showAllStoreMember = false;
    $scope.showAllMembers = function() {
        $scope.showAllStoreMember = !$scope.showAllStoreMember;
    }; 

});

//Create Store controller here
app.controller('CreateChildStore', function ($scope, $http, $routeParams, $location, $timeout, StoreService) {
    $scope.createStoreLoader = false;
    $scope.createStoreError = false;
    $scope.createStoreErrorMgs = "";
    $scope.store = {};

    var opts1 = {};
    StoreService.getCountryList(opts1, function(data) {
        if(data.code == 101) {
            $scope.countryList = data.data;
        }
    });
    $scope.createChildStore = function() { 
        var storeParentId = $routeParams.id;
        if($scope.store.phone == undefined || $scope.store.phone == ''){
            $scope.createStoreError = true;
            $scope.createStoreErrorMgs = "please enter phone number"
            return false;
        }else if($scope.store.zip == undefined || $scope.store.zip == ''){
            $scope.createStoreError = true;
            $scope.createStoreErrorMgs = "please enter zip number"
            return false;
        }
        $scope.createStoreLoader = true;
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.business_name = $scope.store.business_name;
        opts.parent_store_id = storeParentId;
        opts.legal_status = $scope.store.legal_status;
        opts.business_type = $scope.store.business_type;
        opts.phone = $scope.store.phone;
        opts.email = $scope.store.email;
        opts.business_country = $scope.store.business_country;
        opts.business_region = $scope.store.business_region;
        opts.business_city = $scope.store.business_city;
        opts.business_address = $scope.store.business_address;
        opts.zip = $scope.store.zip;
        opts.province = $scope.store.province;
        opts.vat_number = $scope.store.vat_number;
        opts.iban = $scope.store.iban;
        opts.description = $scope.store.description;
        opts.map_place = document.getElementById("mapplace").value;
        opts.latitude = document.getElementById("latitude").value; 
        opts.longitude = document.getElementById("longitude").value;
        
        StoreService.createChildStore(opts, function(data) {
            if(data.code == 101 && data.message === 'success') {
                $scope.createStoreLoader = true;
                $location.path("/shope/view/"+storeParentId);
            } else {    
                $scope.createStoreLoader = false;
                $scope.createStoreError = true;
                $scope.createStoreErrorMgs = "Store can not be created due to server error";

            }
        });
    };

    $scope.resetStoreObject = function() { 
        document.getElementById("mapplace").value = '';
        document.getElementById("latitude").value = ''; 
        document.getElementById("longitude").value = '';
        $scope.store = {};
    };

    $scope.updateChildStore = function() {
        //alert("update for call")
    };

    $scope.cancelChildStore = function() {
        $scope.showEditForm = false;
        $scope.editStoreObject = {};
    };
    /*$scope.loadMap = function() {
        $scope.map = {center: {latitude: 40.1451, longitude: -99.6680 }, zoom: 4 }
        $scope.options = {scrollwheel: false};
        $scope.marker = {
            id:0,
            coords: {
                latitude: 40.1451,
                longitude: -99.6680
            },
            options: { draggable: true },
            events: {
                dragend: function (marker, eventName, args) {
                    document.getElementById("latitude").value = marker.getPosition().lat();
                    document.getElementById("longitude").value = marker.getPosition().lng();
                    $scope.mapLocation(marker.getPosition().lat(), marker.getPosition().lng());
                }
            }
        }
    };

    $scope.mapLocation = function(mapLatitude, mapLogitude) {
        var geocoder;
        geocoder = new google.maps.Geocoder();
        var latlng = new google.maps.LatLng(parseFloat(mapLatitude), parseFloat(mapLogitude));
        geocoder.geocode({'latLng': latlng}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[1]) {
                $('#mapplace').val(results[1].formatted_address);
            } else {
                alert('No results found');
            }
        } else {
            alert('Geocoder failed due to: ' + status);
        }
        });
    };

    $scope.loadMap();*/

    $scope.initialize = function () {
        var mapOptions = {
            center: new google.maps.LatLng(-33.8688, 151.2195),
            zoom: 8
        };
        var map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);

        var input = (document.getElementById('pac-input'));

        var types = document.getElementById('type-selector');
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', map);

        var infowindow = new google.maps.InfoWindow();
        var marker = new google.maps.Marker({
            map: map,
            anchorPoint: new google.maps.Point(0, -29)
        });

        google.maps.event.addListener(autocomplete, 'place_changed', function() {
            infowindow.close();
            marker.setVisible(false);
            var place = autocomplete.getPlace();
            if (!place.geometry) {
                return;
            }
            var countryPlace = autocomplete.getPlace();
            document.getElementById("latitude").value = countryPlace.geometry.location.k;
            document.getElementById("longitude").value = countryPlace.geometry.location.B;
            document.getElementById("mapplace").value = countryPlace.address_components[0].long_name;

            if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport);
            } else {
                map.setCenter(place.geometry.location);
                map.setZoom(17);  
            }
            marker.setIcon(({
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(35, 35)
            }));
            marker.setPosition(place.geometry.location);
            marker.setVisible(true);

            var address = '';
            if (place.address_components) {
                address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
                ].join(' ');
            }

            infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
            infowindow.open(map, marker);
        });

        function setupClickListener(id, types) {
            var radioButton = document.getElementById(id);
        }

        setupClickListener('changetype-all', []);
        setupClickListener('changetype-establishment', ['establishment']);
        setupClickListener('changetype-geocode', ['geocode']);
    }
    
    if(JSON.stringify(APP.currentUser) != "{}"){
        $timeout(function(){
            $scope.initialize();
        }, 1000);
    }
});

app.controller('StoreLeftController', function ($scope, $http, StoreService) {
        $scope.showLeftPanel = false;
        $scope.storeNotFound = false;
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.store_type = 2;
        opts.limit_start = '';
        opts.limit_size = '';
        StoreService.getAllStoreWithChild(opts, function(data) {  
            if(data.code == 101) {
                if(data.data.stores.length != 0 ) {
                    $scope.storeLeftList =  data.data.stores;
                    $scope.storeNotFound = false;
                }
                else {
                    $scope.storeNotFound = true;
                    $scope.storeLeftList =  data.data.stores; 
                }
            } else if(data.code == 100) { 
                $scope.storeNotFound = true;
            } else {
                $scope.storeNotFound = true;
            }
            $scope.showLeftPanel = true;
        });
});

//Controller to handle the store notiication
app.controller('StoreNotificationController', function ($scope, $http, StoreService) {
    $scope.getStoreNotification = function() {
        $scope.NotificationFound = false;
        $scope.NotificationNotFound = false;
        opts = {};
        opts.user_id = APP.currentUser.id;
        StoreService.getStoreNotifications(opts, function(data) {
            if(data.code == 101 && data.message === 'success') {
                if(data.data.length != 0) {
                    $scope.storeNotification = data.data;
                    $scope.NotificationFound = true;
                } else {
                    $scope.NotificationNotFound = true;
                }
            } else {
                $scope.NotificationNotFound = true;
            }
        });
    };

    $scope.getStoreNotification();
    $scope.AcceptRequest = function(storeId, requestId, id) {
        $("#noti-"+id).fadeOut(1000);
        opts = {};
        opts.user_id = APP.currentUser.id;
        opts.request_id = requestId;
        opts.store_id = storeId;
        opts.response = 1;
        StoreService.acceptDenyToStoreNotification(opts, function(data) {
            if(data.code == 101 && data.message === 'success') {
                $scope.getStoreNotification();
            } else {

            }
        });
    };

    $scope.rejectRequest = function(storeId, requestId, id) { 
        $("#noti-"+id).fadeOut(1000);
        opts = {};
        opts.user_id = APP.currentUser.id;
        opts.request_id = requestId;
        opts.store_id = storeId;
        opts.response = 2;
        StoreService.acceptDenyToStoreNotification(opts, function(data) {
            if(data.code == 101 && data.message === 'success') {
                $scope.getStoreNotification();
            } else {

            }
        });
    }; 

});

/**
* Controller for autocomplete functionality
*
*/
app.controller('AutocompleteController', function ($scope, $http, $timeout, StoreService) {
    $scope.searchLoading = false;
    $scope.msgAfterInvite = '';
    $scope.searchedUsers = [];
    $scope.searchUsers = function() {
        $scope.msgAfterInvite = '';
        $scope.searchLoading = true;
        if($scope.selectedCountries !== '') {
            var opts = {};
            opts.user_id = APP.currentUser.id;
            opts.friend_name = ($scope.selectedCountries === undefined ? '' : $scope.selectedCountries);
            opts.limit_start = APP.user_list_pagination.start;
            opts.limit_size = APP.user_list_pagination.end;
            StoreService.searchUser(opts, function(data) {
                $scope.searchLoading = false;
                $scope.searchedUsers = [];
                if(data.code == 101) {
                    var response = data.data.users;
                    for(var i = 0; i < data.data.users.length; i++) {
                        var user = {};
                        user.capital = response[i].user_id;
                        user.country = response[i].user_name;
                        $scope.searchedUsers.push(user);
                    }
                } else {
                    $scope.searchedUsers = [];
                }
            });
        }
    }

    $scope.InviteSendButton = false;
    $scope.onSelectPart = function() {
        $scope.InviteSendButton = true;
    };
    $scope.onSelectPartCancel = function() {
        $scope.InviteSendButton = false;
        $scope.selectedCountries = '';
    };

    $scope.SentInviteFromStore = function() {
        $scope.searchLoading = true;
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.store_id = $scope.storeDetail.id;
        opts.friend_id = $scope.selectedCountries.capital;
        StoreService.inviteUserOnStore(opts, function(data) {
            $scope.searchLoading = false;
            $scope.InviteSendButton = false;
            $scope.selectedCountries = '';
            if(data.code = 101) {
                $scope.msgAfterInvite = "The user has been succssesfully invited.";
                $timeout(function(){
                    $scope.msgAfterInvite = '';
                }, 2000);
            } else if(data.code == 118) {
                $scope.msgAfterInvite = data.message;
                $timeout(function(){
                    $scope.msgAfterInvite = '';
                }, 2000);
            } else {
                $scope.msgAfterInvite = data.message;
                $timeout(function(){
                    $scope.msgAfterInvite = '';
                }, 2000);
            }
        });
    };

});
