(function () {
    angular
        .module('loc8rApp')
        .directive('footerGeneric', footerGeneric);
    function footerGeneric() {
        return {
            restrict: 'EA',
            templateUrl: '/home/common/directive/footerGeneric/footerGeneric.template.html'
        };

    }

})();