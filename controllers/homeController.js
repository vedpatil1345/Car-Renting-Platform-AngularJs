'use strict';

app.controller('HomeController', function($scope) {
    $scope.welcomeMessage = 'Welcome to Car Rental Service';
    $scope.features = [
        'Wide selection of vehicles',
        'Competitive prices',
        'Easy booking process',
        '24/7 customer support'
    ];
});