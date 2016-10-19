(function() {
	'use strict';

	angular
		.module('notifications-services', [])
		.factory('notificationsResource', NotificationsResource);

    NotificationsResource.$inject = ['$resource'];

	function NotificationsResource($resource){
		return{
			notification: notification
		};

		function notification(){
			return $resource('assets/notifications.json', { }, {
				get: { method: 'GET', isArray: true },

                // kept here to show that in real world application this will call the RESTful API
                update: { method: 'PUT' },
				save: { method: 'POST' },
				remove: { method: 'DELETE' }
			});
		}

	}
})();