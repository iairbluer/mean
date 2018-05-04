(function () {
  'use strict';

  angular
    .module('users')
    .controller('AccountsController', AccountsController);

  AccountsController.$inject = ['$scope', '$state', '$window', 'UsersService', 'Authentication', 'Notification', '$uibModal', 'accountsResolve'];

  function AccountsController($scope, $state, $window, UsersService, Authentication, Notification, $uibModal, accounts) {
    var vm = this;

    vm.user = Authentication.user;
    // vm.save = save;
    vm.connectAccount = connectAccount;
    vm.remove = remove;
    vm.accounts = accounts;
    vm.refreshDisconnectedAccounts = refreshDisconnectedAccounts;
    vm.refreshDisconnectedAccounts();
    function refreshDisconnectedAccounts() {
      vm.disconnectedAccounts = [];
      for (var accountIndex = 0; accountIndex < vm.accounts.length; accountIndex++) {
        if (vm.accounts[accountIndex].status === 'DISCONNECTED')
          vm.disconnectedAccounts.push(vm.accounts[accountIndex]);
      }
    }
    vm.hasConnectedAdditionalAccounts = hasConnectedAdditionalAccounts;
    vm.isConnectedAccount = isConnectedAccount;
    vm.removeUserAccount = removeUserAccount;
    vm.callOauthProvider = callOauthProvider;
    // Connect Account Function
    function connectAccount(account) {
      var accountToConnect = account;
      console.log('ACCOUNT TO CONNECT = ' + JSON.stringify(accountToConnect));
      // PREPARE FOR OAUTH CALL
      var url = '/api/auth/google/clientId/' + accountToConnect.customerId;
      // var indexToSplice = vm.accounts
      // MAKING OAUTH CALL
      vm.callOauthProvider(url);
    }
    // Remove existing Account
    function remove(account) {
      if ($window.confirm('Are you sure you want to delete?')) {
        account.$remove(function () {
          $state.go('admin.accounts.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Account deleted successfully!' });
        });
      }
    }
    // Check if there are additional accounts
    function hasConnectedAdditionalAccounts() {
      return (vm.user.additionalProvidersData && Object.keys(vm.user.additionalProvidersData).length);
    }

    // Check if provider is already in use with current user
    function isConnectedAccount(provider) {
      return vm.user.provider === provider || (vm.user.additionalProvidersData && vm.user.additionalProvidersData[provider]);
    }

    // Remove a user account
    function removeUserAccount(account) {
      console.log('ACCOUNT = ' + JSON.stringify(account));
      // TO DO - FIND OUT IF WE HAVE A USER CONTEXT AND GET PROVIDER OR FROM ACCOUNT ITSELF
      // UsersService.removeAccount(provider)
      //   .then(onRemoveAccountSuccess)
      //   .catch(onRemoveAccountError);
    }

    function onRemoveAccountSuccess(response) {
      // If successful show success message and clear form
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Removed successfully!' });
      vm.user = Authentication.user = response;
    }

    function onRemoveAccountError(response) {
      Notification.error({ message: response.message, title: '<i class="glyphicon glyphicon-remove"></i> Remove failed!' });
    }
    // function save() {
    //   // Create a new article, or update the current instance
    //   vm.account.createOrUpdate()
    //     .then(successCallback)
    //     .catch(errorCallback);

    //   function successCallback(res) {
    //     console.log('ACCOUNT SAVED - LOGING IN TO IT DIRECTLY');
    //     vm.callOauthProvider();
    //     // $state.go('admin.articles.list'); // should we send the User to the list or the updated Article's view?
    //     // Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Article saved successfully!' });
    //   }

    //   function errorCallback(res) {
    //     Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Article save error!' });
    //   }
    // }
    // OAuth provider request
    function callOauthProvider(url) {
      url += '?redirect_to=' + encodeURIComponent($state.$current.url.prefix);

      // Effectively call OAuth authentication route:
      $window.location.href = url;
    }
  }
}());
