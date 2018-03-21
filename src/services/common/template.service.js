(function() {
    'use strict';

    angular
        .module('hostaliandoServices')
        .constant("coreTemplateService", {
            "get": function(name) {
                return '/' + name + '.html';
            }
        });
})();