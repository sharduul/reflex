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
                var groupedPainNotifs = {};
                var groupedReview = {};

                scope.notifications = [];

                (function(){

                    // get all the notifications here
                    notificationsResource.notification().get(function(data){

                        allNotifs = data;

                        scope.notifications = _.filter(data, function(notification){
                            return notification.type.toLowerCase() == "exercise_trouble";
                        });


                        groupPainSessions();
                        groupAssessmentReviews();

                        scope.notifications.sort(function(a,b){
                            return new Date(b.timestamp) - new Date(a.timestamp);
                        });


                        //vm.notifications.needsReviewList = _.filter(data, function(notification){
                        //    return notification.toLowerCase() == "assessment_needs_review";
                        //});
                        //
                        //vm.notifications.eventPainList = _.filter(data, function(notification){
                        //    return notification.toLowerCase() == "event_pain";
                        //});
                        //


                        console.log(scope.notifications);

                    });

                })();

                function groupPainSessions(){
                    var allPainNotifs = _.filter(allNotifs, function(notification){
                        return notification.type.toLowerCase() == "event_pain";
                    });

                    groupedPainNotifs = _.groupBy(allPainNotifs, 'therapy_session_id');

                    for(var key in groupedPainNotifs){
                        var maxPainLevel = Math.max.apply(Math, groupedPainNotifs[key].map(function(o){ return o.pain_value; }))
                        var maxTimestamp = getMaxTimestampFromArray(groupedPainNotifs[key]);

                        var notifObject = {
                            patient_name: groupedPainNotifs[key][0].patient_name,
                            message: "Reported pain " + groupedPainNotifs[key].length + " times with highest pain" + maxPainLevel,
                            timestamp: maxTimestamp
                        };

                        scope.notifications.push(notifObject);
                    }

                }

                function groupAssessmentReviews(){
                    var allReviews = _.filter(allNotifs, function(notification){
                        return notification.type.toLowerCase() == "assessment_needs_review";
                    });

                    groupedReview = _.groupBy(allReviews, 'patient_id');

                    console.log(groupedReview);

                    for(var key in groupedReview){

                        var maxTimestamp = getMaxTimestampFromArray(groupedReview[key]);

                        var notifObject = {
                            patient_name: groupedReview[key][0].patient_name,
                            message: "Has " + groupedReview[key].length + " assessments ready to review",
                            timestamp: maxTimestamp
                        };

                        scope.notifications.push(notifObject);
                    }

                }

                function getMaxTimestampFromArray(array){

                    if(array.length == 0){
                        return "";
                    }

                    if(array.length == 0){
                        return array[0].timestamp;
                    }

                    array.sort(function(a,b){
                        return new Date(a.timestamp) - new Date(b.timestamp);
                    });

                    return array[0].timestamp;
                }

            }


        };

    }

})();


