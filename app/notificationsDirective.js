(function(){
    'use strict';

    angular
        .module('notifications-directives', [])
        .directive('notifs', Notifs);

    Notifs.$inject = ['notificationsResource', '$rootScope'];

    function Notifs(notificationsResource, $rootScope){

        return {
            restrict: 'E',
            templateUrl: 'templates/notifications.html',
            link: function (scope, element, attrs) {

                // declare private variables here
                var allNotifs = [];
                var groupedPainNotifs = {};
                var groupedReview = {};

                // all the scope variables and functions
                scope.notifications = [];
                scope.clearNotifById = clearNotifById;
                scope.clearAllNotifs = clearAllNotifs;
                scope.summary = summary;

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

                        // this broadcast is to show the red dot alert
                        $rootScope.$broadcast('notif-changed', { notifications: scope.notifications });

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

                        // need  these ids for dismissing all notifs in group
                        var idArray = _.map(groupedReview[key], function(result){
                            return result.id;
                        });

                        var notifObject = {
                            patient_name: groupedPainNotifs[key][0].patient_name,
                            message: "Reported pain " + groupedPainNotifs[key].length + " times with highest pain" + maxPainLevel,
                            timestamp: maxTimestamp,
                            type: "event_pain",
                            id: idArray
                        };

                        scope.notifications.push(notifObject);
                    }

                }


                function groupAssessmentReviews(){
                    var allReviews = _.filter(allNotifs, function(notification){
                        return notification.type.toLowerCase() == "assessment_needs_review";
                    });

                    groupedReview = _.groupBy(allReviews, 'patient_id');

                    for(var key in groupedReview){
                        var maxTimestamp = getMaxTimestampFromArray(groupedReview[key]);

                        // need  these ids for dismissing all notifs in group
                        var idArray = _.map(groupedReview[key], function(result){
                                return result.id;
                        });

                        var notifObject = {
                            patient_name: groupedReview[key][0].patient_name,
                            message: "Has " + groupedReview[key].length + " assessments ready to review",
                            timestamp: maxTimestamp,
                            type: "assessment_needs_review",
                            id: idArray
                        };

                        scope.notifications.push(notifObject);
                    }

                }

                // get the max timestamp from the grouped notifications
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

                function summary(name){
                    alert("summary of " + name);
                }


                function clearNotifById(id){
                    // API call will be made to dismiss the notification by id
                    scope.notifications = _.filter(scope.notifications, function(notif){
                        return notif.id != id;
                    });

                    // this is done so that the notification alert (red dot) can be removed if all the notifications are dismissed
                    // we wouldn't need this in real world application based on how we implement it.
                    $rootScope.$broadcast('notif-changed', { notifications: scope.notifications });
                }

                function clearAllNotifs(){
                    // all notifications are dismissed
                    // in real world application and API call will be made here
                    scope.notifications = [];
                    $rootScope.$broadcast('notif-changed', { notifications: scope.notifications });
                }

            }


        };

    }

})();


