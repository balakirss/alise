(function () {

angular
    .module('loc8rApp')
    .service('loc8rData', loc8rData);
function loc8rData($http){
    var locationByCoords = function (lat, lng) {
        //  lng=55.755826
        //  lat=37.6173
        return $http.get('api/locations?lng='+lng+'&lat='+lat+'&maxDistance=999999');
    };

    var locationById = function (locationid) {
        return $http.get('/api/locations/' + locationid);

    };

    var addReviewById = function (locationid, data) {
        return $http.post('/api/locations/' + locationid + '/reviews', data);

    };
    return {
        locationByCoords: locationByCoords,
        locationById: locationById,
        addReviewById : addReviewById
    };
}
})();