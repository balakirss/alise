(function () {

    angular
        .module('loc8rApp')
        .directive('navigation', navigation);

    function navigation() {
        return {
            restrict: 'EA',
            templateUrl: '/home/common/directive/navigation/navigation.template.html'
        };

    }

})();