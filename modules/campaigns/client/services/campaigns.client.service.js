(function () {
  'use strict';

  angular
    .module('campaigns.services')
    .factory('CampaignsService', CampaignsService);

  CampaignsService.$inject = ['$resource', '$log'];

  function CampaignsService($resource, $log) {
    var Campaign = $resource('/api/campaigns/:campaignId', {
      campaignId: '@_id',
      accountId: '@account'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Campaign.prototype, {
      createOrUpdate: function () {
        var campaign = this;
        return createOrUpdate(campaign);
      }
    });

    return Campaign;

    function createOrUpdate(campaign) {
      if (campaign._id) {
        return campaign.$update(onSuccess, onError);
      } else {
        return campaign.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(campaign) {
        console.log('SAVED CAMPAIGN SUCCESSFULLY');
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
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
