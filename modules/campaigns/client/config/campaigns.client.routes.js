(function () {
  'use strict';

  angular
    .module('campaigns.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('campaigns', {
        abstract: true,
        url: '/campaigns',
        template: '<ui-view/>'
      })
      .state('campaigns.list', {
        url: '/',
        templateUrl: '/modules/campaigns/client/views/list-campaigns.client.view.html',
        controller: 'CampaignsListController',
        controllerAs: 'vm'
        // resolve: {
        //   campaignsResolve: getCampaigns
        // }
      })
      .state('campaigns.view', {
        url: '/:campaignId',
        templateUrl: '/modules/campaigns/client/views/view-campaign.client.view.html',
        controller: 'CampaignController',
        controllerAs: 'vm',
        resolve: {
          campaignResolve: getCampaign
        },
        data: {
          pageTitle: '{{ campaignResolve.campaignName }}'
        }
      });
  }

  getCampaign.$inject = ['$stateParams', 'CampaignsService'];

  function getCampaign($stateParams, CampaignsService) {
    return CampaignsService.get({
      campaignId: $stateParams.campaignId
    }).$promise;
  }

  // getCampaigns.$inject = ['$stateParams', 'CampaignsService'];
  // function getCampaign($stateParams, CampaignsService) {
  //   return CampaignsService.query({
  //     accountId: $stateParams.accountId
  //   }).$promise;
  // }
}());
