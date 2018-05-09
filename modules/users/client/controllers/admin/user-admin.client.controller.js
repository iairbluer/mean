(function () {
    'use strict';

    angular
      .module('users.admin')
      .controller('UserAdminController', UserAdminController);
  
    UserAdminController.$inject = ['$scope', '$state', '$window', 'Authentication', 'Notification', 'AdminService', 'accountsResolve'];
  
    function UserAdminController($scope, $state, $window, Authentication, Notification, AdminService, accounts) {
      var vm = this;
      vm.authentication = Authentication;
      vm.remove = remove;
      vm.update = update;
      vm.addUser = addUser;
      vm.accounts = accounts;
      vm.isContextUserSelf = isContextUserSelf;
      // ADD USER FUNCTION
      function addUser (isValid) {
        if (!isValid) {
          $scope.$broadcast('show-errors-check-validity', 'vm.userForm');
  
          return false;
        }
        AdminService.addUser(vm.credentials)
          .then(onUserAddSuccess)
          .catch(onUserAddError);
      }
      function onUserAddSuccess(response) {
        // If successful we assign the response to the global user model
        // vm.authentication.user = response;
        if (response.accounts && response.accounts.length) {
          for (var accountIndex = 0; accountIndex < vm.accounts.length; accountIndex++) {
            if (response.accounts.includes(vm.accounts[accountIndex]._id)) {
              console.log('ADDING USERS TO AUTHORIZED USERS ARRAY IN ACCOUNTS');
              vm.accounts[accountIndex].authorizedUsers.push(vm.accounts[accountIndex]._id);
            }
          }
        }
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> User added successfuly!' });
        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }
      function onUserAddError(response) {
        Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Add user Error!', delay: 6000 });
      }
      // ADD USER ADDITIONAL HELPER FUNCTIONS
      $scope.toggleIsAdmin = function toggleIsAdmin() {
        console.log('Is Admin Toggle = ' + JSON.stringify(vm.credentials.isAdmin));
        // var idx = $scope.selection.indexOf(brandName);
        vm.credentials.roles = [];
        vm.credentials.roles.push('user');
        if (vm.credentials.isAdmin) {
          // is currently selected
          console.log('ADD ADMIN AUTH');
          var adminIndex = vm.credentials.roles.indexOf('admin');
          if (adminIndex === -1) {
            console.log('NO ADMIN AUTH ADDING IT TO: ' + JSON.stringify(vm.credentials.roles));
            vm.credentials.roles.push('admin');
            console.log('AFTER UPDATE = ' + JSON.stringify(vm.credentials.roles));
          } else {
            console.log('CANT ADD WHATS ALREADY THERE');
          }
        } else {
          console.log('REMOVE ADMIN AUTH');
          var adminIndex = vm.credentials.roles.indexOf('admin');
          if (adminIndex > -1) {
            vm.credentials.roles.splice(adminIndex, 1);
          } else {
            console.log('CANT REMOVE WHATS NOT THERE');
          }
        }
      }
      vm.selection=[];
      // toggle selection for a given brand by name
      $scope.toggleSelection = function toggleSelection(account) {
        var customerName = account.customerName;
        var accountId = account._id;
        var isFound = false;
        var selectedIndex;
        console.log('SELECTION = ' + JSON.stringify(vm.selection));
        // var idx = $scope.selection.indexOf(brandName);
        for (selectedIndex = 0; selectedIndex < vm.selection.length && !isFound; selectedIndex++) {
          if (vm.selection[selectedIndex].customerName === account.customerName) {
            // is currently selected
            isFound = true;
            vm.selection.splice(selectedIndex, 1);
          }
        }
        if (isFound) {
          console.log('CALLING UPDATE AUTH BRANDS AFTER SPLICE');
          updateAuthBrands();
        } else {
          // is newly selected
          vm.selection.push({customerName: customerName, accountId: accountId });
          console.log('CALLING UPDATE AUTH BRANDS AFTER PUSH');
          updateAuthBrands();
        }
        
        
        
        function updateAuthBrands() {
          console.log('UPDATE AUTH ACCOUNTS = ' + JSON.stringify(vm.selection));
          vm.credentials.accounts = null;
          if (vm.selection.length > 0) {
            vm.credentials.accounts = [];
            for (var accountIndex = 0; accountIndex < vm.selection.length; accountIndex++) {
              vm.credentials.accounts.push(vm.selection[accountIndex].accountId);
            } 
          } else {
            console.log('NO ACCOUNTS SELECTED');
          }
          console.log('POPULATED AUTH ACCOUNTS');
        }
      };
      // REMOVE USER FUNCTION
      function remove(user) {
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
  