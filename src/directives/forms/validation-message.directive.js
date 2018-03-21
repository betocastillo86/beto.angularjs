(function () {
    'use strict';

    angular.module('beto.core.directives')
        .directive('coreValidationMessage', hostValidationMessage);

    function hostValidationMessage() {
        var directive = {
            restrict: 'E',
            template: '<ul class="parsley-errors-list filled" ng-if="form.$submitted && !field.$valid"><li class="parsley-required">{{getMessage(field)}}</li></ul>',
            scope: {
                form: '=',
                field: '=',
                otherValue: '@otherValue',
                name: '@'
            },
            link: link
        };

        return directive;

        function link(scope, element, attrs) {
            scope.getMessage = getMessage;

            function getMessage(field) {
                var fieldName = scope.name ? 'Campo ' + scope.name : 'Campo';

                if (!field.$valid && field.$error) {
                    if (field.$error['required']) {
                        return fieldName + ' es obligatorio';
                    }
                    else if (field.$error['email']) {
                        return fieldName + ' no es un correo valido';
                    }
                    else if (field.$error['min']) {
                        return fieldName + ' no puede ser menor a ' + scope.field.$$attr.ngMin;
                    }
                    else if (field.$error['max']) {
                        return fieldName + ' no puede ser mayor a ' + scope.field.$$attr.ngMax;
                    }
                    else if (field.$error['maxlength']) {
                        return fieldName + ' excede los ' + scope.field.$$attr.ngMaxlength + ' caracteres.';
                    }
                    else if (field.$error['minlength']) {
                        return fieldName + ' debe tener al menos ' + scope.field.$$attr.ngMinlength + ' caracteres.';
                    }
                    else if (field.$error['compareTo']) {
                        if (scope.otherValue) {
                            return fieldName + ' debe ser igual al campo ' + scope.otherValue + ' .';
                        }
                        else {
                            return fieldName + ' no es igual';
                        }
                    }
                    else {
                        return fieldName + ' invalido';
                    }
                }
            }
        }
    }

})();