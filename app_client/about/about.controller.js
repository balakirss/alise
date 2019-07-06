(function () {

    angular
        .module('loc8rApp')
        .controller('aboutCtrl', aboutCtrl);
    function aboutCtrl() {
        var vm=this;
        vm.pageHeader = {
            title: 'About Loc8r',

        };
        vm.main = {
            content: 'тут много всяких букв про нас.\n\nНовая строчка?.'
        };

    }

})();