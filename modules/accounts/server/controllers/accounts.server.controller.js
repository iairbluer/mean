'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Account = mongoose.model('Account'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an account
 */
exports.create = function (req, res) {
  var account = new Account(req.body);
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
 * List of Accounts
 */
exports.list = function (req, res) {
  console.log('LIST ACCOUNTS');
  Account.find({
    user: {$in: req.user._id }
  }).sort('-created').populate('user', 'username').exec(function (err, accounts) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(accounts);
    }
  });
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
        message: 'No account with that identifier has been found'
      });
    }
    req.account = account;
    next();
  });
};
