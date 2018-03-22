(function () {
    'use strict';

    angular
        .module('beto.core.services')
        .factory('coreHttpService', httpService);

    httpService.$inject = [
        '$http',
        '$q',
        '$window'];

    function httpService(
        $http,
        $q,
        $window) {

        var service = {
            post: post,
            get: get,
            put: put,
            delete: del,
            patch: patch
        };

        return service;

        function post(url, model, params) {
            var defered = $q.defer();
            var promise = defered.promise;
            $http.post(configServiceUrl(url), model, params)
                .then(GetComplete.bind(null, defered), GetFailed.bind(null, defered));
            return promise;
        }

        function get(url, model) {
            var defered = $q.defer();
            var promise = defered.promise;
            $http.get(configServiceUrl(url), model)
                .then(GetComplete.bind(null, defered), GetFailed.bind(null, defered));
            return promise;
        }

        function put(url, model, params) {
            var defered = $q.defer();
            var promise = defered.promise;
            $http.put(configServiceUrl(url), model, params)
                .then(GetComplete.bind(null, defered), GetFailed.bind(null, defered));
            return promise;
        }

        function del(url, model) {
            var defered = $q.defer();
            var promise = defered.promise;
            $http.delete(configServiceUrl(url), model)
                .then(GetComplete.bind(null, defered), GetFailed.bind(null, defered));
            return promise;
        }

        function patch(url, model, params) {
            var defered = $q.defer();
            var promise = defered.promise;
            $http.patch(configServiceUrl(url), model, params)
                .then(GetComplete.bind(null, defered), GetFailed.bind(null, defered));
            return promise;
        }

        function GetComplete(defered, response) {
            defered.resolve(response.data);
        }

        function GetFailed(defered, response) {
            defered.reject(response);
        }

        function configServiceUrl(localUrl, modalService) {
            if ($window.isIE) {
                var rdn = Math.floor(Math.random() * 600) + 1;
                var url = localUrl;
                return url.indexOf('?') > -1 ? url + '&rdn=' + rdn : url + '?rdn=' + rdn;
            } else {
                return localUrl;
            }
        }
    }
})();