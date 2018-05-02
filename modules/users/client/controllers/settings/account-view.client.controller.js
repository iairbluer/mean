(function () {
    'use strict';
  
    angular
      .module('users')
      .controller('AccountViewController', AccountViewController);
  
      AccountViewController.$inject = ['$scope', '$state', '$window', 'UsersService', 'Authentication', 'Notification', '$uibModal', 'accountResolve'];
  
    function AccountViewController($scope, $state, $window, UsersService, Authentication, Notification, $uibModal, account) {
      var vm = this;
      vm.account = account;
      console.log('ACCOUNT = ' + JSON.stringify(account));
      vm.user = Authentication.user;
    }
})();