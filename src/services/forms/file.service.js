(function () {

    'use strict';

    angular.module('beto.core.services')
        .factory('coreFileService', fileService);

    fileService.$inject = ['$http', '$q', 'coreHttpService'];

    function fileService($http, $q, http) {
        return {
            post: post
        };

        function post(url, file, name, callback, indexFile) {
            var defered = $q.defer();
            var promise = defered.promise;
            
            var fd = new FormData();
            fd.append('files', file);
            fd.append('name', name ? name : file.name);

            $http({
                method: 'POST',
                url: url,
                headers: { 'Content-Type': undefined },
                uploadEventHandlers: {
                    progress: function (object) {
                        try {
                            var prog = Math.ceil((object.loaded / object.total) * 100);
                            if (callback) {
                                callback.call(this, prog, indexFile);
                            }
                        } catch (e) {
                        }
                    }
                },
                data: fd,
                transformRequest: angular.identity
            })
            .then(postCompleted.bind(null, defered), postError.bind(null, defered));

            function postCompleted(defered, response) {

                if (callback) {
                    callback.call(this, 101, indexFile);
                }

                defered.resolve(response.data);
            }

            function postError(defered, response) {
                defered.reject(response);
            }

            return promise;
        }
    }
})();