(function () {
  'use strict';

  angular
    .module('accounts')
    .controller('AccountController', AccountController);

  AccountController.$inject = ['$scope', 'accountResolve', 'Authentication'];

  function AccountController($scope, account, Authentication) {
    var vm = this;

    vm.account = account;
    vm.authentication = Authentication;

  }
}());
