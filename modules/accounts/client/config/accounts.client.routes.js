(function () {
  'use strict';

  angular
    .module('accounts.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('accounts', {
        abstract: true,
        url: '/accounts',
        template: '<ui-view/>'
      })
      .state('accounts.list', {
        url: '',
        templateUrl: '/modules/accounts/client/views/list-accounts.client.view.html',
        controller: 'AccountsListController',
        controllerAs: 'vm',
        resolve: {
          accountsResolve: getAccounts
        },
      })
      .state('accounts.view', {
        url: '/:accountId',
        templateUrl: '/modules/accounts/client/views/view-account.client.view.html',
        controller: 'AccountController',
        controllerAs: 'vm',
        resolve: {
          accountResolve: getAccount
        },
        data: {
          pageTitle: '{{ accountResolve.customerName }}'
        }
      });
  }

  getAccount.$inject = ['$stateParams', 'AccountsService'];

  function getAccount($stateParams, AccountsService) {
    return AccountsService.get({
      accountId: $stateParams.accountId
    }).$promise;
  }
  getAccounts.$inject = ['$stateParams', 'AccountsService'];

  function getAccounts($stateParams, AccountsService) {
    return AccountsService.query({
      userId: $stateParams.userId
    }).$promise;
  }
}());
