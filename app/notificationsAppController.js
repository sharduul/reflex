(function(){
	'use strict';

	angular
		.module('notifications-controllers', [])
		.controller('notificationsAppController', NotificationsAppController);

    NotificationsAppController.$inject = ['$scope'];

	function NotificationsAppController($scope){

		(function(){


        })();

        $scope.$on('notif-dismissed', function(event, args) {
            $scope.notifications = args.notifications;
        });

	}

})();