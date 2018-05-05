(function () {
  'use strict';

  angular
    .module('users.admin')
    .controller('UserController', UserController);

  UserController.$inject = ['$scope', '$state', '$window', 'Authentication', 'userResolve', 'Notification', 'AccountsService', 'AdminService'];

  function UserController($scope, $state, $window, Authentication, user, Notification, AccountsService, AdminService) {
    var vm = this;
    vm.authentication = Authentication;
    vm.user = user;
    vm.selection = [];
    AdminService.query(function (data){
      vm.users = data;
      if (vm.users.accounts && vm.user.accounts.length) {
        console.log('ADDING USER ACCOUNTS TO SELECTION');
        for (var accountIndex = 0; accountIndex < vm.users[userIndex].accounts.length; accountIndex ++) {
          vm.selection.push(vm.users[userIndex].accounts[accountIndex]);
        }
      }
      
    });
    console.log('USER = ' + JSON.stringify(vm.user));
    AccountsService.query(function (data){
      console.log('RECEIVED DATA = ' + JSON.stringify(data));
      vm.accounts = data;
    });
    vm.remove = remove;
    vm.update = update;
    vm.isContextUserSelf = isContextUserSelf;
    
    vm.toggleSelection = toggleSelection;
    function toggleSelection(account) {
      var customerName = account.customerName;
      var accountId = account._id;
      var isFound = false;
      var selectedIndex;
      console.log('SELECTION = ' + JSON.stringify(vm.selection));
      // var idx = $scope.selection.indexOf(brandName);
      for (selectedIndex = 0; selectedIndex < vm.selection.length && !isFound; selectedIndex++) {
        if (vm.selection[selectedIndex] === accountId) {
          // is currently selected
          isFound = true;
          vm.selection.splice(selectedIndex, 1);
        }
      }
      if (isFound) {
        console.log('CALLING UPDATE AUTH BRANDS AFTER SPLICE');
        updateAuthAccounts();
      } else {
        // is newly selected
        vm.selection.push(accountId);
        console.log('CALLING UPDATE AUTH BRANDS AFTER PUSH');
        updateAuthAccounts();
      }
      function updateAuthAccounts() {
        console.log('UPDATE AUTH Accounts = ' + JSON.stringify(vm.selection));
        vm.user.accounts = null;
        if (vm.selection.length > 0) {
          vm.user.accounts = [];
          for (var accountIndex = 0; accountIndex < vm.selection.length; accountIndex++) {
            vm.user.accounts.push(vm.selection[accountIndex]);
          } 
        } else {
          console.log('NO Accounts SELECTED');
        }
        console.log('POPULATED AUTH Accounts');
      }
    };
    function remove(user) {
      console.log('USER = ' + JSON.stringify(user));
      console.log('VM USERS = ' + JSON.stringify(vm.users));
      if ($window.confirm('Are you sure you want to delete this user?')) {
        if (user) {
          user.$remove();
          vm.users.splice(vm.users.indexOf(user), 1);
          Notification.success('User deleted successfully!');
        } else {
          vm.user.$remove(function () {
            $state.go('admin.users');
            Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> User deleted successfully!' });
          });
        }
      }
    }

    function update(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

        return false;
      }

      var user = vm.user;

      user.$update(function () {
        $state.go('admin.user', {
          userId: user._id
        });
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> User saved successfully!' });
      }, function (errorResponse) {
        Notification.error({ message: errorResponse.data.message, title: '<i class="glyphicon glyphicon-remove"></i> User update error!' });
      });
    }

    function isContextUserSelf() {
      return vm.user.username === vm.authentication.user.username;
    }
  }
}());
