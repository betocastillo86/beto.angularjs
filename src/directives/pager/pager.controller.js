(function() {
    
        angular.module('beto.core.directives')
            .controller('PagerController', PagerController);
    
        function PagerController() {
            var vm = this;
            vm.pages = [];
    
            vm.previousPage = previousPage;
            vm.getTotalPages = getTotalPages;
            vm.changePage = changePage;
            vm.showPage = showPage;
    
            function getTotalPages() {
                vm.totalPages = Math.ceil(vm.model.totalCount / vm.model.pageSize);
                vm.pages = new Array(vm.totalPages);
                return vm.totalPages;
            }
    
            function showPage(page) {
                if (vm.totalPages > 6) {
                    if (vm.model.page < 3 || vm.model.page > vm.totalPages - 3) {
                        return page > vm.totalPages - 3 || page < 4 || page == vm.model.page - 1;
                    }
                    else {
                        return page > vm.model.page - 3 && (page < vm.model.page + 2 || page > vm.totalPages - 3);
                    }
                }
                else {
                    return true;
                }
            }
    
            function previousPage() {
                if (vm.model.page > 0) {
                    changePage(vm.model.page - 1);
                }
            }
    
            function changePage(page) {
                vm.model.page = page;
                vm.pageChanged({page: page});
            }
            
        }
    })();