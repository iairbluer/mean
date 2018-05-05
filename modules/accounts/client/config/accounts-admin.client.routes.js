(function () {
  'use strict';

  angular
    .module('accounts.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.accounts', {
        abstract: true,
        url: '/accounts',
        template: '<ui-view/>'
      })
      .state('admin.accounts.list', {
        url: '',
        templateUrl: '/modules/accounts/client/views/admin/list-accounts.client.view.html',
        controller: 'AccountsAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.account', {
        url: '/account/:accountId',
        templateUrl: '/modules/accounts/client/views/admin/view-account.client.view.html',
        controller: 'AccountsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          accountResolve: getAccount
        }
      })
      .state('admin.accounts.create-adwords', {
        url: '/create',
        templateUrl: '/modules/accounts/client/views/admin/form-account.client.view.html',
        controller: 'AccountsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          accountResolve: newAccount
        }
      })
      .state('admin.accounts.edit', {
        url: '/:accountId/edit',
        templateUrl: '/modules/accounts/client/views/admin/form-account.client.view.html',
        controller: 'AccountsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin'],
          pageTitle: '{{ accountResolve.customerName }}'
        },
        resolve: {
          accountResolve: getAccount
        }
      });
  }

  getAccount.$inject = ['$stateParams', 'AccountsService'];

  function getAccount($stateParams, AccountsService) {
    return AccountsService.get({
      accountId: $stateParams.accountId,
    }).$promise;
  }

  newAccount.$inject = ['AccountsService'];

  function newAccount(AccountsService) {
    return new AccountsService();
  }
}());
