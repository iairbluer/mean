(function () {
  'use strict';

  angular
    .module('campaigns.admin')
    .controller('CampaignsAdminListController', CampaignsAdminListController);

  CampaignsAdminListController.$inject = ['CampaignsService'];

  function CampaignsAdminListController(CampaignsService) {
    var vm = this;

    vm.campaigns = CampaignsService.query();
  }
}());
