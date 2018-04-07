(function () {
    'use strict';

    angular
        .module('beto.core.directives')
        .controller('ModalDefaultController', ModalDefaultController);

    ModalDefaultController.$inject = ['$scope'];

    function ModalDefaultController($scope) {
        var vm = this;
        vm.title = $scope.title;
        vm.message = $scope.message;
        vm.large = $scope.large;
        vm.image = $scope.image;
        vm.params = $scope.params;

        vm.close = close;

        function close() {
            $scope.close({ accept: true });
        }
    }
})();