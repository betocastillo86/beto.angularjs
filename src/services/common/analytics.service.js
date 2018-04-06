(function () {
    'use strict';

    angular
        .module('beto.core.services')
        .factory('coreAnalyticsService', analyticsService);

        analyticsService.$inject = [
        '$window'];

    function analyticsService($window) {
        var service = {
            trackVisit: trackVisit,
            trackGoal: trackGoal
        };

        return service;

        function trackVisit(thewindow, thelocation)
        {
            if (app.Settings.general.googleAnalyticsCode.length) {
                thewindow.ga('send', 'pageview', thelocation.path());
            }
            else{
                console.log('Visita rastreada');
            }
        }

        function trackGoal(thewindow, category, action, label, value) {
            if (app.Settings.general.googleAnalyticsCode.length) {
                thewindow.ga('send', 'event', category, action, label, value);
            }
            else{
                console.log('Goal rastreado', category, action, label, value);
            }
        }
    }
})();