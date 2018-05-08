'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Account = mongoose.model('Account'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  AccountsCampaignsService = require('../services/accounts-campaignservice');
  var accountsCampaignsService = new AccountsCampaignsService;
/**
 * Create an account
 */
exports.create = function (req, res) {
  var account = new Account(req.body);
  console.log('ACCOUNT IN CREATE = ' + JSON.stringify(account));

  account.user = req.user._id;

  account.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(account);
    }
  });
};

/**
 * Show the current account
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var account = req.account ? req.account.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  account.isCurrentUserOwner = !!(req.user && account.user && account.user._id.toString() === req.user._id.toString());

  res.json(account);
};

/**
 * Update an account
 */
exports.update = function (req, res) {
  var account = req.account;

  account.customerName = req.body.customerName;
  account.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(account);
    }
  });
};

/**
 * Delete an account
 */
exports.delete = function (req, res) {
  var account = req.account;

  account.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(account);
    }
  });
};
/**
 * Get Acounts Campaign Services
 */
exports.getCampaignService = function (req, res) {
  var account = req.account;
  if (req.user.additionalProviderData && Object.keys(req.user.additionalProviderData)) {
    console.log('USER HAS CONNECTED ACCOUNTS');
    if (Object.keys(req.user.additionalProviderData).includes(account.customerId)) {
      console.log('THE PROVIDER DATA = ' + req.user.additionalProviderData[account.customerId]);
    }
  }
  var user = {
    developerToken: config.adwords.dveloperToken, //your adwords developerToken
    userAgent: account.customerName, //any company name
    clientCustomerId: account.customerId, //the Adwords Account id (e.g. 123-123-123)
    client_id: config.adwords.client_id, //this is the api console client_id
    client_secret: config.adwords.client_secret,
    // refresh_token: req.user.
  };
  accountsCampaignsService.getCampaignsService(account, user)
  .then(function (campaignsService){
    account.campaignsService = campaignsService;
    res.json(account);
  })
  .catch(function (error){
    res.json(error);
  });
};

/**
 * List of Accounts
 */
exports.list = function (req, res) {
  console.log('LIST ACCOUNTS');
  var roles = JSON.stringify(req.user.roles)
  if(roles.includes('admin')){
    console.log('LIST ACCOUNTS ADMIN');
    Account.find().sort('-created').exec(function (err, accounts) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(accounts);
      }
    });
  } else {
    console.log('LIST ACCOUNTS USER');
    Account.find({
      customerId: {$in: req.user.accounts}
    }).sort('-created').exec(function (err, accounts) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(accounts);
      }
    });
  }
};

/**
 * Account middleware
 */
exports.accountByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Account is invalid'
    });
  }

  Account.findById(id).populate('user', 'username').exec(function (err, account) {
    if (err) {
      return next(err);
    } else if (!account) {
      return res.status(404).send({
        message: 'No account with that identifier (ACCOUNT ID) has been found'
      });
    }
    req.account = account;
    next();
  });
};

/**
 * Account middleware
 */
exports.accountByCustomerID = function (req, res, next, id) {

  // if (!mongoose.Types.ObjectId.isValid(id)) {
  //   return res.status(400).send({
  //     message: 'Account is invalid'
  //   });
  // }

  Account.findOne({ customerId : id }).populate('user', 'username').exec(function (err, account) {
    if (err) {
      return next(err);
    } else if (!account) {
      return res.status(404).send({
        message: 'No account with that identifier (CUSTOMER ID) has been found'
      });
    }
    req.account = account;
    next();
  });
};
