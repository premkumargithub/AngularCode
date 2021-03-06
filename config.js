var APP = APP || {};
APP.keys = {
	"client_id": "1_3ofdwe6u02kgg4ock4os4okc4ss4gckc80ccw000kkc8wo4gsc",
	"client_secret": "4mjnllttzpycgss4og8koc40gk8ocskko8kc4888c08wkc4s8g",
	"grant_type": "password"
}

APP.currentUser = {};
APP.accessToken = {};

/*.......Service List ............*/
//var domain = "https://develop-sixthcontinent.rhcloud.com/develop/php/web/";
var domain = "http://54.83.205.169/sixthcontinent_symfony/php/web/";
APP.service = {
	"getAccessToken" : domain+ "oauth/v2/token",
	"logins" : domain+ "api/logins",
	"logout" : domain+ "api/logouts",
	"registration" : domain+ "webapi/register",
	"getProfile" : domain+ "api/shows",
	"viewMultiProfile" : domain+ "api/viewmultiprofiles",
	"editProfile" : domain+ "api/editmultiprofiles",
	"deleteProfile" : domain+ "api/deleteprofiles",
	"searchUser" : domain+ "api/searchusers",
	"searchFriend" : domain+ "api/searchfriends",
	"friendProfile" : domain+ "api/viewprofiles",
	"getUserGroups" : domain+ "api/getusergroups",
	"createGroup" : domain+ "api/creategroups",
	"updateGroup" : domain+ "api/updategroups",
	"deleteGroup" : domain+ "api/deleteusergroups",
	"getGroupDetail" : domain+ "api/getgroupdetails",
	"searchGroup" : domain+ "api/searchgroups",
	"joinPrivateGroup" : domain+ "api/joinprivategroups",
	"getGroupJoinNotifications" : domain+ "api/getgroupjoinnotifications",
	"joinPublicGroup" : domain+ "api/joinpublicgroups",
	"getGroupNotifications" : domain+ "api/getgroupnotifications",
	"responseGroupJoin" : domain+ "api/responsegroupjoins",
	"assignRoleToGroup" : domain+ "api/assignroletogroups",
	"sendEmailNotification" : domain+ "api/notifications",
	"getEmailNotification" : domain+ "api/getnotifications",
	"readUnreadEmailNotifications" : domain+ "api/readunreadnotifications",
	"deleteEmailNotifications" : domain+"api/deletenotifications",
	"searchEmailNotifications" : domain+"api/searchnotifications",
	"createGroupComment" : domain+"api/createcomments",
	"listGroupComments" : domain+"api/commentlists",
	"updateGroupComment" : domain+"api/commentupdates",
	"deleteGroupComment" : domain+"api/commentdeletes",
	"createGroupPost" : domain+"api/userposts",
	"listGroupPosts" : domain+"api/listposts",
	"updateGroupPost" : domain+"api/updateposts",
	"deleteGroupPost" : domain+"api/deleteposts",
	"createMessage" : domain+ "api/sends",
	"deleteMessage" : domain+ "api/deletemessages",
	"messageListing" : domain+ "api/inboxlists",
	"readMessage" : domain+ "api/readmessages",
	"replyMessage" : domain+ "api/replymessages",
	"searchMessage" : domain+ "api/listmessages",
	"updateMessage" : domain+ "api/updatemessages",
	"sendemailMessage" : domain+ "api/sendemails",
	"forgotPassword" : domain+ "webapi/forgetpassword",
	"uploadmedia" : domain+ "api/uploads",
	"listmedia" : domain+ "api/listmedia",
	"deletemedia" : domain+ "api/deletemedia",
	"searchmedia" : domain+ "api/searchmedia",
	"resetPassword" : domain+ "webapi/reset",
	"changePassword" : domain+ "api/changepasswords",
	"searchFriends" : domain+ "api/searchfriends",
	"messageInbox" : domain+ "api/listuserthreadmessages",
	"searchUserThread" : domain+ "api/searchuserthreads",
	"listusermessages" : domain+ "api/listusermessages",
	"createAlbum" : domain+ "api/createuseralbums",
	"uploadmediaAlbum" : domain+ "api/mediauploads",
	"albumListing" : domain+ "api/listuseralbums",
	"deleteAlbum" : domain+ "api/deleteuseralbums",
	"viewAlbum" : domain+ "api/viewuseralbums",
	"getStore" : domain + "api/getuserstores",
	"getStoreWithChild" : domain + "api/getuserallstores",
	"createStore" : domain + "api/createstores",
	"createChildStore" : domain + "api/createchildstores",
	"updateStore" : domain + "api/editstores",
	"deleteStore" : domain + "api/deletestores",
	"editStore" : domain + "api/editstores",
	"storeDetail" : domain + "api/storedetails",
	"searchStore" : domain + "api/searchstores",
	"countPhoto" : domain + "api/countmediauseralbums",
	"deleteMediaAlbum" : domain + "api/deletealbummedias",
	"dashboardpost" : domain + "api/dashboardposts",
	"getPendingFriendRequest" : domain + "api/pendingfriendrequests",
	"acceptDenyFriendReq" : domain + "api/responsefriendrequests",
	"deleteMediaAlbum" : domain + "api/deletealbummedias",
	"sendFriendRequests" : domain + "api/sendfriendrequests",
	"getStoreNotification" : domain + "storenotifications",
	"getStoreNotification" : domain + "storenotifications",
	"createstorealbums" : domain + "api/createstorealbums",
	"uploadstoremediaalbums" : domain + "api/uploadstoremediaalbums",
	"storealbumlists" : domain + "api/storealbumlists",
	"deletestorealbums" : domain + "api/deletestorealbums",
	"deletealbummedias" : domain + "api/deletestorealbummedias",
	"viewstorealbums" : domain + "api/viewstorealbums",
	"getStoreNotification" : domain + "api/storenotifications",
	"listDashboardPost" : domain + "api/getdashboardfeeds",
	"responseToStoreNoti" : domain + "api/responsestorejoins",
	"getPublicGroupNotification" : domain + "api/getgroupjoinnotifications",
	"getSpecificClubNotication" : domain + "api/getgroupnotifications",
	"responseClubNotification" : domain + "api/responsegroupjoins",
	"registerMultiProfile" : domain + "webapi/registermultiprofile",
	"joinPrivateGroups" : domain + "api/joinprivategroups",
	"brokerMultiprofile" : domain + "webapi/registermultiprofile", 
	"deleteDashboardPost" : domain + "api/removedashboardposts",
	"updateDashboardPost" : domain + "api/dashboardeditposts",
	"createDashboardComment" : domain + "api/dashboardcomments",
	"deleteDashboardComment" : domain + "api/dashboarddeletecomments",
	"updateDashboardComment" : domain + "api/dashboardeditcomments",
	"uploaduserprofileimages" : domain + "api/uploaduserprofileimages",
	"viewmultiprofiles" : domain + "api/viewmultiprofiles",
	"getCountryList" : domain + "webapi/countrylist",
	"deletePostMedia" : domain + "api/removemediaposts",
	"setStoreProfileImage" : domain + "api/setstoreprofileimages",
	"uploadStoreProfileimage" : domain + "api/uploadstoreprofileimages",
	"setuserprofileimages" : domain + "api/setuserprofileimages",
	"inviteUserOnStore" : domain + "api/invitestoreusers",
	"listunreadmessages" : domain + "api/listunreadmessages",
	"markreadallmessages" : domain + "api/markreadallmessages",
	"createStorePost" : domain + "api/storeposts",
	"listStorePost" : domain + "api/liststoreposts",
	"updateStorePost" : domain + "api/updatestoreposts",
	"deleteStorePost" : domain + "api/deletestoreposts",
	"createStoreComment" : domain + "api/storecomments",
	"listStoreComment" : domain + "api/liststorecomments",
	"updateStoreComment" : domain + "api/storeeditcomments",
	"deleteStoreComment" : domain + "api/removestorecomments",
	"deleteStoreMediaComment" : domain + "api/removemediacomments",
	"deleteStoreMediasPost" : domain + "api/deletepostmedias",
	"createClubAlbum" : domain + "api/creategroupalbums",
	"deleteClubAlbum" : domain + "api/deletegroupalbums",
	"getClubAlbums" : domain + "api/groupalbumlists",
	"viewClubAlbum" : domain + "api/viewgroupalbums",
	"deleteClubAlbumMedia" : domain + "api/deletegroupalbummedias",
	"uploadMediaInClubAlbum" : domain + "api/uploadgroupmediaalbums",
	"getDashboardComments" : domain + "api/getdashboardcomments",
	"setClubProfileImage" : domain + "api/setclubprofileimages",
	"uploadClubCover" : domain + "api/uploadclubprofileimages",
	"setUserProfileCover" : domain + "api/setusercoverimages",
	"dashboardMediaDeleteComments" : domain + "api/dashboardmedaideletecomments"
};

