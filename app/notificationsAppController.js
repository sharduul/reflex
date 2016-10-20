(function(){
	'use strict';

	angular
		.module('notifications-controllers', [])
		.controller('notificationsAppController', NotificationsAppController);

    NotificationsAppController.$inject = ['$scope', 'notificationsResource'];

	function NotificationsAppController($scope, notificationsResource){

		(function(){


        })();

        // listen to notifications being modified
        $scope.$on('notif-changed', function(event, args) {
            $scope.notifications = args.notifications;
        });

	}

})();