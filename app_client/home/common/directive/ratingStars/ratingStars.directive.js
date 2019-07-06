(function () {


    angular
        .module('loc8rApp')
        .directive('ratingStars', ratingStars);

    function ratingStars() {
        return {
            restrict: 'EA',
            scope: {
                thisRating: '=rating'
            },
            templateUrl: '/home/common/directive/ratingStars/ratingStars.template.html'
        };


    }
})()