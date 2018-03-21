(function () {
    'use strict';

    angular
        .module('beto.core.services')
        .factory('coreExceptionService', exceptionService);

    exceptionService.$inject = ['modalService'];

    function exceptionService(modalService) {
        var service = {
            handle: handle
        };

        function handle(exception) {
            if (exception.status == 500) {
                modalService.showError({ message: 'Ha occurrido un error inesperado. Intenta de nuevo' });
            }
            else if (exception.status == 403) {
                modalService.showError({ message: 'No tienes permisos para acceder a esta funcionalidad' });
            }
            else if (exception.status == 401) {
                modalService.showError({ message: 'Debes estar autenticado para realizar esta acción' });
            }
            else {
                if (exception.data) {
                    modalService.showError({ error: exception.data.error });
                }
                else {
                    console.log("error por enviar");
                }
            }

            console.log(exception);
        }

        return service;
    }
})();