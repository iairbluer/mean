(function () {
  'use strict';

  // Setting up route
  angular
    .module('users.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.users', {
        url: '/users',
        templateUrl: '/modules/users/client/views/admin/list-users.client.view.html',
        controller: 'UserListController',
        controllerAs: 'vm'
      })
      .state('admin.user', {
        url: '/users/:userId',
        templateUrl: '/modules/users/client/views/admin/view-user.client.view.html',
        controller: 'UserController',
        controllerAs: 'vm',
        resolve: {
          userResolve: getUser
        },
        data: {
          pageTitle: '{{ userResolve.displayName }}'
        }
      })
      .state('admin.user-add', {
        url: '/add-user',
        templateUrl: '/modules/users/client/views/admin/add-user.client.view.html',
        controller: 'UserAdminController',
        controllerAs: 'vm',
        resolve: {
          accountsResolve: getAccounts
        },
        data: {
          pageTitle: 'Admin User Add'
        }
      })
      .state('admin.user-edit', {
        url: '/users/:userId/edit',
        templateUrl: '/modules/users/client/views/admin/edit-user.client.view.html',
        controller: 'UserController',
        controllerAs: 'vm',
        resolve: {
          userResolve: getUser
        },
        data: {
          pageTitle: '{{ userResolve.displayName }}'
        }
      });

    getUser.$inject = ['$stateParams', 'AdminService'];

    function getUser($stateParams, AdminService) {
      console.log('TRYING TO GET USER');
      return AdminService.get({
        userId: $stateParams.userId
      }).$promise;
    }

    getAccounts.$inject = ['AccountsService'];

    function getAccounts(AccountsService) {
      return AccountsService.query().$promise;
    }
  }
}());
