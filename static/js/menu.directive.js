(function () {
	'use strict';

	var office = angular.module('naijalogosOffice')

	office.directive('menuButton',function () {
		return {
			restrict : 'E',
			templateUrl: '/static/html/sidebarmenu.html'
		}
	})
})()