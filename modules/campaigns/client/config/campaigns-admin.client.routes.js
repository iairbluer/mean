(function () {
  'use strict';

  angular
    .module('campaigns.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.campaigns', {
        abstract: true,
        url: '/campaigns',
        template: '<ui-view/>'
      })
      .state('admin.campaigns.list', {
        url: '',
        templateUrl: '/modules/campaigns/client/views/admin/list-campaigns.client.view.html',
        controller: 'CampaignsAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.campaigns.create', {
        url: '/create',
        templateUrl: '/modules/campaigns/client/views/admin/form-campaign.client.view.html',
        controller: 'CampaignsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          campaignResolve: newCampaign
        }
      })
      .state('admin.campaigns.edit', {
        url: '/:campaignId/edit',
        templateUrl: '/modules/campaigns/client/views/admin/form-campaign.client.view.html',
        controller: 'CampaignsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin'],
          pageTitle: '{{ campaignResolve.customerName }}'
        },
        resolve: {
          campaignResolve: getCampaign
        }
      });
  }

  getCampaign.$inject = ['$stateParams', 'CampaignsService'];

  function getCampaign($stateParams, CampaignsService) {
    return CampaignsService.get({
      campaignId: $stateParams.campaignId,
    }).$promise;
  }

  newCampaign.$inject = ['CampaignsService'];

  function newCampaign(CampaignsService) {
    return new CampaignsService();
  }
}());
