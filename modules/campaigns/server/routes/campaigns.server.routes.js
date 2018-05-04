'use strict';

/**
 * Module dependencies
 */
var campaignsPolicy = require('../policies/campaigns.server.policy'),
    campaigns = require('../controllers/campaigns.server.controller');

module.exports = function (app) {
  // campaigns collection routes
  app.route('/api/campaigns').all(campaignsPolicy.isAllowed)
    .get(campaigns.list)
    .post(campaigns.create);

  // Single account routes
  app.route('/api/accounts/:campaignId').all(campaignsPolicy.isAllowed)
    .get(campaigns.read)
    .put(campaigns.update)
    .delete(campaigns.delete);

  // Finish by binding the account middleware
  app.param('campaignId', campaigns.campaignByID);
};
