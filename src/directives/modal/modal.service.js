(function () {
    'use strict';

    angular
        .module('beto.core.directives')
        .factory('coreModalService', modalService);

    modalService.$inject = [
        '$q',
        '$templateRequest', 
        '$rootScope', 
        '$compile', 
        '$controller', 
        '$document', 
        '$location', 
        '$timeout',
        'coreTemplateService'];

    function modalService(
        $q,
        $templateRequest, 
        $rootScope, 
        $compile, 
        $controller, 
        $document, 
        $location, 
        $timeout,
        templateService) {

        var vm = this;
        vm.show = show;
        vm.showError = showError;
        vm.showDialog = showDialog;

        var defaultOptions = {
            modalType: 'default',
            scope: $rootScope,
            controllerAs: 'modal',
            title: 'Mensaje',
            image: undefined,
            redirectAfterClose: undefined,
            closed: undefined,
            onClosed: undefined,
            autoClose: 0
        };

        return vm;

        //searches the template by the modal type
        function getTemplate(templateUrl) {
            var deferred = $q.defer();

            $templateRequest(templateUrl, true)
                .then(templateCompleted)
                .catch(consoleError);

            return deferred.promise;

            function templateCompleted(template) {
                deferred.resolve(template);
            }
        }

        function consoleError() {

        }

        function show(options) {

            var deferred = $q.defer();

            //loads the defaults options
            options = _.defaults(options, defaultOptions);

            if (options.template) {
                getTemplate(options.template)
                    .then(templateLoaded)
                    .catch(consoleError);
            }
            else {
                getTemplate(templateService.get('modal/modal-' + options.modalType))
                    .then(templateLoaded)
                    .catch(consoleError);
            }

            return deferred.promise;


            function templateLoaded(template) {
                
                //creates an scope
                var scope = options.scope.$new();

                //if the location changes then closes the modal
                var rootScopeOnClose = $rootScope.$on('$locationChangeSuccess', close);

                //compiles the themplate
                var templateCompiled = $compile(template);
                var modalElement = templateCompiled(scope);

                scope.close = close;
                scope.message = options.message;
                scope.title = options.title;
                scope.image = options.image;
                scope.large = options.large;
                scope.params = options.params;

                //injected properties of the new controller
                var inputs = {
                    $scope: scope
                };

                var controllerObjBefore = scope[options.controllerAs];

                var controller = $controller(getControllerName(options), inputs, false, options.controllerAs);

                if (options.controllerAs && controllerObjBefore) {
                    angular.extend(controller, controllerObjBefore);
                }

                var body = angular.element($document[0].body);
                appendElement(body, modalElement);

                var closeDeferred = $q.defer();
                var closedDeferred = $q.defer();

                var modal = {
                    controller: controller,
                    scope: scope,
                    element: modalElement,
                    close: closeDeferred.promise,
                    closed: closedDeferred.promise,
                    autoClose: options.autoClose
                };

                modal.element.on('hidden.bs.modal', function () {
                    console.log('Entra al evento de cerrado');
                    close({ previousClosed: true });
                })
                //calls the modal before resolving promise
                if (!modal.element.modal) {
                    modal.element = angular.element(modal.element);
                }

                modal.element.modal();

                validateZindex();

                validateAutoClose();

                deferred.resolve(modal);

                function close(result) {
                    closeDeferred.resolve(result);

                    if (!result.previousClosed) {
                        modal.element.off('hidden.bs.modal');
                        modal.element.modal('hide');
                        modal.element.data('bs.modal').$backdrop.remove();
                    }

                    scope.$destroy();
                    closedDeferred.resolve(result);

                    if (options.closed) {
                        options.closed(result);
                    }

                    // remove event watcher
                    rootScopeOnClose && rootScopeOnClose();

                    if (options.redirectAfterClose) {
                        $rootScope.$apply(function(){
                            $location.path(options.redirectAfterClose);
                        });
                    }

                    $(modal.element).data('bs.modal', null).remove();

                    if (document.getElementsByClassName('modal').length) {
                        document.body.classList.add('modal-open');
                    }
                }

                function validateZindex()
                {
                    var modals = $('.modal');
                    if(modals.length > 1)
                    {
                        var backgrous = $('.modal-backdrop');
                        for (var i = 0; i < modals.length; i++) {
                            var modal = $(modals[i]);
                            var backgroud = backgrous[i];
                            var newZIndex = parseInt(modal.css('zIndex')) + (i * 10)
                            modal.css('zIndex', newZIndex);
                            backgroud.style.zIndex = newZIndex - 1;
                        }
                    }
                }

                function validateAutoClose(modal)
                {
                    if(modal.autoClose > 0)
                    {
                        $timeout(close(), modal.autoClose);
                    }
                }

                function appendElement(parent, child) {
                    //var children = parent.children();
                    //if (children.length > 0) {
                    //    return children[children.length - 1].append(child);
                    //}
                    //else {
                    //    return parent.append(child);
                    //}
                    return parent.append(child);
                }

                function getControllerName() {
                    if (options.controller) {
                        return options.controller;
                    }
                    else {
                        var modalType = options.modalType.toLowerCase();
                        switch (modalType) {
                            case 'dialog':
                                return 'ModalDialogController';
                            case 'default':
                            default:
                                return 'ModalDefaultController';
                        }
                    }
                }
            }
        }

        

        function showError(options) {
            var options = options || {};
            options.modalType = 'error';
            options.title = options.title || 'Error';

            //if it has an error shows the especific message
            if (options.error) {
                var message = '';
                var error = options.error;
                if (error.code === 'BadArgument') {
                    //validates the details to attatch to message
                    if (error.details) {
                        message = _.pluck(error.details, 'message').join('<br>');
                    }
                    else {
                        message = error.message || 'Algunos datos son invalidos';
                    }
                }
                else if (error.code === 'InvalidForeignKey') {
                    message = 'El campo ' + error.target + ' que intenta relacionar no existe';
                }
                else {
                    message = error.message;
                }

                options.message = message;
            }

            return show(options);
        }

        function showDialog(options) {
            var options = options || {};
            options.modalType = 'dialog';
            options.title = options.title || 'Importante';
            return show(options);
        }
    }    
    
})();
