'use strict';

/**
 * Module dependencies
 */
var accountsPolicy = require('../policies/accounts.server.policy'),
    accounts = require('../controllers/accounts.server.controller');
   
module.exports = function (app) {
  // accounts collection routes ADMIN
  app.route('/api/accounts').all(accountsPolicy.isAllowed)
    .get(accounts.list)
    .post(accounts.create);

  // Single account routes ADMIN
  app.route('/api/accounts/:accountId').all(accountsPolicy.isAllowed)
    .get(accounts.read)
    .put(accounts.update)
    .delete(accounts.delete);

  // GET CAMPAIGNS SERVICE FOR ACCOUNT ADMIN
  app.route('/api/accounts/:accountId/getCampaignsService').all(accountsPolicy.isAllowed)
    .get(accounts.getCampaignService);

  // accounts collection routes - USER
  // app.route('/api/accounts/user/:userId').all(accountsPolicy.isAllowed)
  //   .get(accounts.list);

  // // SINGLE ACCOUNT ROUTES - USER 
  // app.route('/api/accounts/user/:userId/account/:accountId').all(accountsPolicy.isAllowed)
  //   .get(accounts.read)
  //   .put(accounts.update)
  //   .delete(accounts.delete);

  // Finish by binding the account middleware
  app.param('accountId', accounts.accountByID);
  // app.param('userId', accounts.accountByUserID);
  app.param('customerId', accounts.accountByCustomerID);

};
