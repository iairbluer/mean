(function () {
  'use strict';

  angular
    .module('campaigns')
    .controller('CampaignsListController', CampaignsListController);

    CampaignsListController.$inject = ['CampaignsService', 'Authentication', 'campaignsResolve'];

  function CampaignsListController(CampaignsService, Authentication, campaigns) {
    var vm = this;

    vm.user = Authentication.user;
    if (vm.user.accounts) {
      console.log('USER ACCOUNTS FOUND = ' + JSON.stringify(vm.user.accounts));  
    } else {
      console.log('USER ACCOUNTS NOT FOUND');
      // vm.getUserAccounts();
    }
    vm.campaigns = null;
    // GET USER ACCOUNTS
    vm.getUserAccounts = vm.getUserAccounts;
    function getUserAccounts() {
      AccountsService.query({ userId: vm.user._id }, function (data){
        vm.user.accounts = data;
        console.log('Received User Accounts');
      });
    }
    // GET CAMPAIGNS - AFTER GET USERS ACCOUNTS
    vm.getCampaigns = getCampaigns;
    function getCampaigns () {
      console.log('IN GET CAMPAIGNS');
      // CampaignsService.query({ accountId: vm.account._id }, function (data){
      //   vm.campaigns = data;
      //   console.log('DATA = ' + JSON.stringify(data));
      // })
    }  
  }
}());
