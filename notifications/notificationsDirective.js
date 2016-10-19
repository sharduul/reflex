(function(){
    'use strict';

    angular
        .module('notifications-directives', [])
        .directive('notifs', Notifs);

    Notifs.$inject = ['notificationsResource'];

    function Notifs(notificationsResource){

        return {
            restrict: 'E',
            templateUrl: 'notifications/notifications.html',
            link: function (scope, element, attrs) {

                console.log("asdfasdf");

                // declare private variables here
                var vm = this;
                var allNotifs = [];

                scope.notifications = [];

                (function(){

                    // get all the notifications here
                    notificationsResource.notification().get(function(data){

                        allNotifs = data;


                        //console.log(data);

                        groupPainSessions();

                        //vm.notifications.needsReviewList = _.filter(data, function(notification){
                        //    return notification.toLowerCase() == "assessment_needs_review";
                        //});
                        //
                        //vm.notifications.eventPainList = _.filter(data, function(notification){
                        //    return notification.toLowerCase() == "event_pain";
                        //});
                        //
                        //vm.notifications.exerciseTroubleList = _.filter(data, function(notification){
                        //    return notification.toLowerCase() == "exercise_trouble";
                        //});

                        console.log(scope.notifications);

                    });

                })();

                function groupPainSessions(){
                    var allPainNotifs = _.filter(allNotifs, function(notification){
                        return notification.type.toLowerCase() == "event_pain";
                    });

                    console.log(allPainNotifs);

                    //scope.notifications.painNotifs = _.groupBy(allPainNotifs, 'therapy_session_id');
                    //scope.notifications = _.groupBy(allPainNotifs, 'therapy_session_id');


                }

            }


        };

    }

})();


