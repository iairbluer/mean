(function () {
  'use strict';

  angular
    .module('accounts')
    .controller('AccountsListController', AccountsListController);

    AccountsListController.$inject = ['AccountsService', 'Authentication'];

  function AccountsListController(AccountsService, Authentication) {
    var vm = this;
    vm.user = Authentication.user;
    AccountsService.query(function (data){
      vm.accounts = data;
      console.log('DATA = ' + JSON.stringify(data));
    })
  }
}());
