(function () {
    'use strict';
  
    angular
      .module('core')
      .controller('SidebarController', SidebarController);
  
    SidebarController.$inject = ['$scope', '$state', 'Authentication', 'menuService'];
  
    function SidebarController($scope, $state, Authentication, menuService) {
      var vm = this;
  
    //   vm.accountMenu = menuService.getMenu('account').items[0];
      vm.authentication = Authentication;
    //   vm.isCollapsed = false;
    //   vm.menu = menuService.getMenu('sidebar');
      
      $scope.$on('$stateChangeSuccess', stateChangeSuccess);
  
      function stateChangeSuccess() {
        // Collapsing the menu after navigation
        vm.isCollapsed = false;
      }
    }
  }());
  