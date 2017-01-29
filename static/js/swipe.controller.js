(function () {
	'use strict';

	var office = angular.module('naijalogosOffice');

	office.controller('swipeCtrl', ['$scope', function($scope){
		
		$scope.showSideBar = function () {
			$('.ui.left.sidebar').sidebar({
            	dimPage: false,
            	transition: 'overlay',
            	exclusive: true,
            	closable: true
        	}).sidebar('show');
		}

		$scope.hideSideBar = function () {
			$('.ui.left.sidebar').sidebar('hide')
		}
	}])
})();