APP.group_pagination = {
	start : 0,
	end : 12
};

APP.clubAlbum_pagination = {
	start : 0,
	end : 30
};

APP.user_list_pagination = {
	start : 0,
	end : 12
};

APP.store_list_pagination = {
	start : 0,
	end : 12
};

APP.message_list_pagination = {
	start : 0,
	end : 12
};

APP.friend_list_pagination = {
	start : 0,
	end : 12
};



var roleToGroupOptions = [
	{'name': 'Admin', 'id': '2'},
	{'name': 'Friend', 'id': '3'},
	];

APP.siteTitle = "SixthContinent";

APP.groupRole = [
    {roleValue: 0, roleTitle: 'Select'},
    {roleValue: 7, roleTitle: 'Admin'},
    {roleValue: 1, roleTitle: 'Friend'}
    ];

APP.groupTypes = [
    {groupTypeID: 0, groupTypeTitle: 'Select'},
    {groupTypeID: 1, groupTypeTitle: 'Public'},
    {groupTypeID: 2, groupTypeTitle: 'Private'}
    ];

APP.dashbord_pagination = {
	start : 0,
	end : 20
};


APP.countries = [{id :"AF" , country:"Afghanistan"},
  						{id : "AX",country : "Åland Islands"},
						{id :"AL" , country:"Albania"},
						{id :"DZ" , country:"Algeria"},
						{id :"AS" , country:"American Samoa"},
						{id :"AD" , country:"Andorra"},
						{id :"AO" , country:"Angola"},
						{id :"AI" , country:'Anguilla'},
						{id :"AQ" , country:'Antarctica'},
						{id :'AG' , country:"Antigua and Barbuda"},
						{id :'AR' , country:'Argentina'},
						{id :'AM' , country:'Armenia'},
						{id :'AW' , country:"Aruba"},
						{id :'AU' , country:"Australia"},
						{id :'AT' , country:"Austria"},
						{id :'AZ' , country:"Azerbaijan"},
						{id :'BS' , country:"Bahamas"},
						{id :'BH' , country:"Bahrain"},
						{id :'BD' , country:"Bangladesh"},
						{id :'BB' , country:"Barbados"},
						{id :'BY' , country:"Belarus"},
						{id :'BE' , country:"Belgium"},
						{id :'BZ' , country:"Belize"},
						{id :'BJ' , country:"Benin"},
						{id :'BM' , country:"Bermuda"},
						{id :'BT' , country:"Bhutan"},
						{id :'BO' , country:"Bolivia"},
						{id :'BA' , country:"Bosnia and Herzegovina"},
						{id :'BW' , country:"Botswana"},
						{id :'BV' , country:"Bouvet Island"},
						{id :'BR' , country:"Brazil"},
						{id :'IO' , country:"British Indian Ocean Territory"},
						{id :'BN' , country:"Brunei Darussalam"},
						{id :'BG', country:"Bulgaria"},
						{id :'BF' , country:"Burkina Faso"},
						{id :'BI' , country:"Burundi"},
						{id :'KH' , country:"Cambodia"},
						{id :'CM' , country:"Cameroon"},
						{id :'CA' , country:"Canada"},
						{id :'CV' , country:"Cape Verde"},
						{id :'KY' , country:"Cayman Islands"},
						{id :'CF' , country:"Central African Republic"},
						{id :'TD' , country:"Chad"},
						{id :'CL' , country:"Chile"},
						{id :'CN' , country:"China"},
						{id :'CX' , country:"Christmas Island"},
						{id :'CC' , country:"Cocos (Keeling) Islands"},
						{id :'CO' , country:"Colombia"},
						{id :'KM' , country:"Comoros"},
						{id :'CG' , country:"Congo"},
						{id :'CD' , country:"Congo, The Democratic Republic of The"},
						{id :'CK' , country:"Cook Islands"},
						{id :'CR' , country:"Costa Rica"},
						{id :'CI' , country:"Cote D'ivoire"},
						{id :'HR' , country:"Croatia"},
						{id :'CU' , country:"Cuba"},
						{id :'CY' , country:"Cyprus"},
						{id :'CZ' , country:"Czech Republic"},
						{id :'DK' , country:"Denmark"},
						{id :'DJ' , country:"Djibouti"},
						{id :'DM' , country:"Dominica"},
						{id :'DO' , country:"Dominican Republic"},
						{id :'EC' , country:"Ecuador"},
						{id :'EG' , country:"Egypt"},
						{id :'SV' , country:"El Salvador"},
						{id :'GQ' , country:"Equatorial Guinea"},
						{id :'ER' , country:"Eritrea"},
						{id :'EE' , country:"Estonia"},
						{id :'ET' , country:"Ethiopia"},
						{id :'FK' , country:"Falkland Islands (Malvinas)"},
						{id :'FO' , country:"Faroe Islands"},
						{id :'FJ' , country:"Fiji"},
						{id :'FI' , country:"Finland"},
						{id :'FR' , country:'France'},
						{id :'GF' , country:"French Guiana"},
						{id :'PF' , country:"French Polynesia"},
						{id :'TF' , country:"French Southern Territories"},
						{id :'GA' , country:"Gabon"},
						{id :'GM' , country:"Gambia"},
						{id :'GE' , country:"Georgia"},
						{id :'DE' , country:"Germany"},
						{id :'GI' , country:"Gibraltar"},
						{id :'GR' , country:"Greece"},
						{id :'GL' , country:"Greenland"},
						{id :'GD' , country:"Grenada"},
						{id :'GP' , country:"Guadeloupe"},
						{id :'GU' , country:"Guam"},
						{id :'GT' , country:"Guatemala"},
						{id :'GG' , country:"Guernsey"},
						{id :'GN' , country:"Guinea"},
						{id :'GW' , country:"Guinea-bissau"},
						{id :'GY' , country:"Guyana"},
						{id :'HT' , country:"Haiti"},
						{id :'HM' , country:"Heard Island and Mcdonald Islands"},
						{id :'VA' , country:"Holy See (Vatican City State)"},
						{id :'HN' , country:"Honduras"},
						{id :'HK' , country:"Hong Kong"},
						{id :'HU' , country:"Hungary"},
						{id :'IS' , country:"Iceland"},
						{id :'IN' , country:"India"},
						{id :'ID' , country:"Indonesia"},
						{id :'IR' , country:"Iran, Islamic Republic of"},
						{id :'IQ' , country:"Iraq"},
						{id :'IE' , country:"Ireland"},
						{id :'IM' , country:"Isle of Man"},
						{id :'IL' , country:"Israel"},
						{id :'IT' , country:"Italy"},
						{id :'JM' , country:"Jamaica"},
						{id :'JP' , country:"Japan"},
						{id :'JE' , country:"Jersey"},
						{id :'JO' , country:"Jordan"},
						{id :'KZ' , country:"Kazakhstan"},
						{id :'KE' , country:"Kenya"},
						{id :'KI' , country:"Kiribati"},
						{id :'KP' , country:"Korea, Democratic People's Republic of"},
						{id :'KR' , country:"Korea, Republic of"},
						{id :'KW' , country:"Kuwait"},
						{id :'KG' , country:"Kyrgyzstan"},
						{id :'LA' , country:"Lao People's Democratic Republic"},
						{id :'LV' , country:"Latvia"},
						{id :'LB' , country:"Lebanon"},
						{id :'LS' , country:"Lesotho"},
						{id :'LR' , country:"Liberia"},
						{id :'LY' , country:"Libyan Arab Jamahiriya"},
						{id :'LI' , country:"Liechtenstein"},
						{id :'LT' , country:"Lithuania"},
						{id :'LU' , country:"Luxembourg"},
						{id :'MO' , country:"Macao"},
						{id :'MK' , country:"Macedonia, The Former Yugoslav Republic of"},
						{id :'MG' , country:"Madagascar"},
						{id :'MW' , country:"Malawi"},
						{id :'MY' , country:"Malaysia"},
						{id :'MV' , country:"Maldives"},
						{id :'ML' , country:"Mali"},
						{id :'MT' , country:"Malta"},
						{id :'MH' , country:'Marshall Islands'},
						{id :'MQ' , country:"Martinique"},
						{id :'MR' , country:"Mauritania"},
						{id :'MU' , country:"Mauritius"},
						{id :'YT' , country:"Mayotte"},
						{id :'MX' , country:"Mexico"},
						{id :'FM' , country:"Micronesia, Federated States of"},
						{id :'MD' , country:"Moldova, Republic of"},
						{id :'MC' , country:"Monaco"},
						{id :'MN' , country:"Mongolia"},
						{id :'ME' , country:"Montenegro"},
						{id :'MS' , country:"Montserrat"},
						{id :'MA' , country:'Morocco'},
						{id :'MZ' , country:"Mozambique"},
						{id :'MM' , country:"Myanmar"},
						{id :'NA' , country:"Namibia"},
						{id :'NR' , country:"Nauru"},
						{id :'NP' , country:"Nepal"},
						{id :'NL' , country:"Netherlands"},
						{id :'AN' , country:"Netherlands Antilles"},
						{id :'NC' , country:"New Caledonia"},
						{id :'NZ' , country:"New Zealand"},
						{id :'NI' , country:"Nicaragua"},
						{id :'NE' , country:"Niger"},
						{id :'NG' , country:"Nigeria"},
						{id :'NU' , country: "Niue"},
						{id :'NF' , country:"Norfolk Island"},
						{id :'MP' , country:"Northern Mariana Islands"},
						{id :'NO' , country:"Norway"},
						{id :'OM' , country:"Oman"},
						{id :'PK' , country:"Pakistan"},
						{id :'PW' , country:"Palau"},
						{id :'PS' , country:"Palestinian Territory, Occupied"},
						{id :'PA' , country:"Panama"},
						{id :'PG' , country:"Papua New Guinea"},
						{id :'PY' , country:"Paraguay"},
						{id :'PE' , country:"Peru"},
						{id :'PH' , country:"Philippines"},
						{id :'PN' , country:"Pitcairn"},
						{id :'PL' , country:"Poland"},
						{id :'PT' , country:"Portugal"},
						{id :'PR' , country:"Puerto Rico"},
						{id :'QA' , country:"Qatar"},
						{id :'RE' , country:"Reunion"},
						{id :'RO' , country:"Romania"},
						{id :'RU' , country:"Russian Federation"},
						{id :'RW' , country:"Rwanda"},
						{id :'SH' , country:"Saint Helena"},
						{id :'KN' , country:"Saint Kitts and Nevis"},
						{id :'LC' , country:"Saint Lucia"},
						{id :'PM' , country:"Saint Pierre and Miquelon"},
						{id :'VC' , country:"Saint Vincent and The Grenadines"},
						{id :'WS' , country:"Samoa"},
						{id :'SM' , country:"San Marino"},
						{id :'ST' , country:"Sao Tome and Principe"},
						{id :'SA' , country:"Saudi Arabia"},
						{id :'SN' , country:"Senegal"},
						{id :'RS' , country:"Serbia"},
						{id :'SC' , country:"Seychelles"},
						{id :'SL' , country:"Sierra Leone"},
						{id :'SG' , country:"Singapore"},
						{id :'SK' , country:'Slovakia'},
						{id :'SI' , country:"Slovenia"},
						{id :'SB' , country:"Solomon Islands"},
						{id :'SO' , country:"Somalia"},
						{id :'ZA' , country:"South Africa"},
						{id :'GS' , country:"South Georgia and The South Sandwich Islands"},
						{id :'ES' , country:"Spain"},
						{id :'LK' , country:"Sri Lanka"},
						{id :'SD' , country:"Sudan"},
						{id :'SR' , country:"Suriname"},
						{id :'SJ' , country:"Svalbard and Jan Mayen"},
						{id :'SZ' , country:"Swaziland"},
						{id :'SE' , country:"Sweden"},
						{id :'CH' , country:"Switzerland"},
						{id :'SY' , country:"Syrian Arab Republic"},
						{id :'TW' , country:"Taiwan, Province of China"},
						{id :'TJ' , country:"Tajikistan"},
						{id :'TZ' , country:"Tanzania, United Republic of"},
						{id :'TH' , country:'Thailand'},
						{id :'TL' , country:"Timor-leste"},
						{id :'TG' , country:"Togo"},
						{id :'TK' , country:"Tokelau"},
						{id :'TO' , country:"Tonga"},
						{id :'TT' , country:"Trinidad and Tobago"},
						{id :'TN' , country:"Tunisia"},
						{id :'TR' , country:"Turkey"},
						{id :'TM' , country:"Turkmenistan"},
						{id :'TC' , country:"Turks and Caicos Island"},
						{id :'TV' , country:"Tuvalu"},
						{id :'UG' , country:"Uganda"},
						{id :'UA' , country:"Ukraine"},
						{id :'AE' , country:"United Arab Emirates"},
						{id :'GB' , country:"United Kingdom"},
						{id :'US' , country:"United States"},
						{id :'UM' , country:"United States Minor Outlying Islands"},
						{id :'UY' , country:"Uruguay"},
						{id :'UZ' , country:"Uzbekistan"},
						{id :'VU' , country:"Vanuatu"},
						{id :'VE' , country:"Venezuela"},
						{id :'VN' , country:"Viet Nam"},
						{id :'VG' , country:"Virgin Islands, British"},
						{id :'VI' , country:"Virgin Islands, U.S."},
						{id :'WF' , country:"Wallis and Futuna"},
						{id :'EH' , country:'Western Sahara'},
						{id :'YE' , country:'Yemen'},
						{id :'ZM' , country:'Zambia'},
						{id :'ZW' , country:'Zimbabwe'}];
