(function () {
  'use strict';

  angular
    .module('accounts.admin')
    .controller('AccountsAdminController', AccountsAdminController);

  AccountsAdminController.$inject = ['$scope', '$state', '$window', 'accountResolve', 'Authentication', 'Notification'];

  function AccountsAdminController($scope, $state, $window, account, Authentication, Notification) {
    var vm = this;

    vm.account = account;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Account
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.account.$remove(function () {
          $state.go('admin.accounts.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Account deleted successfully!' });
        });
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
