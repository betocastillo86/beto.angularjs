(function() {
    'use strict';

    angular
        .module('beto.core.services')
        .constant("coreTemplateService", {
            "get": function(name) {
                return '/' + app.Settings.frontViews + name + '.html';
            }
        });
})();