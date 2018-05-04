(function () {
  'use strict';

  angular
    .module('accounts.admin')
    .controller('AccountsAdminListController', AccountsAdminListController);

  AccountsAdminListController.$inject = ['$filter', 'AccountsService', 'UsersService'];

  function AccountsAdminListController($filter, AccountsService, UsersService) {
    var vm = this;
    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;
    vm.removeUserAccount = removeUserAccount;

    AccountsService.query(function (data) {
      vm.accounts = data;
      vm.buildPager();
    });

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

    // Remove a user account
    function removeUserAccount(provider) {
      UsersService.removeAccount(provider)
        .then(onRemoveAccountSuccess)
        .catch(onRemoveAccountError);

        function onRemoveAccountSuccess(response) {
          // If successful show success message and clear form
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Removed successfully!' });
          vm.user = Authentication.user = response;
        }
    
        function onRemoveAccountError(response) {
          Notification.error({ message: response.message, title: '<i class="glyphicon glyphicon-remove"></i> Remove failed!' });
        }
    }
    
  }
}());
