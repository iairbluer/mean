(function () {
  'use strict';

  angular
    .module('campaigns')
    .controller('CampaignsController', CampaignsController);

  CampaignsController.$inject = ['$scope', 'campaignResolve', 'Authentication'];

  function CampaignsController($scope, campaign, Authentication) {
    var vm = this;
    
    vm.campaign = campaign;
    vm.authentication = Authentication;

  }
}());
