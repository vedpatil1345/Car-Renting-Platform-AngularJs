'use strict';

app.controller('CarController', function($scope, $http) {
    $scope.sortOptions = [
        { value: '', label: 'Default' },
        { value: 'price', label: 'Price (Low to High)' },
        { value: 'name', label: 'Name (A-Z)' }
    ];
    
    $scope.selectedSort = '';
    
    $scope.loadCars = function() {
        $http.get('/api/cars', { params: { sort: $scope.selectedSort } })
            .then(function(response) {
                $scope.cars = response.data;
            });
    };
    
    $scope.rentCar = function(car) {
        // Here you would typically make an API call to rent the car
        alert('Booking request sent for ' + car.name);
    };
    
    $scope.$watch('selectedSort', function() {
        $scope.loadCars();
    });
    
    $scope.loadCars();
});