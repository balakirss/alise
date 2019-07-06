(function () {

angular
  .module('loc8rApp')
  .controller('homeCtrl', homeCtrl);

function homeCtrl(loc8rData, geolocation) {
    var vm = this;
    vm.pageHeader = {
        title: 'Loc8r',
        strapline: 'Find place'
    };
    vm.sidebar = {
        content: "Looking"
    };


    vm.message = "Ищем хорошее местечко";
//    $scope.message = "Определение Вашего месторасположения";

    lng=-0.79;
    lat=51.3;
//    loc8rData.locationByCoords(lat,lng);

//    $scope.getData= function(position){
//        var lat = position.coords.latitude,
//            lng = position.coords.longitude;


//        $scope.message = "Ищем хорошее местечко";
    loc8rData.locationByCoords(lat,lng)
        .success(function (data) {
            vm.message = data.length > 0 ? "" : "Ничего не найдено";
            vm.data = {locations: data};
        })
        .error(function (e) {
            vm.message = "Извините, что-то пошло не так";
        });
//};
//    $scope.showError = function(error){
//        $scope.$apply(function () {
//            $scope.message = error.message;


//        });
//    };
//    $scope.noGeo = function () {
//        $scope.$apply(function () {
//            $scope.message = "Геолокация не поддерживается Вашим браузером";

//        });
//    };
//      geolocation.getPosition($scope.getData, $scope.showError, $scope.noGeo);



}

})();