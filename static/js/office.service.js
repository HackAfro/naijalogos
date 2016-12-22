(function () {

    var office = angular.module('naijalogosOffice');

    office.factory('Auth', ['$http', '$localForage', '$scope', function ($http, $localForage, $scope) {

        var auth = {}

        auth.login = function (credentials) {
            $http.post('/auth_api/login', credentials)
                .then(function (data) {
                        $localForage.setItem('user', data.data)
                    },
                    function () {
                        $scope.login_error = 'Invalid Username/password'
                    })
        }

        $localForage.getItem('user').then(function (data) {
            auth.isAuthenticated = !!data.id
        })

    }])
})();