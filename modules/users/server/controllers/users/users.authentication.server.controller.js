'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  passport = require('passport'),
  User = mongoose.model('User'),
  config = require(path.resolve('./config/config')),
  Account = mongoose.model('Account');

var AdwordsUser = require('node-adwords').AdwordsUser;
var AdwordsConstants = require('node-adwords').AdwordsConstants;
var AdwordsReport = require('node-adwords').AdwordsReport;
//create selector for campaigns Services
var selector = {
  fields: ['Id', 'Name', 'Status'],
  ordering: [{
      field: 'Name',
      sortOrder: 'ASCENDING'
  }],
  paging: {
      startIndex: 0,
      numberResults: AdwordsConstants.RECOMMENDED_PAGE_SIZE
  }
};
// URLs for which user can't be redirected on signin
var noReturnUrls = [
  '/authentication/signin',
  '/authentication/signup'
];

/**
 * Signup
 */
exports.signup = function (req, res) {
  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;

  // Init user and add missing fields
  var user = new User(req.body);
  user.provider = 'local';
  user.displayName = user.firstName + ' ' + user.lastName;
  if (user.email === 'iair@neefla.com') {
    user.roles.push('admin');
  }
  // Then save the user
  user.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;

      req.login(user, function (err) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.json(user);
        }
      });
    }
  });
};

/**
 * Signin after passport authentication
 */
exports.signin = function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err || !user) {
      res.status(422).send(info);
    } else {
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;
      req.login(user, function (err) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.json(user);
        }
      });
    }
  })(req, res, next);
};

/**
 * Signout
 */
exports.signout = function (req, res) {
  req.logout();
  res.redirect('/');
};

/**
 * OAuth provider call
 */
exports.oauthCall = function (req, res, next) {
  console.log('OAUTH CALLED SERVER');
  var strategy = req.params.strategy;
  var customerId = req.params.customerId;
  console.log('STRATEGY = ' + JSON.stringify(strategy));
  console.log('ACCOUNT ID = ' + customerId);
  process.env.GOOGLE_ID = customerId;
  // Authenticate
  passport.authenticate(strategy)(req, res, next);
};

/**
 * OAuth callback
 */
exports.oauthCallback = function (req, res, next) {
  var strategy = req.params.strategy;
  console.log('OAUTH CALLBACK CALLED SERVER WITH STRATEGY - ' + strategy);
  if (process.env.GOOGLE_ID) {
    console.log('WHAT DO YOU KNOW...IT WORKED');
  } else {
    console.log('AS I THOUGHT...');
    if (req.params.customerId) {
      process.env.GOOGLE_ID = req.params.customerId;
    }
  }
  
  console.log('BEFORE AUTHENTICATE - ' + process.env.GOOGLE_ID);
  // info.redirect_to contains inteded redirect path
  passport.authenticate(strategy, function (err, user, info) {
    if (err) {
      return res.redirect('/authentication/signin?err=' + encodeURIComponent(errorHandler.getErrorMessage(err)));
    }
    if (!user) {
      return res.redirect('/authentication/signin');
    }
    if (!process.env.GOOGLE_ID && !req.params.customerId) {
      console.log('COULDNT FIND PARAM CUSTOMER ID');
    } else {
      console.log('FOUND GOOGLE ID = ' + process.env.GOOGLE_ID);
      console.log('FOUND CUSTOMER ID = ' + req.params.customerId);
      var customerId;
      if (process.env.GOOGLE_ID) {
        customerId = process.env.GOOGLE_ID;
        process.env.GOOGLE_ID = undefined;
      } else if (req.params.customerId) {
        customerId = req.params.customerId;
        req.params.customerId = undefined;
      } else {
        console.log('WEIRD - NO CUSTOMER ID');
      }
      console.log('FIND ACCOUNT = ' + customerId);
      Account.findOne({ 
        customerId: { $in: customerId }
      }).exec(function (err, account) {
        if (err) {
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          var accountToUpdate = account;
          accountToUpdate.status = 'CONNECTED';
          accountToUpdate.connected = new Date();
          accountToUpdate.provider = 'adwords';
          accountToUpdate.connectedUsers.push(user._id);
          accountToUpdate.providerData = user.additionalProvidersData[account.customerId];
          accountToUpdate.save(function (err) {
            if (err) {
              return res.status(422).send({
                message: errorHandler.getErrorMessage(err)
              });
            }
            var io = require('../../../../accounts/sockets/accounts.server.socket.config').IO;
            if(io){
              io.to('admin').emit("accountConnected", account);
              console.log("sending account customer id to room: "+ account)
              io.to(account_id).emit("accountConnected", account);
            }
            return res.redirect(info.redirect_to || '/settings/accounts');
          });
        }
      });
    }
  })(req, res, next);
};

