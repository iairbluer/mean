(function () {
  'use strict';

  angular
    .module('accounts.admin')
    .controller('AccountsAdminController', AccountsAdminController);

  AccountsAdminController.$inject = ['$scope', '$state', '$window', 'accountResolve', 'Authentication', 'Notification', 'UsersService'];

  function AccountsAdminController($scope, $state, $window, account, Authentication, Notification, UsersService) {
    var vm = this;
    vm.account = account;
    console.log('ACCOUNTTT = ' + JSON.stringify(account));
    vm.authentication = Authentication;
    vm.form = {};
    vm.removeUserAccount = removeUserAccount;
    vm.save = save;

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

    // Save Account
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.accountForm');
        return false;
      }
      // Create a new Account, or update the current instance
      vm.account.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.accounts.list'); // should we send the User to the list or the updated Article's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Account saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Account save error!' });
      }
    }
  }
}());
