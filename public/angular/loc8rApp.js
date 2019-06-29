angular.module('loc8rApp', []);

var locationListCtrl = function ($scope, loc8rData, geolocation) {
    console.log('bbb');
    $scope.message = "Определение Вашего месторасположения";

    $scope.getData= function(position){
        $scope.message = "Ищем хорошее местечко";
    loc8rData
        .success(function (data) {
            $scope.message = data.length > 0 ? "" : "Ничего не найдено";
            $scope.data = {locations: data};
        })
        .error(function (e) {
            $scope.message = "Извините, что-то пошло не так";
        });
};
    $scope.showError = function(error){
        $scope.$apply(function () {
            $scope.message = error.message;

        });
    };
    $scope.noGeo = function () {
        $scope.$apply(function () {
            $scope.message = "Геолокация не поддерживается Вашим браузером";

        });
    };
      geolocation.getPosition($scope.getData, $scope.showError, $scope.noGeo);
    };

var formatDistanceA = function() {
        return function (distance) {
        var numDistance, unit;
        if (distance) {
            if (distance > 1) {
                numDistance = parseFloat(distance).toFixed(1);
                unit = 'km';
            } else {
                numDistance = parseInt(distance * 1000, 10);
                unit = 'm';
            }
            return numDistance + unit;
        } else {
            return "?";
        }
    };
};

var ratingStars = function(){
    return {
        scope: {
            thisRating : '=rating'
        },
        templateUrl : '/angular/rating-stars.html'
    };
};

var loc8rData = function($http){
    return $http.get('api/locations?lng=-0.79&lat=51.3&maxDistance=99999');
};

var geolocation = function (){
    console.log('aaa');
    var getPosition = function (cbSuccess, cbError, cbNoGeo) {
        if (navigator.geolocation){
            navigator.geolocation.getCurrentPosition(cbSuccess, cbError);
        }
        else {
            cbNoGeo();
        }
    };
    return {
        getPosition : getPosition
    };
};

angular
  .module('loc8rApp')
  .controller('locationListCtrl',locationListCtrl)
  .filter('formatDistanceA', formatDistanceA)
  .directive('ratingStars',ratingStars)
  .service('loc8rData',loc8rData)
  .service('geolocation',geolocation);



