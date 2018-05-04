(function () {
  'use strict';

  angular
    .module('campaigns.admin')
    .controller('CampaignsAdminController', CampaignsAdminController);

  CampaignsAdminController.$inject = ['$scope', '$state', '$window', 'campaignResolve', 'Authentication', 'Notification'];

  function CampaignsAdminController ($scope, $state, $window, campaign, Authentication, Notification) {
    var vm = this;

    vm.campaign = campaign;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Account
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.campaign.$remove(function () {
          $state.go('admin.accounts.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Campaign deleted successfully!' });
        });
      }
    }

    // Save Account
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.campaignForm');
        return false;
      }
      // Create a new Account, or update the current instance
      vm.campaign.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.campaign.list'); // should we send the User to the list or the updated Article's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Campaign saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Campaign save error!' });
      }
    }
  }
}());
