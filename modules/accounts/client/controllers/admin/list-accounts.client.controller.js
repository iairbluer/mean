(function () {
  'use strict';

  angular
    .module('accounts.admin')
    .controller('AccountsAdminListController', AccountsAdminListController);

  AccountsAdminListController.$inject = ['AccountsService'];

  function AccountsAdminListController(AccountsService) {
    var vm = this;

    vm.accounts = AccountsService.query();
  }
}());
