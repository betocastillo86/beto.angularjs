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
            if (params && params.showLoading) {
                addLoading();
            }

            var defered = $q.defer();
            var promise = defered.promise;
            $http.post(configServiceUrl(url), model, params)
                .then(GetComplete.bind(null, defered, params), GetFailed.bind(null, defered, params));
            return promise;
        }

        function get(url, model, params) {
            if (params && params.showLoading) {
                addLoading();
            }

            var defered = $q.defer();
            var promise = defered.promise;
            $http.get(configServiceUrl(url), model)
                .then(GetComplete.bind(null, defered, params), GetFailed.bind(null, defered, params));
            return promise;
        }

        function put(url, model, params) {
            if (params && params.showLoading) {
                addLoading();
            }

            var defered = $q.defer();
            var promise = defered.promise;
            $http.put(configServiceUrl(url), model, params)
                .then(GetComplete.bind(null, defered, params), GetFailed.bind(null, defered, params));
            return promise;
        }

        function del(url, model, params) {
            if (params && params.showLoading) {
                addLoading();
            }

            var defered = $q.defer();
            var promise = defered.promise;
            $http.delete(configServiceUrl(url), model)
                .then(GetComplete.bind(null, defered, params), GetFailed.bind(null, defered, params));
            return promise;
        }

        function patch(url, model, params) {
            if (params && params.showLoading) {
                addLoading();
            }

            var defered = $q.defer();
            var promise = defered.promise;
            $http.patch(configServiceUrl(url), model, params)
                .then(GetComplete.bind(null, defered, params), GetFailed.bind(null, defered, params));
            return promise;
        }

        function GetComplete(defered, params, response) {
            if (params && params.showLoading) {
                hideLoading();
            }

            defered.resolve(response.data);
        }

        function GetFailed(defered, params, response) {
            if (params && params.showLoading) {
                hideLoading();
            }

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

        function addLoading() {
            var el = document.getElementsByClassName('loading')[0];

            if (!el) {
                el = document.createElement('div');
                el.classList.add('loading');
                (document.getElementsByTagName('body')[0]).appendChild(el);
            }

            el.style.display = 'block';
        }

        function hideLoading() {
            var el = document.getElementsByClassName('loading')[0];
            if (el) {
                el.style.display = 'none';
            }
        }
    }
})();