(function(){
	'use strict';

	angular
		.module('notifications-controllers', [])
		.controller('notificationsAppController', NotificationsAppController);

    NotificationsAppController.$inject = ['$scope', 'notificationsResource'];

	function NotificationsAppController($scope, notificationsResource){

		(function(){

            // get all the notifications here
            notificationsResource.notification().get(function(data){
                $scope.notifications = data;
            });

        })();

        $scope.$on('notif-dismissed', function(event, args) {
            $scope.notifications = args.notifications;
        });

	}

})();