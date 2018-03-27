(function () {
    'use strict';
    
    angular
        .module('beto.core.directives')
        .directive('coreAdsense', coreAdsense);

    coreAdsense.$inject = ['$timeout'];
    
    function coreAdsense($timeout) {
        var directive = {
            restrict: 'A',
            scope: {
                adClass: '@',
                adClient: '@',
                adSlot: '@',
                adFormat: '@'
            },
            template: '<ins class="adsbygoogle" style="display:block" ' + (app.Settings.isDebug ? 'data-ad-test="on" data-adtest="on"' : '') +' data-ad-client="{{adClient}}" data-ad-slot="{{adSlot}}" data-ad-format="{{adFormat}}"></ins>',
            link: link
        };

        function link(scope, element, attrs)
        {
            if (!app.Settings.general.adsenseEnabled) {
                element.remove();
            }
            else
            {
                if (element[0].offsetWidth) {
                    console.log("registra " + element[0].offsetWidth, attrs.adSlot);
                        
                    $timeout(function () {
                        console.log("registre google");
                        (adsbygoogle = window.adsbygoogle || []).push({});
                    }, 500);
                }
                else {
                    console.log("elimina " + element[0].offsetWidth, attrs.adSlot);
                    element.remove();
                }

            }
        }

        return directive;
    }
})();