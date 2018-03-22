(function() {
    angular.module('beto.core.directives')
        .directive('corePager', listPager);

    listPager.$inject = ['coreTemplateService'];

    function listPager(templateService) {
        var directive = {
            restrict: 'E',
            templateUrl: templateService.get('pager/pager'),
            controller: 'PagerController',
            controllerAs: 'pager',
            scope: {
                model: '=',
                pageChanged: '&'
            },
            bindToController: true
        };

        return directive;
    };
})();