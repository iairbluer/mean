(function () {
  'use strict';

  angular
    .module('accounts.services')
    .factory('AccountsService', AccountsService);

    AccountsService.$inject = ['$resource', '$log'];

  function AccountsService($resource, $log) {
    var Account = $resource('/api/accounts/:accountId/:customerId', {
      accountId: '@_id',
      customerId: '@customerId',
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Account.prototype, {
      createOrUpdate: function () {
        var account = this;
        return createOrUpdate(account);
      }
    });

    return Account;

    function createOrUpdate(account) {
      if (account._id) {
        return account.$update(onSuccess, onError);
      } else {
        return account.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(account) {
        console.log('SUCCESS SAVE ACCOUNT');
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        console.log('ERROR ON ACCOUNT SAVE');
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function handleError(error) {
      // Log error
      $log.error(error);
    }
  }
}());
