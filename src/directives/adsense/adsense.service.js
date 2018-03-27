(function(){
    'use strict';

    angular
        .module('beto.core.directives')
        .service('adsenseService', adsenseService);
    
        function adsenseService()
        {
            this.url = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
            this.isAlreadyLoaded = false;
            return this;
        }
})();