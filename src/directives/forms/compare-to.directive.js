(function () {
    'use strict';

    angular
        .module('beto.core.directives')
        .directive('coreCompareTo', compareTo);

    function compareTo() {
        return {
            require: 'ngModel',
            scope: {
                otherValue: '=coreCompareTo'
            },
            link: function (scope, element, attributes, ngModel) {
                ngModel.$validators.coreCompareTo = function (modelValue) {
                    return modelValue === scope.otherValue;
                }

                scope.$watch('otherValue', function () {
                    ngModel.$validate();
                });
            }
        };
    }
})();