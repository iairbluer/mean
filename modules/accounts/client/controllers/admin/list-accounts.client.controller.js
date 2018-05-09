(function () {
  'use strict';

  angular
    .module('accounts.admin')
    .controller('AccountsAdminListController', AccountsAdminListController);

  AccountsAdminListController.$inject = ['$window', '$state',  '$filter', 'AccountsService', 'UsersService', 'Notification', 'Authentication'];

  function AccountsAdminListController($window, $state, $filter, AccountsService, UsersService, Notification, Authentication) {
    var vm = this;
    vm.user = Authentication.user;
    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;
    vm.remove = remove;
    vm.connectAccount = connectAccount;
    vm.callOauthProvider = callOauthProvider;
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
      vm.buildPager();
    });

    // Connect Account Function
    function connectAccount(account) {
      vm.accountToConnect = account;
      if (!vm.accountToConnect) {
        console.log('NO ACCOUNT TO CONNECT');
      } else {
        console.log('ACCOUNT TO CONNECT = ' + JSON.stringify(vm.accountToConnect));
        // PREPARE FOR OAUTH CALL
        var url = '/api/auth/google/clientId/' + vm.accountToConnect.customerId;
        // var indexToSplice = vm.accounts
        // MAKING OAUTH CALL
        vm.callOauthProvider(url);
      }
    }
    // OAuth provider request
    function callOauthProvider(url) {
      url += '?redirect_to=' + encodeURIComponent($state.$current.url.prefix);

      // Effectively call OAuth authentication route:
      $window.location.href = url;
    }
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
    function remove(account) {
      if ($window.confirm('Are you sure you want to delete?')) {
        account.$remove(function () {
          $state.go('admin.accounts.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Campaign deleted successfully!' });
        });
      }
      // UsersService.removeAccount(provider)
      //   .then(onRemoveAccountSuccess)
      //   .catch(onRemoveAccountError);

      // function onRemoveAccountSuccess(response) {
      //   // If successful show success message and clear form
      //   Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Removed successfully!' });
      // }
    
      // function onRemoveAccountError(response) {
      //   Notification.error({ message: response.message, title: '<i class="glyphicon glyphicon-remove"></i> Remove failed!' });
      // }
    }
    
  }
}());
