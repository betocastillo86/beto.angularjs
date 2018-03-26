(function(){
    'use strict';

    angular
        .module('beto.core.services')
        .factory('coreInputService', inputService);


    function inputService()
    {
        var service = {
            goToFocus: goToFocus, 
            goToFocusError: goToFocusError
        };

        return service;

        function goToFocusError() {
            goToFocus('.error', -100);
        }

        function goToFocus(selector, addPixels) {
            selector = selector || '.error';

            var obj = $(selector);
            if (!obj.length)
                return;
            if (addPixels == undefined)
                addPixels = 0;

            var position = 0;
            if (obj.offset() != undefined)
                position = obj.offset().top;
            $('html, body').animate({
                scrollTop: position + addPixels
            }, 500);
        }

        function enableLeavingPageMode($scope, $window)
        {
            if ($window.addEventListener) {
                $window.addEventListener("beforeunload", handleUnloadEvent);
            } else {
                //For IE browsers
                $window.attachEvent("onbeforeunload", handleUnloadEvent);
            }

            var offEvent = $scope.$on('$locationChangeStart', function (event) {
                var answer = confirm("¿Seguro deseas dejar esta página sin terminar el proceso?");
                if (!answer) {
                    event.preventDefault();
                }
                else
                {
                    disableEvent();
                }
            });

            var disableEvent = function()
            {
                if ($window.removeEventListener) {
                    $window.removeEventListener("beforeunload", handleUnloadEvent);
                } else {
                    $window.detachEvent("onbeforeunload", handleUnloadEvent);
                }

                if (offEvent) {
                    offEvent()
                }
            };

            return disableEvent;
        }
    }
})();