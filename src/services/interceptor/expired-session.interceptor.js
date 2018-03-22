(function () {
    angular.module('beto.core.services')
        .factory('coreExpiredSessionInterceptor', expiredSessionInterceptor);

    expiredSessionInterceptor.$inject = [
        '$q',
        '$location',
        'routingService',
        'coreSessionService'];

    function expiredSessionInterceptor($q, $location, routingService, sessionService) {
        var interceptor = {
            responseError: responseError
        };

        return interceptor;

        function responseError(response) {
            if (response.status == 401) {
                sessionService.removeCurrentUser();
                $location.path(routingService.getRoute('closedsession'));
                return;
            }

            return $q.reject(response);
        }
    }

})();