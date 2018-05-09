(function () {
  'use strict';

  angular
    .module('accounts')
    .controller('AccountsListController', AccountsListController);

    AccountsListController.$inject = ['$filter', 'accountsResolve', 'Authentication'];

  function AccountsListController($filter, accounts, Authentication) {
    var vm = this;
    vm.user = Authentication.user;
    vm.accounts = accounts;
    vm.buildPager = buildPager;
    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;
    if (vm.user.accounts && vm.user.accounts.length) {
      for (var accountIndex = 0; accountIndex < vm.accounts.length; accountIndex++) {
        if (vm.user.accounts.includes(vm.accounts[accountIndex]._id)) {
          console.log('ADDING USER TO AUTHORIZED USERS ARRAY IN ACCOUNTS');
          vm.accounts[accountIndex].authorizedUsers.push(vm.accounts[accountIndex]._id);
        }
      }
    }
    // MAKE SURE IF A USER IS ADDED TO AN ACCOUNT IT UPDATES THE ACCOUNT
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
    vm.buildPager();

    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 15;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    }

    function figureOutItemsToDisplay() {
      vm.filteredItems = $filter('filter')(vm.accounts, {
        $: vm.search
      });
      vm.filterLength = vm.filteredItems.length;
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      vm.pagedItems = vm.filteredItems.slice(begin, end);
    }

    function pageChanged() {
      vm.figureOutItemsToDisplay();
    }   
  }
}());
