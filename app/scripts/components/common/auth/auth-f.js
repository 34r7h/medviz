/**
 * @ngdoc service
 * @name medviz.Auth
 * @description
 * # Auth
 * Factory in the medviz.
 */
angular.module('medviz')
    .factory('Auth', function (Firebase, $rootScope, $state, $stateParams, Data)
    {
        'use strict';

        // INITIALIZATION
	    var ref = new Firebase('https://medviz.firebaseio.com');
	    function newUser(name, role, email, password){
	        // TODO set-up index
            ref.createUser({
	              name     : name,
	              role     : role,
                email    : email,
                password : password
            }, function(error, userData) {
                if (error) {
                    console.log('Error creating user:', error);
                } else {
                    console.log("Successfully created user account with uid:", userData.uid);
                    console.log(userData);

                    var addUser = ref.child('users');
	                  var addUserIndex = ref.child('index/users');
		                var newUser = {
			                name: name,
			                role: role,
			                uid: userData.uid,
			                email: email
		                };
                    var theUser = addUser.push(newUser, function(error){
	                    if(error){
		                    console.log('No user data written');
	                    } else {
		                    var id = theUser.key();
		                    console.log('User created');
		                    angular.forEach(newUser, function(prop, key){
			                    if(prop && prop.length>2){
				                    var cleanProp = prop.toLowerCase().replace(/'+/g, '').replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "-").replace(/^-+|-+$/g, '');
				                    addUserIndex.child(key+'/'+cleanProp).push(id);
			                    }
		                    });
/*
		                    addUserIndex.child(userData.uid).push(id);
*/
	                    }
                    });

                }
            });
        }
	    function login(email, pass) {
		    ref.authWithPassword({email:email,password:pass}, function(error, authData){
			    if (error) {
				    console.log(error);
			    } else {
				    console.log('signed in as',authData.uid);
				    var uid = authData.uid.toLowerCase().replace(/'+/g, '').replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "-").replace(/^-+|-+$/g, '');
				    angular.forEach(Data.dataObject.index.users.uid[uid],function(id, key){
					    $rootScope.role = Data.dataObject.users[id].role;
					    $rootScope.auth = {authData:authData, id:id, role:Data.dataObject.users[id].role};
				    });
				    if($rootScope.auth.role === 'rep'){
					    $state.go('medviz.client');
				    } else if ($rootScope.auth.role === 'customer') {
					    $state.go('medviz.admin')
				    } else {
					    $state.reload();
				    }
			    }
		    });
	    }
	    function logout(){ref.unauth();$state.go($state.current, {}, {reload: true});}
	    function authCheck(){return ref.getAuth();}


        // ACTUAL DEFINITION
        var service = {
		        newUser: newUser,
		        login: login,
            logout: logout,
            authCheck: authCheck
        };

        return service;
    });