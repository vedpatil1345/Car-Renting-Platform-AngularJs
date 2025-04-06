'use strict';

var app = angular.module('carRentalApp', ['ngRoute']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('!');
    
    $routeProvider
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'HomeController'
        })
        .when('/cars', {
            templateUrl: 'views/cars.html',
            controller: 'CarController'
        })
        .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'AuthController'
        })
        .when('/register', {
            templateUrl: 'views/register.html',
            controller: 'AuthController'
        })
        .when('/admin', {
            templateUrl: 'views/admin.html',
            controller: 'AdminController'
        })
        .when('/profile', {
            templateUrl: 'views/profile.html',
            controller: 'ProfileController'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

app.service('AuthService', function($http) {
    var currentUser = null;

    this.login = function(credentials) {
        return $http.post('/api/login', credentials).then(function(response) {
            currentUser = response.data;
            return response;
        });
    };
    
    this.register = function(userData) {
        return $http.post('/api/register', userData);
    };

    this.getCurrentUser = function() {
        return currentUser;
    };

    this.logout = function() {
        currentUser = null;
        return $http.post('/api/logout');
    };
});

app.controller('NavController', function($scope, $location, AuthService) {
    $scope.user = AuthService.getCurrentUser();
    
    $scope.$watch(function() {
        return AuthService.getCurrentUser();
    }, function(newUser) {
        $scope.user = newUser;
    });

    $scope.getProfileLetter = function() {
        if ($scope.user && $scope.user.email) {
            return $scope.user.email.charAt(0).toUpperCase();
        }
        return '';
    };

    $scope.logout = function() {
        AuthService.logout().then(function() {
            $location.path('/login');
        });
    };
});

app.controller('AuthController', function($scope, $location, AuthService) {
    $scope.credentials = {};
    $scope.registrationType = 'user';
    
    $scope.login = function() {
        AuthService.login($scope.credentials)
            .then(function(response) {
                if (response.data.role === 'admin') {
                    $location.path('/admin');
                } else {
                    $location.path('/cars');
                }
            })
            .catch(function(error) {
                $scope.error = error.data.message;
            });
    };
    
    $scope.register = function() {
        const userData = {
            ...$scope.credentials,
            role: $scope.registrationType
        };
        
        AuthService.register(userData)
            .then(function() {
                $location.path('/login');
            })
            .catch(function(error) {
                $scope.error = error.data.message;
            });
    };
});

app.controller('ProfileController', function($scope, AuthService) {
    $scope.user = AuthService.getCurrentUser();
});

app.controller('AdminController', function($scope, $http) {
    $scope.newCar = {};
    
    $scope.addCar = function() {
        $http.post('/api/cars', $scope.newCar)
            .then(function() {
                $scope.loadCars();
                $scope.newCar = {};
            })
            .catch(function(error) {
                $scope.error = error.data.message;
            });
    };
    
    $scope.deleteCar = function(carId) {
        $http.delete('/api/cars/' + carId)
            .then(function() {
                $scope.loadCars();
            })
            .catch(function(error) {
                $scope.error = error.data.message;
            });
    };
    
    $scope.loadCars = function() {
        $http.get('/api/cars')
            .then(function(response) {
                $scope.cars = response.data;
            });
    };
    
    $scope.loadCars();
});