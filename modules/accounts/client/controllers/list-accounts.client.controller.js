(function () {
  'use strict';

  angular
    .module('accounts')
    .controller('AccountsListController', AccountsListController);

    AccountsListController.$inject = ['AccountsService', 'Authentication'];

  function AccountsListController(AccountsService, Authentication) {
    var vm = this;
    vm.user = Authentication.user;
    AccountsService.query(function (data) {
      console.log('DATA RECEIVED LIST ACCOUNTS ADMIN = ' + JSON.stringify(data));
      vm.accounts = data;
      if (vm.user.additionalProvidersData && Object.keys(vm.user.additionalProvidersData).length) {
        console.log('HAVE ACCOUNTS CONNECTED');
        var additionalDataKeys = Object.keys(vm.user.additionalProvidersData);
        for (var additionalDataIndex = 0; additionalDataIndex < additionalDataKeys.length; additionalDataIndex++) {
          var accountFound = false; 
          for (var accountIndex = 0; accountIndex < vm.accounts.length && !accountFound; accountIndex++) {
            if (additionalDataKeys[additionalDataIndex] === vm.accounts[accountIndex].customerId) {
              console.log('FOUND ACCOUNT - ' + additionalDataKeys[additionalDataIndex]);
              accountFound = true;
              vm.accounts[accountIndex].status = 'CONNECTED';
              vm.accounts[accountIndex].connected = new Date();
            }
          }
        }
      }    
    });
  }
}());
