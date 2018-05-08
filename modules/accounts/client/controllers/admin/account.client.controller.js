(function () {
  'use strict';

  angular
    .module('accounts.admin')
    .controller('AccountsAdminController', AccountsAdminController);

  AccountsAdminController.$inject = ['Socket', '$scope', '$state', '$window', 'accountResolve', 'Authentication', 'Notification', 'UsersService', 'AccountsCampaignsService'];

  function AccountsAdminController(Socket, $scope, $state, $window, account, Authentication, Notification, UsersService, AccountsCampaignsService) {
    var vm = this;
    vm.account = account;
    console.log('ACCOUNTTT = ' + JSON.stringify(account));
    vm.authentication = Authentication;
    vm.form = {};
    vm.removeUserAccount = removeUserAccount;
    vm.save = save;
    vm.getCampaignsService = getCampaignsService;
    init();

    function init() {
      console.log('AccountsAdminController INIT');
      if (!vm.authentication.user) {
        console.log('NO USER DETECTED');
      } else {
        console.log('USER = ' + JSON.stringify(vm.authentication.user));
      }
      
      vm.loading = false;
      // Make sure the Socket is connected
      if (!Socket.socket) {
        console.log('NO SOCKET DETECTED - CONNECTING');
        Socket.connect();
      }

      // Add an event listener to the 'chatMessage' event
      Socket.on('connectedAccount', function (account) {
        console.log('THUMBNAIL = ' + JSON.stringify(thumbnail));
        // vm.thumbnails.push(thumbnail);
      });
    
      // Remove the event listener when the controller instance is destroyed
      $scope.$on('$destroy', function () {
        Socket.removeListener('thumbnail');
      });
    }


    function getCampaignsService() {
      console.log('CALLING GET CAMPAIGNS SERVICE');
      AccountsCampaignsService.get({ accountId: vm.account._id }, function(data){
        console.log('RECEIVED CAMPAIGNS SERVICE ACCOUNT = ' + JSON.stringify(data));
      })
      // campaignServices.getCampaignsService(vm.account, vm.authentication.user);
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
