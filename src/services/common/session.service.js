(function () {
    'use strict';

    angular
        .module('beto.core.services')
        .factory('coreSessionService', sessionService);

    sessionService.$inject = ['$localStorage'];

    function sessionService($localStorage) {
        var service = {
            setCurrentUser: setCurrentUser,
            removeCurrentUser: removeCurrentUser,
            getCurrentUser: getCurrentUser,
            getToken: getToken,
            isAuthenticated: isAuthenticated,
            isAdmin: isAdmin,
			hasPermission: hasPermission
        };

        return service;

        function setCurrentUser(currentUser) {
            $localStorage.currentUser = currentUser;
        }

        function getCurrentUser() {
            return $localStorage.currentUser;
        }

        function removeCurrentUser() {
            $localStorage.$reset({ currentUser: undefined });
        }

        function getToken() {
            return $localStorage.currentUser ? $localStorage.currentUser.token : undefined;
        }

        function isAuthenticated() {
            return $localStorage.currentUser !== undefined;
        }

        function isAdmin() {
            return getCurrentUser().role === 'Admin';
        }
		
		function hasPermission(permisssion) {
            var currentUser = sessionService.getCurrentUser();
            for (var i = 0; i < currentUser.permissions.length; i++) {
                if (currentUser.permissions[i] == permission) {
                    return true;
                }
            }
			return false;
        }
    }
})();