/**
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthUserProfile = function (req, providerUserProfile, done) {
  // Setup info and user objects
  var info = {};
  var user;

  // Set redirection path on session.
  // Do not redirect to a signin or signup page
  if (noReturnUrls.indexOf(req.session.redirect_to) === -1) {
    info.redirect_to = req.session.redirect_to;
  }

  // Define a search query fields
  var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
  var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;

  // Define main provider search query
  var mainProviderSearchQuery = {};
  mainProviderSearchQuery.provider = providerUserProfile.provider;
  mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

  // Define additional provider search query
  var additionalProviderSearchQuery = {};
  additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

  // Define a search query to find existing user with current provider profile
  var searchQuery = {
    $or: [mainProviderSearchQuery, additionalProviderSearchQuery]
  };

  // Find existing user with this provider account
  User.findOne(searchQuery, function (err, existingUser) {
    if (err) {
      return done(err);
    }

    if (!req.user) {
      if (!existingUser) {
        console.log('NO EXISTING USER');
        var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');
        console.log('POSSIBLE USER = ' + JSON.stringify(possibleUsername));

        User.findUniqueUsername(possibleUsername, null, function (availableUsername) {
          console.log('availableUsername = ' + availableUsername);
          console.log('providerUserProfile = ' + JSON.stringify(providerUserProfile));
          user = new User({
            firstName: providerUserProfile.firstName,
            lastName: providerUserProfile.lastName,
            username: availableUsername,
            displayName: providerUserProfile.displayName,
            profileImageURL: providerUserProfile.profileImageURL,
            provider: providerUserProfile.provider,
            providerData: providerUserProfile.providerData
          });

          // Email intentionally added later to allow defaults (sparse settings) to be applid.
          // Handles case where no email is supplied.
          // See comment: https://github.com/meanjs/mean/pull/1495#issuecomment-246090193
          user.email = providerUserProfile.email;

          // And save the user
          user.save(function (err) {
            return done(err, user, info);
          });
        });
      } else {
        console.log('RETURNING EXISTING USER');
        return done(err, existingUser, info);
      }
    } else {
      // User is already logged in, join the provider data to the existing user
      user = req.user;
      // Check if an existing user was found for this provider account
      if (existingUser) {
        if (user.id === existingUser.id) {
          return done(new Error('User is already connected using this provider'), user, info);
        }
      }

      // Add the provider data to the additional provider data field
      if (!user.additionalProvidersData) {
        user.additionalProvidersData = {};
      }
  
      user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

      // Then tell mongoose that we've updated the additionalProvidersData field
      user.markModified('additionalProvidersData');
      // And save the user
      user.save(function (err) {
        return done(err, user, info);
      });
    }
  });
};

/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = function (req, res, next) {
  var user = req.user;
  var provider = req.query.provider;

  if (!user) {
    return res.status(401).json({
      message: 'User is not authenticated'
    });
  } else if (!provider) {
    return res.status(400).send();
  }

  // Delete the additional provider
  if (user.additionalProvidersData[provider]) {
    delete user.additionalProvidersData[provider];

    // Then tell mongoose that we've updated the additionalProvidersData field
    user.markModified('additionalProvidersData');
  }

  user.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      req.login(user, function (err) {
        if (err) {
          return res.status(400).send(err);
        } else {
          return res.json(user);
        }
      });
    }
  });
};
